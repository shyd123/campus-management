package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.ClassroomLayout;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ClassroomLayoutDao {
    List<ClassroomLayout> selectByClassroomId(Integer classroomId);
    int batchInsert(List<ClassroomLayout> layouts);
    int deleteByClassroomId(Integer classroomId);
}
