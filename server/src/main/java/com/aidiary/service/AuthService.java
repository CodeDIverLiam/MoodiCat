package com.aidiary.service;

import com.aidiary.dto.LoginResponse;
import com.aidiary.dto.RegisterRequest;
import com.aidiary.mapper.UserMapper;
import com.aidiary.model.User;
import com.aidiary.security.JwtTokenProvider;
import com.aidiary.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 导入事务注解

@Service
@RequiredArgsConstructor
@Slf4j // 添加日志
public class AuthService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder; // 注入密码编码器
    private final AuthenticationManager authenticationManager; // 注入认证管理器
    private final JwtTokenProvider jwtTokenProvider; // 注入JWT提供者

    @Transactional // 注册应该是事务性的
    public User register(RegisterRequest registerRequest) {
        log.info("Registering user: {}", registerRequest.getUsername());
        // 检查用户名是否已存在 (可选但推荐)
        if (userMapper.findByUsername(registerRequest.getUsername()) != null) {
            log.warn("Username already exists: {}", registerRequest.getUsername());
            throw new IllegalArgumentException("Username already exists"); // 或者自定义异常
        }
        
        // 创建User对象
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        // 加密密码并存储到passwordHash字段
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        
        userMapper.insert(user);
        log.info("User registered successfully: id={}, username={}", user.getId(), user.getUsername());
        user.setPasswordHash(null); // 不要在响应中返回密码哈希
        return user;
    }

    public LoginResponse login(String username, String password) {
        log.info("Attempting login for user: {}", username);
        try {
            // 使用 AuthenticationManager 验证凭证
            // 这会调用 CustomUserDetailsService.loadUserByUsername 来加载用户信息并比对密码
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            // 认证成功，生成 JWT
            String token = jwtTokenProvider.createToken(username);
            log.info("Login successful, token generated for user: {}", username);

            // 获取用户信息用于返回给前端
            User user = userMapper.findByUsername(username);
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(user.getId(), user.getUsername(), user.getEmail());
            return new LoginResponse(token, userInfo);

        } catch (AuthenticationException e) {
            log.warn("Login failed for user: {}. Reason: {}", username, e.getMessage());
            // 对于登录失败，不应抛出异常到 Controller，而是返回 null 或特定的错误 DTO
            return null;
        } catch (Exception e) {
            log.error("An unexpected error occurred during login for user: {}", username, e);
            return null; // 其他异常也视为登录失败
        }
    }

    // getMe 方法保持不变，用于获取当前登录用户信息
    public User getMe() {
        String username = SecurityUtils.getCurrentUsername();
        if (username != null) {
            User user = userMapper.findByUsername(username);
            if (user != null) {
                user.setPasswordHash(null);
            }
            return user;
        }
        return null;
    }
}