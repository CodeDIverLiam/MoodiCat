package com.aidiary.tools;

import com.aidiary.model.Reminder;
import com.aidiary.service.ReminderService;
import com.aidiary.security.SecurityUtils;
import com.aidiary.mapper.UserMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.aidiary.model.DiaryEntry;
import com.aidiary.service.DiaryEntryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.ai.tool.annotation.Tool;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class DiaryTools {
    private final DiaryEntryService diaryEntryService;
    private final ReminderService reminderService;
    private final UserMapper userMapper;
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();

    @Tool(name = "append_diary",
            description = "Write text to today's diary. Parameters JSON: {\"title\":\"optional title\",\"content\":\"content (required)\",\"mood\":\"optional mood\"}")
    public String append_diary(String json) {
        log.info("=== TOOL CALLED: append_diary with json={} ===", json);
        
        if (json == null || json.trim().isEmpty()) {
            log.error("append_diary called with null or empty json parameter");
            return "ERROR: Parameters cannot be empty. Please provide valid JSON parameters: {\"title\":\"optional title\",\"content\":\"content (required)\",\"mood\":\"optional mood\"}";
        }
        
        try {
            JsonNode node;
            try {
                node = mapper.readTree(json);
            } catch (Exception e) {
                log.error("Failed to parse JSON: {}, json={}", e.getMessage(), json);
                return "ERROR: Invalid JSON format: " + e.getMessage();
            }
            
            String title = null;
            if (node.hasNonNull("title")) {
                String titleStr = node.get("title").asText();
                if (titleStr != null && !titleStr.trim().isEmpty()) {
                    title = titleStr.trim();
                }
            }
            
            String content = null;
            if (node.hasNonNull("content")) {
                content = node.get("content").asText();
                if (content != null) {
                    content = content.trim();
                }
            }
            
            if (content == null || content.isEmpty()) {
                log.error("append_diary called without required 'content' field or content is empty. JSON: {}", json);
                return "ERROR: content field is required and cannot be empty. Please provide valid JSON parameters: {\"title\":\"optional title\",\"content\":\"content (required)\",\"mood\":\"optional mood\"}";
            }
            
            String mood = null;
            if (node.hasNonNull("mood")) {
                String moodStr = node.get("mood").asText();
                if (moodStr != null && !moodStr.trim().isEmpty()) {
                    mood = moodStr.trim();
                }
            }

            log.info("Parsed diary data: title={}, content length={}, mood={}", 
                    title, content.length(), mood);

            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for diary entry");
                return "ERROR: User not authenticated";
            }
            
            log.info("Creating diary entry for user ID: {}", currentUserId);
            
            var entry = new DiaryEntry();
            entry.setUserId(currentUserId);
            entry.setTitle(title);
            entry.setContent(content);
            entry.setMood(mood);
            entry.setEntryDate(LocalDate.now());

            log.info("Calling diaryEntryService.createDiaryEntry()...");
            diaryEntryService.createDiaryEntry(entry);
            
            log.info("=== DIARY ENTRY CREATED SUCCESSFULLY: id={}, title={}, content length={} ===", 
                    entry.getId(), title, content.length());
            
            return "OK id=" + entry.getId() + " title=" + (title != null ? title : "Untitled");
        } catch (Exception e) {
            log.error("=== ERROR in appendDiary tool: {} ===", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    @Tool(name = "set_reminder",
            description = "Set a reminder for a future event or task. Parameters JSON: {\"task_id\":\"associated task ID (optional)\", \"reminder_time\":\"reminder time (ISO 8601 format, YYYY-MM-DDTHH:mm:ss)\", \"description\":\"short description of reminder (optional)\"}")
    public String set_reminder(String json) {
        try {
            var node = mapper.readTree(json);
            var taskId = node.hasNonNull("task_id") ? node.get("task_id").asLong() : null;
            var reminderTimeStr = node.get("reminder_time").asText();
            LocalDateTime reminderTime = LocalDateTime.parse(reminderTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            if (reminderTime.isBefore(LocalDateTime.now())) {
                log.warn("Attempted to set reminder in the past: {}", reminderTime);
                return "ERROR: Reminder time must be in the future.";
            }

            var reminder = new Reminder();
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for reminder");
                return "ERROR: User not authenticated";
            }
            reminder.setUserId(currentUserId);
            reminder.setTaskId(taskId);
            reminder.setReminderTime(reminderTime);

            reminderService.createReminder(reminder);
            log.info("Reminder set via AI tool: id={}, time={}", reminder.getId(), reminder.getReminderTime());
            return "OK id=" + reminder.getId();

        } catch (Exception e) {
            log.error("Error in setReminder tool: {}", e.getMessage(), e);
            return "ERROR: Failed to parse reminder details or time is in the past - " + e.getMessage();
        }
    }
}