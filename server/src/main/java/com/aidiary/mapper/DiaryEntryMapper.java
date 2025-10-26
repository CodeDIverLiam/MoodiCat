package com.aidiary.mapper;

import com.aidiary.model.DiaryEntry;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DiaryEntryMapper {
    DiaryEntry findById(@Param("id") Long id);
    List<DiaryEntry> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    int insert(DiaryEntry diaryEntry);
    int update(DiaryEntry diaryEntry);
    int delete(@Param("id") Long id);
}
