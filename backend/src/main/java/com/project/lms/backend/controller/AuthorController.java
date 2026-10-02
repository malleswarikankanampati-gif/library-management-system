package com.project.lms.backend.controller;

import com.project.lms.backend.dto.AuthorDto;
import com.project.lms.backend.service.AuthorService;
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
@RequestMapping("/api/authors")
@AllArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<AuthorDto> createNew(@RequestPart("authorDto") AuthorDto authorDto,
                                               @RequestPart("authorImg") MultipartFile authorImg) {

        AuthorDto dto = authorService.addNew(authorDto);
        String imgDir = "/images/authors/" + dto.getAuthorId();
        String imageName = InputOutput.saveImageToDir("." + imgDir, authorImg);
        dto.setAuthorImg(imgDir + "/" + imageName);

        return new ResponseEntity<>(authorService.addNew(dto), HttpStatus.CREATED);

    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping
    public ResponseEntity<Page<AuthorDto>> getAll(@RequestParam(value = "name", required = false) String name,
                                                  @RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "20") int size,
                                                  @RequestParam(defaultValue = "name") String sort,
                                                  @RequestParam(defaultValue = "true") Boolean asc) {
        return ResponseEntity.ok(authorService.getAll(name, page, size, sort, asc));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/sort-filters")
    public ResponseEntity<List<String>> getSortFilters() {
        return ResponseEntity.ok(authorService.getSortFilters());
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/{id}")
    public ResponseEntity<AuthorDto> getOne(@PathVariable("id") Long id) {
        return ResponseEntity.ok(authorService.getOne(id));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<AuthorDto> updateOne(@PathVariable("id") Long id,
                                               @RequestPart("authorDto") AuthorDto authorDto,
                                               @RequestPart(value = "authorImg", required = false) MultipartFile authorImg) {

        if (authorImg != null) {
            String imgDir = "/images/authors/" + id;
            String imageName = InputOutput.saveImageToDir("." + imgDir, authorImg);
            authorDto.setAuthorImg(imgDir + "/" + imageName);
        }

        return ResponseEntity.ok(authorService.updateOne(id, authorDto));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOne(@PathVariable("id") Long id) {
        authorService.deleteOne(id);
        return ResponseEntity.ok("Author deleted successfully: " + id);
    }
}
