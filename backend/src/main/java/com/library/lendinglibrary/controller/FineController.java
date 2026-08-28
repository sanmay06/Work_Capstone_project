package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Fine;
import com.library.lendinglibrary.service.FineService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    @PostMapping
    public Fine applyFine(@Valid @RequestBody FineRequest request) {
        return fineService.applyFine(request.loanId(), request.amount(), request.reason());
    }

    @PutMapping("/{id}/pay")
    public Fine pay(@PathVariable UUID id) {
        return fineService.payFine(id);
    }

    @PutMapping("/{id}/waive")
    public Fine waive(@PathVariable UUID id) {
        return fineService.waiveFine(id);
    }

    @GetMapping("/loan/{loanId}")
    public List<Fine> getByLoan(@PathVariable UUID loanId) {
        return fineService.getByLoan(loanId);
    }

    @GetMapping
    public List<Fine> getAll() {
        return fineService.getAll();
    }

    public record FineRequest(
            @NotNull(message = "loanId is required") UUID loanId,
            @NotNull(message = "amount is required")
            @DecimalMin(value = "0.01", message = "amount must be greater than 0") BigDecimal amount,
            @NotBlank(message = "reason is required") String reason
    ) {}

    @GetMapping("/member/{memberId}")
    public List<Fine> getByMember(@PathVariable UUID memberId) {
        return fineService.getByMember(memberId);
    }
}