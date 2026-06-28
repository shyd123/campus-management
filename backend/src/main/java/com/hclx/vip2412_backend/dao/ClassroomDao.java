package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Classroom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 教室DAO接口
 */
@Mapper
public interface ClassroomDao {

    /**
     * 查询所有教室
     * @return 教室列表
     */
    List<Classroom> selectAll();

    /**
     * 根据ID查询教室
     * @param id 教室ID
     * @return 教室
     */
    Classroom selectById(@Param("id") Integer id);

    /**
     * 插入教室
     * @param classroom 教室
     * @return 影响行数
     */
    int insert(Classroom classroom);

    /**
     * 更新教室
     * @param classroom 教室
     * @return 影响行数
     */
    int update(Classroom classroom);

    /**
     * 删除教室
     * @param id 教室ID
     * @return 影响行数
     */
    int delete(@Param("id") Integer id);

}
