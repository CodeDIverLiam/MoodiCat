package com.aidiary.service;

import com.aidiary.dto.DailySummaryResponse;
import com.aidiary.mapper.DiaryEntryMapper;
import com.aidiary.mapper.TaskMapper;
import com.aidiary.model.DiaryEntry;
import com.aidiary.model.Task;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final TaskMapper taskMapper;
    private final DiaryEntryMapper diaryEntryMapper;
    private final ChatModel chatModel;

    public DailySummaryResponse getDailySummary(Long userId, LocalDate date) {

        List<Task> tasks = taskMapper.findByUserIdAndDate(userId, date);
        long completedCount = tasks.stream().filter(t -> "completed".equalsIgnoreCase(t.getStatus())).count();
        long pendingCount = tasks.size() - completedCount;

        List<DiaryEntry> entries = diaryEntryMapper.findByUserIdAndDateRange(userId, date, date);

        String aiSuggestion = generateAiSummary(tasks, entries);

        DailySummaryResponse response = new DailySummaryResponse();
        response.setDate(date);
        response.setTasksCompleted(completedCount);
        response.setTasksPending(pendingCount);
        response.setAiSuggestion(aiSuggestion);

        return response;
    }

    private String generateAiSummary(List<Task> tasks, List<DiaryEntry> entries) {
        if (tasks.isEmpty() && entries.isEmpty()) {
            return "No tasks or diary entries recorded for today.";
        }

        String tasksData = tasks.stream()
                .map(t -> String.format("- Task: %s (Status: %s)", t.getTitle(), t.getStatus()))
                .collect(Collectors.joining("\n"));

        String entriesData = entries.stream()
                .map(e -> String.format("- Diary (Mood: %s): %s", e.getMood(), e.getContent().substring(0, Math.min(e.getContent().length(), 100)) + "..."))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
            You are an empathetic and insightful assistant. Based on the user's task list and diary entries for today, provide a brief (1-2 sentence) summary and suggestion.
            Focus on their mood, task completion, and provide positive feedback or gentle reminders.
            Return only the summary text, do not say "Hello" or "Of course".
            """;

        String userPrompt = String.format(
                "Here is my summary for today:\n\n[Tasks]\n%s\n\n[Diary]\n%s\n\nPlease give me a short summary and suggestion.",
                tasks.isEmpty() ? "No tasks" : tasksData,
                entries.isEmpty() ? "No diary" : entriesData
        );

        try {
            ChatClient localChatClient = ChatClient.builder(chatModel).build();
            return localChatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Failed to generate AI summary: {}", e.getMessage(), e);
            return "Could not generate AI suggestion; the AI service may be temporarily unavailable.";
        }
    }

    /**
     * [NEW] Gets a single-word or emoji summary of today's mood.
     */
    public String getTodayMoodSummary(Long userId) {
        LocalDate today = LocalDate.now();
        List<DiaryEntry> entries = diaryEntryMapper.findByUserIdAndDateRange(userId, today, today);

        if (entries.isEmpty()) {
            return "Tracked"; // Default if no entries
        }

        String entriesData = entries.stream()
                .map(e -> String.format("(Mood: %s) %s", e.getMood(), e.getContent()))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
            Analyze the user's diary entries for today.
            Respond with ONLY a single word or an emoji that best represents their dominant mood.
            Do not include any other text, explanation, or punctuation.
            Example response: Grateful
            Example response: 😊
            Example response: Stressed
            """;

        String userPrompt = "Here are my diary entries:\n" + entriesData;

        try {
            ChatClient localChatClient = ChatClient.builder(chatModel).build();
            String mood = localChatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();

            // Clean up response just in case
            return mood.replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{S}]", "").trim();
        } catch (Exception e) {
            log.error("Failed to generate today's mood summary: {}", e.getMessage(), e);
            return "N/A";
        }
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

        if (entries.isEmpty()) {
            return "[]";
        }

        String entriesData = entries.stream()
                .map(entry -> String.format(
                        "Date: %s, Mood: %s, Content: %s",
                        entry.getEntryDate(),
                        entry.getMood(),
                        entry.getContent()
                ))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
            You are a mood analyst. Analyze the following list of diary entries.
            Your task is to return a JSON array of objects.
            Each object must have two keys: "date" (in YYYY-MM-DD format) and "mood" (e.g., 'happy', 'sad', 'neutral', 'anxious', 'grateful', 'stressed').
            If multiple entries exist for the same day, consolidate them into a single dominant mood for that day.
            Only return the raw JSON array, with no other text, explanations, or markdown.
            """;

        String userPrompt = "Please analyze these entries:\n" + entriesData;

        ChatClient localChatClient = ChatClient.builder(chatModel).build();
        String analysisJson = localChatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();

        return extractJsonArray(analysisJson);
    }

    private String extractJsonArray(String aiResponse) {
        int startIndex = aiResponse.indexOf('[');
        int endIndex = aiResponse.lastIndexOf(']');

        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            String json = aiResponse.substring(startIndex, endIndex + 1);
            log.info("Extracted JSON from AI response.");
            return json;
        }

        log.warn("Could not extract JSON array from AI response. Response was: {}", aiResponse);
        return "[]";
    }
}