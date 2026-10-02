package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.MemberDto;
import com.project.lms.backend.dto.WishlistDto;
import com.project.lms.backend.entity.Wishlist;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.WishlistRepository;
import com.project.lms.backend.service.AuthService;
import com.project.lms.backend.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookMapper modelMapper;
    private final AuthService authService;

    @Override
    public WishlistDto addNew(WishlistDto wishlistDto) {

        wishlistRepository.findByMemberIdAndBookId(wishlistDto.getMemberId(), wishlistDto.getBookId()).ifPresent(w -> {
            throw new RuntimeException("Wishlist entry already exists");
        });

        return modelMapper.map(wishlistRepository.save(modelMapper.WishlistDtoToEntity(wishlistDto)), WishlistDto.class);
    }

    @Override
    public List<BookDto> getWishlistBooksByMember(Long id) {
        return wishlistRepository.getWishlistBooksByMember(id).stream().map(modelMapper::entityToDto).toList();
    }

    @Override
    public Boolean isWishlist(Long memberId, Long bookId) {
        if (memberId == null) {
            return false;
        }
        return wishlistRepository.findByMemberIdAndBookId(memberId, bookId).isPresent();
    }

    @Override
    public void deleteOne(WishlistDto wishlistDto) {
        MemberDto memberDetails = authService.getMemberDetails();
        Wishlist wishlist = wishlistRepository.findByMemberIdAndBookId(memberDetails.getMemberId(), wishlistDto.getBookId()).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Wishlist not found with member id: " + wishlistDto.getMemberId() + " and book id: " + wishlistDto.getBookId()));
        wishlistRepository.delete(wishlist);
    }
}
