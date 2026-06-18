package com.fitzone.gym.service;

import com.fitzone.gym.dto.UserUpdateRequest;
import com.fitzone.gym.entity.Role;
import com.fitzone.gym.entity.User;
import com.fitzone.gym.event.UserRegisteredEvent;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.UserRepository;
import com.fitzone.gym.security.GoogleAccount;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repo;
    private final ApplicationEventPublisher events;

    public UserService(UserRepository repo, ApplicationEventPublisher events) {
        this.repo = repo;
        this.events = events;
    }

    @Transactional
    public User findOrCreate(GoogleAccount account) {
        return repo.findByEmailIgnoreCase(account.email())
                .map(existing -> {
                    boolean dirty = false;
                    if (existing.getGoogleSub() == null && account.sub() != null) {
                        existing.setGoogleSub(account.sub());
                        dirty = true;
                    }
                    if ((existing.getName() == null || existing.getName().isBlank()) && account.name() != null) {
                        existing.setName(account.name());
                        dirty = true;
                    }
                    return dirty ? repo.save(existing) : existing;
                })
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(account.email());
                    u.setName(account.name() != null ? account.name() : account.email());
                    u.setGoogleSub(account.sub());
                    u.setRole(Role.USER);
                    u = repo.save(u);
                    // First-time Google sign-in → welcome email after commit.
                    events.publishEvent(new UserRegisteredEvent(u));
                    return u;
                });
    }

    @Transactional
    public User ensureAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            user.setRole(Role.ADMIN);
            return repo.save(user);
        }
        return user;
    }

    // ---- Email/password accounts ----

    public Optional<User> findByEmail(String email) {
        return repo.findByEmailIgnoreCase(email);
    }

    /** Look up a user by email or username (for password login). */
    public Optional<User> findByIdentifier(String identifier) {
        return repo.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier);
    }

    public boolean emailExists(String email) {
        return repo.existsByEmailIgnoreCase(email);
    }

    public boolean usernameExists(String username) {
        return repo.existsByUsernameIgnoreCase(username);
    }

    /** Create a new USER account with a pre-encoded password. The email doubles as the username. */
    @Transactional
    public User registerLocal(String name, String email, String encodedPassword) {
        String normalizedEmail = email.trim().toLowerCase();
        User u = new User();
        u.setName(name);
        u.setEmail(normalizedEmail);
        u.setUsername(normalizedEmail);
        u.setPasswordHash(encodedPassword);
        u.setRole(Role.USER);
        return repo.save(u);
    }

    @Transactional
    public User setPasswordHash(User user, String encodedPassword) {
        user.setPasswordHash(encodedPassword);
        return repo.save(user);
    }

    /**
     * Ensure a bootstrap admin exists with the given encoded password. Creates the account if
     * missing; only sets the password if not already set (so a later self-chosen one isn't clobbered).
     */
    @Transactional
    public void ensureBootstrapAdmin(String email, String encodedPassword) {
        String normalized = email.trim().toLowerCase();
        User user = repo.findByEmailIgnoreCase(normalized).orElseGet(() -> {
            User u = new User();
            u.setEmail(normalized);
            u.setName(normalized);
            return u;
        });
        user.setRole(Role.ADMIN);
        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            user.setPasswordHash(encodedPassword);
        }
        repo.save(user);
    }

    // ---- Admin / profile management ----

    public Page<User> list(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return repo.findAll(pageable);
        }
        return repo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable);
    }

    public User get(UUID id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("User not found: " + id));
    }

    @Transactional
    public User update(UUID id, UserUpdateRequest req) {
        User u = get(id);
        applyProfile(u, req);
        return repo.save(u);
    }

    @Transactional
    public User updateProfile(User user, UserUpdateRequest req) {
        applyProfile(user, req);
        return repo.save(user);
    }

    private void applyProfile(User u, UserUpdateRequest req) {
        if (req.name() != null) u.setName(req.name());
        if (req.phone() != null) u.setPhone(req.phone());
        if (req.address() != null) u.setAddress(req.address());
        if (req.age() != null) u.setAge(req.age());
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("User not found: " + id);
        }
        repo.deleteById(id);
    }

    @Transactional
    public User setRole(UUID id, Role role) {
        User u = get(id);
        u.setRole(role);
        return repo.save(u);
    }
}
