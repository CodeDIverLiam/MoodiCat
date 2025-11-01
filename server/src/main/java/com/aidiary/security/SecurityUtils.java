package com.aidiary.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.aidiary.model.User;
import com.aidiary.mapper.UserMapper;

public class SecurityUtils {

    public static Long getCurrentUserId(UserMapper userMapper) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userMapper.findByUsername(username);
        return (user != null) ? user.getId() : null;
    }
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
}