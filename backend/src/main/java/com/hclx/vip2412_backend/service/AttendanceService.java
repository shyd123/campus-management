package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.AttendanceDao;
import com.hclx.vip2412_backend.dao.StudentDao;
import com.hclx.vip2412_backend.entity.Attendance;
import com.hclx.vip2412_backend.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceDao attendanceDao;

    @Autowired
    private StudentDao studentDao;

    public List<Attendance> selectByCourseIdAndDate(Integer courseId, String date) {
        return attendanceDao.selectByCourseIdAndDate(courseId, date);
    }

    public int saveAttendance(Integer courseId, String date, List<Attendance> records) {
        attendanceDao.deleteByCourseIdAndDate(courseId, date);
        for (Attendance record : records) {
            record.setCourseId(courseId);
            record.setDate(date);
            if (record.getStudentName() == null && record.getStudentId() != null) {
                Student student = studentDao.selectById(record.getStudentId());
                if (student != null) {
                    record.setStudentName(student.getName());
                }
            }
        }
        if (!records.isEmpty()) {
            return attendanceDao.batchInsert(records);
        }
        return 0;
    }
}
