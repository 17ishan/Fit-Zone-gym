package com.fitzone.gym.security;

public record GoogleAccount(String email, String sub, String name, boolean emailVerified) {
}
