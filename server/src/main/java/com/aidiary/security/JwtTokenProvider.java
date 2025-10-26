package com.aidiary.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import java.util.Base64;
import java.util.Collections;

@Component
public class JwtTokenProvider {

    // 密钥，应该足够复杂且保密，最好从配置文件读取
    @Value("${security.jwt.token.secret-key:secret-key}") // 从 application.yml 读取，如果没有则使用默认值
    private String secretKeyPlain = "secret-key"; // 默认值，不安全，仅用于演示

    @Value("${security.jwt.token.expire-length:3600000}") // 默认1小时过期
    private long validityInMilliseconds = 3600000; // 1h

    private Key key;
    private final UserDetailsService userDetailsService; // Spring Security 用于加载用户信息的服务

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    protected void init() {
        // 将字符串密钥编码为安全的Key对象
        byte[] keyBytes = Base64.getEncoder().encode(secretKeyPlain.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // 创建Token
    public String createToken(String username) {
        Claims claims = Jwts.claims().setSubject(username);
        // 可以添加角色等信息: claims.put("roles", roles);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 从Token获取用户认证信息
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(getUsername(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // 从Token中解析用户名
    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    // 从请求中解析Token
    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // 验证Token是否有效
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 可以细化异常处理，例如 TokenExpiredException 等
            return false;
        }
    }
}