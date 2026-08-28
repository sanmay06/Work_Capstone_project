package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Fine;
import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.repository.FineRepository;
import com.library.lendinglibrary.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final LoanRepository loanRepository;

    public Fine applyFine(UUID loanId, BigDecimal amount, String reason) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        Fine fine = Fine.builder()
                .loan(loan)
                .amount(amount)
                .reason(reason)
                .status("UNPAID")
                .build();

        return fineRepository.save(fine);
    }

    public Fine payFine(UUID fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found"));
        fine.setStatus("PAID");
        return fineRepository.save(fine);
    }

    public Fine waiveFine(UUID fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found"));
        fine.setStatus("WAIVED");
        return fineRepository.save(fine);
    }

    public List<Fine> getByLoan(UUID loanId) {
        return fineRepository.findByLoanId(loanId);
    }

    public List<Fine> getAll() {
        return fineRepository.findAll();
    }

    public List<Fine> getByMember(UUID memberId) {
        return fineRepository.findByMemberId(memberId);
    }
}