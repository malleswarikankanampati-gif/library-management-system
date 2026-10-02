package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.entity.Book;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.BookRepository;
import com.project.lms.backend.service.AuthService;
import com.project.lms.backend.service.BookService;
import com.project.lms.backend.service.BorrowService;
import com.project.lms.backend.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class BookServiceImpl implements BookService {

    private final List<String> sortingList =
            List.of("book_id", "available_copies", "publication_year", "publisher", "summary", "title", "total_copies");

    private final BookRepository bookRepository;
    private final WishlistService wishlistService;
    private final AuthService authService;
    private final BorrowService borrowService;
    private final BookMapper bookMapper;

    @Override
    public BookDto addNew(BookDto bookDto) {
        return bookMapper.entityToDto(bookRepository.save(bookMapper.dtoToEntity(bookDto)));
    }

    @Override
    public List<BookDto> getAll() {
        List<Book> bookSet = bookRepository.findAllByOrderByTitleAsc();
        List<BookDto> bookDtoSet = new ArrayList<>();

        for (Book book : bookSet) {
            bookDtoSet.add(bookMapper.entityToDto(book));
        }

        return bookDtoSet;
    }

    @Override
    public BookDto getOne(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );
        return enrich(bookMapper.entityToDto(book));
    }

    @Override
    public BookDto updateOne(Long id, BookDto bookDto) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );
        bookDto.setBookId(id);

        if (bookDto.getBookCoverImg() == null || bookDto.getBookCoverImg().isEmpty()) {
            bookDto.setBookCoverImg(book.getBookCoverImg());
        }
        return addNew(bookDto);
    }

    @Override
    public void deleteOne(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );
        bookRepository.delete(book);
    }

    @Override
    public BookDto increaseAvailableCopies(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );

        if (book.getAvailableCopies() == book.getTotalCopies()) {
            throw new RuntimeException("Available copies can not be greater than total copies");
        }
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        return bookMapper.entityToDto(bookRepository.save(book));

    }

    @Override
    public BookDto decreaseAvailableCopies(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );

        if (book.getAvailableCopies() == 0) {
            throw new RuntimeException("Available copies can not be less than 0");
        }
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        return bookMapper.entityToDto(bookRepository.save(book));
    }

    @Override
    public BookDto increaseTotalCopies(Long id, Integer amount) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );

        book.setAvailableCopies(book.getAvailableCopies() + amount);
        book.setTotalCopies(book.getTotalCopies() + amount);
        return bookMapper.entityToDto(bookRepository.save(book));
    }

    @Override
    public BookDto decreaseTotalCopies(Long id, Integer amount) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with id: " + id)
        );

        if (book.getAvailableCopies() < amount) {
            throw new RuntimeException("Available copies can not be less than 0");
        }
        book.setAvailableCopies(book.getAvailableCopies() - amount);
        book.setTotalCopies(book.getTotalCopies() - amount);
        return bookMapper.entityToDto(bookRepository.save(book));
    }

    @Override
    public Page<BookDto> getAllByDrawerFilters(
            String title,
            List<Long> authorIds,
            List<Long> categoriesIds,
            String publisher,
            Integer fromDate,
            Integer tillDate,
            Integer availableCopies,
            int page,
            int size,
            String sort,
            Boolean asc) {

        if (title != null) {
            title = title.trim();
        }
        if (sort != null && !sortingList.contains(sort)) {
            throw new RuntimeException("Invalid sort parameter: " + sort + ". Sorting should be for: " + sortingList);
        }

        // Normalize null numeric filters
        if (fromDate == null) fromDate = 0;
        if (tillDate == null) tillDate = Integer.MAX_VALUE;
        if (availableCopies == null) availableCopies = 0;

        Pageable pageable = (size > 0)
                ? PageRequest.of(
                page > 0 ? page - 1 : 0,
                size,
                Sort.by(
                        asc ? Sort.Order.asc(Objects.requireNonNull(sort)) : Sort.Order.desc(Objects.requireNonNull(sort)),
                        Sort.Order.asc("title")
                )
        ) : Pageable.unpaged();

        if ((authorIds == null || authorIds.isEmpty()) && (categoriesIds == null || categoriesIds.isEmpty())) {
            Page<Book> bookSet = bookRepository.findAllByDrawerFiltersWithoutAuthorAndCategory(
                    title, publisher, fromDate, tillDate, availableCopies, pageable);
            return bookSet.map(bookMapper::entityToDto);
        }

        if (authorIds == null || authorIds.isEmpty()) {
            Page<Book> bookSet = bookRepository.findAllByDrawerFiltersWithoutAuthor(
                    title, categoriesIds, publisher, fromDate, tillDate, availableCopies, pageable);
            return bookSet.map(bookMapper::entityToDto);
        }

        if (categoriesIds == null || categoriesIds.isEmpty()) {
            Page<Book> bookSet = bookRepository.findAllByDrawerFiltersWithoutCategory(
                    title, authorIds, publisher, fromDate, tillDate, availableCopies, pageable);
            return bookSet.map(bookMapper::entityToDto);
        }

        Page<Book> bookSet = bookRepository.findAllByDrawerFilters(
                title, authorIds, categoriesIds, publisher, fromDate, tillDate, availableCopies, pageable);
        return bookSet.map(bookMapper::entityToDto);
    }

    @Override
    public List<String> getSortFilters() {
        return sortingList;
    }

    private BookDto enrich(BookDto bookDto) {
        Long memberId = authService.getMemberDetails().getMemberId();

        bookDto.setBorrowedDays(borrowService.getBorrowedDays(memberId, bookDto.getBookId()));
        bookDto.setIsWishlist(wishlistService.isWishlist(memberId, bookDto.getBookId()));

        return bookDto;
    }

}






























