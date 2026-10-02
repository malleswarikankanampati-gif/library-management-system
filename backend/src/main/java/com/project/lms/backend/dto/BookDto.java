package com.project.lms.backend.dto;

import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BookDto {

    private Long bookId;
    private String title;
    private String summary;
    private String publisher;
    private int publicationYear;
    private int totalCopies;
    private int availableCopies;
    private String bookCoverImg;
    private Long authorId;
    private String authorName;
    private Set<Long> categoryIds;
    private List<CategoryDto> categoryDtos;
    private Boolean isWishlist;
    private Long borrowedDays;  // -1 -> Not borrowed
}
