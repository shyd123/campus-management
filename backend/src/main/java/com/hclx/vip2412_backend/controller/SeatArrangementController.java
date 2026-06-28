package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.SeatArrangement;
import com.hclx.vip2412_backend.service.SeatArrangementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/seat-arrangements")
public class SeatArrangementController {

    @Autowired
    private SeatArrangementService seatArrangementService;

    @GetMapping("/{courseId}")
    public Response<List<SeatArrangement>> getSeatArrangements(@PathVariable Integer courseId) {
        List<SeatArrangement> arrangements = seatArrangementService.selectByCourseId(courseId);
        return Response.success(arrangements);
    }

    @GetMapping("/class/{classId}")
    public Response<List<SeatArrangement>> getSeatArrangementsByClass(@PathVariable Integer classId) {
        List<SeatArrangement> arrangements = seatArrangementService.selectByClassId(classId);
        return Response.success(arrangements);
    }

    @PutMapping("/{courseId}")
    public Response<Void> saveSeatArrangements(@PathVariable Integer courseId, @RequestBody List<Map<String, Object>> body) {
        List<SeatArrangement> arrangements = body.stream().map(m -> {
            SeatArrangement sa = new SeatArrangement();
            sa.setStudentId((Integer) m.get("studentId"));
            sa.setRow((Integer) m.get("row"));
            sa.setCol((Integer) m.get("col"));
            return sa;
        }).toList();

        seatArrangementService.saveSeatArrangements(courseId, arrangements);
        return Response.success("保存成功");
    }
}
