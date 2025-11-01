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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        response.setTasks(tasks);
        response.setEntries(entries);

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

    public String getTodayMoodSummary(Long userId) {
        LocalDate today = LocalDate.now();
        List<DiaryEntry> entries = diaryEntryMapper.findByUserIdAndDateRange(userId, today, today);

        if (entries.isEmpty()) {
            return "Tracked";
        }

        Map<String, Long> moodCounts = entries.stream()
                .filter(e -> e.getMood() != null && !e.getMood().trim().isEmpty())
                .collect(Collectors.groupingBy(
                        e -> e.getMood().trim().toLowerCase(),
                        Collectors.counting()
                ));

        if (!moodCounts.isEmpty()) {
            if (moodCounts.size() == 1) {
                String dominantMood = moodCounts.keySet().iterator().next();
                log.info("All entries have the same mood: {}", dominantMood);
                return capitalizeFirst(dominantMood);
            }

            String mostFrequentMood = moodCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            if (mostFrequentMood != null && moodCounts.get(mostFrequentMood) > entries.size() / 2) {
                log.info("Most frequent mood (majority): {}", mostFrequentMood);
                return capitalizeFirst(mostFrequentMood);
            }
        }

        String entriesData = entries.stream()
                .map(e -> String.format("Mood: %s, Content: %s",
                        e.getMood() != null && !e.getMood().trim().isEmpty() ? e.getMood() : "not specified",
                        e.getContent() != null ? e.getContent() : ""))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
            The user has provided diary entries with their own mood labels.
            Your task is to determine the single dominant mood based ONLY on the mood labels they provided.
            DO NOT analyze the content to determine mood - use the mood labels they already provided.
            Count the moods they labeled and return the most frequent one.
            If moods are evenly distributed, choose the one that appears first or seems most representative.
            Respond with ONLY a single English word (the mood), all lowercase.
            Do NOT use emojis, Chinese characters, or any other non-English text.
            Do not include any other text, explanation, or punctuation.
            """;

        String userPrompt = String.format(
                "User's diary entries with their mood labels:\n%s\n\nWhat is the dominant mood based on the mood labels above?",
                entriesData
        );

        try {
            ChatClient localChatClient = ChatClient.builder(chatModel).build();
            String mood = localChatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();

            if (mood != null) {
                String cleaned = mood.replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{S}]", "").trim().toLowerCase();
                if (!cleaned.isEmpty()) {
                    return capitalizeFirst(cleaned);
                }
            }

            // Fallback: return most frequent mood from counts
            if (!moodCounts.isEmpty()) {
                String fallback = moodCounts.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("neutral");
                log.warn("AI analysis failed, using fallback mood: {}", fallback);
                return capitalizeFirst(fallback);
            }

            return "Neutral";
        } catch (Exception e) {
            log.error("Failed to generate today's mood summary: {}", e.getMessage(), e);
            if (!moodCounts.isEmpty()) {
                String fallback = moodCounts.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("neutral");
                return capitalizeFirst(fallback);
            }
            return "Neutral";
        }
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
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

        Map<LocalDate, List<DiaryEntry>> entriesByDate = entries.stream()
                .collect(Collectors.groupingBy(DiaryEntry::getEntryDate));

        List<Map<String, String>> moodTrendList = new ArrayList<>();

        for (Map.Entry<LocalDate, List<DiaryEntry>> dateEntry : entriesByDate.entrySet()) {
            LocalDate date = dateEntry.getKey();
            List<DiaryEntry> dayEntries = dateEntry.getValue();

            Map<String, Long> moodCounts = dayEntries.stream()
                    .filter(e -> e.getMood() != null && !e.getMood().trim().isEmpty())
                    .collect(Collectors.groupingBy(
                            e -> e.getMood().trim().toLowerCase(),
                            Collectors.counting()
                    ));

            String dominantMood;
            if (!moodCounts.isEmpty()) {
                dominantMood = moodCounts.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("neutral");
            } else {
                String dayEntriesData = dayEntries.stream()
                        .map(e -> String.format("Content: %s", e.getContent() != null ? e.getContent() : ""))
                        .collect(Collectors.joining("\n"));

                dominantMood = analyzeMoodWithAI(dayEntriesData);
            }

            Map<String, String> moodData = new HashMap<>();
            moodData.put("date", date.toString());
            moodData.put("mood", dominantMood);
            moodTrendList.add(moodData);
        }

        moodTrendList.sort((a, b) -> a.get("date").compareTo(b.get("date")));

        try {
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String json = objectMapper.writeValueAsString(moodTrendList);
            log.info("Generated mood trend with {} days", moodTrendList.size());
            return json;
        } catch (Exception e) {
            log.error("Failed to serialize mood trend to JSON: {}", e.getMessage(), e);
            return "[]";
        }
    }

    private String analyzeMoodWithAI(String entriesData) {
        String systemPrompt = """
            Analyze the diary content and determine the mood.
            Respond with ONLY a single English word (all lowercase) representing the mood.
            Use common English mood words such as: happy, sad, neutral, anxious, grateful, stressed, calm, excited, tired, peaceful, content, frustrated, joyful, worried, relaxed, overwhelmed.
            Do NOT use emojis, Chinese characters, or any other text.
            """;

        String userPrompt = "Diary entries:\n" + entriesData + "\n\nWhat is the mood? (single word only)";

        try {
            ChatClient localChatClient = ChatClient.builder(chatModel).build();
            String mood = localChatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();

            if (mood != null) {
                String cleaned = mood.replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{S}]", "").trim().toLowerCase();
                if (!cleaned.isEmpty()) {
                    return cleaned;
                }
            }
        } catch (Exception e) {
            log.warn("Failed to analyze mood with AI: {}", e.getMessage());
        }

        return "neutral";
    }
}