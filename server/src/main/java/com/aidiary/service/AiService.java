package com.aidiary.service;

import com.aidiary.mapper.UserMapper;
import com.aidiary.model.ChatSession;
import com.aidiary.model.ChatMessage;
import com.aidiary.model.DiaryEntry;
import com.aidiary.security.SecurityUtils;
import com.aidiary.service.DiaryEntryService;
import com.aidiary.tools.DiaryTools;
import com.aidiary.tools.TaskTools;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
// 导入 Spring AI 的消息类型
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final ChatClient chatClient;
    private final UserMapper userMapper;
    private final ChatSessionService chatSessionService;
    private final DiaryTools diaryTools;
    private final TaskTools taskTools;
    private final DiaryEntryService diaryEntryService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String processChatMessage(String message) {
        // 2. 检查用户认证
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to AI chat");
            throw new SecurityException("User not authenticated");
        }

        log.info("Processing AI chat message from user ID: {}", currentUserId);

        try {
            // 3. 获取或创建当前用户的会话
            ChatSession session = chatSessionService.getOrCreateCurrentSession(currentUserId);
            Long sessionId = session.getId();

            // 4. 保存用户的当前消息
            chatSessionService.addMessage(sessionId, "user", message);

            // 5. 获取所有历史消息（包括刚添加的）
            List<ChatMessage> dbHistory = chatSessionService.getSessionMessages(sessionId);

            // 6. 尝试使用 .user() 方法而不是 .messages()，因为 .messages() 可能不支持工具执行
            // 但为了保持历史上下文，我们先尝试使用 .messages()，如果返回工具调用对象，再处理
            log.info("Calling AI with {} history messages, user message: {}", dbHistory.size(), message);
            
            // 将数据库消息转换为 Spring AI 的 Message 列表（用于历史上下文）
            List<Message> aiHistory = new ArrayList<>();
            for (ChatMessage msg : dbHistory) {
                if ("user".equals(msg.getRole())) {
                    aiHistory.add(new UserMessage(msg.getContent()));
                } else if ("assistant".equals(msg.getRole())) {
                    aiHistory.add(new AssistantMessage(msg.getContent()));
                }
            }

            // 尝试使用 .messages()，但只传递最近的消息（避免上下文过长）
            // 如果返回工具调用对象，说明工具没有被执行
            int recentHistorySize = Math.min(10, aiHistory.size()); // 只使用最近10条消息
            List<Message> recentHistory = aiHistory.subList(Math.max(0, aiHistory.size() - recentHistorySize), aiHistory.size());
            
            log.debug("Using {} recent messages for context", recentHistory.size());
            // 保持 .tools() 让 AI 知道有哪些工具，但 Spring AI 可能会自动执行
            // 如果自动执行失败（参数为 null），我们会通过手动执行来处理工具调用 JSON
            var chatResponse = chatClient.prompt()
                    .messages(recentHistory) // 使用最近的历史消息
                    .tools(diaryTools, taskTools) // 显式指定工具，让 AI 知道有哪些工具
                    .call();
            
            log.debug("Chat response received, extracting content...");
            
            // 提取文本内容，确保返回的是字符串而不是对象
            String response = chatResponse.content();
            
            log.info("AI response extracted, length: {}, preview: {}", 
                    response != null ? response.length() : 0,
                    response != null && response.length() > 50 ? response.substring(0, 50) + "..." : response);
            
            // 如果 content() 返回的不是字符串，尝试转换为字符串
            if (response == null) {
                log.error("AI response content is null! Full response: {}", chatResponse);
                response = "Sorry, I couldn't generate a response. Please try again.";
            }
            
            // 检测并处理工具调用：如果返回的是工具调用 JSON，手动执行工具
            // 也检查响应中是否包含工具调用相关的错误信息（比如参数为空）
            boolean isToolCallJson = response.startsWith("{") && response.contains("tool_name") && response.contains("parameters");
            boolean hasToolError = response.contains("参数不能为空") || response.contains("content 字段是必需的") || 
                                  (response.contains("append_diary") || response.contains("create_task")) && 
                                  response.contains("ERROR");
            
            // 检查响应中是否已经包含工具执行成功的结果（比如"OK id="），说明 Spring AI 已经执行了工具
            boolean alreadyExecuted = response.contains("OK id=") || 
                                     (response.contains("成功") && (response.contains("id=") || response.contains("已保存")));
            
            // 检测 AI 是否"假装"执行了日记但没有真正调用工具
            // 如果 AI 说"日记已成功记录"但工具没有被执行，我们需要手动执行
            // 但如果响应中已经包含了工具执行成功的结果，说明工具已经执行了，不要重复执行
            boolean claimsDiarySaved = (response.contains("日记已成功记录") || response.contains("日记已记录") || 
                                       response.contains("成功记录") || response.contains("已保存")) &&
                                       !response.contains("tool_name") && !alreadyExecuted;
            
            // 如果 AI 声称执行了日记但没有真正执行，从消息中提取信息手动执行
            if (claimsDiarySaved && !isToolCallJson && !alreadyExecuted) {
                log.warn("AI claimed diary was saved but no tool was called! Extracting info from message and executing tool manually...");
                try {
                    // 从原始用户消息中提取日记内容
                    String diaryContent = extractDiaryContent(message);
                    if (diaryContent != null && !diaryContent.trim().isEmpty()) {
                        // 如果没有标题，让 AI 生成一个标题
                        String title = extractTitleFromResponse(response);
                        if (title == null || title.trim().isEmpty()) {
                            log.info("No title provided, generating title with AI...");
                            title = generateDiaryTitle(diaryContent);
                        }
                        
                        // 构建日记参数 JSON（包含 AI 生成的标题）
                        String diaryJson;
                        if (title != null && !title.trim().isEmpty()) {
                            diaryJson = String.format("{\"title\":\"%s\",\"content\":\"%s\"}", 
                                    title.replace("\"", "\\\""), 
                                    diaryContent.replace("\"", "\\\""));
                        } else {
                            diaryJson = String.format("{\"content\":\"%s\"}", diaryContent.replace("\"", "\\\""));
                        }
                        
                        log.info("Manually executing append_diary with title={}, content={}", title, diaryContent);
                        
                        // 执行工具
                        String toolResult = diaryTools.append_diary(diaryJson);
                        log.info("Manual diary tool execution result: {}", toolResult);
                        
                        // 如果成功，更新响应
                        if (toolResult.startsWith("OK")) {
                            response = "我已经成功为您记录了日记！" + (title != null ? "标题：" + title + "。 " : "") + toolResult;
                        } else {
                            response = "尝试记录日记时出现问题：" + toolResult;
                        }
                    } else {
                        log.warn("Could not extract diary content from message: {}", message);
                    }
                } catch (Exception e) {
                    log.error("Error manually executing diary tool: {}", e.getMessage(), e);
                }
            } else if (isToolCallJson && !alreadyExecuted) {
                log.info("Detected tool call request, parsing and executing tool...");
                
                try {
                    // 解析工具调用 JSON
                    JsonNode toolCallJson = objectMapper.readTree(response);
                    String toolName = toolCallJson.get("tool_name").asText();
                    JsonNode parameters = toolCallJson.get("parameters");
                    
                    log.info("Tool call detected: toolName={}, parameters={}", toolName, parameters);
                    
                    // 如果是 append_diary，先检查是否已经有相同内容的日记条目刚刚创建（避免重复执行）
                    if ("append_diary".equals(toolName)) {
                        String content = parameters.hasNonNull("content") ? parameters.get("content").asText() : "";
                        if (!content.trim().isEmpty() && hasRecentlyCreatedDiaryEntry(currentUserId, content)) {
                            log.warn("Found recently created diary entry with similar content, skipping duplicate execution");
                            // 如果已经有相同的日记条目，直接返回成功消息，不再执行
                            response = "日记已经成功记录！";
                        } else {
                            // 将 parameters 转换为 JSON 字符串（工具方法期望 JSON 字符串）
                            String parametersJson = objectMapper.writeValueAsString(parameters);
                            
                            // 如果没有标题，生成一个标题
                            JsonNode paramsNode = objectMapper.readTree(parametersJson);
                            if (!paramsNode.hasNonNull("title") || paramsNode.get("title").asText().trim().isEmpty()) {
                                if (!content.trim().isEmpty()) {
                                    log.info("No title in append_diary parameters, generating title with AI...");
                                    String generatedTitle = generateDiaryTitle(content);
                                    if (generatedTitle != null && !generatedTitle.trim().isEmpty()) {
                                        ((com.fasterxml.jackson.databind.node.ObjectNode) paramsNode).put("title", generatedTitle);
                                        parametersJson = objectMapper.writeValueAsString(paramsNode);
                                        log.info("Generated title: {}", generatedTitle);
                                    }
                                }
                            }
                            
                            // 执行工具
                            String toolResult = executeTool(toolName, parametersJson);
                            log.info("Tool execution result: {}", toolResult);
                            
                            // 将工具结果添加到历史消息中
                            recentHistory.add(new AssistantMessage(response)); // 保存工具调用请求
                            recentHistory.add(new UserMessage("Tool execution result: " + toolResult)); // 添加工具执行结果
                            
                            // 再次调用 AI，让它基于工具执行结果生成最终回复
                            log.info("Calling AI again with tool execution result...");
                            var finalResponse = chatClient.prompt()
                                    .messages(recentHistory)
                                    .tools(diaryTools, taskTools)
                                    .call();
                            
                            response = finalResponse.content();
                            
                            // 如果最终回复仍然是工具调用，说明可能还有更多工具需要执行
                            // 为了避免无限循环，我们只执行一次
                            if (response != null && response.startsWith("{") && response.contains("tool_name")) {
                                log.warn("AI returned another tool call after execution, using tool result as response");
                                response = "我已经执行了操作：" + toolResult;
                            }
                        }
                    } else {
                        // 非 append_diary 工具，正常执行
                        String parametersJson = objectMapper.writeValueAsString(parameters);
                        String toolResult = executeTool(toolName, parametersJson);
                        log.info("Tool execution result: {}", toolResult);
                        
                        // 将工具结果添加到历史消息中
                        recentHistory.add(new AssistantMessage(response)); // 保存工具调用请求
                        recentHistory.add(new UserMessage("Tool execution result: " + toolResult)); // 添加工具执行结果
                        
                        // 再次调用 AI，让它基于工具执行结果生成最终回复
                        log.info("Calling AI again with tool execution result...");
                        var finalResponse = chatClient.prompt()
                                .messages(recentHistory)
                                .tools(diaryTools, taskTools)
                                .call();
                        
                        response = finalResponse.content();
                        
                        // 如果最终回复仍然是工具调用，说明可能还有更多工具需要执行
                        // 为了避免无限循环，我们只执行一次
                        if (response != null && response.startsWith("{") && response.contains("tool_name")) {
                            log.warn("AI returned another tool call after execution, using tool result as response");
                            response = "我已经执行了操作：" + toolResult;
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Error executing tool manually: {}", e.getMessage(), e);
                    response = "处理您的请求时出现错误：" + e.getMessage();
                }
            } else if (hasToolError) {
                // 如果响应中包含工具执行错误，说明 Spring AI 尝试执行工具但失败了
                // 可能是因为参数传递问题，我们尝试从历史消息中提取工具调用信息
                log.warn("Detected tool execution error in response, trying to extract and retry tool call...");
                // 注意：这种情况下很难提取原始工具调用参数，所以先记录日志
                log.warn("Tool execution failed. Response: {}", response.substring(0, Math.min(200, response.length())));
            }
            
            // 确保响应是纯文本字符串（最终检查）
            if (response == null || response.trim().isEmpty()) {
                response = "我已经为您处理了请求。请查看是否操作成功完成。";
            }

            // 8. 保存 AI 的回复
            chatSessionService.addMessage(sessionId, "assistant", response);

            log.info("AI response generated successfully, response length: {}", response.length());
            return response;

        } catch (Exception e) {
            log.error("Error processing AI chat message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process AI chat message", e);
        }
    }
    
    /**
     * 手动执行工具方法
     */
    private String executeTool(String toolName, String parametersJson) {
        log.info("Executing tool: {} with parameters: {}", toolName, parametersJson);
        
        try {
            switch (toolName) {
                case "create_task":
                    return taskTools.create_task(parametersJson);
                case "update_task":
                    return taskTools.update_task(parametersJson);
                case "list_tasks":
                    return taskTools.list_tasks(parametersJson);
                case "append_diary":
                    return diaryTools.append_diary(parametersJson);
                case "set_reminder":
                    return diaryTools.set_reminder(parametersJson);
                default:
                    log.error("Unknown tool name: {}", toolName);
                    return "ERROR: Unknown tool: " + toolName;
            }
        } catch (Exception e) {
            log.error("Error executing tool {}: {}", toolName, e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }
    
    /**
     * 从用户消息中提取日记内容
     */
    private String extractDiaryContent(String message) {
        // 移除"记录日记"等关键词，提取实际内容
        String content = message;
        
        // 移除常见的前缀
        String[] prefixes = {"记录日记", "写日记", "记日记", "记录", "日记"};
        for (String prefix : prefixes) {
            if (content.toLowerCase().contains(prefix.toLowerCase())) {
                content = content.replaceFirst("(?i)" + prefix, "").trim();
                // 移除逗号、冒号等分隔符
                content = content.replaceFirst("^[,，:：\\s]+", "");
            }
        }
        
        return content.trim();
    }
    
    /**
     * 从 AI 响应中提取标题（如果 AI 在响应中提到了标题）
     */
    private String extractTitleFromResponse(String response) {
        // 尝试从响应中提取标题，比如 "**标题**：xxx" 或类似格式
        try {
            // 查找 "标题" 后面的内容
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(?i)(?:标题|Title)[:：\\s]*\\*?([^*\\n]+)\\*?");
            java.util.regex.Matcher matcher = pattern.matcher(response);
            if (matcher.find()) {
                String title = matcher.group(1).trim();
                // 移除多余的星号和空格
                title = title.replaceAll("^\\*+|\\*+$", "").trim();
                if (!title.isEmpty()) {
                    return title;
                }
            }
        } catch (Exception e) {
            log.debug("Failed to extract title from response: {}", e.getMessage());
        }
        return null;
    }
    
    /**
     * 使用 AI 为日记内容生成标题
     */
    private String generateDiaryTitle(String content) {
        try {
            log.debug("Generating title for diary content: {}", content.substring(0, Math.min(50, content.length())));
            
            // 使用简单的 prompt 生成标题
            String titlePrompt = String.format("请为以下日记内容生成一个简洁的标题（不超过10个字，不要使用引号或特殊符号）：\n\n%s", content);
            
            String generatedTitle = chatClient.prompt()
                    .user(titlePrompt)
                    .call()
                    .content();
            
            if (generatedTitle != null) {
                // 清理标题：移除引号、星号等符号
                generatedTitle = generatedTitle.replaceAll("[\"'\u201C\u201D\u2018\u2019\\*\\[\\]（()）]", "").trim();
                // 限制长度
                if (generatedTitle.length() > 20) {
                    generatedTitle = generatedTitle.substring(0, 20);
                }
                log.info("AI generated title: {}", generatedTitle);
                return generatedTitle;
            }
        } catch (Exception e) {
            log.error("Failed to generate title with AI: {}", e.getMessage(), e);
        }
        
        // 如果 AI 生成失败，使用内容的前几个字作为标题
        if (content != null && content.length() > 0) {
            String fallbackTitle = content.length() > 10 ? content.substring(0, 10) + "..." : content;
            log.info("Using fallback title: {}", fallbackTitle);
            return fallbackTitle;
        }
        
        return "今日记录";
    }
    
    /**
     * 检查是否最近刚刚创建了相同内容的日记条目（避免重复执行）
     */
    private boolean hasRecentlyCreatedDiaryEntry(Long userId, String content) {
        try {
            // 获取今天的日记条目
            LocalDate today = LocalDate.now();
            List<DiaryEntry> todayEntries = diaryEntryService.findDiaryEntries(userId, today, today);
            
            // 检查是否有内容相似且最近创建的条目（最近30秒内）
            LocalDateTime cutoffTime = LocalDateTime.now().minusSeconds(30);
            for (DiaryEntry entry : todayEntries) {
                if (entry.getContent() != null && entry.getContent().trim().equals(content.trim())) {
                    // 内容完全相同，检查创建时间
                    if (entry.getCreatedAt() != null && entry.getCreatedAt().isAfter(cutoffTime)) {
                        log.info("Found duplicate diary entry created at {} with same content", entry.getCreatedAt());
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error checking for duplicate diary entries: {}", e.getMessage(), e);
            // 如果检查失败，为了安全起见，返回 false（允许执行）
        }
        return false;
    }
}