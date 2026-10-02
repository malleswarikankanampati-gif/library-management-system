package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.CategoryDto;
import com.project.lms.backend.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/categories")
@AllArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<CategoryDto> createNew(@RequestBody CategoryDto categoryDto) {
        return new ResponseEntity<>(categoryService.addNew(categoryDto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAll(@RequestParam(value = "name", required = false) String name) {
        if (name != null) {
            return ResponseEntity.ok(categoryService.getAllLikeName(name));
        }
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getOne(@PathVariable("id") Long id) {
        return ResponseEntity.ok(categoryService.getOne(id));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/{id}/books")
    public ResponseEntity<List<BookDto>> getBooksByCategory(@PathVariable("id") Long id) {
        return ResponseEntity.ok(categoryService.getBooksByCategory(id));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateOne(@PathVariable("id") Long id, @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.updateOne(id, categoryDto));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOne(@PathVariable("id") Long id) {
        categoryService.deleteOne(id);
        return new ResponseEntity<>("Category deleted successfully: " + id, HttpStatus.OK);
    }
}
