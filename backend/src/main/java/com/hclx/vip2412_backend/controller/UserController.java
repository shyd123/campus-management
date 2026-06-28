package com.hclx.vip2412_backend.controller;

import com.hclx.vip2412_backend.dto.Response;
import com.hclx.vip2412_backend.entity.User;
import com.hclx.vip2412_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取用户列表
     * @param role 角色过滤
     * @return 用户列表
     */
    @GetMapping
    public Response<List<User>> getUsers(@RequestParam(value = "role", required = false) String role) {
        List<User> users;
        if (role != null) {
            users = userService.getUsersByRole(role);
        } else {
            users = userService.getAllUsers();
        }
        return Response.success("获取用户列表成功", users);
    }

    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户信息
     */
    @GetMapping("/{id}")
    public Response<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return Response.fail(404, "用户不存在");
        }
        return Response.success("获取用户成功", user);
    }

    /**
     * 创建用户
     * @param user 用户信息
     * @return 创建结果
     */
    @PostMapping
    public Response<User> createUser(@RequestBody User user) {
        // 检查用户名是否已存在
        if (userService.getUserByUsername(user.getUsername()) != null) {
            return Response.fail(400, "用户名已存在");
        }
        User createdUser = userService.createUser(user);
        return Response.success("创建用户成功", createdUser);
    }

    /**
     * 更新用户
     * @param id 用户ID
     * @param user 用户信息
     * @return 更新结果
     */
    @PutMapping("/{id}")
    public Response<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.updateUser(user);
        if (updatedUser == null) {
            return Response.fail(404, "用户不存在");
        }
        return Response.success("更新用户成功", updatedUser);
    }

    /**
     * 删除用户
     * @param id 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Response<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return Response.fail(404, "用户不存在");
        }
        return Response.success("删除用户成功");
    }

}
