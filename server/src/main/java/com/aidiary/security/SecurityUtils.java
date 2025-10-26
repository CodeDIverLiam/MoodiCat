package com.aidiary.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.aidiary.model.User; // 假设你的 UserDetails 实现最终能关联回 User 对象
import com.aidiary.mapper.UserMapper; // 需要 UserMapper 来根据用户名查找用户ID

public class SecurityUtils {

    // 注意：这个简单的实现需要注入 UserMapper，更好的方式是在 CustomUserDetailsService 返回包含ID的自定义UserDetails
    public static Long getCurrentUserId(UserMapper userMapper) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null; // 或者抛出异常
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userMapper.findByUsername(username); // 通过用户名查找 User
        return (user != null) ? user.getId() : null; // 返回用户ID
    }

    // 或者一个更简单的方式，如果你只需要用户名
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
}