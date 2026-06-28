package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.LoginRequest;
import com.hclx.vip2412_backend.dto.LoginResponse;
import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.User;
import com.hclx.vip2412_backend.service.UserService;
import com.hclx.vip2412_backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * 登录
     * @param loginRequest 登录请求
     * @return 登录响应
     */
    @PostMapping("/login")
    public Response<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // 验证用户
        User user = userService.verifyUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user == null) {
            return Response.fail(401, "用户名或密码错误");
        }

        // 生成token
        String token = JwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        // 构建响应
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setUser(user);

        return Response.success("登录成功", loginResponse);
    }

    /**
     * 刷新令牌
     * @return 刷新响应
     */
    @PostMapping("/refresh")
    public Response<String> refresh() {
        // 从请求头中获取token
        // 验证token
        // 生成新token
        // 返回新token
        return Response.success("令牌刷新成功", "new-token");
    }

}
