package com.aidiary.service;

import com.aidiary.mapper.DiaryEntryMapper;
import com.aidiary.model.DiaryEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryEntryService {
    private final DiaryEntryMapper diaryEntryMapper;

    public List<DiaryEntry> findDiaryEntries(Long userId, LocalDate startDate, LocalDate endDate) {
        return diaryEntryMapper.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public DiaryEntry findDiaryEntryById(Long id) {
        return diaryEntryMapper.findById(id);
    }

    public DiaryEntry createDiaryEntry(DiaryEntry diaryEntry) {
        diaryEntryMapper.insert(diaryEntry);
        return diaryEntry;
    }

    public DiaryEntry updateDiaryEntry(Long id, DiaryEntry entryDetails) {
        DiaryEntry existingEntry = diaryEntryMapper.findById(id);
        if (existingEntry == null) {
            return null;
        }
        existingEntry.setTitle(entryDetails.getTitle());
        existingEntry.setContent(entryDetails.getContent());
        existingEntry.setMood(entryDetails.getMood());
        diaryEntryMapper.update(existingEntry);
        return existingEntry;
    }

    public boolean deleteDiaryEntry(Long id) {
        return diaryEntryMapper.delete(id) > 0;
    }
}
