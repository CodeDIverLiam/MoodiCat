package com.aidiary.controller;

import com.aidiary.model.ChatSession;
import com.aidiary.model.ChatMessage;
import com.aidiary.service.ChatSessionService;
import com.aidiary.mapper.UserMapper;
import com.aidiary.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/chat-sessions")
@RequiredArgsConstructor
public class ChatSessionController {
    private final ChatSessionService chatSessionService;
    private final UserMapper userMapper;

    @GetMapping
    public List<ChatSession> getUserSessions() {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        return chatSessionService.getUserSessions(currentUserId);
    }

    @GetMapping("/{sessionId}/messages")
    public List<ChatMessage> getSessionMessages(@PathVariable String sessionId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        
        ChatSession session = chatSessionService.getSessionBySessionId(sessionId);
        if (session == null || !session.getUserId().equals(currentUserId)) {
            throw new IllegalArgumentException("Session not found or access denied");
        }
        
        return chatSessionService.getSessionMessages(session.getId());
    }

    @PostMapping
    public ChatSession createSession(@RequestParam(required = false) String title) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        
        String sessionTitle = title != null ? title : "New Chat";
        return chatSessionService.createSession(currentUserId, sessionTitle);
    }

    @DeleteMapping("/{sessionId}")
    public void deleteSession(@PathVariable String sessionId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        
        ChatSession session = chatSessionService.getSessionBySessionId(sessionId);
        if (session == null || !session.getUserId().equals(currentUserId)) {
            throw new IllegalArgumentException("Session not found or access denied");
        }
        
        chatSessionService.deleteSession(session.getId());
    }
}


