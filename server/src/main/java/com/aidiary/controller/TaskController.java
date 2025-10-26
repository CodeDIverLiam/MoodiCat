package com.aidiary.controller;

import com.aidiary.mapper.UserMapper; // 导入 UserMapper 用于 SecurityUtils
import com.aidiary.model.Task;
import com.aidiary.security.SecurityUtils; // 导入 SecurityUtils
import com.aidiary.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserMapper userMapper; // 注入 UserMapper

    @GetMapping
    public List<Task> getTasks(@RequestParam(required = false) String status) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            // 或者根据你的错误处理策略返回
            throw new IllegalStateException("User not authenticated");
        }
        return taskService.findTasksByUserId(currentUserId, status);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        Task task = taskService.findTaskById(taskId);

        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查：任务是否属于当前用户
        if (!task.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 或者 NotFound
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        task.setUserId(currentUserId); // 设置任务所属的用户ID
        return taskService.createTask(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        Task existingTask = taskService.findTaskById(taskId); // 先获取现有任务

        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查
        if (!existingTask.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 传递 taskDetails 以供更新
        Task updatedTask = taskService.updateTask(taskId, taskDetails);
        return updatedTask != null ? ResponseEntity.ok(updatedTask) : ResponseEntity.notFound().build(); // updateTask 内部也可能返回 null
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        Task existingTask = taskService.findTaskById(taskId); // 先获取以验证所有权

        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查
        if (!existingTask.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (taskService.deleteTask(taskId)) {
            return ResponseEntity.noContent().build();
        }
        // 通常如果上面检查通过，这里不会是notFound，但保留以防万一
        return ResponseEntity.notFound().build();
    }
}