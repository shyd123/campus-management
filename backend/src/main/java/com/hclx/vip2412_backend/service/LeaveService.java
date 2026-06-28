package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.LeaveDao;
import com.hclx.vip2412_backend.entity.Leave;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveDao leaveDao;

    public List<Leave> selectAll() {
        return leaveDao.selectAll();
    }

    public Leave selectById(Integer id) {
        return leaveDao.selectById(id);
    }

    public List<Leave> selectByClassId(Integer classId) {
        return leaveDao.selectByClassId(classId);
    }

    public int insert(Leave leave) {
        return leaveDao.insert(leave);
    }

    public int update(Leave leave) {
        return leaveDao.update(leave);
    }

    public int delete(Integer id) {
        return leaveDao.delete(id);
    }
}
