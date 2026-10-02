package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Book;
import com.project.lms.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query("SELECT w FROM Wishlist w WHERE w.member.memberId = ?1 AND w.book.bookId = ?2")
    Optional<Wishlist> findByMemberIdAndBookId(Long memberId, Long bookId);

    @Query("SELECT w.book FROM Wishlist w WHERE w.member.memberId = ?1 ORDER BY w.createdAt DESC")
    List<Book> getWishlistBooksByMember(Long id);
}
