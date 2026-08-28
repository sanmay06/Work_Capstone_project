package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.LoanRepository;
import com.library.lendinglibrary.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;

    public Loan checkout(UUID memberId, UUID itemId, int loanDurationDays) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (!"AVAILABLE".equals(item.getStatus())) {
            throw new IllegalStateException("Item is not available for checkout");
        }

        item.setStatus("CHECKED_OUT");
        itemRepository.save(item);

        Loan loan = Loan.builder()
                .member(member)
                .item(item)
                .checkoutDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(loanDurationDays))
                .conditionAtCheckout(item.getCondition())
                .status("ACTIVE")
                .build();

        Loan saved = loanRepository.save(loan);

        // ensure lazy relations are initialized before serialization
        saved.getMember().getId();
        saved.getItem().getId();

        return saved;
    }

    public Loan returnItem(UUID loanId, String conditionAtReturn) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        loan.setReturnDate(LocalDate.now());
        loan.setConditionAtReturn(conditionAtReturn);
        loan.setStatus("RETURNED");

        Item item = loan.getItem();
        item.setStatus("AVAILABLE");
        item.setCondition(conditionAtReturn);
        itemRepository.save(item);

        Loan saved = loanRepository.save(loan);

        // ensure lazy relations are initialized before serialization
        saved.getMember().getId();
        saved.getItem().getId();

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Loan> getByMember(UUID memberId) {
        List<Loan> loans = loanRepository.findByMemberId(memberId);
        loans.forEach(l -> {
            l.getMember().getId();
            l.getItem().getId();
        });
        return loans;
    }

    @Transactional(readOnly = true)
    public List<Loan> getActive() {
        List<Loan> loans = loanRepository.findByStatus("ACTIVE");
        loans.forEach(l -> {
            l.getMember().getId();
            l.getItem().getId();
        });
        return loans;
    }

    @Transactional(readOnly = true)
    public List<Loan> getOverdue() {
        List<Loan> loans = loanRepository.findByStatusAndDueDateBefore("ACTIVE", LocalDate.now());
        loans.forEach(l -> {
            l.getMember().getId();
            l.getItem().getId();
        });
        return loans;
    }
}