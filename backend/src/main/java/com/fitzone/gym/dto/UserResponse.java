package com.fitzone.gym.dto;

import com.fitzone.gym.entity.Role;
import com.fitzone.gym.entity.User;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String username,
        String email,
        String phone,
        String address,
        Integer age,
        Role role,
        Instant createdAt) {

    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(), u.getName(), u.getUsername(), u.getEmail(), u.getPhone(),
                u.getAddress(), u.getAge(), u.getRole(), u.getCreatedAt());
    }
}
