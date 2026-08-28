package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.model.Reservation;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.MemberRepository;
import com.library.lendinglibrary.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;

    public Reservation createReservation(UUID memberId, UUID itemId, LocalDate startDate, LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        List<Reservation> overlaps = reservationRepository.findOverlapping(itemId, startDate, endDate);
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Item is already reserved for an overlapping date range");
        }

        Reservation reservation = Reservation.builder()
                .member(member)
                .item(item)
                .startDate(startDate)
                .endDate(endDate)
                .status("PENDING")
                .build();

        return reservationRepository.save(reservation);
    }

    public Reservation approveReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("APPROVED");
        return reservationRepository.save(reservation);
    }

    public Reservation declineReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("DECLINED");
        return reservationRepository.save(reservation);
    }

    public Reservation cancelReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("CANCELLED");
        return reservationRepository.save(reservation);
    }
}