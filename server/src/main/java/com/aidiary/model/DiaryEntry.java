package com.aidiary.model;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DiaryEntry {
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String mood;
    private LocalDate entryDate;
    private Float aiSentimentScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}