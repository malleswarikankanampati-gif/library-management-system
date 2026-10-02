package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.service.BookService;
import com.project.lms.backend.service.BorrowService;
import com.project.lms.backend.util.InputOutput;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/books")
@AllArgsConstructor
public class BookController {

    private final BookService bookService;
    private final BorrowService borrowService;

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BookDto> createNew(@RequestPart("bookDto") BookDto bookDto,
                                             @RequestPart("bookImg") MultipartFile bookImg) {

        BookDto dto = bookService.addNew(bookDto);
        String imgDir = "/images/books/" + dto.getBookId();
        String imageName = InputOutput.saveImageToDir("." + imgDir, bookImg);
        dto.setBookCoverImg(imgDir + "/" + imageName);

        return new ResponseEntity<>(bookService.addNew(dto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping
    public ResponseEntity<Page<BookDto>> getAll(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "authorId", required = false) List<Long> authorId,
            @RequestParam(value = "categoriesIds", required = false) List<Long> categoriesIds,
            @RequestParam(value = "publisher", required = false) String publisher,
            @RequestParam(value = "fromDate", required = false) Integer fromDate,
            @RequestParam(value = "tillDate", required = false) Integer tillDate,
            @RequestParam(value = "availableCopies", required = false) Integer availableCopies,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "title") String sort,
            @RequestParam(defaultValue = "true") Boolean asc
    ) {
        return ResponseEntity.ok(bookService.getAllByDrawerFilters(
                title, authorId, categoriesIds, publisher, fromDate, tillDate, availableCopies, page, size, sort, asc
        ));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/sort-filters")
    public ResponseEntity<List<String>> getSortFilters() {
        return ResponseEntity.ok(bookService.getSortFilters());
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getOne(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookService.getOne(id));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateOne(@PathVariable("id") Long id,
                                             @RequestPart("bookDto") BookDto bookDto,
                                             @RequestPart(value = "bookImg", required = false) MultipartFile bookImg) {

        if (bookImg != null) {
            String imgDir = "/images/books/" + id;
            String imageName = InputOutput.saveImageToDir("." + imgDir, bookImg);
            bookDto.setBookCoverImg(imgDir + "/" + imageName);
        }

        return ResponseEntity.ok(bookService.updateOne(id, bookDto));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOne(@PathVariable("id") Long id) {
        bookService.deleteOne(id);
        return ResponseEntity.ok("Book deleted successfully: " + id);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PatchMapping("/increase/{id}")
    public ResponseEntity<BookDto> increaseAvailableCopies(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookService.increaseAvailableCopies(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PatchMapping("/decrease/{id}")
    public ResponseEntity<BookDto> decreaseAvailableCopies(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bookService.decreaseAvailableCopies(id));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PatchMapping("/increase-total/{id}")
    public ResponseEntity<BookDto> increaseTotalCopies(@PathVariable("id") Long id, @RequestBody Integer amount) {
        return ResponseEntity.ok(bookService.increaseTotalCopies(id, amount));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PatchMapping("/decrease-total/{id}")
    public ResponseEntity<BookDto> decreaseTotalCopies(@PathVariable("id") Long id, @RequestBody Integer amount) {
        return ResponseEntity.ok(bookService.decreaseTotalCopies(id, amount));
    }
}
