package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户DAO接口
 */
@Mapper
public interface UserDao {

    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户
     */
    User selectByUsername(@Param("username") String username);

    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户
     */
    User selectById(@Param("id") Integer id);

    /**
     * 获取所有用户
     * @return 用户列表
     */
    List<User> selectAll();

    /**
     * 根据角色查询用户
     * @param role 角色
     * @return 用户列表
     */
    List<User> selectByRole(@Param("role") String role);

    /**
     * 插入用户
     * @param user 用户
     * @return 影响行数
     */
    int insert(User user);

    /**
     * 更新用户
     * @param user 用户
     * @return 影响行数
     */
    int update(User user);

    /**
     * 删除用户
     * @param id 用户ID
     * @return 影响行数
     */
    int delete(@Param("id") Integer id);

}
