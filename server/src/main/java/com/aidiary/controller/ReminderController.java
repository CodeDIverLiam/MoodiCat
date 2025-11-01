package com.aidiary.controller;

import com.aidiary.mapper.UserMapper;
import com.aidiary.model.Reminder;
import com.aidiary.security.SecurityUtils;
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
    private final UserMapper userMapper;

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
        return reminderService.createReminder(reminder);
    }

    @DeleteMapping("/{reminderId}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long reminderId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Reminder existingReminder = reminderService.findById(reminderId);
        if (existingReminder == null) {
            return ResponseEntity.notFound().build();
        }

        if (!existingReminder.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (reminderService.deleteReminder(reminderId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}