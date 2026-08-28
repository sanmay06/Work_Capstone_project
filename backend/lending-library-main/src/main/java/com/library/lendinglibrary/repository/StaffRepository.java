package com.library.lendinglibrary.repository;


import com.library.lendinglibrary.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StaffRepository extends JpaRepository<Staff, UUID> {
}
