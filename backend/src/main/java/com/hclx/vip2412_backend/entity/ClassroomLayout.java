package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class ClassroomLayout {

    private Integer id;
    private Integer classroomId;
    private Integer row;
    private Integer col;
    private String status;

    private Date createTime;
    private Date updateTime;
}