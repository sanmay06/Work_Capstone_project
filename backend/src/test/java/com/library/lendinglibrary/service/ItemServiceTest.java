package com.library.lendinglibrary.service;


import com.library.lendinglibrary.model.Category;
import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.repository.CategoryRepository;
import com.library.lendinglibrary.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock private ItemRepository itemRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks
    private ItemService itemService;

    @Test
    void addItem_succeedsWhenCategoryExists() {
        UUID categoryId = UUID.randomUUID();
        Category category = Category.builder().id(categoryId).name("Power Tools").build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(itemRepository.save(any(Item.class))).thenAnswer(inv -> inv.getArgument(0));

        Item item = itemService.addItem("Drill", "18V drill", categoryId, "PT-001");

        assertThat(item.getStatus()).isEqualTo("AVAILABLE");
        assertThat(item.getCategory()).isEqualTo(category);
    }

    @Test
    void addItem_throwsWhenCategoryNotFound() {
        UUID fakeCategoryId = UUID.randomUUID();
        when(categoryRepository.findById(fakeCategoryId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.addItem("Drill", "desc", fakeCategoryId, "PT-002"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void getAvailable_returnsOnlyAvailableItems() {
        Item item = Item.builder().status("AVAILABLE").build();
        when(itemRepository.findByStatus("AVAILABLE")).thenReturn(List.of(item));

        List<Item> result = itemService.getAvailable();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo("AVAILABLE");
    }
}