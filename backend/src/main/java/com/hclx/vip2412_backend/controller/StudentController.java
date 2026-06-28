package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Student;
import com.hclx.vip2412_backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public Response<List<Student>> listStudents(@RequestParam(required = false) Integer classId) {
        List<Student> students;
        if (classId != null) {
            students = studentService.selectByClassId(classId);
        } else {
            students = studentService.selectAll();
        }
        return Response.success(students);
    }

    @GetMapping("/{id}")
    public Response<Student> getStudent(@PathVariable Integer id) {
        Student student = studentService.selectById(id);
        if (student == null) {
            return Response.fail(404, "学生不存在");
        }
        return Response.success(student);
    }

    @PostMapping
    public Response<Student> createStudent(@RequestBody Student student) {
        int result = studentService.insert(student);
        if (result > 0) {
            return Response.success("创建成功", studentService.selectById(student.getId()));
        }
        return Response.fail("创建失败");
    }

    @PutMapping("/{id}")
    public Response<Student> updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        student.setId(id);
        int result = studentService.update(student);
        if (result > 0) {
            return Response.success("更新成功", studentService.selectById(id));
        }
        return Response.fail("更新失败");
    }

    @DeleteMapping("/{id}")
    public Response<Void> deleteStudent(@PathVariable Integer id) {
        int result = studentService.delete(id);
        if (result > 0) {
            return Response.success("删除成功");
        }
        return Response.fail("删除失败");
    }
}
