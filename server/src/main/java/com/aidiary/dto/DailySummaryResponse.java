package com.aidiary.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailySummaryResponse {
    private LocalDate date;
    private long tasksCompleted;
    private long tasksPending;
    private String aiSuggestion;
}
