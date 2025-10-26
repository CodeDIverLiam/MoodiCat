package com.aidiary.controller;

import com.aidiary.dto.DailySummaryResponse;
import com.aidiary.mapper.UserMapper; // 导入
import com.aidiary.security.SecurityUtils; // 导入
import com.aidiary.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserMapper userMapper; // 注入

    @GetMapping("/daily-summary")
    public DailySummaryResponse getDailySummary(
            // 移除 userId 参数
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }

        LocalDate queryDate = (date == null) ? LocalDate.now() : date;
        return reportService.getDailySummary(currentUserId, queryDate);
    }

    @GetMapping("/mood-trend")
    public String getMoodTrend(
            // 移除 userId 参数
            @RequestParam(defaultValue = "last30days") String period) {

        Long currentUserId = SecurityUtils.getCurrentUserId(userMapper);
        if (currentUserId == null) {
            throw new IllegalStateException("User not authenticated");
        }
        return reportService.getMoodTrend(currentUserId, period);
    }
}