package com.aidiary.controller;

import com.aidiary.dto.AiChatRequest;
import com.aidiary.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody AiChatRequest request) {
        try {
            String response = aiService.processChatMessage(request.getMessage());
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            log.warn("Unauthorized access attempt to AI chat endpoint");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        } catch (Exception e) {
            log.error("Error processing AI chat request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Sorry, I'm having trouble processing your request. Please try again later.");
        }
    }
}
