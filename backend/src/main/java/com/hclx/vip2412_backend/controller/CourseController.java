package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Course;
import com.hclx.vip2412_backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public Response<List<Course>> listCourses(@RequestParam(required = false) Integer page,
                                             @RequestParam(required = false) Integer size,
                                             @RequestParam(required = false) Integer classId,
                                             @RequestParam(required = false) Integer teacherId) {
        List<Course> courses;
        if (classId != null) {
            courses = courseService.selectByClassId(classId);
        } else if (teacherId != null) {
            courses = courseService.selectByTeacherId(teacherId);
        } else {
            courses = courseService.selectAll();
        }
        return new Response<>(200, "获取成功", courses);
    }

    @GetMapping("/{id}")
    public Response<Course> getCourse(@PathVariable Integer id) {
        Course course = courseService.selectById(id);
        if (course == null) {
            return new Response<>(404, "课程不存在", null);
        }
        return new Response<>(200, "获取成功", course);
    }

    @PostMapping
    public Response<Course> createCourse(@RequestBody Course course) {
        int result = courseService.insert(course);
        if (result > 0) {
            Course createdCourse = courseService.selectById(course.getId());
            return new Response<>(200, "创建成功", createdCourse);
        }
        return new Response<>(400, "创建失败", null);
    }

    @PutMapping("/{id}")
    public Response<Course> updateCourse(@PathVariable Integer id, @RequestBody Course course) {
        course.setId(id);
        int result = courseService.update(course);
        if (result > 0) {
            Course updatedCourse = courseService.selectById(id);
            return new Response<>(200, "更新成功", updatedCourse);
        }
        return new Response<>(400, "更新失败", null);
    }

    @DeleteMapping("/{id}")
    public Response<Void> deleteCourse(@PathVariable Integer id) {
        int result = courseService.delete(id);
        if (result > 0) {
            return new Response<>(200, "删除成功", null);
        }
        return new Response<>(400, "删除失败", null);
    }
}