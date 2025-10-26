package com.aidiary.mapper;

import com.aidiary.model.Reminder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDateTime; // 导入 LocalDateTime
import java.util.List;

@Mapper
public interface ReminderMapper {
    int insert(Reminder reminder);
    List<Reminder> findByUserId(@Param("userId") Long userId);
    int delete(@Param("id") Long id);
    Reminder findById(@Param("id") Long id);
    List<Reminder> findDueReminders(@Param("currentTime") LocalDateTime currentTime); // 新增：查找所有到期的提醒
    int markAsSent(@Param("id") Long id); // 新增：将提醒标记为已发送
}