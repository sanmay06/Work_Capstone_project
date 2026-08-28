package com.library.lendinglibrary.service;


import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.Loan;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.LoanRepository;
import com.library.lendinglibrary.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanServiceTest {

    @Mock private LoanRepository loanRepository;
    @Mock private ItemRepository itemRepository;
    @Mock private MemberRepository memberRepository;

    @InjectMocks
    private LoanService loanService;

    private UUID memberId;
    private UUID itemId;
    private Member member;
    private Item item;

    @BeforeEach
    void setUp() {
        memberId = UUID.randomUUID();
        itemId = UUID.randomUUID();
        member = Member.builder().id(memberId).name("Test Member").build();
        item = Item.builder().id(itemId).name("Drill").status("AVAILABLE").condition("GOOD").build();
    }

    @Test
    void checkout_succeedsWhenItemAvailable() {
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(loanRepository.save(any(Loan.class))).thenAnswer(inv -> inv.getArgument(0));

        Loan loan = loanService.checkout(memberId, itemId, 7);

        assertThat(loan.getStatus()).isEqualTo("ACTIVE");
        assertThat(loan.getDueDate()).isEqualTo(loan.getCheckoutDate().plusDays(7));
        assertThat(item.getStatus()).isEqualTo("CHECKED_OUT");
    }

    @Test
    void checkout_throwsWhenItemNotAvailable() {
        item.setStatus("ON_LOAN");
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> loanService.checkout(memberId, itemId, 7))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void returnItem_marksLoanReturnedAndItemAvailable() {
        Loan loan = Loan.builder()
                .id(UUID.randomUUID())
                .member(member)
                .item(item)
                .status("ACTIVE")
                .build();

        when(loanRepository.findById(loan.getId())).thenReturn(Optional.of(loan));
        when(loanRepository.save(any(Loan.class))).thenAnswer(inv -> inv.getArgument(0));

        Loan result = loanService.returnItem(loan.getId(), "FAIR");

        assertThat(result.getStatus()).isEqualTo("RETURNED");
        assertThat(result.getConditionAtReturn()).isEqualTo("FAIR");
        assertThat(item.getStatus()).isEqualTo("AVAILABLE");
    }

    @Test
    void returnItem_throwsWhenLoanNotFound() {
        UUID fakeLoanId = UUID.randomUUID();
        when(loanRepository.findById(fakeLoanId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.returnItem(fakeLoanId, "GOOD"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Loan not found");
    }
}
