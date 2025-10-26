package com.aidiary.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Reminder {
    private Long id;
    private Long userId;
    private Long taskId;
    private LocalDateTime reminderTime;
    private boolean isSent;
    private LocalDateTime createdAt;
}