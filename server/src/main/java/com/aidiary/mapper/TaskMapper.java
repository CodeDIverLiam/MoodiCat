package com.aidiary.mapper;

import com.aidiary.model.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TaskMapper {
    Task findById(@Param("id") Long id);
    List<Task> findByUserId(@Param("userId") Long userId, @Param("status") String status);
    int insert(Task task);
    int update(Task task);
    int delete(@Param("id") Long id);
    List<Task> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
}
