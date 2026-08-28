package com.library.lendinglibrary.repository;



import com.library.lendinglibrary.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FineRepository extends JpaRepository<Fine, UUID> {
    List<Fine> findByLoanId(UUID loanId);
}
