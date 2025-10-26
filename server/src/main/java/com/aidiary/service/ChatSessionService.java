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

    /**
     * 创建新的聊天会话
     */
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

    /**
     * 获取用户的所有会话
     */
    public List<ChatSession> getUserSessions(Long userId) {
        return chatSessionMapper.getSessionsByUserId(userId);
    }

    /**
     * 根据sessionId获取会话
     */
    public ChatSession getSessionBySessionId(String sessionId) {
        return chatSessionMapper.getSessionBySessionId(sessionId);
    }

    /**
     * 添加消息到会话
     */
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

    /**
     * 获取会话的所有消息
     */
    public List<ChatMessage> getSessionMessages(Long sessionId) {
        return chatSessionMapper.getMessagesBySessionId(sessionId);
    }

    /**
     * 获取或创建当前用户的会话
     */
    public ChatSession getOrCreateCurrentSession(Long userId) {
        // 获取用户最近的会话
        List<ChatSession> sessions = chatSessionMapper.getSessionsByUserId(userId);
        
        if (sessions.isEmpty()) {
            // 如果没有会话，创建一个新的
            return createSession(userId, "新对话");
        }
        
        // 返回最近的会话
        return sessions.get(0);
    }

    /**
     * 更新会话标题
     */
    public void updateSessionTitle(Long sessionId, String title) {
        ChatSession session = chatSessionMapper.getSessionBySessionId(sessionId.toString());
        if (session != null) {
            session.setTitle(title);
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionMapper.updateSession(session);
        }
    }

    /**
     * 删除会话
     */
    public void deleteSession(Long sessionId) {
        // 先删除所有消息
        chatSessionMapper.deleteMessagesBySessionId(sessionId);
        // 再删除会话
        chatSessionMapper.deleteSession(sessionId);
        log.info("Deleted session: {}", sessionId);
    }
}
