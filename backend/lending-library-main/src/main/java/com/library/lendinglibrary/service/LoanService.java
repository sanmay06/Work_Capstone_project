package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.LoanRepository;
import com.library.lendinglibrary.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
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

        return loanRepository.save(loan);
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

        return loanRepository.save(loan);
    }

    public List<Loan> getByMember(UUID memberId) {
        return loanRepository.findByMemberId(memberId);
    }

    public List<Loan> getOverdue() {
        return loanRepository.findByStatusAndDueDateBefore("ACTIVE", LocalDate.now());
    }
}