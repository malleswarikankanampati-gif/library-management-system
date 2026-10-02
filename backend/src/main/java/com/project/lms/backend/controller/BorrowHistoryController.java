package com.project.lms.backend.controller;

import com.project.lms.backend.dto.BorrowHistoryDto;
import com.project.lms.backend.dto.PaginationDto;
import com.project.lms.backend.service.BorrowHistoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/borrow-history")
@AllArgsConstructor
public class BorrowHistoryController {

    private final BorrowHistoryService borrowHistoryService;

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping("/member/{memberId}")
    public ResponseEntity<PaginationDto<BorrowHistoryDto>> getBorrowHistoryByMemberId(@PathVariable Long memberId,
                                                                                      @RequestBody(required = false) PaginationDto<BorrowHistoryDto> paginationDto) {
        Page<BorrowHistoryDto> pageResult = borrowHistoryService.getBorrowHistoryByMemberId(memberId, paginationDto);
        return getPaginatedResponse(pageResult, paginationDto);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping
    public ResponseEntity<PaginationDto<BorrowHistoryDto>> getBorrowHistorySelf(@RequestBody(required = false) PaginationDto<BorrowHistoryDto> paginationDto) {
        Page<BorrowHistoryDto> pageResult = borrowHistoryService.getBorrowHistorySelf(paginationDto);
        return getPaginatedResponse(pageResult, paginationDto);
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping("/book/{bookId}")
    public ResponseEntity<PaginationDto<BorrowHistoryDto>> getBorrowHistoryByBookId(@PathVariable Long bookId,
                                                                                    @RequestBody(required = false) PaginationDto<BorrowHistoryDto> paginationDto) {
        Page<BorrowHistoryDto> pageResult = borrowHistoryService.getBorrowHistoryByBookId(bookId, paginationDto);
        return getPaginatedResponse(pageResult, paginationDto);
    }

    @GetMapping("/sort-filters")
    public ResponseEntity<List<String>> getSortFilters() {
        return ResponseEntity.ok(borrowHistoryService.getSortFilters());
    }

    private ResponseEntity<PaginationDto<BorrowHistoryDto>> getPaginatedResponse(Page<BorrowHistoryDto> pageResult, PaginationDto<BorrowHistoryDto> paginationDto) {
        String sort = paginationDto == null || paginationDto.getSort() == null || paginationDto.getSort().isBlank()
                ? "createdAt"
                : paginationDto.getSort();

        boolean asc = paginationDto != null && paginationDto.getAsc() != null && paginationDto.getAsc();

        PaginationDto<BorrowHistoryDto> response = new PaginationDto<>(
                pageResult.getContent(),
                pageResult.getNumber() + 1,
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isFirst(),
                pageResult.isLast(),
                pageResult.hasNext(),
                pageResult.hasPrevious(), sort, asc
        );

        return ResponseEntity.ok(response);
    }
}