package com.project.lms.backend.service;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.WishlistDto;

import java.util.List;

public interface WishlistService {
    WishlistDto addNew(WishlistDto wishlistDto);

    List<BookDto> getWishlistBooksByMember(Long id);

    Boolean isWishlist(Long memberId, Long bookId);

    void deleteOne(WishlistDto wishlistDto);
}
