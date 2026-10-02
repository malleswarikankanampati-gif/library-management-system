package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.BookRequestDto;
import com.project.lms.backend.entity.BookRequest;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.BookRepository;
import com.project.lms.backend.repository.BookRequestRepository;
import com.project.lms.backend.service.BookRequestService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BookRequestServiceImpl implements BookRequestService {

    private final BookMapper modelMapper;
    private final BookRequestRepository bookRequestRepository;
    private final BookRepository bookRepository;

    @Override
    public BookRequestDto addNew(BookRequestDto bookRequestDto) {
        if (bookRequestDto.getMemberId() == null || bookRequestDto.getMemberId() == 0) {
            throw new ResourceNotFoundException("Member ID cannot be null or 0");
        }
        if (!bookRepository.findAllByTitleAndAuthorName(bookRequestDto.getBookTitle(), bookRequestDto.getAuthor()).isEmpty()) {
            throw new RuntimeException("Book already exists in our collection");
        }
        if (!bookRequestRepository.findAllByBookTitleIgnoreCaseAndAuthorIgnoreCase(bookRequestDto.getBookTitle(), bookRequestDto.getAuthor()).isEmpty()) {
            throw new RuntimeException("Book request already exists. We are working on it.");
        }

        BookRequest entity = modelMapper.BookRequestDtoToEntity(bookRequestDto);
        if (entity.getIsCompleted() == null) {
            entity.setIsCompleted(false);
        }
        return modelMapper.map(bookRequestRepository.save(entity), BookRequestDto.class);
    }

    @Override
    public List<BookRequestDto> getAll() {
        return bookRequestRepository.findAllByOrderByIsCompletedDescCreatedAtAsc().stream().map(
                e -> modelMapper.map(e, BookRequestDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<BookRequestDto> getAllIncomplete() {
        return bookRequestRepository.findAllByIsCompletedFalseOrderByCreatedAtAsc().stream()
                .map(e -> modelMapper.map(e, BookRequestDto.class)).collect(Collectors.toList());
    }

    @Override
    public BookRequestDto getOne(Long id) {
        return modelMapper.map(bookRequestRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book request not found with id: " + id)
        ), BookRequestDto.class);
    }

    @Override
    public BookRequestDto updateOne(Long id, BookRequestDto bookRequestDto) {
        BookRequest bookRequest = bookRequestRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book request not found with id: " + id));

        if (bookRequestDto.getMemberId() == null || bookRequestDto.getMemberId() == 0) {
            throw new ResourceNotFoundException("Member ID cannot be null or 0");
        }
        if (!Objects.equals(bookRequest.getMember().getMemberId(), bookRequestDto.getMemberId())) {
            throw new RuntimeException("You are not authorized to modify this book request");
        }
        if (!bookRepository.findAllByTitleAndAuthorName(bookRequestDto.getBookTitle(), bookRequestDto.getAuthor()).isEmpty()) {
            throw new RuntimeException("Book already exists in our collection");
        }
        if (!bookRequestRepository.findAllByBookTitleIgnoreCaseAndAuthorIgnoreCase(bookRequestDto.getBookTitle(), bookRequestDto.getAuthor()).isEmpty()) {
            throw new RuntimeException("Book request already exists. We are working on it.");
        }

        bookRequestDto.setId(id);
        if (bookRequestDto.getIsCompleted() == null) {
            bookRequestDto.setIsCompleted(false);
        }
        return modelMapper.map(bookRequestRepository.save(modelMapper.BookRequestDtoToEntity(bookRequestDto)), BookRequestDto.class);
    }

    @Override
    public void deleteOne(Long id) {
        BookRequest bookRequest = bookRequestRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book request not found with id: " + id));
        bookRequestRepository.delete(bookRequest);
    }

    @Override
    public BookRequestDto setCompleted(Long id) {
        BookRequest bookRequest = bookRequestRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book request not found with id: " + id));
        bookRequest.setIsCompleted(!bookRequest.getIsCompleted());
        return modelMapper.map(bookRequestRepository.save(bookRequest), BookRequestDto.class);
    }

    @Override
    public List<BookRequestDto> getBookRequestsByMember(Long id) {
        List<BookRequest> bookRequests = bookRequestRepository.findBookRequestsByMemberId(id);
        return bookRequests.stream().map(e -> modelMapper.map(e, BookRequestDto.class)).collect(Collectors.toList());
    }
}
