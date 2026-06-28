package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.Attendance;
import com.hclx.vip2412_backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendances")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/{courseId}")
    public Response<List<Attendance>> getAttendance(@PathVariable Integer courseId, @RequestParam String date) {
        List<Attendance> records = attendanceService.selectByCourseIdAndDate(courseId, date);
        return Response.success(records);
    }

    @PostMapping("/{courseId}")
    public Response<Void> saveAttendance(@PathVariable Integer courseId, @RequestBody Map<String, Object> body) {
        String date = (String) body.get("date");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> recordMaps = (List<Map<String, Object>>) body.get("records");

        List<Attendance> records = recordMaps.stream().map(m -> {
            Attendance a = new Attendance();
            a.setCourseId(courseId);
            a.setStudentId((Integer) m.get("studentId"));
            a.setStatus((String) m.get("status"));
            a.setRemark((String) m.get("remark"));
            return a;
        }).toList();

        attendanceService.saveAttendance(courseId, date, records);
        return Response.success("保存成功");
    }
}
