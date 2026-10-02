package com.project.lms.backend.mapper;

import com.project.lms.backend.dto.*;
import com.project.lms.backend.entity.*;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.repository.AuthorRepository;
import com.project.lms.backend.repository.BookRepository;
import com.project.lms.backend.repository.CategoryRepository;
import com.project.lms.backend.repository.MemberRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BookMapper extends ModelMapper {

    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;

    @Value("${server.url}")
    private String serverUrl;

    public BookMapper(AuthorRepository authorRepository, CategoryRepository categoryRepository, MemberRepository memberRepository, BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.memberRepository = memberRepository;
        this.bookRepository = bookRepository;
    }

    public BookRequest BookRequestDtoToEntity(BookRequestDto bookRequestDto) {
        BookRequest request = map(bookRequestDto, BookRequest.class);
        Member member = memberRepository.findById(bookRequestDto.getMemberId()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with ID: " + bookRequestDto.getMemberId())
        );
        request.setMember(member);
        return request;
    }

    public AuthorDto AuthorEntityToDto(Author author) {
        AuthorDto authorDto = map(author, AuthorDto.class);
        authorDto.setAuthorImg(serverUrl + author.getAuthorImg());
        return authorDto;
    }


    // Convert Book JPA Entity into BookDto
    public BookDto entityToDto(Book book) {
        BookDto bookDto = map(book, BookDto.class);
        bookDto.setBookCoverImg(serverUrl + book.getBookCoverImg());
        bookDto.setAuthorId(book.getAuthor().getAuthorId());
        bookDto.setAuthorName(book.getAuthor().getName());
        bookDto.setCategoryIds(
                book.getCategories().stream()
                        .map(Category::getCategoryId).collect(Collectors.toSet())
        );
        bookDto.setCategoryDtos(
                book.getCategories().stream()
                        .sorted(Comparator.comparing(Category::getName))
                        .map(category -> map(category, CategoryDto.class)).collect(Collectors.toList())
        );
        return bookDto;
    }


    // Convert BookDto into Book JPA Entity
    public Book dtoToEntity(BookDto bookDto) {
        Author author = authorRepository.findById(bookDto.getAuthorId()).orElseThrow(
                () -> new ResourceNotFoundException("Author not found with id: " + bookDto.getAuthorId())
        );

        Set<Category> categorySet = bookDto.getCategoryIds().stream().map(cId -> categoryRepository.findById(cId).orElseThrow(
                () -> new ResourceNotFoundException("Category not found with id: " + cId)
        )).collect(Collectors.toSet());

        Book book = map(bookDto, Book.class);
        book.setAuthor(author);
        book.setCategories(categorySet);
        return book;
    }

    public Wishlist WishlistDtoToEntity(WishlistDto wishlistDto) {
        Wishlist wishlist = map(wishlistDto, Wishlist.class);

        Member member = memberRepository.findById(wishlistDto.getMemberId()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with ID: " + wishlistDto.getMemberId()));

        Book book = bookRepository.findById(wishlistDto.getBookId()).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with ID: " + wishlistDto.getBookId()));

        wishlist.setMember(member);
        wishlist.setBook(book);
        return wishlist;
    }

    public Borrow BorrowDtoToEntity(BorrowDto borrowDto) {
        Borrow borrow = map(borrowDto, Borrow.class);

        Member member = memberRepository.findById(borrowDto.getMemberId()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with ID: " + borrowDto.getMemberId()));

        Book book = bookRepository.findById(borrowDto.getBookId()).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with ID: " + borrowDto.getBookId()));

        borrow.setMember(member);
        borrow.setBook(book);
        return borrow;
    }

    public BorrowHistoryDto BorrowHistoryEntityToDto(BorrowHistory borrowHistory) {
        BorrowHistoryDto borrowHistoryDto = map(borrowHistory, BorrowHistoryDto.class);
        borrowHistoryDto.setFirstName(borrowHistory.getMember().getFirstName());
        borrowHistoryDto.setLastName(borrowHistory.getMember().getLastName());
        borrowHistoryDto.setTitle(borrowHistory.getBook().getTitle());
        borrowHistoryDto.setAuthorId(borrowHistory.getBook().getAuthor().getAuthorId());
        borrowHistoryDto.setAuthorName(borrowHistory.getBook().getAuthor().getName());
        return borrowHistoryDto;
    }

    public BorrowHistory BorrowHistoryDtoToEntity(BorrowHistoryDto borrowHistoryDto) {
        BorrowHistory borrowHistory = map(borrowHistoryDto, BorrowHistory.class);
        Member member = memberRepository.findById(borrowHistoryDto.getMemberId()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with ID: " + borrowHistoryDto.getMemberId()));
        Book book = bookRepository.findById(borrowHistoryDto.getBookId()).orElseThrow(
                () -> new ResourceNotFoundException("Book not found with ID: " + borrowHistoryDto.getBookId()));
        borrowHistory.setMember(member);
        borrowHistory.setBook(book);
        return borrowHistory;
    }

    public MemberDto MemberEntityToDto(Member member) {
        MemberDto memberDto = map(member, MemberDto.class);
        if (!isNullOrBlank(member.getMemberImg()) && !member.getMemberImg().startsWith("http")) {
            memberDto.setMemberImg(serverUrl + member.getMemberImg());
        }
        memberDto.setIsPasswordSet(!isNullOrBlank(member.getPassword()));
        memberDto.setRoleNames(member.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet()));
        memberDto.setPassword(null);
        return memberDto;
    }

    private boolean isNullOrBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
















