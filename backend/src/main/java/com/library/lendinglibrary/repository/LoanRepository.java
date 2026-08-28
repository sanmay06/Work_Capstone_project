package com.library.lendinglibrary.repository;

import com.library.lendinglibrary.model.Loan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, UUID> {

    @EntityGraph(attributePaths = {"member", "item"})
    List<Loan> findByMemberId(UUID memberId);

    List<Loan> findByStatus(String status);

    @EntityGraph(attributePaths = {"member", "item"})
    List<Loan> findByStatusAndDueDateBefore(String status, LocalDate date);
}