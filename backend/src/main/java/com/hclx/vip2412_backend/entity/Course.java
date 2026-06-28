package com.hclx.vip2412_backend.entity;

import lombok.Data;
import lombok.ToString;

import java.util.Date;

/**
 * 课程实体类
 */
@Data
@ToString
public class Course {

    /**
     * 课程ID
     */
    private Integer id;

    /**
     * 课程名称
     */
    private String name;

    /**
     * 班级ID
     */
    private Integer classId;

    /**
     * 教室ID
     */
    private Integer classroomId;

    /**
     * 学科ID
     */
    private Integer subjectId;

    /**
     * 教师ID
     */
    private Integer teacherId;

    /**
     * 上课星期
     */
    private Integer weekday;

    /**
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    // 关联字段
    private String className;
    private String classroomName;
    private String subjectName;
    private String teacherName;

    private Integer colCount;
    private Integer rowCount;
}
