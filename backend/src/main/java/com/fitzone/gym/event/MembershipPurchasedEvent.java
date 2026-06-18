package com.fitzone.gym.event;

import com.fitzone.gym.entity.Membership;
import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.User;

/** Published after a membership purchase commits; triggers confirmation + invoice emails. */
public record MembershipPurchasedEvent(User user, Membership membership, Payment payment) {
}
