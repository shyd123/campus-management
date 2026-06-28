package com.hclx.vip2412_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
//前后端分离项目，要配置跨域，才能实现前后端通信交互
/**
 * 跨域配置
 */
@Configuration
public class CorsConfig {

    /**
     * 全局跨域过滤器
     * @return CorsFilter
     */
    @Bean
    public CorsFilter corsFilter() {
        // 创建CORS配置对象
        CorsConfiguration config = new CorsConfiguration();
        // 允许所有源
        config.addAllowedOriginPattern("*");
        // 允许所有请求头
        config.addAllowedHeader("*");
        // 允许所有请求方法
        config.addAllowedMethod("*");
        // 允许携带凭证
        config.setAllowCredentials(true);
        // 设置最大缓存时间
        config.setMaxAge(3600L);

        // 创建URL源配置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 对所有路径应用CORS配置
        source.registerCorsConfiguration("/**", config);

        // 创建并返回CORS过滤器
        return new CorsFilter(source);
    }

}
