package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.SeatArrangementDao;
import com.hclx.vip2412_backend.dao.StudentDao;
import com.hclx.vip2412_backend.entity.SeatArrangement;
import com.hclx.vip2412_backend.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatArrangementService {

    @Autowired
    private SeatArrangementDao seatArrangementDao;

    @Autowired
    private StudentDao studentDao;

    public List<SeatArrangement> selectByCourseId(Integer courseId) {
        return seatArrangementDao.selectByCourseId(courseId);
    }

    public List<SeatArrangement> selectByClassId(Integer classId) {
        return seatArrangementDao.selectByClassId(classId);
    }

    public int saveSeatArrangements(Integer courseId, List<SeatArrangement> arrangements) {
        seatArrangementDao.deleteByCourseId(courseId);
        for (SeatArrangement arr : arrangements) {
            arr.setCourseId(courseId);
            if (arr.getStudentName() == null && arr.getStudentId() != null) {
                Student student = studentDao.selectById(arr.getStudentId());
                if (student != null) {
                    arr.setStudentName(student.getName());
                }
            }
        }
        if (!arrangements.isEmpty()) {
            return seatArrangementDao.batchInsert(arrangements);
        }
        return 0;
    }
}
