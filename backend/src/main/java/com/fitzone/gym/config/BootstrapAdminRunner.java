package com.fitzone.gym.config;

import com.fitzone.gym.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * On startup, seeds the bootstrap admin email(s) as ADMIN accounts with a password (from
 * {@code app.admin.bootstrap-password}) so the admin portal has an email/password login from
 * a fresh database. No-op when no password is configured.
 */
@Component
public class BootstrapAdminRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BootstrapAdminRunner.class);

    private final AppProperties props;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public BootstrapAdminRunner(AppProperties props, UserService userService, PasswordEncoder passwordEncoder) {
        this.props = props;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String password = props.getAdmin().getBootstrapPassword();
        if (password == null || password.isBlank()) {
            log.info("No app.admin.bootstrap-password set; skipping admin password seeding.");
            return;
        }
        String encoded = passwordEncoder.encode(password);
        for (String email : props.getAdmin().getBootstrapEmails()) {
            if (email == null || email.isBlank()) {
                continue;
            }
            userService.ensureBootstrapAdmin(email, encoded);
            log.info("Ensured bootstrap admin account for {}", email.trim());
        }
    }
}
