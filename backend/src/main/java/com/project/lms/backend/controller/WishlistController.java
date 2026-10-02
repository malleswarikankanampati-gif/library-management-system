package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.WishlistDto;
import com.project.lms.backend.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/wishlist")
@AllArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<WishlistDto> createNew(@RequestBody WishlistDto wishlistDto) {
        return new ResponseEntity<>(wishlistService.addNew(wishlistDto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/books/{id}")
    public ResponseEntity<List<BookDto>> getWishlistBooksByMember(@PathVariable("id") Long id) {
        return ResponseEntity.ok(wishlistService.getWishlistBooksByMember(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @DeleteMapping
    public ResponseEntity<String> deleteOne(@RequestBody WishlistDto wishlistDto) {
        wishlistService.deleteOne(wishlistDto);
        return new ResponseEntity<>("Book removed from wishlist successfully", HttpStatus.OK);
    }
}
