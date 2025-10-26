-- SQL Script for aiDiary Application Database (MySQL)
-- Version: 1.1
-- Description: Creates the initial tables for users, tasks, diary entries, and reminders for MySQL.

-- =================================================================
-- Table 1: users (用户信息表)
-- 存储用户账户信息，是用户身份的中心。
-- =================================================================
CREATE TABLE `users` (
                         `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                         `username` VARCHAR(100) NOT NULL UNIQUE,
                         `email` VARCHAR(255) NOT NULL UNIQUE,
                         `password_hash` VARCHAR(255) NOT NULL,
                         `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         INDEX `idx_username` (`username`),
                         INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表，存储用户的账户和认证信息';

-- =================================================================
-- Table 2: tasks (任务信息表)
-- 独立存储所有与任务相关的数据。
-- =================================================================
CREATE TABLE `tasks` (
                         `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                         `user_id` BIGINT NOT NULL,
                         `title` VARCHAR(255) NOT NULL,
                         `description` TEXT,
                         `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
                         `due_date` DATE,
                         `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务信息表，存储用户的待办事项';

-- =================================================================
-- Table 3: diary_entries (日记条目表)
-- 独立存储所有与日记和心情相关的数据。
-- =================================================================
CREATE TABLE `diary_entries` (
                                 `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 `user_id` BIGINT NOT NULL,
                                 `title` VARCHAR(255),
                                 `content` TEXT NOT NULL,
                                 `mood` VARCHAR(50),
                                 `entry_date` DATE NOT NULL,
                                 `ai_sentiment_score` REAL,
                                 `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='日记条目表，存储用户的心情日记';

-- =================================================================
-- Table 4: reminders (提醒信息表)
-- 存储与任务关联的提醒，由后台定时任务处理。
-- =================================================================
CREATE TABLE `reminders` (
                             `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                             `user_id` BIGINT NOT NULL,
                             `task_id` BIGINT,
                             `reminder_time` DATETIME NOT NULL,
                             `is_sent` BOOLEAN NOT NULL DEFAULT FALSE,
                             `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                             FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
                             INDEX `idx_reminder_time_sent` (`reminder_time`, `is_sent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提醒信息表，存储待发送的提醒';

-- Script End

