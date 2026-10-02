package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthorRepository extends JpaRepository<Author, Long> {

    @Query("""
                SELECT a FROM Author a 
                WHERE (:name IS NULL OR UPPER(a.name) LIKE UPPER(CONCAT('%', CAST(:name AS string), '%')))
            """)
    Page<Author> findByNameLike(@Param("name") String name, Pageable pageable);

    @Query("""
                SELECT a FROM Author a
                LEFT JOIN a.books b
                WHERE (:name IS NULL OR UPPER(a.name) LIKE UPPER(CONCAT('%', CAST(:name AS string), '%')))
                GROUP BY a
                ORDER BY 
                    CASE WHEN :asc = true THEN COUNT(b) END ASC,
                    CASE WHEN :asc = false THEN COUNT(b) END DESC,
                    a.name ASC
            
            """)
    Page<Author> findAllOrderByBookCount(
            @Param("name") String name,
            @Param("asc") boolean asc,
            Pageable pageable
    );
}
