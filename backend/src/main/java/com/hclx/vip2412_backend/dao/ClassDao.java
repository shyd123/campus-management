package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.ClassInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 班级DAO接口
 */
@Mapper
public interface ClassDao {

    /**
     * 查询所有班级
     * @return 班级列表
     */
    List<ClassInfo> selectAll();

    /**
     * 根据ID查询班级
     * @param id 班级ID
     * @return 班级
     */
    ClassInfo selectById(@Param("id") Integer id);

    /**
     * 根据班主任ID查询班级
     * @param headmasterId 班主任ID
     * @return 班级列表
     */
    List<ClassInfo> selectByHeadmasterId(@Param("headmasterId") Integer headmasterId);

    /**
     * 插入班级
     * @param clazz 班级
     * @return 影响行数
     */
    int insert(ClassInfo clazz);

    /**
     * 更新班级
     * @param clazz 班级
     * @return 影响行数
     */
    int update(ClassInfo clazz);

    /**
     * 删除班级
     * @param id 班级ID
     * @return 影响行数
     */
    int delete(@Param("id") Integer id);
}