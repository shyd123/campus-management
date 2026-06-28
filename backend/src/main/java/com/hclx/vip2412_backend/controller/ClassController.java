package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.ClassInfo;
import com.hclx.vip2412_backend.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    public Response<List<ClassInfo>> listClasses(@RequestParam(required = false) Integer page,
                                                 @RequestParam(required = false) Integer size,
                                                 @RequestParam(required = false) Integer headmasterId) {
        List<ClassInfo> classInfos;
        if (headmasterId != null) {
            classInfos = classService.selectByHeadmasterId(headmasterId);
        } else {
            classInfos = classService.selectAll();
        }
        return new Response<>(200, "获取成功", classInfos);
    }

    @GetMapping("/{id}")
    public Response<ClassInfo> getClass(@PathVariable Integer id) {
        ClassInfo clazz = classService.selectById(id);
        if (clazz == null) {
            return new Response<>(404, "班级不存在", null);
        }
        return new Response<>(200, "获取成功", clazz);
    }

    @PostMapping
    public Response<ClassInfo> createClass(@RequestBody ClassInfo clazz) {
        int result = classService.insert(clazz);
        if (result > 0) {
            ClassInfo createdClassInfo = classService.selectById(clazz.getId());
            return new Response<>(200, "创建成功", createdClassInfo);
        }
        return new Response<>(400, "创建失败", null);
    }

    @PutMapping("/{id}")
    public Response<ClassInfo> updateClass(@PathVariable Integer id, @RequestBody ClassInfo clazz) {
        clazz.setId(id);
        int result = classService.update(clazz);
        if (result > 0) {
            ClassInfo updatedClassInfo = classService.selectById(id);
            return new Response<>(200, "更新成功", updatedClassInfo);
        }
        return new Response<>(400, "更新失败", null);
    }

    @DeleteMapping("/{id}")
    public Response<Void> deleteClass(@PathVariable Integer id) {
        int result = classService.delete(id);
        if (result > 0) {
            return new Response<>(200, "删除成功", null);
        }
        return new Response<>(400, "删除失败", null);
    }
}