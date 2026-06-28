package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Classroom;
import com.hclx.vip2412_backend.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 教室控制器
 */
@RestController
@RequestMapping("/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    /**
     * 获取教室列表
     * @return 教室列表
     */
    @GetMapping
    public Response<List<Classroom>> listClassrooms() {
        List<Classroom> classrooms = classroomService.listClassrooms();
        return Response.success(classrooms);
    }

    /**
     * 根据ID获取教室
     * @param id 教室ID
     * @return 教室
     */
    @GetMapping("/{id}")
    public Response<Classroom> getClassroom(@PathVariable Integer id) {
        Classroom classroom = classroomService.selectById(id);
        if (classroom == null) {
            return Response.fail(404, "教室不存在");
        }
        return Response.success(classroom);
    }

    /**
     * 创建教室
     * @param classroom 教室
     * @return 创建的教室
     */
    @PostMapping
    public Response<Classroom> createClassroom(@RequestBody Classroom classroom) {
        int result = classroomService.addClassroom(classroom);
        if (result > 0) {
            return Response.success("创建成功", classroom);
        } else {
            return Response.fail("创建失败");
        }
    }

    /**
     * 更新教室
     * @param id 教室ID
     * @param classroom 教室
     * @return 更新后的教室
     */
    @PutMapping("/{id}")
    public Response<Classroom> updateClassroom(@PathVariable Integer id, @RequestBody Classroom classroom) {
        classroom.setId(id);
        int result = classroomService.updateClassroom(classroom);
        if (result > 0) {
            return Response.success("更新成功", classroom);
        } else {
            return Response.fail("更新失败");
        }
    }

    /**
     * 删除教室
     * @param id 教室ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public Response<Void> deleteClassroom(@PathVariable Integer id) {
        int result = classroomService.deleteClassroom(id);
        if (result > 0) {
            return Response.success("删除成功");
        } else {
            return Response.fail("删除失败");
        }
    }

    /**
     * 设置教室行列数   班主任功能
     * @param id 教室ID
     * @param rowCount 行数
     * @param colCount 列数
     * @return 操作结果
     */
    @PutMapping("/{id}/size")
    public Response<Void> setClassroomSize(@PathVariable Integer id, @RequestParam Integer rowCount, @RequestParam Integer colCount) {
        int result = classroomService.setClassroomSize(id, rowCount, colCount);
        if (result > 0) {
            return Response.success("设置成功");
        } else {
            return Response.fail("设置失败");
        }
    }

}
