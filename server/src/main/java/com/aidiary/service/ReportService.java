package com.aidiary.service;

import com.aidiary.dto.DailySummaryResponse;
import com.aidiary.mapper.DiaryEntryMapper;
import com.aidiary.mapper.TaskMapper;
import com.aidiary.model.DiaryEntry;
import com.aidiary.model.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient; // 1. 导入 ChatClient
import org.springframework.ai.chat.model.ChatModel;   // 2. 导入 ChatModel
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TaskMapper taskMapper;
    private final DiaryEntryMapper diaryEntryMapper;
    private final ChatModel chatModel; // 3. 注入 ChatModel (用于创建一个不带工具的本地 ChatClient)

    public DailySummaryResponse getDailySummary(Long userId, LocalDate date) {
        // ... (getDailySummary 方法保持不变)
        List<Task> tasks = taskMapper.findByUserIdAndDate(userId, date);
        long completedCount = tasks.stream().filter(t -> "completed".equalsIgnoreCase(t.getStatus())).count();
        long pendingCount = tasks.size() - completedCount;

        String aiSuggestion = "你今天非常高效！不过注意到 '设计数据库' 任务占用了较多时间，明天可以尝试先处理更快的任务来建立节奏。";

        DailySummaryResponse response = new DailySummaryResponse();
        response.setDate(date);
        response.setTasksCompleted(completedCount);
        response.setTasksPending(pendingCount);
        response.setAiSuggestion(aiSuggestion);

        return response;
    }

    public String getMoodTrend(Long userId, String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        switch (period.toLowerCase()) {
            case "last7days":
                startDate = endDate.minusDays(6);
                break;
            case "last30days":
            default:
                startDate = endDate.minusMonths(1).plusDays(1);
                break;
        }

        List<DiaryEntry> entries = diaryEntryMapper.findByUserIdAndDateRange(userId, startDate, endDate);

        // 4. 实现情绪分析逻辑
        if (entries.isEmpty()) {
            // 如果没有条目，返回一个空消息
            return "{\"message\": \"No diary entries found for this period.\", \"data\": []}";
        }

        // 5. 将日记条目格式化为 AI 可读的字符串
        String entriesData = entries.stream()
                .map(entry -> String.format(
                        "Date: %s, Mood: %s, Content: %s",
                        entry.getEntryDate(),
                        entry.getMood(),
                        entry.getContent()
                ))
                .collect(Collectors.joining("\n"));

        // 6. 定义一个专门用于分析的 System Prompt
        String systemPrompt = """
            You are a mood analyst. Analyze the following list of diary entries.
            Your task is to return a JSON array of objects.
            Each object must have two keys: "date" (in YYYY-MM-DD format) and "mood" (e.g., 'happy', 'sad', 'neutral', 'anxious', 'grateful', 'stressed').
            If multiple entries exist for the same day, consolidate them into a single dominant mood for that day.
            Only return the raw JSON array, with no other text, explanations, or markdown.
            """;

        String userPrompt = "Please analyze these entries:\n" + entriesData;

        // 7. 创建一个本地的、不带工具的 ChatClient 进行分析
        ChatClient localChatClient = ChatClient.builder(chatModel).build();

        String analysisJson = localChatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();

        // 8. 返回 AI 生成的 JSON 字符串
        // （前端的 ReportsPage.jsx 将需要解析这个JSON字符串来显示图表）
        return analysisJson;
    }
}