package com.fitzone.gym.event;

import com.fitzone.gym.entity.User;

/** Published when a new account is created (local register or first Google sign-in). */
public record UserRegisteredEvent(User user) {
}
