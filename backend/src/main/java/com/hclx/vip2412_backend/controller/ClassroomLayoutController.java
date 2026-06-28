package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.ClassroomLayout;
import com.hclx.vip2412_backend.service.ClassroomLayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/classroom-layouts")
public class ClassroomLayoutController {

    @Autowired
    private ClassroomLayoutService classroomLayoutService;

    @GetMapping("/{classroomId}")
    public Response<List<ClassroomLayout>> getLayouts(@PathVariable Integer classroomId) {
        List<ClassroomLayout> layouts = classroomLayoutService.selectByClassroomId(classroomId);
        return Response.success(layouts);
    }

    @PutMapping("/{classroomId}")
    public Response<Void> saveLayouts(@PathVariable Integer classroomId, @RequestBody List<Map<String, Object>> body) {
        List<ClassroomLayout> layouts = body.stream().map(m -> {
            ClassroomLayout cl = new ClassroomLayout();
            cl.setRow((Integer) m.get("row"));
            cl.setCol((Integer) m.get("col"));
            cl.setStatus((String) m.get("status"));
            return cl;
        }).toList();

        classroomLayoutService.saveLayouts(classroomId, layouts);
        return Response.success("保存成功");
    }

    @PostMapping("/{classroomId}/generate")
    public Response<List<ClassroomLayout>> generateLayout(@PathVariable Integer classroomId,
                                                           @RequestParam Integer rowCount,
                                                           @RequestParam Integer colCount) {
        classroomLayoutService.generateDefaultLayout(classroomId, rowCount, colCount);
        List<ClassroomLayout> layouts = classroomLayoutService.selectByClassroomId(classroomId);
        return Response.success(layouts);
    }
}
