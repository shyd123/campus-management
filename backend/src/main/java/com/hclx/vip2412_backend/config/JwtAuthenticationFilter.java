package com.hclx.vip2412_backend.config;

import com.hclx.vip2412_backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT认证过滤器  去请求头提取token，并且验证是否有效，然后提取权限信息，验证这个网址它有没有权限访问
 * 具体拦截哪种网址，需要另外一个文件来配置，配置类型是SecurityFilterChain，这个代码写在了SecurityConfig类里，配置了哪些网址需要拦截
 * SecurityFilterChain的配置和SecurityConfig类本身无关，只有向spring注册这个SecurityFilterChain的bean就可以。
 *
 * //        密码校验逻辑1：查询 账号与密码完全匹配的 用户是否存在，这个更合理（如果不是用的 不可逆加密+随机盐 就千万别读密码出来）
 * //        密码校验逻辑2：查询 账号的信息，然后匹配密码是否相同，一般不要让密码离开数据库。这个思路不好
 * //        早期就是逻辑1，现在改为逻辑2，没有办法呀，因为密码不是明文报错，使用了加密算法，加密过程中产生临时的盐，再次生成密码可能完全不同
 * //        原文 + 随机的盐， 可能产生很多中暗文   暗文中携带随机的盐数据
 * //        暗文 + 生成时候的盐  可以逆推回原文。（是否可以逆推回原文是要看加密算法，是可选项。叫做可逆加密和不可逆加密。）
 * //        原文 + 查询暗文中的盐 再次生成相同暗文
 */

//
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        // 从请求头中获取token
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;
        String role = null;

        // 检查请求头   Bearer是项目签名，验证token是不是自己签发的，如果不是都不用解码
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            username = JwtUtil.getUsername(token);
            role = JwtUtil.getRole(token);
        }

        // 验证token
        if (username != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (JwtUtil.validateToken(token)) {
                // 创建认证对象
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(role))
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // 设置认证信息
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 继续过滤链
        chain.doFilter(request, response);
    }

}
