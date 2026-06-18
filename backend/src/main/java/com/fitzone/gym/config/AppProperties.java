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
    private Notifications notifications = new Notifications();

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
        /** When false, emails are logged instead of sent (dev). */
        private boolean enabled = false;
        private String from = "FitZone <no-reply@fitzone.local>";
        /** Inbox that receives contact-form alerts (and any admin notifications). */
        private String adminInbox = "";
    }

    @Getter
    @Setter
    public static class Frontend {
        /** Base URLs used to build password-reset links per app. */
        private String userUrl = "http://localhost:5173";
        private String adminUrl = "http://localhost:5174";
    }

    @Getter
    @Setter
    public static class Notifications {
        /** Master switch for all scheduled notification jobs. */
        private boolean enabled = true;
        /** Days before endDate to send expiry reminders (one email per offset). */
        private List<Integer> reminderDaysBefore = new ArrayList<>(List.of(7, 1));
        /** Days after expiry to send the renewal nudge. */
        private int renewalNudgeDaysAfter = 3;
        /** A pending/failed payment older than this (hours) gets a follow-up. */
        private int paymentFollowUpHours = 24;
        /** Cron expressions (default: once daily ~08:00 server time). */
        private String expiryCron = "0 0 8 * * *";
        private String expireCron = "0 10 8 * * *";
        private String renewalCron = "0 20 8 * * *";
        private String paymentCron = "0 30 8 * * *";
    }
}
