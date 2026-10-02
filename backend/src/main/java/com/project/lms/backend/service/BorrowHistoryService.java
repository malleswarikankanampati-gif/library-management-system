package com.project.lms.backend.service;

import com.project.lms.backend.dto.BorrowHistoryDto;
import com.project.lms.backend.dto.PaginationDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BorrowHistoryService {
    Page<BorrowHistoryDto> getBorrowHistoryByMemberId(Long memberId, PaginationDto<BorrowHistoryDto> paginationDto);

    Page<BorrowHistoryDto> getBorrowHistoryByBookId(Long bookId, PaginationDto<BorrowHistoryDto> paginationDto);

    void createNew(BorrowHistoryDto borrowHistoryDto);

    Page<BorrowHistoryDto> getBorrowHistorySelf(PaginationDto<BorrowHistoryDto> paginationDto);

    List<String> getSortFilters();
}
