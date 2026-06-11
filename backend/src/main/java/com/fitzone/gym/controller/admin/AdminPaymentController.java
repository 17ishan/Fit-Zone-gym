package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.PageResponse;
import com.fitzone.gym.dto.PaymentDtos.PaymentResponse;
import com.fitzone.gym.dto.PaymentDtos.PaymentUpdateRequest;
import com.fitzone.gym.entity.PaymentStatus;
import com.fitzone.gym.service.PaymentService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public PageResponse<PaymentResponse> list(@RequestParam(required = false) PaymentStatus status,
                                              @PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.of(paymentService.list(status, pageable), PaymentResponse::from);
    }

    @GetMapping("/{id}")
    public PaymentResponse get(@PathVariable UUID id) {
        return PaymentResponse.from(paymentService.get(id));
    }

    @PatchMapping("/{id}")
    public PaymentResponse update(@PathVariable UUID id, @RequestBody PaymentUpdateRequest req) {
        return PaymentResponse.from(paymentService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        paymentService.delete(id);
    }
}
