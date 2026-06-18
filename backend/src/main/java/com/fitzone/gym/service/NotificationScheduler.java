package com.fitzone.gym.service;

import com.fitzone.gym.config.AppProperties;
import com.fitzone.gym.entity.Membership;
import com.fitzone.gym.entity.MembershipStatus;
import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.PaymentStatus;
import com.fitzone.gym.repository.MembershipRepository;
import com.fitzone.gym.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Daily scheduled email jobs driven by membership/payment dates. Each job is a no-op when
 * {@code app.notifications.enabled} is false. Dedup relies on exact-day matching so a member
 * receives each reminder/nudge once without a notification-log table (a log table would be the
 * upgrade if multi-window retries are ever needed). Mail sending itself is @Async in MailService.
 */
@Service
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final MembershipRepository membershipRepo;
    private final PaymentRepository paymentRepo;
    private final MailService mail;
    private final AppProperties props;

    public NotificationScheduler(MembershipRepository membershipRepo, PaymentRepository paymentRepo,
                                 MailService mail, AppProperties props) {
        this.membershipRepo = membershipRepo;
        this.paymentRepo = paymentRepo;
        this.mail = mail;
        this.props = props;
    }

    private boolean disabled() {
        return !props.getNotifications().isEnabled();
    }

    /** Remind members whose membership ends in exactly N days, for each configured N. */
    @Scheduled(cron = "${app.notifications.expiry-cron}")
    public void sendExpiryReminders() {
        if (disabled()) return;
        LocalDate today = LocalDate.now();
        int total = 0;
        for (Integer offset : props.getNotifications().getReminderDaysBefore()) {
            List<Membership> due = membershipRepo.findByStatusAndEndDate(
                    MembershipStatus.ACTIVE, today.plusDays(offset));
            due.forEach(mail::sendExpiryReminder);
            total += due.size();
        }
        if (total > 0) log.info("Expiry reminder job: queued {} email(s)", total);
    }

    /** Flip lapsed ACTIVE memberships to EXPIRED and notify each member. */
    @Scheduled(cron = "${app.notifications.expire-cron}")
    @Transactional
    public void expireLapsedMemberships() {
        if (disabled()) return;
        List<Membership> lapsed = membershipRepo.findByStatusAndEndDateBefore(
                MembershipStatus.ACTIVE, LocalDate.now());
        for (Membership m : lapsed) {
            m.setStatus(MembershipStatus.EXPIRED);
            membershipRepo.save(m);
            mail.sendMembershipExpired(m);
        }
        if (!lapsed.isEmpty()) log.info("Auto-expire job: expired {} membership(s)", lapsed.size());
    }

    /** Nudge members who lapsed exactly renewalNudgeDaysAfter days ago to come back. */
    @Scheduled(cron = "${app.notifications.renewal-cron}")
    public void sendRenewalNudges() {
        if (disabled()) return;
        LocalDate target = LocalDate.now().minusDays(props.getNotifications().getRenewalNudgeDaysAfter());
        List<Membership> due = membershipRepo.findByStatusAndEndDate(MembershipStatus.EXPIRED, target);
        due.forEach(mail::sendRenewalNudge);
        if (!due.isEmpty()) log.info("Renewal nudge job: queued {} email(s)", due.size());
    }

    /** Follow up on payments still PENDING/FAILED past the configured threshold. */
    @Scheduled(cron = "${app.notifications.payment-cron}")
    public void sendPaymentFollowUps() {
        if (disabled()) return;
        int hours = props.getNotifications().getPaymentFollowUpHours();
        Instant cutoff = Instant.now().minus(hours, ChronoUnit.HOURS);
        // Only the ~1-day window just past the cutoff, so a stuck payment is chased once.
        Instant windowStart = cutoff.minus(24, ChronoUnit.HOURS);
        List<Payment> stuck = paymentRepo.findByStatusInAndCreatedAtBefore(
                List.of(PaymentStatus.PENDING, PaymentStatus.FAILED), cutoff);
        long queued = stuck.stream()
                .filter(p -> p.getCreatedAt().isAfter(windowStart))
                .peek(mail::sendPaymentFollowUp)
                .count();
        if (queued > 0) log.info("Payment follow-up job: queued {} email(s)", queued);
    }
}
