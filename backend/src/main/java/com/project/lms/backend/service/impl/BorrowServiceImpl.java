package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.*;
import com.project.lms.backend.entity.Book;
import com.project.lms.backend.entity.Borrow;
import com.project.lms.backend.entity.BorrowHistory;
import com.project.lms.backend.entity.Member;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.BorrowRepository;
import com.project.lms.backend.service.AuthService;
import com.project.lms.backend.service.BookService;
import com.project.lms.backend.service.BorrowHistoryService;
import com.project.lms.backend.service.BorrowService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BorrowServiceImpl implements BorrowService {

    private final BookMapper modelMapper;
    private final BorrowRepository borrowRepository;
    private final BorrowHistoryService borrowHistoryService;
    private final AuthService authService;

    @Override
    public BorrowDto addNew(BorrowDto borrowDto, BookService bookService) {

        borrowRepository.findByMemberIdAndBookId(borrowDto.getMemberId(), borrowDto.getBookId()).ifPresent(w -> {
            throw new RuntimeException("Borrow entry already exists");
        });

        Borrow entity = modelMapper.BorrowDtoToEntity(borrowDto);
        Borrow save = borrowRepository.save(entity);
        bookService.decreaseAvailableCopies(borrowDto.getBookId());

        BorrowHistoryDto borrowHistoryDto = new BorrowHistoryDto(
                borrowDto.getMemberId(), borrowDto.getBookId(), BorrowHistory.ActivityType.BORROW, null);
        borrowHistoryService.createNew(borrowHistoryDto);

        return modelMapper.map(save, BorrowDto.class);
    }

    @Override
    public Page<BookDto> getBorrowBooksByMember(Long id, int limit) {
        Pageable pageable = (limit > 0) ? PageRequest.of(0, limit) : Pageable.unpaged();

        return borrowRepository
                .getBorrowBooksByMember(id, pageable)
                .map(book -> {
                    BookDto dto = modelMapper.entityToDto(book);
                    dto.setBorrowedDays(getBorrowedDays(id, dto.getBookId()));
                    return dto;
                });
    }

    @Override
    public Long getBorrowedDays(Long memberId, Long bookId) {
        if (memberId == null) {
            return (long) -1;
        }
        Optional<Borrow> optionalBorrow = borrowRepository.findByMemberIdAndBookId(memberId, bookId);
        if (optionalBorrow.isEmpty()) {
            return (long) -1;
        }
        Borrow borrow = optionalBorrow.get();
        return ChronoUnit.DAYS.between(borrow.getCreatedAt().toLocalDate(), LocalDate.now());
    }

    @Override
    public void deleteOne(BorrowDto borrowDto, BookService bookService) {
        MemberDto memberDetails = authService.getMemberDetails();
        Borrow borrow = borrowRepository.findByMemberIdAndBookId(memberDetails.getMemberId(), borrowDto.getBookId()).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Borrow entry not found with member id: " + borrowDto.getMemberId() + " and book id: " + borrowDto.getBookId()));

        BorrowHistoryDto borrowHistoryDto = new BorrowHistoryDto(
                borrowDto.getMemberId(),
                borrowDto.getBookId(),
                BorrowHistory.ActivityType.RETURN,
                getBorrowedDays(borrowDto.getMemberId(), borrowDto.getBookId())
        );

        borrowHistoryService.createNew(borrowHistoryDto);

        borrowRepository.delete(borrow);
        bookService.increaseAvailableCopies(borrowDto.getBookId());
    }

    @Override
    public List<MemberDto> getMembersByBorrowedBook(Long id) {
        return borrowRepository.getMembersByBorrowedBook(id).stream().map(
                modelMapper::MemberEntityToDto
        ).toList();
    }

    @Override
    public List<PendingBorrowDto> getAllPendingBorrow() {
        return borrowRepository.getAllPendingBorrow().stream()
                .map(b -> {
                            Book book = b.getBook();
                            BookDto bookDto = modelMapper.entityToDto(book);
                            bookDto.setBorrowedDays(ChronoUnit.DAYS.between(b.getCreatedAt().toLocalDate(), LocalDate.now()));
                            Member member = b.getMember();
                            MemberDto memberDto = modelMapper.MemberEntityToDto(member);
                            return new PendingBorrowDto(bookDto, memberDto);
                        }
                )
                .toList();
    }
}
