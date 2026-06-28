package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.ClassDao;
import com.hclx.vip2412_backend.entity.ClassInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    @Autowired
    private ClassDao classDao;

    public List<ClassInfo> selectAll() {
        return classDao.selectAll();
    }

    public ClassInfo selectById(Integer id) {
        return classDao.selectById(id);
    }

    public List<ClassInfo> selectByHeadmasterId(Integer headmasterId) {
        return classDao.selectByHeadmasterId(headmasterId);
    }

    public int insert(ClassInfo clazz) {
        return classDao.insert(clazz);
    }

    public int update(ClassInfo clazz) {
        return classDao.update(clazz);
    }

    public int delete(Integer id) {
        return classDao.delete(id);
    }
}