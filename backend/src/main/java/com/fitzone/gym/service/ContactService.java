package com.fitzone.gym.service;

import com.fitzone.gym.dto.ContactDtos.ContactRequest;
import com.fitzone.gym.entity.ContactStatus;
import com.fitzone.gym.entity.ContactSubmission;
import com.fitzone.gym.event.ContactSubmittedEvent;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.ContactSubmissionRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ContactService {

    private final ContactSubmissionRepository repo;
    private final ApplicationEventPublisher events;

    public ContactService(ContactSubmissionRepository repo, ApplicationEventPublisher events) {
        this.repo = repo;
        this.events = events;
    }

    @Transactional
    public ContactSubmission submit(ContactRequest req) {
        ContactSubmission c = new ContactSubmission();
        c.setName(req.name());
        c.setEmail(req.email());
        c.setMessage(req.message());
        c.setStatus(ContactStatus.NEW);
        c = repo.save(c);

        // Acknowledgement to the sender + alert to the admin inbox, after commit.
        events.publishEvent(new ContactSubmittedEvent(c.getName(), c.getEmail(), c.getMessage()));
        return c;
    }

    public Page<ContactSubmission> list(ContactStatus status, Pageable pageable) {
        return status != null ? repo.findByStatus(status, pageable) : repo.findAll(pageable);
    }

    public ContactSubmission get(UUID id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Contact submission not found: " + id));
    }

    @Transactional
    public ContactSubmission updateStatus(UUID id, ContactStatus status) {
        ContactSubmission c = get(id);
        if (status != null) c.setStatus(status);
        return repo.save(c);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Contact submission not found: " + id);
        }
        repo.deleteById(id);
    }
}
