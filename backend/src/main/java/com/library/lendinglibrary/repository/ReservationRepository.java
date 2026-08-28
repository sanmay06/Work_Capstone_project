package com.library.lendinglibrary.repository;


import com.library.lendinglibrary.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    @Query("""
           SELECT r FROM Reservation r
           WHERE r.item.id = :itemId
             AND r.status IN ('PENDING', 'APPROVED')
             AND r.startDate <= :endDate
             AND r.endDate >= :startDate
           """)
    List<Reservation> findOverlapping(
            @Param("itemId") UUID itemId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    List<Reservation> findByMemberId(java.util.UUID memberId);
}
