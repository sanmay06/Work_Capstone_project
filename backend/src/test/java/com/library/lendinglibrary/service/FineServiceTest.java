package com.library.lendinglibrary.service;


import com.library.lendinglibrary.model.Fine;
import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.repository.FineRepository;
import com.library.lendinglibrary.repository.LoanRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FineServiceTest {

    @Mock private FineRepository fineRepository;
    @Mock private LoanRepository loanRepository;

    @InjectMocks
    private FineService fineService;

    @Test
    void applyFine_succeedsForExistingLoan() {
        UUID loanId = UUID.randomUUID();
        Loan loan = Loan.builder().id(loanId).build();

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(loan));
        when(fineRepository.save(any(Fine.class))).thenAnswer(inv -> inv.getArgument(0));

        Fine fine = fineService.applyFine(loanId, new BigDecimal("5.00"), "LATE_RETURN");

        assertThat(fine.getStatus()).isEqualTo("UNPAID");
        assertThat(fine.getAmount()).isEqualByComparingTo("5.00");
        assertThat(fine.getReason()).isEqualTo("LATE_RETURN");
    }

    @Test
    void applyFine_throwsWhenLoanNotFound() {
        UUID fakeLoanId = UUID.randomUUID();
        when(loanRepository.findById(fakeLoanId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> fineService.applyFine(fakeLoanId, new BigDecimal("5.00"), "LATE_RETURN"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Loan not found");
    }

    @Test
    void payFine_setsStatusPaid() {
        UUID fineId = UUID.randomUUID();
        Fine fine = Fine.builder().id(fineId).status("UNPAID").build();

        when(fineRepository.findById(fineId)).thenReturn(Optional.of(fine));
        when(fineRepository.save(any(Fine.class))).thenAnswer(inv -> inv.getArgument(0));

        Fine result = fineService.payFine(fineId);

        assertThat(result.getStatus()).isEqualTo("PAID");
    }

    @Test
    void waiveFine_setsStatusWaived() {
        UUID fineId = UUID.randomUUID();
        Fine fine = Fine.builder().id(fineId).status("UNPAID").build();

        when(fineRepository.findById(fineId)).thenReturn(Optional.of(fine));
        when(fineRepository.save(any(Fine.class))).thenAnswer(inv -> inv.getArgument(0));

        Fine result = fineService.waiveFine(fineId);

        assertThat(result.getStatus()).isEqualTo("WAIVED");
    }
}
