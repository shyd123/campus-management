package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Subject;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 学科DAO接口
 */
@Mapper
public interface SubjectDao {

    /**
     * 查询所有学科
     * @return 学科列表
     */
    List<Subject> selectAll();

    /**
     * 根据ID查询学科
     * @param id 学科ID
     * @return 学科
     */
    Subject selectById(@Param("id") Integer id);

    /**
     * 插入学科
     * @param subject 学科
     * @return 影响行数
     */
    int insert(Subject subject);

    /**
     * 更新学科
     * @param subject 学科
     * @return 影响行数
     */
    int update(Subject subject);

    /**
     * 删除学科
     * @param id 学科ID
     * @return 影响行数
     */
    int delete(@Param("id") Integer id);

}
