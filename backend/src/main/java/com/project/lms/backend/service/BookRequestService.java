package com.project.lms.backend.service;

import com.project.lms.backend.dto.BookRequestDto;

import java.util.List;

public interface BookRequestService {

    BookRequestDto addNew(BookRequestDto bookRequestDto);

    List<BookRequestDto> getAll();

    List<BookRequestDto> getAllIncomplete();

    BookRequestDto getOne(Long id);

    BookRequestDto updateOne(Long id, BookRequestDto bookRequestDto);

    void deleteOne(Long id);

    BookRequestDto setCompleted(Long id);

    List<BookRequestDto> getBookRequestsByMember(Long id);
}
