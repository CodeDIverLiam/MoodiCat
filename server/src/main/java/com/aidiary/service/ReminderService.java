package com.aidiary.service;

import com.aidiary.mapper.ReminderMapper;
import com.aidiary.model.Reminder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {
    private final ReminderMapper reminderMapper;

    public List<Reminder> findByUserId(Long userId) {
        return reminderMapper.findByUserId(userId);
    }

    public Reminder findById(Long id) {
        return reminderMapper.findById(id);
    }

    @Transactional
    public Reminder createReminder(Reminder reminder) {
        reminder.setSent(false);
        reminder.setCreatedAt(LocalDateTime.now());
        reminderMapper.insert(reminder);
        log.info("Reminder created: id={}, userId={}, taskId={}, time={}",
                reminder.getId(), reminder.getUserId(), reminder.getTaskId(), reminder.getReminderTime());
        return reminder;
    }

    @Transactional
    public boolean deleteReminder(Long id) {
        return reminderMapper.delete(id) > 0;
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void processDueReminders() {
        LocalDateTime now = LocalDateTime.now();
        log.debug("Checking for due reminders at {}", now);

        List<Reminder> dueReminders = reminderMapper.findDueReminders(now);

        if (dueReminders.isEmpty()) {
            log.debug("No due reminders found.");
            return;
        }

        log.info("Found {} due reminders to process.", dueReminders.size());

        for (Reminder reminder : dueReminders) {
            try {
                sendNotification(reminder);
                reminderMapper.markAsSent(reminder.getId());
                log.info("Reminder sent and marked: id={}", reminder.getId());
            } catch (Exception e) {
                log.error("Failed to process reminder id={}: {}", reminder.getId(), e.getMessage(), e);
            }
        }
    }

    private void sendNotification(Reminder reminder) {
        log.warn("=== Sending Reminder Notification (Simulation) ===");
        log.warn("To User ID: {}", reminder.getUserId());
        log.warn("Reminder Time: {}", reminder.getReminderTime());
        log.warn("Associated Task ID: {}", reminder.getTaskId());
        log.warn("Reminder Content Placeholder: Reminder for task {}!", reminder.getTaskId());
        log.warn("==================================================");
        try {
            Thread.sleep(100);
        } catch (InterruptedException ignored) {}
    }
}