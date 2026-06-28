package com.hclx.vip2412_backend.entity;

import lombok.Data;
import lombok.ToString;

import java.util.Date;

/**
 * 学科实体类
 */
@Data
@ToString
public class Subject {

    /**
     * 学科ID
     */
    private Integer id;

    /**
     * 学科名称
     */
    private String name;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

}
