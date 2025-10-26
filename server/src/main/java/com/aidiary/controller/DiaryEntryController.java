package com.aidiary.controller;

import com.aidiary.mapper.UserMapper; // 导入
import com.aidiary.model.DiaryEntry;
import com.aidiary.security.SecurityUtils; // 导入
import com.aidiary.service.DiaryEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/diary-entries")
@RequiredArgsConstructor
public class DiaryEntryController {
    private final DiaryEntryService diaryEntryService;
    private final UserMapper userMapper; // 注入

    @GetMapping
    public List<DiaryEntry> getDiaryEntries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        return diaryEntryService.findDiaryEntries(currentUserId, startDate, endDate);
    }

    @GetMapping("/{entryId}")
    public ResponseEntity<DiaryEntry> getDiaryEntryById(@PathVariable Long entryId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        DiaryEntry entry = diaryEntryService.findDiaryEntryById(entryId);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查
        if (!entry.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(entry);
    }

    @PostMapping
    public DiaryEntry createDiaryEntry(@RequestBody DiaryEntry diaryEntry) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        diaryEntry.setUserId(currentUserId);
        return diaryEntryService.createDiaryEntry(diaryEntry);
    }

    @PutMapping("/{entryId}")
    public ResponseEntity<DiaryEntry> updateDiaryEntry(@PathVariable Long entryId, @RequestBody DiaryEntry entryDetails) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        DiaryEntry existingEntry = diaryEntryService.findDiaryEntryById(entryId); // 先获取

        if (existingEntry == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查
        if (!existingEntry.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DiaryEntry updatedEntry = diaryEntryService.updateDiaryEntry(entryId, entryDetails);
        return updatedEntry != null ? ResponseEntity.ok(updatedEntry) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> deleteDiaryEntry(@PathVariable Long entryId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        DiaryEntry existingEntry = diaryEntryService.findDiaryEntryById(entryId); // 先获取

        if (existingEntry == null) {
            return ResponseEntity.notFound().build();
        }
        // 授权检查
        if (!existingEntry.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (diaryEntryService.deleteDiaryEntry(entryId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}