package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByOrderByNameAsc();

    @Query(value = "SELECT a FROM Category a WHERE a.name LIKE UPPER(CONCAT(?1, '%')) ORDER BY a.categoryId ASC")
    List<Category> findAllLikeName(String name);
}
