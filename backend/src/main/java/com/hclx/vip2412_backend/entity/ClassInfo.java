package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class ClassInfo {

    private Integer id;
    private String name;
    private Integer headmasterId;
    private String headmasterName;    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}