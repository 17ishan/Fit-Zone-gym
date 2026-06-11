package com.fitzone.gym.dto;

/** Partial update for a user profile (admin) or own profile (self). Null fields are ignored. */
public record UserUpdateRequest(
        String name,
        String phone,
        String address,
        Integer age) {
}
