package com.project.lms.backend.service;

import com.project.lms.backend.dto.BookDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookService {

    BookDto addNew(BookDto bookDto);

    List<BookDto> getAll();

    BookDto getOne(Long id);

    BookDto updateOne(Long id, BookDto bookDto);

    void deleteOne(Long id);

    BookDto increaseAvailableCopies(Long id);

    BookDto decreaseAvailableCopies(Long id);

    BookDto increaseTotalCopies(Long id, Integer amount);

    BookDto decreaseTotalCopies(Long id, Integer amount);

    Page<BookDto> getAllByDrawerFilters(String title, List<Long> authorId, List<Long> categoriesIds, String publisher, Integer fromDate, Integer tillDate, Integer availableCopies, int page, int size, String sort, Boolean asc);

    List<String> getSortFilters();
}
