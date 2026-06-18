package com.fitzone.gym.service;

import com.fitzone.gym.config.AppProperties;
import com.fitzone.gym.entity.Membership;
import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.User;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

/**
 * Sends transactional and notification email. Bodies are rendered from Thymeleaf
 * templates under {@code templates/email/}. When {@code app.mail.enabled} is false (or no
 * mail sender is configured) the message is logged instead of sent, so local dev works
 * without SMTP. All notification methods run on the {@code mailExecutor} so they never
 * block the request or scheduler threads.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);
    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final SpringTemplateEngine templateEngine;
    private final AppProperties props;

    public MailService(ObjectProvider<JavaMailSender> mailSender,
                       SpringTemplateEngine templateEngine, AppProperties props) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.props = props;
    }

    // ---- Transactional (password reset stays plain text & synchronous) ----

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

    // ---- Event-driven (immediate) ----

    @Async("mailExecutor")
    public void sendWelcome(User user) {
        sendHtml(user.getEmail(), "Welcome to FitZone! 💪", "welcome",
                Map.of("name", firstName(user.getName())));
    }

    @Async("mailExecutor")
    public void sendPurchaseConfirmation(User user, Membership m) {
        sendHtml(user.getEmail(), "Your FitZone membership is active 🎉", "purchase-confirmation",
                Map.of(
                        "name", firstName(user.getName()),
                        "planName", m.getPlanName(),
                        "startDate", date(m.getStartDate()),
                        "endDate", date(m.getEndDate()),
                        "price", inr(m.getPriceMinor())
                ));
    }

    @Async("mailExecutor")
    public void sendInvoice(User user, Membership m, Payment p) {
        sendHtml(user.getEmail(), "Your FitZone invoice " + invoiceNo(p), "invoice",
                Map.ofEntries(
                        Map.entry("name", user.getName() != null ? user.getName() : user.getEmail()),
                        Map.entry("email", user.getEmail()),
                        Map.entry("address", user.getAddress() != null ? user.getAddress() : ""),
                        Map.entry("invoiceNo", invoiceNo(p)),
                        Map.entry("invoiceDate", date(p.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate())),
                        Map.entry("planName", m.getPlanName()),
                        Map.entry("periodStart", date(m.getStartDate())),
                        Map.entry("periodEnd", date(m.getEndDate())),
                        Map.entry("amount", inr(p.getAmountMinor())),
                        Map.entry("method", p.getMethod() != null ? p.getMethod() : "—"),
                        Map.entry("paymentRef", p.getProviderPaymentId() != null ? p.getProviderPaymentId() : p.getId().toString())
                ));
    }

    @Async("mailExecutor")
    public void sendContactAck(String name, String to) {
        sendHtml(to, "We received your message — FitZone", "contact-ack",
                Map.of("name", firstName(name)));
    }

    @Async("mailExecutor")
    public void sendContactAdminAlert(String name, String email, String message) {
        sendHtml(adminInbox(), "New contact submission from " + name, "contact-admin-alert",
                Map.of("name", name, "email", email, "message", message));
    }

    // ---- Scheduled (time-based) ----

    @Async("mailExecutor")
    public void sendExpiryReminder(Membership m) {
        long daysLeft = LocalDate.now().until(m.getEndDate()).getDays();
        sendHtml(m.getUser().getEmail(), "Your FitZone membership expires soon", "expiry-reminder",
                Map.of(
                        "name", firstName(m.getUser().getName()),
                        "planName", m.getPlanName(),
                        "endDate", date(m.getEndDate()),
                        "daysLeft", Math.max(daysLeft, 0)
                ));
    }

    @Async("mailExecutor")
    public void sendMembershipExpired(Membership m) {
        sendHtml(m.getUser().getEmail(), "Your FitZone membership has expired", "membership-expired",
                Map.of(
                        "name", firstName(m.getUser().getName()),
                        "planName", m.getPlanName(),
                        "endDate", date(m.getEndDate())
                ));
    }

    @Async("mailExecutor")
    public void sendRenewalNudge(Membership m) {
        sendHtml(m.getUser().getEmail(), "We miss you at FitZone — renew today", "renewal-nudge",
                Map.of(
                        "name", firstName(m.getUser().getName()),
                        "planName", m.getPlanName(),
                        "endDate", date(m.getEndDate())
                ));
    }

    @Async("mailExecutor")
    public void sendPaymentFollowUp(Payment p) {
        sendHtml(p.getUser().getEmail(), "Action needed: complete your FitZone payment", "payment-followup",
                Map.of(
                        "name", firstName(p.getUser().getName()),
                        "amount", inr(p.getAmountMinor()),
                        "status", p.getStatus().name()
                ));
    }

    // ---- internals ----

    private void sendHtml(String to, String subject, String template, Map<String, Object> model) {
        if (to == null || to.isBlank()) {
            log.warn("Skipping '{}' email: no recipient address", subject);
            return;
        }
        Context ctx = new Context();
        ctx.setVariables(model);
        String html = templateEngine.process("email/" + template, ctx);

        JavaMailSender sender = mailSender.getIfAvailable();
        if (!props.getMail().isEnabled() || sender == null) {
            log.warn("[MAIL DISABLED] would send '{}' to {} (template: {})", subject, to, template);
            return;
        }
        try {
            MimeMessage msg = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
            helper.setFrom(props.getMail().getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            sender.send(msg);
            log.info("Sent '{}' email to {}", subject, to);
        } catch (Exception e) {
            // Never let a mail failure bubble into the caller (request/scheduler).
            log.error("Failed to send '{}' email to {}: {}", subject, to, e.getMessage());
        }
    }

    private String adminInbox() {
        String inbox = props.getMail().getAdminInbox();
        return (inbox != null && !inbox.isBlank()) ? inbox : props.getMail().getFrom();
    }

    private static String invoiceNo(Payment p) {
        return "INV-" + p.getId().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    private static String firstName(String name) {
        if (name == null || name.isBlank()) return "there";
        return name.trim().split("\\s+")[0];
    }

    private static String date(LocalDate d) {
        return d != null ? d.format(DATE_FMT) : "—";
    }

    /** Minor units (paise) → e.g. "₹1,499.00". */
    private static String inr(Long minor) {
        if (minor == null) return "₹0.00";
        BigDecimal rupees = BigDecimal.valueOf(minor).movePointLeft(2).setScale(2, RoundingMode.HALF_UP);
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("en", "IN"));
        nf.setMinimumFractionDigits(2);
        nf.setMaximumFractionDigits(2);
        return "₹" + nf.format(rupees);
    }
}
