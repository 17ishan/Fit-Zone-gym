package com.fitzone.gym.security;

import com.fitzone.gym.entity.User;
import com.fitzone.gym.exception.UnauthorizedException;
import com.fitzone.gym.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new UnauthorizedException("Not authenticated");
        }
        UUID id;
        try {
            id = UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException e) {
            throw new UnauthorizedException("Invalid token subject");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedException("User no longer exists"));
    }
}
