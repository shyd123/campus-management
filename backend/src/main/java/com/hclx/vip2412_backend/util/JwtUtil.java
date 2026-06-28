package com.hclx.vip2412_backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

//jwt  [描述，明码，暗文] 三段式结构，数据自身带有签名，不能被篡改，且带有有效期，不能被伪造。
/**
 * JWT工具类
 */
public class JwtUtil {

    /**
     * 密钥
     */
    private static final String SECRET = "your-secret-key";

    /**
     * 过期时间（24小时）
     */
    private static final long EXPIRE_TIME = 24 * 60 * 60 * 1000;

    /**
     * 生成token
     * @param userId 用户ID
     * @param username 用户名
     * @param role 角色
     * @return token
     */
    public static String generateToken(Long userId, String username, String role) {
        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
        Algorithm algorithm = Algorithm.HMAC256(SECRET);
        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("username", username)
                .withClaim("role", role)
                .withExpiresAt(date)
                .withIssuedAt(new Date())
                .sign(algorithm);
    }

    /**
     * 验证token
     * @param token token
     * @return 是否有效
     */
    public static boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    /**
     * 从token中获取用户名
     * @param token token
     * @return 用户名
     */
    public static String getUsername(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            return decodedJWT.getClaim("username").asString();
        } catch (JWTDecodeException e) {
            return null;
        }
    }

    /**
     * 从token中获取角色
     * @param token token
     * @return 角色
     */
    public static String getRole(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            return decodedJWT.getClaim("role").asString();
        } catch (JWTDecodeException e) {
            return null;
        }
    }

    /**
     * 从token中获取用户ID
     * @param token token
     * @return 用户ID
     */
    public static Long getUserIdFromToken(String token) {
        try {
            DecodedJWT decodedJWT = JWT.decode(token);
            return decodedJWT.getClaim("userId").asLong();
        } catch (JWTDecodeException e) {
            return null;
        }
    }

}
