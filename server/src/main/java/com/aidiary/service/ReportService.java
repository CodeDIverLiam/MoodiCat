package com.aidiary.service;

import com.aidiary.dto.DailySummaryResponse;
import com.aidiary.mapper.DiaryEntryMapper; // 导入 DiaryEntryMapper
import com.aidiary.mapper.TaskMapper;
import com.aidiary.model.DiaryEntry; // 导入 DiaryEntry
import com.aidiary.model.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors; // 导入 Collectors

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TaskMapper taskMapper;
    private final DiaryEntryMapper diaryEntryMapper; // 注入 DiaryEntryMapper
    // private final AiService aiService; // 可注入AI服务生成建议

    public DailySummaryResponse getDailySummary(Long userId, LocalDate date) {
        // 注意：TaskMapper.findByUserIdAndDate 目前是根据 created_at 查询当天的任务
        List<Task> tasks = taskMapper.findByUserIdAndDate(userId, date);
        long completedCount = tasks.stream().filter(t -> "completed".equalsIgnoreCase(t.getStatus())).count();
        long pendingCount = tasks.size() - completedCount;

        // TODO: 调用AI模型生成智能建议 (可以调用 AiService)
        String aiSuggestion = "你今天非常高效！不过注意到 '设计数据库' 任务占用了较多时间，明天可以尝试先处理更快的任务来建立节奏。"; // 临时占位符

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

        // 根据 period 计算 startDate
        switch (period.toLowerCase()) {
            case "last7days":
                startDate = endDate.minusDays(6);
                break;
            case "last30days":
            default: // 默认为 last30days
                startDate = endDate.minusMonths(1).plusDays(1);
                break;
            // 可以添加更多时间段选项, 如 "last90days"
        }

        List<DiaryEntry> entries = diaryEntryMapper.findByUserIdAndDateRange(userId, startDate, endDate);

        // TODO: 在这里实现情绪分析逻辑
        // 1. 遍历 entries
        // 2. 提取 mood 或 ai_sentiment_score
        // 3. 按日期聚合或计算趋势
        // 4. 将结果格式化为 JSON 字符串或 DTO 返回给前端（用于图表展示）

        // --- Placeholder ---
        return "{\"message\": \"情绪趋势报告待实现\", \"period\":\"" + startDate + " to " + endDate + "\", \"entryCount\":" + entries.size() + "}";
    }
}