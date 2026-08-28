package com.library.lendinglibrary.repository;



import com.library.lendinglibrary.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FineRepository extends JpaRepository<Fine, UUID> {
    List<Fine> findByLoanId(UUID loanId);

    @org.springframework.data.jpa.repository.Query("""
       SELECT f FROM Fine f
       WHERE f.loan.member.id = :memberId
       """)
    List<Fine> findByMemberId(@org.springframework.data.repository.query.Param("memberId") java.util.UUID memberId);
}
