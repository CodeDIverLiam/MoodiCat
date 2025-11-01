package com.aidiary.mapper;

import com.aidiary.model.ChatSession;
import com.aidiary.model.ChatMessage;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ChatSessionMapper {
    void createSession(ChatSession session);
    List<ChatSession> getSessionsByUserId(Long userId);
    ChatSession getSessionBySessionId(String sessionId);
    void updateSession(ChatSession session);
    void deleteSession(Long sessionId);
    
    void addMessage(ChatMessage message);
    List<ChatMessage> getMessagesBySessionId(Long sessionId);
    void deleteMessagesBySessionId(Long sessionId);
}


