package com.hclx.vip2412_backend.entity;

import lombok.Data;
import lombok.ToString;

import java.util.Date;

/**
 * 教室实体类
 */
@Data
@ToString
public class Classroom {

    /**
     * 教室ID
     */
    private Integer id;

    /**
     * 教室名称
     */
    private String name;

    /**
     * 教室位置
     */
    private String location;

    /**
     * 行数
     */
    private Integer rowCount;

    /**
     * 列数
     */
    private Integer colCount;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

}
