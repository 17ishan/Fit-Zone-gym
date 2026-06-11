package com.fitzone.gym.repository;

import com.fitzone.gym.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    List<Plan> findByActiveTrueOrderBySortOrderAsc();

    List<Plan> findAllByOrderBySortOrderAsc();
}
