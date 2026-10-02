package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.BorrowHistoryDto;
import com.project.lms.backend.dto.PaginationDto;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.BorrowHistoryRepository;
import com.project.lms.backend.service.AuthService;
import com.project.lms.backend.service.BorrowHistoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class BorrowHistoryServiceImpl implements BorrowHistoryService {

    private final Map<String, String> sortingMap = new LinkedHashMap<>() {{
        put("createdAt", "createdAt");
        put("bookTitle", "book.title");
        put("authorName", "book.author.name");
        put("activityType", "activityType");
        put("borrowedDays", "borrowedDays");
    }};


    private final BorrowHistoryRepository borrowHistoryRepository;
    private final AuthService authService;
    private final BookMapper bookMapper;

    @Override
    public Page<BorrowHistoryDto> getBorrowHistoryByMemberId(Long memberId, PaginationDto<BorrowHistoryDto> paginationDto) {
        Page<BorrowHistoryDto> result = borrowHistoryRepository.getBorrowHistoryByMemberId(memberId, getPageable(paginationDto))
                .map(bookMapper::BorrowHistoryEntityToDto);

        int totalPages = result.getTotalPages();
        if (paginationDto != null && paginationDto.getPage() > totalPages) {
            paginationDto.setPage(totalPages);
            result = borrowHistoryRepository.getBorrowHistoryByMemberId(memberId, getPageable(paginationDto))
                    .map(bookMapper::BorrowHistoryEntityToDto);
        }

        return result;
    }

    @Override
    public Page<BorrowHistoryDto> getBorrowHistoryByBookId(Long bookId, PaginationDto<BorrowHistoryDto> paginationDto) {
        Page<BorrowHistoryDto> result = borrowHistoryRepository.getBorrowHistoryByBookId(bookId, getPageable(paginationDto))
                .map(bookMapper::BorrowHistoryEntityToDto);

        int totalPages = result.getTotalPages();
        if (paginationDto != null && paginationDto.getPage() > totalPages) {
            paginationDto.setPage(totalPages);
            result = borrowHistoryRepository.getBorrowHistoryByBookId(bookId, getPageable(paginationDto))
                    .map(bookMapper::BorrowHistoryEntityToDto);
        }

        return result;
    }

    @Override
    public void createNew(BorrowHistoryDto borrowHistoryDto) {
        borrowHistoryRepository.save(bookMapper.BorrowHistoryDtoToEntity(borrowHistoryDto));
    }

    @Override
    public Page<BorrowHistoryDto> getBorrowHistorySelf(PaginationDto<BorrowHistoryDto> paginationDto) {
        String username = authService.getCurrentUsername();

        Page<BorrowHistoryDto> result = borrowHistoryRepository.getBorrowHistoryByUsername(username, getPageable(paginationDto))
                .map(bookMapper::BorrowHistoryEntityToDto);

        int totalPages = result.getTotalPages();
        if (paginationDto != null && paginationDto.getPage() > totalPages) {
            paginationDto.setPage(totalPages);
            result = borrowHistoryRepository.getBorrowHistoryByUsername(username, getPageable(paginationDto))
                    .map(bookMapper::BorrowHistoryEntityToDto);
        }

        return result;
    }

    @Override
    public List<String> getSortFilters() {
        return new ArrayList<>(sortingMap.keySet());
    }

    private Pageable getPageable(PaginationDto<BorrowHistoryDto> paginationDto) {
        int page = paginationDto == null || paginationDto.getPage() < 1
                ? 1
                : paginationDto.getPage();

        int size = paginationDto == null || paginationDto.getSize() == 0
                ? 10
                : paginationDto.getSize();

        String sort = paginationDto == null || paginationDto.getSort() == null || paginationDto.getSort().isBlank()
                ? "createdAt"
                : paginationDto.getSort();

        boolean asc = paginationDto != null && paginationDto.getAsc() != null && paginationDto.getAsc();

        if (!getSortFilters().contains(sort)) {
            throw new IllegalArgumentException("Invalid sort parameter: " + sort + ". Must be one of: " + getSortFilters());
        }

        return (size > 0)
                ? PageRequest.of(
                page - 1,
                size,
                Sort.by(
                        asc ? Sort.Order.asc(Objects.requireNonNull(sortingMap.get(sort))) : Sort.Order.desc(Objects.requireNonNull(sortingMap.get(sort))),
                        Sort.Order.asc("createdAt")
                )
        ) : Pageable.unpaged();
    }
}
