package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Subject;
import com.hclx.vip2412_backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 学科控制器
 */
@RestController
@RequestMapping("/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    /**
     * 获取学科列表
     * @return 学科列表
     */
    @GetMapping
    
    public Response<List<Subject>> listSubjects() {
        List<Subject> subjects = subjectService.listSubjects();
        return Response.success(subjects);
    }

    /**
     * 根据ID获取学科
     * @param id 学科ID
     * @return 学科
     */
    @GetMapping("/{id}")
    
    public Response<Subject> getSubject(@PathVariable Integer id) {
        Subject subject = subjectService.selectById(id);
        if (subject == null) {
            return Response.fail(404, "学科不存在");
        }
        return Response.success(subject);
    }

    /**
     * 创建学科
     * @param subject 学科
     * @return 创建的学科
     */
    @PostMapping
    
    public Response<Subject> createSubject(@RequestBody Subject subject) {
        int result = subjectService.addSubject(subject);
        if (result > 0) {
            return Response.success("创建成功", subject);
        } else {
            return Response.fail("创建失败");
        }
    }

    /**
     * 更新学科
     * @param id 学科ID
     * @param subject 学科
     * @return 更新后的学科
     */
    @PutMapping("/{id}")
    
    public Response<Subject> updateSubject(@PathVariable Integer id, @RequestBody Subject subject) {
        subject.setId(id);
        int result = subjectService.updateSubject(subject);
        if (result > 0) {
            return Response.success("更新成功", subject);
        } else {
            return Response.fail("更新失败");
        }
    }

    /**
     * 删除学科
     * @param id 学科ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    
    public Response<Void> deleteSubject(@PathVariable Integer id) {
        int result = subjectService.deleteSubject(id);
        if (result > 0) {
            return Response.success("删除成功");
        } else {
            return Response.fail("删除失败");
        }
    }

}
