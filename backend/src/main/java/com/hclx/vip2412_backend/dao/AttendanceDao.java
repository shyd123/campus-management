package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Attendance;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttendanceDao {
    List<Attendance> selectByCourseIdAndDate(@Param("courseId") Integer courseId, @Param("date") String date);
    int batchInsert(@Param("records") List<Attendance> records);
    int deleteByCourseIdAndDate(@Param("courseId") Integer courseId, @Param("date") String date);
}
