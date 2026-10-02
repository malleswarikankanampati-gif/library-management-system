package com.project.lms.backend.service;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.BorrowDto;
import com.project.lms.backend.dto.MemberDto;
import com.project.lms.backend.dto.PendingBorrowDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BorrowService {
    BorrowDto addNew(BorrowDto borrowDto, BookService bookService);

    Page<BookDto> getBorrowBooksByMember(Long id, int limit);

    Long getBorrowedDays(Long memberId, Long bookId);

    void deleteOne(BorrowDto borrowDto, BookService bookService);

    List<MemberDto> getMembersByBorrowedBook(Long id);

    List<PendingBorrowDto> getAllPendingBorrow();
}
