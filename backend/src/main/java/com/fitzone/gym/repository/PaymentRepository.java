package com.fitzone.gym.repository;

import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    // open-in-view is disabled: fetch the to-one user/membership associations eagerly so the
    // controller can map to a DTO after the transaction closes without LazyInitializationException.

    @EntityGraph(attributePaths = {"user", "membership"})
    List<Payment> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @EntityGraph(attributePaths = {"user", "membership"})
    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "membership"})
    Page<Payment> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "membership"})
    Optional<Payment> findById(UUID id);

    long countByCreatedAtAfter(Instant since);

    /** Unsettled payments older than a cutoff (used by the payment follow-up job). */
    @EntityGraph(attributePaths = {"user", "membership"})
    List<Payment> findByStatusInAndCreatedAtBefore(Collection<PaymentStatus> statuses, Instant cutoff);

    @Query("select coalesce(sum(p.amountMinor), 0) from Payment p where p.status = com.fitzone.gym.entity.PaymentStatus.SUCCESS")
    long sumSuccessfulAmountMinor();

    @Query("select function('to_char', p.createdAt, 'YYYY-MM') as month, coalesce(sum(p.amountMinor),0) as total " +
            "from Payment p where p.status = com.fitzone.gym.entity.PaymentStatus.SUCCESS group by function('to_char', p.createdAt, 'YYYY-MM') order by month")
    List<RevenueByMonth> revenueByMonth();

    interface RevenueByMonth {
        String getMonth();
        long getTotal();
    }
}
