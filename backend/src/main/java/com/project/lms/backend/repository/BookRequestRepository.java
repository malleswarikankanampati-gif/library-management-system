package com.project.lms.backend.repository;

import com.project.lms.backend.entity.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {

    List<BookRequest> findAllByBookTitleIgnoreCaseAndAuthorIgnoreCase(String bookTitle, String author);

    List<BookRequest> findAllByOrderByIsCompletedDescCreatedAtAsc();

    List<BookRequest> findAllByIsCompletedFalseOrderByCreatedAtAsc();

    @Query("SELECT br FROM BookRequest br WHERE br.member.memberId = ?1 ORDER BY br.createdAt ASC")
    List<BookRequest> findBookRequestsByMemberId(Long id);

}
