package com.library.lendinglibrary.service;


import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.model.Reservation;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.MemberRepository;
import com.library.lendinglibrary.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private ReservationService reservationService;

    private UUID memberId;
    private UUID itemId;
    private Member member;
    private Item item;

    @BeforeEach
    void setUp() {
        memberId = UUID.randomUUID();
        itemId = UUID.randomUUID();
        member = Member.builder().id(memberId).name("Test Member").email("test@example.com").build();
        item = Item.builder().id(itemId).name("Drill").status("AVAILABLE").build();
    }

    @Test
    void createReservation_succeedsWhenNoOverlap() {
        LocalDate start = LocalDate.of(2026, 8, 1);
        LocalDate end = LocalDate.of(2026, 8, 3);

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(reservationRepository.findOverlapping(itemId, start, end)).thenReturn(Collections.emptyList());
        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Reservation result = reservationService.createReservation(memberId, itemId, start, end);

        assertThat(result.getStatus()).isEqualTo("PENDING");
        assertThat(result.getMember()).isEqualTo(member);
        assertThat(result.getItem()).isEqualTo(item);
    }

    @Test
    void createReservation_throwsWhenDatesOverlap() {
        LocalDate start = LocalDate.of(2026, 8, 1);
        LocalDate end = LocalDate.of(2026, 8, 3);

        Reservation existing = Reservation.builder().id(UUID.randomUUID()).build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(reservationRepository.findOverlapping(itemId, start, end))
                .thenReturn(List.of(existing));

        assertThatThrownBy(() ->
                reservationService.createReservation(memberId, itemId, start, end)
        ).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("overlapping");
    }

    @Test
    void createReservation_throwsWhenEndDateBeforeStartDate() {
        LocalDate start = LocalDate.of(2026, 8, 5);
        LocalDate end = LocalDate.of(2026, 8, 1);

        assertThatThrownBy(() ->
                reservationService.createReservation(memberId, itemId, start, end)
        ).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("End date cannot be before start date");
    }

    @Test
    void createReservation_throwsWhenMemberNotFound() {
        LocalDate start = LocalDate.of(2026, 8, 1);
        LocalDate end = LocalDate.of(2026, 8, 3);

        when(memberRepository.findById(memberId)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                reservationService.createReservation(memberId, itemId, start, end)
        ).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Member not found");
    }
}