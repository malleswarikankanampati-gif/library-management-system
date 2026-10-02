package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Book;
import com.project.lms.backend.entity.Borrow;
import com.project.lms.backend.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    @Query("SELECT b FROM Borrow b WHERE b.member.memberId = ?1 AND b.book.bookId = ?2")
    Optional<Borrow> findByMemberIdAndBookId(Long memberId, Long bookId);

    @Query("SELECT b.book FROM Borrow b WHERE b.member.memberId = ?1 ORDER BY b.createdAt ASC")
    Page<Book> getBorrowBooksByMember(Long memberId, Pageable pageable);

    @Query("SELECT b.member FROM Borrow b WHERE b.book.bookId = ?1 ORDER BY b.createdAt ASC")
    List<Member> getMembersByBorrowedBook(Long id);

    @Query("SELECT b FROM Borrow b ORDER BY b.createdAt ASC, b.book.title")
    List<Borrow> getAllPendingBorrow();
}
