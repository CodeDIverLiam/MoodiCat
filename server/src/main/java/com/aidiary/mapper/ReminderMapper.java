package com.aidiary.mapper;

import com.aidiary.model.Reminder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface ReminderMapper {
    int insert(Reminder reminder);
    List<Reminder> findByUserId(@Param("userId") Long userId);
    int delete(@Param("id") Long id);
    Reminder findById(@Param("id") Long id);
    List<Reminder> findDueReminders(@Param("currentTime") LocalDateTime currentTime);
    int markAsSent(@Param("id") Long id);
}