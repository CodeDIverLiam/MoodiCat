package com.aidiary.service;

import com.aidiary.mapper.ReminderMapper;
import com.aidiary.model.Reminder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 导入 Slf4j 日志
import org.springframework.scheduling.annotation.Scheduled; // 导入 Scheduled
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 导入 Transactional
import java.time.LocalDateTime; // 导入 LocalDateTime
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j // 添加 Slf4j 日志注解
public class ReminderService {
    private final ReminderMapper reminderMapper;
    // private final NotificationService notificationService; // TODO: 注入实际的通知服务

    public List<Reminder> findByUserId(Long userId) {
        return reminderMapper.findByUserId(userId);
    }

    public Reminder findById(Long id) {
        return reminderMapper.findById(id);
    }

    @Transactional // 添加事务注解，确保插入成功
    public Reminder createReminder(Reminder reminder) {
        // 可以在这里添加一些默认值或校验
        reminder.setSent(false); // 确保新提醒是未发送状态
        reminder.setCreatedAt(LocalDateTime.now());
        reminderMapper.insert(reminder);
        log.info("Reminder created: id={}, userId={}, taskId={}, time={}",
                reminder.getId(), reminder.getUserId(), reminder.getTaskId(), reminder.getReminderTime());
        return reminder;
    }

    @Transactional // 添加事务注解
    public boolean deleteReminder(Long id) {
        return reminderMapper.delete(id) > 0;
    }

    // --- 定时任务处理提醒 ---
    @Scheduled(cron = "0 * * * * *") // 每分钟的第0秒执行一次
    @Transactional // 整个检查和发送过程应该在一个事务中
    public void processDueReminders() {
        LocalDateTime now = LocalDateTime.now();
        log.debug("Checking for due reminders at {}", now); // 使用 debug 级别，避免过多日志

        List<Reminder> dueReminders = reminderMapper.findDueReminders(now);

        if (dueReminders.isEmpty()) {
            log.debug("No due reminders found.");
            return;
        }

        log.info("Found {} due reminders to process.", dueReminders.size());

        for (Reminder reminder : dueReminders) {
            try {
                sendNotification(reminder); // 发送通知
                reminderMapper.markAsSent(reminder.getId()); // 标记为已发送
                log.info("Reminder sent and marked: id={}", reminder.getId());
            } catch (Exception e) {
                // 记录错误，但不中断循环，尝试处理下一个提醒
                log.error("Failed to process reminder id={}: {}", reminder.getId(), e.getMessage(), e);
                // TODO: 在实际应用中，可能需要更复杂的错误处理，例如重试机制
            }
        }
    }

    // --- 模拟发送通知 ---
    private void sendNotification(Reminder reminder) {
        // TODO: 在这里替换为实际的通知逻辑（邮件、推送等）
        // 例如: notificationService.sendPush(reminder.getUserId(), "提醒: " + reminder.getTaskTitle());
        log.warn("=== Sending Reminder Notification (Simulation) ==="); // 使用 warn 级别使其显眼
        log.warn("To User ID: {}", reminder.getUserId());
        log.warn("Reminder Time: {}", reminder.getReminderTime());
        log.warn("Associated Task ID: {}", reminder.getTaskId());
        // 你可能需要根据 taskId 去查询 task title 来显示更友好的提醒内容
        log.warn("Reminder Content Placeholder: Reminder for task {}!", reminder.getTaskId());
        log.warn("==================================================");
        // 模拟发送需要一些时间
        try {
            Thread.sleep(100); // 模拟耗时
        } catch (InterruptedException ignored) {}
    }
}