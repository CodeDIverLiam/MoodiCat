package com.aidiary.controller;

import com.aidiary.mapper.UserMapper;
import com.aidiary.model.Task;
import com.aidiary.security.SecurityUtils;
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
    private final UserMapper userMapper;

    @GetMapping
    public List<Task> getTasks(@RequestParam(required = false) String status) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
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
        if (!task.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        task.setUserId(currentUserId);
        return taskService.createTask(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        Task existingTask = taskService.findTaskById(taskId);

        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingTask.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Task updatedTask = taskService.updateTask(taskId, taskDetails);
        return updatedTask != null ? ResponseEntity.ok(updatedTask) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        Task existingTask = taskService.findTaskById(taskId);

        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingTask.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (taskService.deleteTask(taskId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}