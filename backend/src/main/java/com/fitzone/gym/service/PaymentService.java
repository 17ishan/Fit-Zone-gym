package com.fitzone.gym.service;

import com.fitzone.gym.dto.PaymentDtos.PaymentUpdateRequest;
import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.PaymentStatus;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public List<Payment> byUser(UUID userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Page<Payment> list(PaymentStatus status, Pageable pageable) {
        return status != null ? repo.findByStatus(status, pageable) : repo.findAll(pageable);
    }

    public Payment get(UUID id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Payment not found: " + id));
    }

    @Transactional
    public Payment update(UUID id, PaymentUpdateRequest req) {
        Payment p = get(id);
        if (req.status() != null) p.setStatus(req.status());
        if (req.method() != null) p.setMethod(req.method());
        return repo.save(p);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Payment not found: " + id);
        }
        repo.deleteById(id);
    }
}
