package com.hclx.vip2412_backend.entity;

import lombok.Data;

import java.util.Date;
@Data
public class Leave {

    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer classId;
    private String className;
    private Date startTime;
    private Date endTime;
    private String reason;
    private Date createTime;
    private Date updateTime;


}