package com.aidiary.tools;

import com.aidiary.model.Task;
import com.aidiary.service.TaskService;
import com.aidiary.security.SecurityUtils;
import com.aidiary.mapper.UserMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.ai.tool.annotation.Tool;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskTools {
    private final TaskService taskService;
    private final UserMapper userMapper;
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();

    @Tool(name = "create_task",
            description = "Create a new task. Parameters JSON: {\"title\":\"task title (required)\",\"description\":\"task description (optional)\",\"dueDate\":\"due date (YYYY-MM-DD format, optional)\"}")
    public String create_task(String json) {
        log.info("=== TOOL CALLED: create_task with json={} ===", json);
        
        if (json == null || json.trim().isEmpty()) {
            log.error("create_task called with null or empty json parameter");
            return "ERROR: Parameters cannot be empty. Please provide valid JSON parameters: {\"title\":\"task title (required)\",\"description\":\"task description (optional)\",\"dueDate\":\"due date (YYYY-MM-DD format, optional)\"}";
        }
        
        try {
            var node = mapper.readTree(json);
            
            if (!node.hasNonNull("title") || node.get("title").asText().trim().isEmpty()) {
                log.error("create_task called without required 'title' field");
                return "ERROR: title field is required and cannot be empty";
            }
            
            var title = node.get("title").asText();
            var description = node.hasNonNull("description") ? node.get("description").asText() : null;
            var dueDateStr = node.hasNonNull("dueDate") ? node.get("dueDate").asText() : null;

            log.info("Parsed task data: title={}, description={}, dueDate={}", title, description, dueDateStr);

            var task = new Task();
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task creation");
                return "ERROR: User not authenticated";
            }
            
            log.info("Creating task for user ID: {}", currentUserId);
            task.setUserId(currentUserId);
            task.setTitle(title);
            task.setDescription(description);
            task.setStatus("pending");
            
            if (dueDateStr != null && !dueDateStr.isEmpty()) {
                try {
                    LocalDate dueDate = LocalDate.parse(dueDateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                    task.setDueDate(dueDate);
                } catch (Exception e) {
                    log.warn("Invalid due date format: {}, ignoring", dueDateStr);
                }
            }

            log.info("Calling taskService.createTask()...");
            taskService.createTask(task);
            log.info("=== TASK CREATED SUCCESSFULLY: id={}, title={} ===", task.getId(), title);
            return "OK id=" + task.getId() + " title=" + title;
        } catch (Exception e) {
            log.error("=== ERROR in createTask tool: {} ===", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    @Tool(name = "update_task",
            description = "Update an existing task's status or information. Parameters JSON: {\"taskId\":\"task ID (required)\",\"status\":\"new status (pending/in_progress/completed, optional)\",\"description\":\"new description (optional)\"}")
    public String update_task(String json) {
        try {
            var node = mapper.readTree(json);
            var taskId = node.get("taskId").asLong();
            var status = node.hasNonNull("status") ? node.get("status").asText() : null;
            var description = node.hasNonNull("description") ? node.get("description").asText() : null;

            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task update");
                return "ERROR: User not authenticated";
            }

            if (status != null && !status.matches("pending|in_progress|completed")) {
                return "ERROR: Invalid status. Must be pending, in_progress, or completed";
            }

            var task = taskService.getTaskById(taskId);
            if (task == null || !task.getUserId().equals(currentUserId)) {
                return "ERROR: Task not found or access denied";
            }

            if (status != null) {
                task.setStatus(status);
            }
            if (description != null) {
                task.setDescription(description);
            }

            taskService.updateTask(task);
            log.info("Task updated via AI tool: id={}, status={}", taskId, status);
            return "OK id=" + taskId + " status=" + (status != null ? status : "unchanged");
        } catch (Exception e) {
            log.error("Error in updateTask tool: {}", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    @Tool(name = "list_tasks",
            description = "Get the user's task list. Parameters JSON: {\"status\":\"filter status (pending/in_progress/completed, optional)\",\"limit\":\"limit count (optional, default 10)\"}")
    public String list_tasks(String json) {
        try {
            var node = mapper.readTree(json);
            var status = node.hasNonNull("status") ? node.get("status").asText() : null;
            int limit = node.hasNonNull("limit") ? node.get("limit").asInt() : 10;

            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task listing");
                return "ERROR: User not authenticated";
            }

            var tasks = taskService.getTasksByUserId(currentUserId);
            
            if (status != null) {
                tasks = tasks.stream()
                    .filter(task -> status.equals(task.getStatus()))
                    .collect(Collectors.toList());
            }

            if (limit > 0) {
                tasks = tasks.stream().limit(limit).collect(Collectors.toList());
            }

            var result = new StringBuilder();
            result.append("Found ").append(tasks.size()).append(" tasks:\n");
            for (var task : tasks) {
                result.append("- ID: ").append(task.getId())
                      .append(", Title: ").append(task.getTitle())
                      .append(", Status: ").append(task.getStatus());
                if (task.getDueDate() != null) {
                    result.append(", Due: ").append(task.getDueDate());
                }
                result.append("\n");
            }

            log.info("Tasks listed via AI tool: count={}", tasks.size());
            return result.toString();
        } catch (Exception e) {
            log.error("Error in listTasks tool: {}", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }
}
