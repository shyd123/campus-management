package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.CourseDao;
import com.hclx.vip2412_backend.entity.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseDao courseDao;

    public List<Course> selectAll() {
        return courseDao.selectAll();
    }

    public Course selectById(Integer id) {
        return courseDao.selectById(id);
    }

    public List<Course> selectByTeacherIdAndWeekday(Long teacherId, Integer weekday) {
        return courseDao.selectByTeacherIdAndWeekday(teacherId, weekday);
    }

    public int insert(Course course) {
        return courseDao.insert(course);
    }

    public int update(Course course) {
        return courseDao.update(course);
    }

    public int delete(Integer id) {
        return courseDao.delete(id);
    }

    public List<Course> selectByClassId(Integer classId) {
        return courseDao.selectByClassId(classId);
    }

    public List<Course> selectByTeacherId(Integer teacherId) {
        return courseDao.selectByTeacherId(teacherId);
    }
}