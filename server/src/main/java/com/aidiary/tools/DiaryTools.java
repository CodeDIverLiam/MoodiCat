package com.aidiary.tools;

import com.aidiary.model.Reminder; // 导入 Reminder
import com.aidiary.service.ReminderService; // 导入 ReminderService
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
import java.time.LocalDateTime; // 导入 LocalDateTime
import java.time.format.DateTimeFormatter; // 导入 DateTimeFormatter

@Component
@RequiredArgsConstructor
@Slf4j
public class DiaryTools {
    private final DiaryEntryService diaryEntryService;
    private final ReminderService reminderService; // 注入 ReminderService
    private final UserMapper userMapper; // 注入 UserMapper
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules(); // 确保能处理Java 8 时间类型

    @Tool(name = "append_diary",
            description = "把文本写入今天的日记。参数JSON: {\"title\":\"可选标题\",\"content\":\"正文(必填)\",\"mood\":\"可选心情\"}")
    public String append_diary(String json) {
        log.info("=== TOOL CALLED: append_diary with json={} ===", json);
        
        // 处理 null 或空参数
        if (json == null || json.trim().isEmpty()) {
            log.error("append_diary called with null or empty json parameter");
            return "ERROR: 参数不能为空。请提供有效的 JSON 参数：{\"title\":\"可选标题\",\"content\":\"正文(必填)\",\"mood\":\"可选心情\"}";
        }
        
        try {
            // 尝试解析 JSON
            JsonNode node;
            try {
                node = mapper.readTree(json);
            } catch (Exception e) {
                log.error("Failed to parse JSON: {}, json={}", e.getMessage(), json);
                return "ERROR: JSON 格式错误：" + e.getMessage();
            }
            
            // 提取字段，与 task 工具保持一致的风格
            String title = null;
            if (node.hasNonNull("title")) {
                String titleStr = node.get("title").asText();
                if (titleStr != null && !titleStr.trim().isEmpty()) {
                    title = titleStr.trim();
                }
            }
            
            // 检查必需的 content 字段（与 task 的 title 检查方式一致）
            String content = null;
            if (node.hasNonNull("content")) {
                content = node.get("content").asText();
                if (content != null) {
                    content = content.trim();
                }
            }
            
            // 检查 content 是否为空（与 task 的 title 检查一致）
            if (content == null || content.isEmpty()) {
                log.error("append_diary called without required 'content' field or content is empty. JSON: {}", json);
                return "ERROR: content 字段是必需的，不能为空。请提供有效的 JSON 参数：{\"title\":\"可选标题\",\"content\":\"正文(必填)\",\"mood\":\"可选心情\"}";
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

            // 从 SecurityContext 获取用户ID
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for diary entry");
                return "ERROR: User not authenticated";
            }
            
            log.info("Creating diary entry for user ID: {}", currentUserId);
            
            var entry = new DiaryEntry();
            entry.setUserId(currentUserId);
            entry.setTitle(title); // title 可以为 null
            entry.setContent(content);
            entry.setMood(mood); // mood 可以为 null
            entry.setEntryDate(LocalDate.now());

            log.info("Calling diaryEntryService.createDiaryEntry()...");
            diaryEntryService.createDiaryEntry(entry);
            
            log.info("=== DIARY ENTRY CREATED SUCCESSFULLY: id={}, title={}, content length={} ===", 
                    entry.getId(), title, content.length());
            
            return "OK id=" + entry.getId() + " title=" + (title != null ? title : "无标题");
        } catch (Exception e) {
            log.error("=== ERROR in appendDiary tool: {} ===", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    // --- 新增 Reminder 工具 ---
    @Tool(name = "set_reminder",
            description = "为一个未来的事件或任务设置提醒。参数JSON: {\"task_id\":\"关联的任务ID(可选)\", \"reminder_time\":\"提醒时间(ISO 8601格式, YYYY-MM-DDTHH:mm:ss)\", \"description\":\"提醒的简短描述(可选)\"}")
    public String set_reminder(String json) {
        try {
            var node = mapper.readTree(json);
            var taskId = node.hasNonNull("task_id") ? node.get("task_id").asLong() : null;
            var reminderTimeStr = node.get("reminder_time").asText();
            // AI 返回的时间格式可能需要更健壮的解析
            LocalDateTime reminderTime = LocalDateTime.parse(reminderTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            // 检查提醒时间是否在未来
            if (reminderTime.isBefore(LocalDateTime.now())) {
                log.warn("Attempted to set reminder in the past: {}", reminderTime);
                return "ERROR: Reminder time must be in the future.";
            }

            var reminder = new Reminder();
            // 从 SecurityContext 获取用户ID
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for reminder");
                return "ERROR: User not authenticated";
            }
            reminder.setUserId(currentUserId);
            reminder.setTaskId(taskId);
            reminder.setReminderTime(reminderTime);

            reminderService.createReminder(reminder); // 调用 Service 创建提醒
            log.info("Reminder set via AI tool: id={}, time={}", reminder.getId(), reminder.getReminderTime());
            return "OK id=" + reminder.getId();

        } catch (Exception e) {
            log.error("Error in setReminder tool: {}", e.getMessage(), e);
            return "ERROR: Failed to parse reminder details or time is in the past - " + e.getMessage();
        }
    }
}