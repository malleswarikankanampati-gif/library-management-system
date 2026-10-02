package com.project.lms.backend.repository;

import com.project.lms.backend.entity.BorrowHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BorrowHistoryRepository extends JpaRepository<BorrowHistory, Long> {

    @Query("SELECT b FROM BorrowHistory b WHERE b.member.memberId = ?1")
    Page<BorrowHistory> getBorrowHistoryByMemberId(Long id, Pageable pageable);

    @Query("SELECT b FROM BorrowHistory b WHERE b.book.bookId = ?1")
    Page<BorrowHistory> getBorrowHistoryByBookId(Long id, Pageable pageable);

    @Query("SELECT b FROM BorrowHistory b WHERE (b.member.username = ?1 OR b.member.email = ?1)")
    Page<BorrowHistory> getBorrowHistoryByUsername(String username, Pageable pageable);
}
