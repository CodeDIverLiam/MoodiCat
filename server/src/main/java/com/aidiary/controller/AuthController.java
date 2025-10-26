package com.aidiary.controller;

import com.aidiary.dto.LoginRequest;
import com.aidiary.dto.LoginResponse;
import com.aidiary.dto.RegisterRequest;
import com.aidiary.model.User;
import com.aidiary.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // 导入 HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // 确保请求体中包含 username 和 password
            if (registerRequest.getUsername() == null || registerRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body("Username and password are required.");
            }
            User registeredUser = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser); // 返回 201 Created
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 用户名已存在返回 409 Conflict
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().build(); // 基本的请求体验证
        }
        LoginResponse response = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        // 如果 service 返回 null，表示认证失败
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 登录失败返回 401 Unauthorized
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        User user = authService.getMe();
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 未登录或找不到用户返回 401
    }
}