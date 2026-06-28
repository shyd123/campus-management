package com.hclx.vip2412_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//新的框架，是spring的安全框架，替代了spring-security-core，可以用来验证密码，密码加密
//密码加密的意义：防止在不经意或者失误，或者被攻击时，密码被破解，密码被破解后，再进一步扩大损失
//不完全是防止泄密，在攻击下，泄密是早晚的问题，但是密码加密，可以防止密码被破解，密码被破解后，再进一步扩大损失
//很多人会在不同程序，平台使用相同的密码，一个密码，多个程序，多个平台使用，那么密码被破解，就会导致多个平台，多个程序，多个平台都泄露密码，
//如果后台服务器存储的不是明码，而是加密后的数据，就可以防止密码被破解，密码被破解后，再进一步扩大损失，因为每个平台的后台密码可能不同
//加盐的二次加密，盐是随机的一个数据，拼接到初始拼命中，进行二次加密。

//能够自动生成  盐，并且自动生成新密码的技术的实现就是这个框架提供的工具PasswordEncoder
//BCryptPasswordEncoder是BCrypt密码加密算法的实现类
/**
 * Spring Security配置类
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    /**
     * 密码编码器
     * @return 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理器
     * @param authConfig 认证配置
     * @return 认证管理器
     * @throws Exception 异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * 安全过滤器链
     * @param http HttpSecurity
     * @return 安全过滤器链
     * @throws Exception 异常
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF
                .csrf(csrf -> csrf.disable())
                // 禁用表单登录
                .formLogin(form -> form.disable())
                // 禁用HTTP Basic
                .httpBasic(basic -> basic.disable())
                // 无状态会话
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 授权配置
                .authorizeHttpRequests(auth -> auth
                        // 允许所有OPTIONS请求
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // 允许访问的路径
                        .requestMatchers("/auth/**").permitAll()
                        // 其他路径需要认证
                        .anyRequest().authenticated()
                )
                // 添加JWT过滤器
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                // 异常处理
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            // 认证异常已由GlobalExceptionHandler处理
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            // 权限异常已由GlobalExceptionHandler处理
                        })
                );

        return http.build();
    }

}
