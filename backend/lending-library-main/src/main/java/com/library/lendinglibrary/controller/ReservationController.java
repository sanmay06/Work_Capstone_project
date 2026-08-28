package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Reservation;
import com.library.lendinglibrary.service.ReservationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public Reservation createReservation(@Valid @RequestBody ReservationRequest request) {
        return reservationService.createReservation(
                request.memberId(),
                request.itemId(),
                request.startDate(),
                request.endDate()
        );
    }

    @PutMapping("/{id}/approve")
    public Reservation approve(@PathVariable UUID id) {
        return reservationService.approveReservation(id);
    }

    @PutMapping("/{id}/decline")
    public Reservation decline(@PathVariable UUID id) {
        return reservationService.declineReservation(id);
    }

    @PutMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable UUID id) {
        return reservationService.cancelReservation(id);
    }

    public record ReservationRequest(
            @NotNull(message = "memberId is required") UUID memberId,
            @NotNull(message = "itemId is required") UUID itemId,
            @NotNull(message = "startDate is required") LocalDate startDate,
            @NotNull(message = "endDate is required") LocalDate endDate
    ) {}
}