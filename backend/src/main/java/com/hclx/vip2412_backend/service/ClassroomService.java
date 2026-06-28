package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.ClassroomDao;
import com.hclx.vip2412_backend.entity.Classroom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 教室服务类
 */
@Service
public class ClassroomService {

    @Autowired
    private ClassroomDao classroomDao;

    /**
     * 查询所有教室
     * @return 教室列表
     */
    public List<Classroom> listClassrooms() {
        return classroomDao.selectAll();
    }

    /**
     * 根据ID查询教室
     * @param id 教室ID
     * @return 教室
     */
    public Classroom selectById(Integer id) {
        return classroomDao.selectById(id);
    }

    /**
     * 添加教室
     * @param classroom 教室
     * @return 影响行数
     */
    public int addClassroom(Classroom classroom) {
        return classroomDao.insert(classroom);
    }

    /**
     * 更新教室
     * @param classroom 教室
     * @return 影响行数
     */
    public int updateClassroom(Classroom classroom) {
        return classroomDao.update(classroom);
    }

    /**
     * 删除教室
     * @param id 教室ID
     * @return 影响行数
     */
    public int deleteClassroom(Integer id) {
        return classroomDao.delete(id);
    }

    /**
     * 设置教室行列数
     * @param id 教室ID
     * @param rowCount 行数
     * @param colCount 列数
     * @return 影响行数
     */
    public int setClassroomSize(Integer id, Integer rowCount, Integer colCount) {
        Classroom classroom = classroomDao.selectById(id);
        if (classroom != null) {
            classroom.setRowCount(rowCount);
            classroom.setColCount(colCount);
            return classroomDao.update(classroom);
        }
        return 0;
    }

}
