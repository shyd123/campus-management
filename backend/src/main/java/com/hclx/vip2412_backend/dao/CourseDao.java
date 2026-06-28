package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 课程DAO接口
 */
@Mapper
public interface CourseDao {

    /**
     * 查询所有课程
     * @return 课程列表
     */
    List<Course> selectAll();

    /**
     * 根据ID查询课程
     * @param id 课程ID
     * @return 课程
     */
    Course selectById(@Param("id") Integer id);

    /**
     * 根据教师ID和星期查询课程
     * @param teacherId 教师ID
     * @param weekday 星期
     * @return 课程列表
     */
    List<Course> selectByTeacherIdAndWeekday(@Param("teacherId") Long teacherId, @Param("weekday") Integer weekday);

    /**
     * 插入课程
     * @param course 课程
     * @return 影响行数
     */
    int insert(Course course);

    /**
     * 更新课程
     * @param course 课程
     * @return 影响行数
     */
    int update(Course course);

    /**
     * 删除课程
     * @param id 课程ID
     * @return 影响行数
     */
    int delete(@Param("id") Integer id);

    /**
     * 根据班级ID查询课程
     * @param classId 班级ID
     * @return 课程列表
     */
    List<Course> selectByClassId(@Param("classId") Integer classId);

    /**
     * 根据教师ID查询课程
     * @param teacherId 教师ID
     * @return 课程列表
     */
    List<Course> selectByTeacherId(@Param("teacherId") Integer teacherId);

}
