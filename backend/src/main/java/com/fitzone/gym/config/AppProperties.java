package com.fitzone.gym.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Google google = new Google();
    private Admin admin = new Admin();
    private Cors cors = new Cors();
    private Mail mail = new Mail();
    private Frontend frontend = new Frontend();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private String issuer = "fitzone";
        private long accessTokenTtlMinutes = 60;
    }

    @Getter
    @Setter
    public static class Google {
        private String clientId;
    }

    @Getter
    @Setter
    public static class Admin {
        /** Bootstrap admin emails (comma-separated in config). */
        private List<String> bootstrapEmails = new ArrayList<>();
        /** Password seeded for the bootstrap admin accounts on startup (optional). */
        private String bootstrapPassword;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
    }

    @Getter
    @Setter
    public static class Mail {
        /** When false, password-reset links are logged instead of emailed (dev). */
        private boolean enabled = false;
        private String from = "FitZone <no-reply@fitzone.local>";
    }

    @Getter
    @Setter
    public static class Frontend {
        /** Base URLs used to build password-reset links per app. */
        private String userUrl = "http://localhost:5173";
        private String adminUrl = "http://localhost:5174";
    }
}
