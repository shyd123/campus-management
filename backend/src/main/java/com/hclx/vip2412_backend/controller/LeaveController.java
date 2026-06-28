package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Leave;
import com.hclx.vip2412_backend.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public Response<List<Leave>> listLeaves(@RequestParam(required = false) Integer classId) {
        List<Leave> leaves;
        if (classId != null) {
            leaves = leaveService.selectByClassId(classId);
        } else {
            leaves = leaveService.selectAll();
        }
        return Response.success(leaves);
    }

    @GetMapping("/{id}")
    public Response<Leave> getLeave(@PathVariable Integer id) {
        Leave leave = leaveService.selectById(id);
        if (leave == null) {
            return Response.fail(404, "请假记录不存在");
        }
        return Response.success(leave);
    }

    @PostMapping
    public Response<Leave> createLeave(@RequestBody Leave leave) {
        int result = leaveService.insert(leave);
        if (result > 0) {
            return Response.success("创建成功", leaveService.selectById(leave.getId()));
        }
        return Response.fail("创建失败");
    }

    @PutMapping("/{id}")
    public Response<Leave> updateLeave(@PathVariable Integer id, @RequestBody Leave leave) {
        leave.setId(id);
        int result = leaveService.update(leave);
        if (result > 0) {
            return Response.success("更新成功", leaveService.selectById(id));
        }
        return Response.fail("更新失败");
    }

    @DeleteMapping("/{id}")
    public Response<Void> deleteLeave(@PathVariable Integer id) {
        int result = leaveService.delete(id);
        if (result > 0) {
            return Response.success("删除成功");
        }
        return Response.fail("删除失败");
    }
}
