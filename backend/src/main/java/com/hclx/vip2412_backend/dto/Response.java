package com.hclx.vip2412_backend.dto;

import lombok.Data;

/**
 * 通用响应DTO
 */
@Data
public class Response<T> {

    /**
     * 响应码
     */
    private int code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    

    public Response(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    public Response() {
    }



    /**
     * 成功响应
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 响应对象
     */
    public static <T> Response<T> success(T data) {
        Response<T> response = new Response<>();
        response.setCode(200);
        response.setMessage("操作成功");
        response.setData(data);
        return response;
    }
    /**
     * 成功响应
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 响应对象
     */
    public static  Response<Void> success(String data) {
        Response<Void> response = new Response<>();
        response.setCode(200);
        response.setMessage(data);
        return response;
    }

    

    /**
     * 成功响应
     * @param message 响应消息
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 响应对象
     */
    public static <T> Response<T> success(String message, T data) {
        Response<T> response = new Response<>();
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    /**
     * 失败响应
     * @param code 响应码
     * @param message 响应消息
     * @param <T> 数据类型
     * @return 响应对象
     */
    public static <T> Response<T> fail(int code, String message) {
        Response<T> response = new Response<>();
        response.setCode(code);
        response.setMessage(message);
        response.setData(null);
        return response;
    }

    /**
     * 失败响应
     * @param message 响应消息
     * @param <T> 数据类型
     * @return 响应对象
     */
    public static <T> Response<T> fail(String message) {
        Response<T> response = new Response<>();
        response.setCode(400);
        response.setMessage(message);
        response.setData(null);
        return response;
    }

}
