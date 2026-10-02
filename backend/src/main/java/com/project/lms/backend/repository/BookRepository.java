package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Author;
import com.project.lms.backend.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByOrderByTitleAsc();

    List<Book> findAllByAuthorOrderByTitleAsc(Author author);

    @Query(value = "SELECT a FROM Book a WHERE UPPER(a.title) LIKE UPPER(CONCAT('%', ?1, '%')) ORDER BY a.title ASC")
    List<Book> findAllLikeTitle(String title);

    @Query(value = "SELECT a FROM Book a WHERE UPPER(a.title) LIKE UPPER(CONCAT('%', ?1, '%')) AND a.author.authorId = ?2 ORDER BY a.title ASC")
    List<Book> findAllLikeTitleAndAuthorId(String title, Long id);

    @Query("SELECT a FROM Book a WHERE UPPER(a.title) = UPPER(?1) AND UPPER(a.author.name) = UPPER(?2)")
    List<Book> findAllByTitleAndAuthorName(String title, String authorName);

    @Query(value = """
            SELECT DISTINCT b.*
            FROM books b
            JOIN authors a ON a.author_id = b.author_id
            JOIN book_category bc ON b.book_id = bc.book_id
            JOIN categories c ON bc.category_id = c.category_id
            WHERE
              UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
              AND a.author_id IN (:authorIds)
              AND c.category_id IN (:categoriesIds)
              AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
              AND b.publication_year >= :fromDate
              AND b.publication_year <= :tillDate
              AND b.available_copies >= :availableCopies
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT b.book_id)
                    FROM books b
                    JOIN authors a ON a.author_id = b.author_id
                    JOIN book_category bc ON b.book_id = bc.book_id
                    JOIN categories c ON bc.category_id = c.category_id
                    WHERE
                      UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
                      AND a.author_id IN (:authorIds)
                      AND c.category_id IN (:categoriesIds)
                      AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
                      AND b.publication_year >= :fromDate
                      AND b.publication_year <= :tillDate
                      AND b.available_copies >= :availableCopies
                    """,
            nativeQuery = true)
    Page<Book> findAllByDrawerFilters(
            @Param("title") String title,
            @Param("authorIds") List<Long> authorIds,
            @Param("categoriesIds") List<Long> categoriesIds,
            @Param("publisher") String publisher,
            @Param("fromDate") Integer fromDate,
            @Param("tillDate") Integer tillDate,
            @Param("availableCopies") Integer availableCopies,
            Pageable pageable);

    @Query(value = """
            SELECT DISTINCT b.*
            FROM books b
            JOIN authors a ON a.author_id = b.author_id
            JOIN book_category bc ON b.book_id = bc.book_id
            JOIN categories c ON bc.category_id = c.category_id
            WHERE
              UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
              AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
              AND b.publication_year >= :fromDate
              AND b.publication_year <= :tillDate
              AND b.available_copies >= :availableCopies
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT b.book_id)
                    FROM books b
                    JOIN authors a ON a.author_id = b.author_id
                    JOIN book_category bc ON b.book_id = bc.book_id
                    JOIN categories c ON bc.category_id = c.category_id
                    WHERE
                      UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
                      AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
                      AND b.publication_year >= :fromDate
                      AND b.publication_year <= :tillDate
                      AND b.available_copies >= :availableCopies
                    """,
            nativeQuery = true)
    Page<Book> findAllByDrawerFiltersWithoutAuthorAndCategory(
            @Param("title") String title,
            @Param("publisher") String publisher,
            @Param("fromDate") Integer fromDate,
            @Param("tillDate") Integer tillDate,
            @Param("availableCopies") Integer availableCopies,
            Pageable pageable);

    @Query(value = """
            SELECT DISTINCT b.*
            FROM books b
            JOIN authors a ON a.author_id = b.author_id
            JOIN book_category bc ON b.book_id = bc.book_id
            JOIN categories c ON bc.category_id = c.category_id
            WHERE
              UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
              AND c.category_id IN (:categoriesIds)
              AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
              AND b.publication_year >= :fromDate
              AND b.publication_year <= :tillDate
              AND b.available_copies >= :availableCopies
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT b.book_id)
                    FROM books b
                    JOIN authors a ON a.author_id = b.author_id
                    JOIN book_category bc ON b.book_id = bc.book_id
                    JOIN categories c ON bc.category_id = c.category_id
                    WHERE
                      UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
                      AND c.category_id IN (:categoriesIds)
                      AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
                      AND b.publication_year >= :fromDate
                      AND b.publication_year <= :tillDate
                      AND b.available_copies >= :availableCopies
                    """,
            nativeQuery = true)
    Page<Book> findAllByDrawerFiltersWithoutAuthor(
            @Param("title") String title,
            @Param("categoriesIds") List<Long> categoriesIds,
            @Param("publisher") String publisher,
            @Param("fromDate") Integer fromDate,
            @Param("tillDate") Integer tillDate,
            @Param("availableCopies") Integer availableCopies,
            Pageable pageable);

    @Query(value = """
            SELECT DISTINCT b.*
            FROM books b
            JOIN authors a ON a.author_id = b.author_id
            JOIN book_category bc ON b.book_id = bc.book_id
            JOIN categories c ON bc.category_id = c.category_id
            WHERE
              UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
              AND a.author_id IN (:authorIds)
              AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
              AND b.publication_year >= :fromDate
              AND b.publication_year <= :tillDate
              AND b.available_copies >= :availableCopies
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT b.book_id)
                    FROM books b
                    JOIN authors a ON a.author_id = b.author_id
                    JOIN book_category bc ON b.book_id = bc.book_id
                    JOIN categories c ON bc.category_id = c.category_id
                    WHERE
                      UPPER(b.title) LIKE UPPER(CONCAT('%', COALESCE(:title, ''), '%'))
                      AND a.author_id IN (:authorIds)
                      AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', COALESCE(:publisher, ''), '%'))
                      AND b.publication_year >= :fromDate
                      AND b.publication_year <= :tillDate
                      AND b.available_copies >= :availableCopies
                    """,
            nativeQuery = true)
    Page<Book> findAllByDrawerFiltersWithoutCategory(
            @Param("title") String title,
            @Param("authorIds") List<Long> authorIds,
            @Param("publisher") String publisher,
            @Param("fromDate") Integer fromDate,
            @Param("tillDate") Integer tillDate,
            @Param("availableCopies") Integer availableCopies,
            Pageable pageable);
}