-- SQL Script for aiDiary Application Database (MySQL)
-- Version: 1.1
-- Description: Creates the initial tables for users, tasks, diary entries, and reminders for MySQL.

CREATE TABLE `users` (
                         `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                         `username` VARCHAR(100) NOT NULL UNIQUE,
                         `email` VARCHAR(255) NOT NULL UNIQUE,
                         `password_hash` VARCHAR(255) NOT NULL,
                         `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         INDEX `idx_username` (`username`),
                         INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Script End

