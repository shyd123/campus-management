package com.hclx.vip2412_backend.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(CorsConfig.class)
@MapperScan(basePackages = "com.hclx.vip2412_backend.dao")
public class ConfigMain {
}
