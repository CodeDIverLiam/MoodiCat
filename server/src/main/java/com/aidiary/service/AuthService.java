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
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public User register(RegisterRequest registerRequest) {
        log.info("Registering user: {}", registerRequest.getUsername());
        if (userMapper.findByUsername(registerRequest.getUsername()) != null) {
            log.warn("Username already exists: {}", registerRequest.getUsername());
            throw new IllegalArgumentException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        
        userMapper.insert(user);
        log.info("User registered successfully: id={}, username={}", user.getId(), user.getUsername());
        user.setPasswordHash(null);
        return user;
    }

    public LoginResponse login(String username, String password) {
        log.info("Attempting login for user: {}", username);
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            String token = jwtTokenProvider.createToken(username);
            log.info("Login successful, token generated for user: {}", username);

            User user = userMapper.findByUsername(username);
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(user.getId(), user.getUsername(), user.getEmail());
            return new LoginResponse(token, userInfo);

        } catch (AuthenticationException e) {
            log.warn("Login failed for user: {}. Reason: {}", username, e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("An unexpected error occurred during login for user: {}", username, e);
            return null;
        }
    }
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