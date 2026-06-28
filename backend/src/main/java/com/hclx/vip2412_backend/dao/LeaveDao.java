package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Leave;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LeaveDao {
    List<Leave> selectAll();
    Leave selectById(Integer id);
    List<Leave> selectByClassId(Integer classId);
    List<Leave> selectByStudentId(Integer studentId);
    int insert(Leave leave);
    int update(Leave leave);
    int delete(Integer id);
}
