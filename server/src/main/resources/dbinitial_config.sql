-- Mock Data for aiDiary Application (MySQL)
-- This script creates 1 user, 3 tasks, and 2 diary entries.

-- Step 1: Create a user.
-- We'll create a user with id=1, so other records can link to it.
-- NOTE: The password_hash is just a placeholder. In a real app, this would be a real hash.
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`, `updated_at`)
VALUES
    (1, 'liamxue', 'liam.xue@example.com', 'placeholder_hash_for_testing', '2025-10-21 09:00:00', '2025-10-21 09:00:00');


-- Step 2: Create some tasks for the user with id=1.
INSERT INTO `tasks` (`user_id`, `title`, `description`, `status`, `due_date`, `created_at`, `updated_at`)
VALUES
    (1, 'Complete the API design document', 'Finish writing all endpoints for the aiDiary project.', 'completed', '2025-10-21', '2025-10-21 10:00:00', '2025-10-21 18:30:00'),
    (1, 'Develop the CRUD API for Tasks', 'Implement the GET, POST, PUT, DELETE endpoints for tasks.', 'pending', '2025-10-22', '2025-10-21 11:00:00', '2025-10-21 11:00:00'),
    (1, 'Test login endpoint', 'Use Postman to test the /auth/login API and verify JWT response.', 'pending', '2025-10-22', '2025-10-21 14:00:00', '2025-10-21 14:00:00');


-- Step 3: Create some diary entries for the user with id=1.
INSERT INTO `diary_entries` (`user_id`, `title`, `content`, `mood`, `entry_date`, `ai_sentiment_score`, `created_at`, `updated_at`)
VALUES
    (1, 'A Productive Day', 'Managed to fix the foreign key constraint issue and got the task creation API working. Feeling accomplished!', 'happy', '2025-10-21', 0.8, '2025-10-21 20:00:00', '2025-10-21 20:00:00'),
    (1, 'Planning for tomorrow', 'Tomorrow I need to focus on implementing the authentication layer with Spring Security. It might be challenging.', 'neutral', '2025-10-21', 0.1, '2025-10-21 22:15:00', '2025-10-21 22:15:00');