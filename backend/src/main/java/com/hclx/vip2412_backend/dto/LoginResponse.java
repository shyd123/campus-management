package com.hclx.vip2412_backend.dto;

import com.hclx.vip2412_backend.entity.User;
import lombok.Data;

/**
 * 登录响应DTO
 */
@Data
public class LoginResponse {

    /**
     * JWT token
     */
    private String token;

    /**
     * 用户信息
     */
    private User user;

}
