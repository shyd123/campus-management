package com.hclx.vip2412_backend.service;

import com.hclx.vip2412_backend.dao.UserDao;
import com.hclx.vip2412_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户服务类
 */
@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户
     */
    public User getUserByUsername(String username) {
        return userDao.selectByUsername(username);
    }

    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户
     */
    public User getUserById(Long id) {
        return userDao.selectById(id.intValue());
    }

    /**
     * 验证用户
     * @param username 用户名
     * @param password 密码
     * @return 用户
     */
    public User verifyUser(String username, String password) {
        User user = userDao.selectByUsername(username);

//密码加密的意义：防止在不经意或者失误，或者被攻击时，密码被破解，密码被破解后，再进一步扩大损失
//不完全是防止泄密，在攻击下，泄密是早晚的问题，但是密码加密，可以防止密码被破解，密码被破解后，再进一步扩大损失
//很多人会在不同程序，平台使用相同的密码，一个密码，多个程序，多个平台使用，那么密码被破解，就会导致多个平台，多个程序，多个平台都泄露密码，
//如果后台服务器存储的不是明码，而是加密后的数据，就可以防止密码被破解，密码被破解后，再进一步扩大损失，因为每个平台的后台密码可能不同
//加盐的二次加密，盐是随机的一个数据，拼接到初始拼命中，进行二次加密。

//能够自动生成  盐，并且自动生成新密码的技术的实现就是这个框架提供的工具PasswordEncoder
//BCryptPasswordEncoder是BCrypt密码加密算法的实现类

//        密码校验逻辑1：查询 账号与密码完全匹配的 用户是否存在，这个更合理（如果不是用的 不可逆加密+随机盐 就千万别读密码出来）
//        密码校验逻辑2：查询 账号的信息，然后匹配密码是否相同，一般不要让密码离开数据库。这个思路不好
//        早期就是逻辑1，现在改为逻辑2，没有办法呀，因为密码不是明文报错，使用了加密算法，加密过程中产生临时的盐，再次生成密码可能完全不同
//        原文 + 随机的盐， 可能产生很多中暗文   暗文中携带随机的盐数据
//        暗文 + 生成时候的盐  可以逆推回原文。（是否可以逆推回原文是要看加密算法，是可选项。叫做可逆加密和不可逆加密。）
//        原文 + 查询暗文中的盐 再次生成相同暗文
        if (user != null) {
            // 尝试使用BCrypt验证
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
            // 如果BCrypt验证失败，尝试明文密码验证（兼容旧数据）
            if (password.equals(user.getPassword())) {
                // 自动更新为加密密码
                user.setPassword(passwordEncoder.encode(password));
                userDao.update(user);
                return user;
            }
        }
        return null;
    }

    /**
     * 获取所有用户
     * @return 用户列表
     */
    public List<User> getAllUsers() {
        return userDao.selectAll();
    }

    /**
     * 根据角色获取用户
     * @param role 角色
     * @return 用户列表
     */
    public List<User> getUsersByRole(String role) {
        return userDao.selectByRole(role);
    }

    /**
     * 创建用户
     * @param user 用户
     * @return 用户
     */
    public User createUser(User user) {
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.insert(user);
        return user;
    }

    /**
     * 更新用户
     * @param user 用户
     * @return 用户
     */
    public User updateUser(User user) {
        // 如果密码不为空，加密密码
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userDao.update(user);
        return user;
    }

    /**
     * 删除用户
     * @param id 用户ID
     * @return 是否成功
     */
    public boolean deleteUser(Long id) {
        return userDao.delete(id.intValue()) > 0;
    }

}
