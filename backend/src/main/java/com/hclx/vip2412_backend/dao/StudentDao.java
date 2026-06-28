package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentDao {
    List<Student> selectAll();
    Student selectById(Integer id);
    List<Student> selectByClassId(Integer classId);
    int insert(Student student);
    int update(Student student);
    int delete(Integer id);
}
