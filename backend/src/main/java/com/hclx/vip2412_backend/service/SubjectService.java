package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.SubjectDao;
import com.hclx.vip2412_backend.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 学科服务类
 */
@Service
public class SubjectService {

    @Autowired
    private SubjectDao subjectDao;

    /**
     * 查询所有学科
     * @return 学科列表
     */
    public List<Subject> listSubjects() {
        return subjectDao.selectAll();
    }

    /**
     * 根据ID查询学科
     * @param id 学科ID
     * @return 学科
     */
    public Subject selectById(Integer id) {
        return subjectDao.selectById(id);
    }

    /**
     * 添加学科
     * @param subject 学科
     * @return 影响行数
     */
    public int addSubject(Subject subject) {
        return subjectDao.insert(subject);
    }

    /**
     * 更新学科
     * @param subject 学科
     * @return 影响行数
     */
    public int updateSubject(Subject subject) {
        return subjectDao.update(subject);
    }

    /**
     * 删除学科
     * @param id 学科ID
     * @return 影响行数
     */
    public int deleteSubject(Integer id) {
        return subjectDao.delete(id);
    }

}
