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
import java.time.LocalDateTime;
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
            description = "创建一个新的任务。参数JSON: {\"title\":\"任务标题(必填)\",\"description\":\"任务描述(可选)\",\"dueDate\":\"截止日期(YYYY-MM-DD格式,可选)\"}")
    public String create_task(String json) {
        try {
            var node = mapper.readTree(json);
            var title = node.get("title").asText();
            var description = node.hasNonNull("description") ? node.get("description").asText() : null;
            var dueDateStr = node.hasNonNull("dueDate") ? node.get("dueDate").asText() : null;

            var task = new Task();
            // 从 SecurityContext 获取用户ID
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task creation");
                return "ERROR: User not authenticated";
            }
            
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

            taskService.createTask(task);
            log.info("Task created via AI tool: id={}, title={}", task.getId(), title);
            return "OK id=" + task.getId() + " title=" + title;
        } catch (Exception e) {
            log.error("Error in createTask tool: {}", e.getMessage(), e);
            return "ERROR: " + e.getMessage();
        }
    }

    @Tool(name = "update_task",
            description = "更新现有任务的状态或信息。参数JSON: {\"taskId\":\"任务ID(必填)\",\"status\":\"新状态(pending/in_progress/completed,可选)\",\"description\":\"新描述(可选)\"}")
    public String update_task(String json) {
        try {
            var node = mapper.readTree(json);
            var taskId = node.get("taskId").asLong();
            var status = node.hasNonNull("status") ? node.get("status").asText() : null;
            var description = node.hasNonNull("description") ? node.get("description").asText() : null;

            // 从 SecurityContext 获取用户ID
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task update");
                return "ERROR: User not authenticated";
            }

            // 验证状态
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
            description = "获取用户的任务列表。参数JSON: {\"status\":\"过滤状态(pending/in_progress/completed,可选)\",\"limit\":\"限制数量(可选,默认10)\"}")
    public String list_tasks(String json) {
        try {
            var node = mapper.readTree(json);
            var status = node.hasNonNull("status") ? node.get("status").asText() : null;
            int limit = node.hasNonNull("limit") ? node.get("limit").asInt() : 10;

            // 从 SecurityContext 获取用户ID
            Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
            if (currentUserId == null) {
                log.error("No authenticated user found for task listing");
                return "ERROR: User not authenticated";
            }

            var tasks = taskService.getTasksByUserId(currentUserId);
            
            // 过滤状态
            if (status != null) {
                tasks = tasks.stream()
                    .filter(task -> status.equals(task.getStatus()))
                    .collect(Collectors.toList());
            }

            // 限制数量
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
