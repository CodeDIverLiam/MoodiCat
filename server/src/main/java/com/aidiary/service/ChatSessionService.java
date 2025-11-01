package com.aidiary.service;

import com.aidiary.mapper.ChatSessionMapper;
import com.aidiary.model.ChatSession;
import com.aidiary.model.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSessionService {
    private final ChatSessionMapper chatSessionMapper;

    public ChatSession createSession(Long userId, String title) {
        String sessionId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        
        ChatSession session = new ChatSession();
        session.setUserId(userId);
        session.setSessionId(sessionId);
        session.setTitle(title);
        session.setCreatedAt(now);
        session.setUpdatedAt(now);
        
        chatSessionMapper.createSession(session);
        log.info("Created new chat session: {} for user: {}", sessionId, userId);
        return session;
    }

    public List<ChatSession> getUserSessions(Long userId) {
        return chatSessionMapper.getSessionsByUserId(userId);
    }

    public ChatSession getSessionBySessionId(String sessionId) {
        return chatSessionMapper.getSessionBySessionId(sessionId);
    }

    public ChatMessage addMessage(Long sessionId, String role, String content) {
        ChatMessage message = new ChatMessage();
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        
        chatSessionMapper.addMessage(message);
        log.info("Added message to session: {}, role: {}", sessionId, role);
        return message;
    }

    public List<ChatMessage> getSessionMessages(Long sessionId) {
        return chatSessionMapper.getMessagesBySessionId(sessionId);
    }

    public ChatSession getOrCreateCurrentSession(Long userId) {
        List<ChatSession> sessions = chatSessionMapper.getSessionsByUserId(userId);
        
        if (sessions.isEmpty()) {
            return createSession(userId, "New Chat");
        }
        return sessions.get(0);
    }

    public void updateSessionTitle(Long sessionId, String title) {
        ChatSession session = chatSessionMapper.getSessionBySessionId(sessionId.toString());
        if (session != null) {
            session.setTitle(title);
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.updateSession(session);
        }
    }

    public void deleteSession(Long sessionId) {
        chatSessionMapper.deleteMessagesBySessionId(sessionId);
        chatSessionMapper.deleteSession(sessionId);
        log.info("Deleted session: {}", sessionId);
    }
}


