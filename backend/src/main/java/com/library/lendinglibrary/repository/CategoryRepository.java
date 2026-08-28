package com.library.lendinglibrary.repository;


import com.library.lendinglibrary.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}