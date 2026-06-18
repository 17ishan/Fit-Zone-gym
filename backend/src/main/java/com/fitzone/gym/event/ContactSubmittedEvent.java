package com.fitzone.gym.event;

/** Published when a public contact form is submitted; triggers ack + admin alert emails. */
public record ContactSubmittedEvent(String name, String email, String message) {
}
