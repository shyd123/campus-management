package com.hclx.vip2412_backend.config;

import com.hclx.vip2412_backend.dto.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.sql.SQLException;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理认证异常
     * @param e 认证异常
     * @return 错误响应
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Response<?> handleAuthenticationException(AuthenticationException e) {
        if (e instanceof BadCredentialsException) {
            return Response.fail(401, "用户名或密码错误");
        }
        return Response.fail(401, "认证失败: " + e.getMessage());
    }

    /**
     * 处理参数验证异常
     * @param e 参数验证异常
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Response<?> handleValidationException(MethodArgumentNotValidException e) {
        String errors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return Response.fail(400, "参数验证失败: " + errors);
    }

    /**
     * 处理数据库异常
     * @param e 数据库异常
     * @return 错误响应
     */
    @ExceptionHandler(SQLException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response<?> handleSQLException(SQLException e) {
        return Response.fail(500, "数据库操作失败: " + e.getMessage());
    }

    /**
     * 处理404异常
     * @param e 404异常
     * @return 错误响应
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Response<?> handleNotFoundException(NoHandlerFoundException e) {
        return Response.fail(404, "请求的资源不存在: " + e.getRequestURL());
    }

    /**
     * 处理运行时异常
     * @param e 运行时异常
     * @return 错误响应
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response<?> handleRuntimeException(RuntimeException e) {
        return Response.fail(500, "服务器内部错误: " + e.getMessage());
    }

    /**
     * 处理通用异常
     * @param e 通用异常
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response<?> handleException(Exception e) {
        return Response.fail(500, "系统错误: " + e.getMessage());
    }

}
