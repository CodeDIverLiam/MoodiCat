package com.aidiary.dto;

import com.aidiary.model.DiaryEntry;
import com.aidiary.model.Task;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DailySummaryResponse {
    private LocalDate date;
    private long tasksCompleted;
    private long tasksPending;
    private String aiSuggestion;
    private String moodAnalysis;
    private List<Task> tasks;
    private List<DiaryEntry> entries;
}
