package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Course;
import com.hclx.vip2412_backend.entity.User;
import com.hclx.vip2412_backend.service.CourseService;
import com.hclx.vip2412_backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/teaching-tasks")
public class TeachingTaskController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public Response<List<Course>> getTeachingTasks(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = JwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return Response.fail(401, "未授权");
        }
        List<Course> courses = courseService.selectByTeacherId(userId.intValue());
        return Response.success(courses);
    }
}
