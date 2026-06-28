package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class Attendance {

    private Integer id;
    private Integer courseId;
    private Integer studentId;
    private String studentName;
    private String date;
    private String status;
    private String remark;

    private Date createTime;
    private Date updateTime;
}