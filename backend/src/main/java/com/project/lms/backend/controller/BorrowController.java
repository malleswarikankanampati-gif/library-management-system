package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.BorrowDto;
import com.project.lms.backend.dto.MemberDto;
import com.project.lms.backend.dto.PendingBorrowDto;
import com.project.lms.backend.service.BookService;
import com.project.lms.backend.service.BorrowService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/borrow")
@AllArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;
    private final BookService bookService;

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BorrowDto> createNew(@RequestBody BorrowDto borrowDto) {
        return new ResponseEntity<>(borrowService.addNew(borrowDto, bookService), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping("/books/{id}")
    public ResponseEntity<Page<BookDto>> getBorrowBooksByMember(@PathVariable("id") Long id, @RequestBody(required = false) Map<String, Object> payload) {
        int limit = 0;

        if (payload != null && payload.get("limit") instanceof Integer) {
            limit = (int) payload.get("limit");
        }
        return ResponseEntity.ok(borrowService.getBorrowBooksByMember(id, limit));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @GetMapping("/members/{id}")
    public ResponseEntity<List<MemberDto>> getMembersByBorrowedBook(@PathVariable("id") Long id) {
        return ResponseEntity.ok(borrowService.getMembersByBorrowedBook(id));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @GetMapping("/pending")
    public ResponseEntity<List<PendingBorrowDto>> getAllPendingBorrow() {
        return ResponseEntity.ok(borrowService.getAllPendingBorrow());
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @DeleteMapping
    public ResponseEntity<String> deleteOne(@RequestBody BorrowDto borrowDto) {
        borrowService.deleteOne(borrowDto, bookService);
        return new ResponseEntity<>("Book successfully returned", HttpStatus.OK);
    }
}
