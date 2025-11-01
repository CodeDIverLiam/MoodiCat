package com.aidiary.service;

import com.aidiary.dto.AiChatRequest;
import com.aidiary.mapper.UserMapper;
import com.aidiary.model.ChatSession;
import com.aidiary.model.ChatMessage;
import com.aidiary.security.SecurityUtils;
import com.aidiary.tools.DiaryTools;
import com.aidiary.tools.TaskTools;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
// 导入 Spring AI 的消息类型
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final ChatClient chatClient;
    private final DiaryTools diaryTools;
    private final TaskTools taskTools;
    private final UserMapper userMapper;
    private final ChatSessionService chatSessionService; // 1. 注入 ChatSessionService

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

            // 6. 将数据库消息转换为 Spring AI 的 Message 列表
            List<Message> aiHistory = new ArrayList<>();
            for (ChatMessage msg : dbHistory) {
                if ("user".equals(msg.getRole())) {
                    aiHistory.add(new UserMessage(msg.getContent()));
                } else if ("assistant".equals(msg.getRole())) {
                    aiHistory.add(new AssistantMessage(msg.getContent()));
                }
            }

            // 7. 使用完整的消息历史（包含默认的 system prompt 和 tools）调用 AI
            String response = chatClient.prompt()
                    .messages(aiHistory) // <--- 使用消息列表而不是单条消息
                    .call()
                    .content();

            // 8. 保存 AI 的回复
            chatSessionService.addMessage(sessionId, "assistant", response);

            log.info("AI response generated successfully");
            return response;

        } catch (Exception e) {
            log.error("Error processing AI chat message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process AI chat message", e);
        }
    }
}