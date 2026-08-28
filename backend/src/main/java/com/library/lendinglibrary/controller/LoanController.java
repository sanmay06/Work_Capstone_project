package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.service.LoanService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/checkout")
    public Loan checkout(@Valid @RequestBody CheckoutRequest request) {
        return loanService.checkout(request.memberId(), request.itemId(), request.loanDurationDays());
    }

    @PutMapping("/{id}/return")
    public Loan returnItem(@PathVariable UUID id, @Valid @RequestBody ReturnRequest request) {
        return loanService.returnItem(id, request.conditionAtReturn());
    }

    @GetMapping("/member/{memberId}")
    public List<Loan> getByMember(@PathVariable UUID memberId) {
        return loanService.getByMember(memberId);
    }

    @GetMapping("/active")
    public List<Loan> getActive() {
        return loanService.getActive();
    }

    @GetMapping("/overdue")
    public List<Loan> getOverdue() {
        return loanService.getOverdue();
    }

    public record CheckoutRequest(
            @NotNull(message = "memberId is required") UUID memberId,
            @NotNull(message = "itemId is required") UUID itemId,
            @Min(value = 1, message = "loanDurationDays must be at least 1") int loanDurationDays
    ) {}

    public record ReturnRequest(
            @NotBlank(message = "conditionAtReturn is required") String conditionAtReturn
    ) {}
}