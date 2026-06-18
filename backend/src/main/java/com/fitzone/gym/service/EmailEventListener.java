package com.fitzone.gym.service;

import com.fitzone.gym.event.ContactSubmittedEvent;
import com.fitzone.gym.event.MembershipPurchasedEvent;
import com.fitzone.gym.event.UserRegisteredEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Sends event-driven emails only after the originating transaction commits, so an email
 * is never sent for work that rolled back. The actual send is @Async inside MailService,
 * so these handlers return immediately.
 */
@Component
public class EmailEventListener {

    private final MailService mail;

    public EmailEventListener(MailService mail) {
        this.mail = mail;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onMembershipPurchased(MembershipPurchasedEvent e) {
        mail.sendPurchaseConfirmation(e.user(), e.membership());
        mail.sendInvoice(e.user(), e.membership(), e.payment());
    }

    // fallbackExecution = true so it also fires for local registration, which runs
    // outside an enclosing transaction (Google first-login runs inside one).
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onUserRegistered(UserRegisteredEvent e) {
        mail.sendWelcome(e.user());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onContactSubmitted(ContactSubmittedEvent e) {
        mail.sendContactAck(e.name(), e.email());
        mail.sendContactAdminAlert(e.name(), e.email(), e.message());
    }
}
