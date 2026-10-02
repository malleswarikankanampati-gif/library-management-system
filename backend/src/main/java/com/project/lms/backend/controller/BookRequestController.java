package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BookRequestDto;
import com.project.lms.backend.service.BookRequestService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/bookRequest")
@AllArgsConstructor
public class BookRequestController {

    private final BookRequestService bookRequestService;

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BookRequestDto> createNew(@RequestBody BookRequestDto bookRequestDto) {
        return new ResponseEntity<>(bookRequestService.addNew(bookRequestDto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @GetMapping("/all")
    public ResponseEntity<List<BookRequestDto>> getAll() {
        return ResponseEntity.ok(bookRequestService.getAll());
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @GetMapping
    public ResponseEntity<List<BookRequestDto>> getAllIncomplete() {
        return ResponseEntity.ok(bookRequestService.getAllIncomplete());
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/{id}")
    public ResponseEntity<BookRequestDto> getOne(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookRequestService.getOne(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookRequestDto> updateOne(@PathVariable("id") Long id, @RequestBody BookRequestDto bookRequestDto) {
        return ResponseEntity.ok(bookRequestService.updateOne(id, bookRequestDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOne(@PathVariable("id") Long id) {
        bookRequestService.deleteOne(id);
        return new ResponseEntity<>("Book request deleted successfully: " + id, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PatchMapping("/{id}")
    public ResponseEntity<BookRequestDto> setCompleted(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookRequestService.setCompleted(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/byMember/{id}")
    public ResponseEntity<List<BookRequestDto>> getBookRequestsByMember(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookRequestService.getBookRequestsByMember(id));
    }
}
