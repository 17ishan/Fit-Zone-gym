package com.fitzone.gym.service;

import com.fitzone.gym.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends transactional email. When {@code app.mail.enabled} is false (or no mail sender is
 * configured), the message is logged instead of sent so local dev works without SMTP.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final AppProperties props;

    public MailService(ObjectProvider<JavaMailSender> mailSender, AppProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    public void sendPasswordReset(String to, String resetLink) {
        String body = "We received a request to reset your FitZone password.\n\n"
                + "Click the link below to choose a new password (valid for 30 minutes):\n\n"
                + resetLink + "\n\n"
                + "If you didn't request this, you can safely ignore this email.";

        JavaMailSender sender = mailSender.getIfAvailable();
        if (!props.getMail().isEnabled() || sender == null) {
            log.warn("[MAIL DISABLED] Password-reset link for {} -> {}", to, resetLink);
            return;
        }

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(props.getMail().getFrom());
        msg.setTo(to);
        msg.setSubject("Reset your FitZone password");
        msg.setText(body);
        sender.send(msg);
        log.info("Sent password-reset email to {}", to);
    }
}
