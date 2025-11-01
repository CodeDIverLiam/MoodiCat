package com.aidiary.controller;

import com.aidiary.mapper.UserMapper;
import com.aidiary.security.SecurityUtils;
import com.aidiary.tools.DiaryTools;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatClient chat;
    private final DiaryTools tools;
    private final UserMapper userMapper;
    
    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody String userMsg) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            log.warn("Unauthorized access attempt to chat endpoint");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        
        log.info("Chat request from user ID: {}", currentUserId);
        
        try {
            String response = chat.prompt(userMsg).tools(tools).call().content();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing chat request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Sorry, I'm having trouble processing your request. Please try again later.");
        }
    }
}