package com.aidiary.security;

import com.aidiary.mapper.UserMapper;
import com.aidiary.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections; // 导入 Collections

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        // Spring Security 的 UserDetails 实现
        // 这里我们简单处理，不涉及角色权限
        return org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password(user.getPasswordHash()) // 数据库中存储的加密密码
                .authorities(Collections.emptyList()) // 权限列表，先为空
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}