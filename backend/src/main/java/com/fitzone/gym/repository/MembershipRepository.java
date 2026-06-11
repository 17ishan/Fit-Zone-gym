package com.fitzone.gym.repository;

import com.fitzone.gym.entity.Membership;
import com.fitzone.gym.entity.MembershipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {

    // open-in-view is disabled, so the to-one user/plan associations must be fetched
    // eagerly within the query — otherwise mapping to a DTO outside the transaction
    // (in the controller) triggers LazyInitializationException. EntityGraph also avoids N+1.

    @EntityGraph(attributePaths = {"user", "plan"})
    List<Membership> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @EntityGraph(attributePaths = {"user", "plan"})
    Page<Membership> findByStatus(MembershipStatus status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "plan"})
    Page<Membership> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "plan"})
    Optional<Membership> findById(UUID id);

    long countByStatus(MembershipStatus status);

    @Query("select m.planName as planName, count(m) as count from Membership m group by m.planName")
    List<PlanCount> countGroupByPlanName();

    interface PlanCount {
        String getPlanName();
        long getCount();
    }
}
