package com.aidiary.service;

import com.aidiary.mapper.TaskMapper;
import com.aidiary.model.Task;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskMapper taskMapper;

    public List<Task> findTasksByUserId(Long userId, String status) {
        return taskMapper.findByUserId(userId, status);
    }

    public Task findTaskById(Long id) {
        return taskMapper.findById(id);
    }

    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        taskMapper.insert(task);
        log.debug("created task: {}", task);
        return task;
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = taskMapper.findById(id);
        if (existingTask == null) {
            return null; // Controller层会处理为404
        }
        // 只更新允许修改的字段
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setDueDate(taskDetails.getDueDate());
        existingTask.setUpdatedAt(LocalDateTime.now());
        taskMapper.update(existingTask);
        return existingTask;
    }

    public boolean deleteTask(Long id) {
        return taskMapper.delete(id) > 0;
    }

    public Task getTaskById(Long id) {
        return taskMapper.findById(id);
    }

    public List<Task> getTasksByUserId(Long userId) {
        return taskMapper.findByUserId(userId, null);
    }

    public Task updateTask(Task task) {
        task.setUpdatedAt(LocalDateTime.now());
        taskMapper.update(task);
        return task;
    }
}
