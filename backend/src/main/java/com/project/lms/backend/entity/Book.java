package com.project.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "books", uniqueConstraints = @UniqueConstraint(columnNames = {"author_id", "title", "summary", "bookCoverImg"}))
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String summary;

    private String publisher;
    private int publicationYear;

    @Column(nullable = false)
    private int totalCopies;

    @Column(nullable = false)
    private int availableCopies;

    private String bookCoverImg;

    @ToString.Exclude
    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "author_id", referencedColumnName = "authorId")
    private Author author;

    @ToString.Exclude
    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "book_category",
            joinColumns = @JoinColumn(name = "book_id", referencedColumnName = "bookId"),
            inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "categoryId")
    )
    private Set<Category> categories;

    @ToString.Exclude
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<Wishlist> wishlists;

    @ToString.Exclude
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<Borrow> borrows;

    @ToString.Exclude
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<BorrowHistory> borrowHistories;
}