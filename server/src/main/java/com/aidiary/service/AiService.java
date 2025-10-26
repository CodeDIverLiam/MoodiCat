package com.aidiary.service;

import com.aidiary.dto.AiChatRequest;
import com.aidiary.mapper.UserMapper;
import com.aidiary.security.SecurityUtils;
import com.aidiary.tools.DiaryTools;
import com.aidiary.tools.TaskTools;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {
    
    private final ChatClient chatClient;
    private final DiaryTools diaryTools;
    private final TaskTools taskTools;
    private final UserMapper userMapper;
    
    public String processChatMessage(String message) {
        // 检查用户认证
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to AI chat");
            throw new SecurityException("User not authenticated");
        }
        
        log.info("Processing AI chat message from user ID: {}", currentUserId);
        
        try {
            // 使用Spring AI的ChatClient，它会自动处理tool call
            String response = chatClient.prompt(message).call().content();
            log.info("AI response generated successfully");
            return response;
        } catch (Exception e) {
            log.error("Error processing AI chat message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process AI chat message", e);
        }
    }
}