package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.ClassroomLayoutDao;
import com.hclx.vip2412_backend.entity.ClassroomLayout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomLayoutService {

    @Autowired
    private ClassroomLayoutDao classroomLayoutDao;

    public List<ClassroomLayout> selectByClassroomId(Integer classroomId) {
        return classroomLayoutDao.selectByClassroomId(classroomId);
    }

    public int saveLayouts(Integer classroomId, List<ClassroomLayout> layouts) {
        classroomLayoutDao.deleteByClassroomId(classroomId);
        for (ClassroomLayout layout : layouts) {
            layout.setClassroomId(classroomId);
        }
        if (!layouts.isEmpty()) {
            return classroomLayoutDao.batchInsert(layouts);
        }
        return 0;
    }

    public int generateDefaultLayout(Integer classroomId, Integer rowCount, Integer colCount) {
        classroomLayoutDao.deleteByClassroomId(classroomId);
        List<ClassroomLayout> layouts = new java.util.ArrayList<>();
        for (int row = 1; row <= rowCount; row++) {
            for (int col = 1; col <= colCount; col++) {
                ClassroomLayout layout = new ClassroomLayout();
                layout.setClassroomId(classroomId);
                layout.setRow(row);
                layout.setCol(col);
                layout.setStatus("SEAT");
                layouts.add(layout);
            }
        }
        if (!layouts.isEmpty()) {
            return classroomLayoutDao.batchInsert(layouts);
        }
        return 0;
    }
}
