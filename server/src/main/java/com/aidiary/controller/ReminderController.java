package com.aidiary.controller;

import com.aidiary.mapper.UserMapper; // 导入
import com.aidiary.model.Reminder;
import com.aidiary.security.SecurityUtils; // 导入
import com.aidiary.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final ReminderService reminderService;
    private final UserMapper userMapper; // 注入 UserMapper 用于获取当前用户ID

    @GetMapping
    public List<Reminder> getReminders() {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        return reminderService.findByUserId(currentUserId);
    }

    @PostMapping
    public Reminder createReminder(@RequestBody Reminder reminder) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        reminder.setUserId(currentUserId);
        // 注意：这里可能还需要校验 reminder.taskId 是否也属于当前用户，如果 task_id 不为空的话
        return reminderService.createReminder(reminder);
    }

    @DeleteMapping("/{reminderId}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long reminderId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Reminder existingReminder = reminderService.findById(reminderId); // 先获取提醒信息
        if (existingReminder == null) {
            return ResponseEntity.notFound().build();
        }

        // 授权检查：确认这个提醒属于当前登录用户
        if (!existingReminder.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (reminderService.deleteReminder(reminderId)) {
            return ResponseEntity.noContent().build();
        }
        // 一般不会到这里，因为上面已经检查过存在性
        return ResponseEntity.notFound().build();
    }
}