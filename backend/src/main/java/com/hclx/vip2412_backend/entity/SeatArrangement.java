package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class SeatArrangement {

    private Integer id;
    private Integer courseId;
    private Integer studentId;
    private String studentName;
    private Integer row;
    private Integer col;

    private Date createTime;
    private Date updateTime;
}