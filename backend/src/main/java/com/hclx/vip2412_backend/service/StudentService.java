package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.StudentDao;
import com.hclx.vip2412_backend.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentDao studentDao;

    public List<Student> selectAll() {
        return studentDao.selectAll();
    }

    public Student selectById(Integer id) {
        return studentDao.selectById(id);
    }

    public List<Student> selectByClassId(Integer classId) {
        return studentDao.selectByClassId(classId);
    }

    public int insert(Student student) {
        return studentDao.insert(student);
    }

    public int update(Student student) {
        return studentDao.update(student);
    }

    public int delete(Integer id) {
        return studentDao.delete(id);
    }
}
