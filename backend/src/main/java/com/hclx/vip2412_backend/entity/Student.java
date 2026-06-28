package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class Student {

    private Integer id;
    private String name;
    private Integer classId;
    private String className;
    private String studentId;
    private Date createTime;
    private Date updateTime;
}