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
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to AI chat");
            throw new SecurityException("User not authenticated");
        }

        log.info("Processing AI chat message from user ID: {}", currentUserId);

        try {
            ChatSession session = chatSessionService.getOrCreateCurrentSession(currentUserId);
            Long sessionId = session.getId();

            chatSessionService.addMessage(sessionId, "user", message);

            List<ChatMessage> dbHistory = chatSessionService.getSessionMessages(sessionId);

            log.info("Calling AI with {} history messages, user message: {}", dbHistory.size(), message);
            
            List<Message> aiHistory = new ArrayList<>();
            for (ChatMessage msg : dbHistory) {
                if ("user".equals(msg.getRole())) {
                    aiHistory.add(new UserMessage(msg.getContent()));
                } else if ("assistant".equals(msg.getRole())) {
                    aiHistory.add(new AssistantMessage(msg.getContent()));
                }
            }

            int recentHistorySize = Math.min(10, aiHistory.size());
            List<Message> recentHistory = aiHistory.subList(Math.max(0, aiHistory.size() - recentHistorySize), aiHistory.size());
            
            log.debug("Using {} recent messages for context", recentHistory.size());
            var chatResponse = chatClient.prompt()
                    .messages(recentHistory)
                    .tools(diaryTools, taskTools)
                    .call();
            
            log.debug("Chat response received, extracting content...");
            
            String response = chatResponse.content();
            
            log.info("AI response extracted, length: {}, preview: {}", 
                    response != null ? response.length() : 0,
                    response != null && response.length() > 50 ? response.substring(0, 50) + "..." : response);
            
            if (response == null) {
                log.error("AI response content is null! Full response: {}", chatResponse);
                response = "Sorry, I couldn't generate a response. Please try again.";
            }
            
            boolean isToolCallJson = response.startsWith("{") && response.contains("tool_name") && response.contains("parameters");
            boolean hasToolError = response.contains("参数不能为空") || response.contains("content 字段是必需的") || 
                                  (response.contains("append_diary") || response.contains("create_task")) && 
                                  response.contains("ERROR");
            
            boolean alreadyExecuted = response.contains("OK id=") || 
                                     (response.contains("成功") && (response.contains("id=") || response.contains("已保存")));
            
            boolean claimsDiarySaved = (response.contains("日记已成功记录") || response.contains("日记已记录") || 
                                       response.contains("成功记录") || response.contains("已保存")) &&
                                       !response.contains("tool_name") && !alreadyExecuted;
            
            if (claimsDiarySaved && !isToolCallJson && !alreadyExecuted) {
                log.warn("AI claimed diary was saved but no tool was called! Extracting info from message and executing tool manually...");
                try {
                    String diaryContent = extractDiaryContent(message);
                    if (diaryContent != null && !diaryContent.trim().isEmpty()) {
                        String title = extractTitleFromResponse(response);
                        if (title == null || title.trim().isEmpty()) {
                            log.info("No title provided, generating title with AI...");
                            title = generateDiaryTitle(diaryContent);
                        }
                        
                        String diaryJson;
                        if (title != null && !title.trim().isEmpty()) {
                            diaryJson = String.format("{\"title\":\"%s\",\"content\":\"%s\"}", 
                                    title.replace("\"", "\\\""), 
                                    diaryContent.replace("\"", "\\\""));
                        } else {
                            diaryJson = String.format("{\"content\":\"%s\"}", diaryContent.replace("\"", "\\\""));
                        }
                        
                        log.info("Manually executing append_diary with title={}, content={}", title, diaryContent);
                        
                        String toolResult = diaryTools.append_diary(diaryJson);
                        log.info("Manual diary tool execution result: {}", toolResult);
                        
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
                    JsonNode toolCallJson = objectMapper.readTree(response);
                    String toolName = toolCallJson.get("tool_name").asText();
                    JsonNode parameters = toolCallJson.get("parameters");
                    
                    log.info("Tool call detected: toolName={}, parameters={}", toolName, parameters);
                    
                    if ("append_diary".equals(toolName)) {
                        String content = parameters.hasNonNull("content") ? parameters.get("content").asText() : "";
                        if (!content.trim().isEmpty() && hasRecentlyCreatedDiaryEntry(currentUserId, content)) {
                            log.warn("Found recently created diary entry with similar content, skipping duplicate execution");
                            response = "日记已经成功记录！";
                        } else {
                            String parametersJson = objectMapper.writeValueAsString(parameters);
                            
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
                            
                            String toolResult = executeTool(toolName, parametersJson);
                            log.info("Tool execution result: {}", toolResult);
                            
                            recentHistory.add(new AssistantMessage(response));
                            recentHistory.add(new UserMessage("Tool execution result: " + toolResult));
                            
                            log.info("Calling AI again with tool execution result...");
                            var finalResponse = chatClient.prompt()
                                    .messages(recentHistory)
                                    .tools(diaryTools, taskTools)
                                    .call();
                            
                            response = finalResponse.content();
                            
                            if (response != null && response.startsWith("{") && response.contains("tool_name")) {
                                log.warn("AI returned another tool call after execution, using tool result as response");
                                response = "我已经执行了操作：" + toolResult;
                            }
                        }
                    } else {
                        String parametersJson = objectMapper.writeValueAsString(parameters);
                        String toolResult = executeTool(toolName, parametersJson);
                        log.info("Tool execution result: {}", toolResult);
                        
                        recentHistory.add(new AssistantMessage(response));
                        recentHistory.add(new UserMessage("Tool execution result: " + toolResult));
                        
                        log.info("Calling AI again with tool execution result...");
                        var finalResponse = chatClient.prompt()
                                .messages(recentHistory)
                                .tools(diaryTools, taskTools)
                                .call();
                        
                        response = finalResponse.content();
                        
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
                log.warn("Detected tool execution error in response, trying to extract and retry tool call...");
                log.warn("Tool execution failed. Response: {}", response.substring(0, Math.min(200, response.length())));
            }
            
            if (response == null || response.trim().isEmpty()) {
                response = "我已经为您处理了请求。请查看是否操作成功完成。";
            }

            chatSessionService.addMessage(sessionId, "assistant", response);

            log.info("AI response generated successfully, response length: {}", response.length());
            return response;

        } catch (Exception e) {
            log.error("Error processing AI chat message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process AI chat message", e);
        }
    }
    
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
    
    private String extractDiaryContent(String message) {
        String content = message;
        
        String[] prefixes = {"记录日记", "写日记", "记日记", "记录", "日记"};
        for (String prefix : prefixes) {
            if (content.toLowerCase().contains(prefix.toLowerCase())) {
                content = content.replaceFirst("(?i)" + prefix, "").trim();
                content = content.replaceFirst("^[,，:：\\s]+", "");
            }
        }
        
        return content.trim();
    }
    
    private String extractTitleFromResponse(String response) {
        try {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(?i)(?:标题|Title)[:：\\s]*\\*?([^*\\n]+)\\*?");
            java.util.regex.Matcher matcher = pattern.matcher(response);
            if (matcher.find()) {
                String title = matcher.group(1).trim();
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
    
    private String generateDiaryTitle(String content) {
        try {
            log.debug("Generating title for diary content: {}", content.substring(0, Math.min(50, content.length())));
            
            String titlePrompt = String.format("请为以下日记内容生成一个简洁的标题（不超过10个字，不要使用引号或特殊符号）：\n\n%s", content);
            
            String generatedTitle = chatClient.prompt()
                    .user(titlePrompt)
                    .call()
                    .content();
            
            if (generatedTitle != null) {
                generatedTitle = generatedTitle.replaceAll("[\"'\u201C\u201D\u2018\u2019\\*\\[\\]（()）]", "").trim();
                if (generatedTitle.length() > 20) {
                    generatedTitle = generatedTitle.substring(0, 20);
                }
                log.info("AI generated title: {}", generatedTitle);
                return generatedTitle;
            }
        } catch (Exception e) {
            log.error("Failed to generate title with AI: {}", e.getMessage(), e);
        }
        
        if (content != null && content.length() > 0) {
            String fallbackTitle = content.length() > 10 ? content.substring(0, 10) + "..." : content;
            log.info("Using fallback title: {}", fallbackTitle);
            return fallbackTitle;
        }
        
        return "今日记录";
    }
    
    private boolean hasRecentlyCreatedDiaryEntry(Long userId, String content) {
        try {
            LocalDate today = LocalDate.now();
            List<DiaryEntry> todayEntries = diaryEntryService.findDiaryEntries(userId, today, today);
            
            LocalDateTime cutoffTime = LocalDateTime.now().minusSeconds(30);
            for (DiaryEntry entry : todayEntries) {
                if (entry.getContent() != null && entry.getContent().trim().equals(content.trim())) {
                    if (entry.getCreatedAt() != null && entry.getCreatedAt().isAfter(cutoffTime)) {
                        log.info("Found duplicate diary entry created at {} with same content", entry.getCreatedAt());
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error checking for duplicate diary entries: {}", e.getMessage(), e);
        }
        return false;
    }
}