package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.AuthorDto;
import com.project.lms.backend.entity.Author;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.AuthorRepository;
import com.project.lms.backend.service.AuthorService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final List<String> sortingList =
            List.of("authorId", "name", "biography", "dob", "No_of_books");

    private final AuthorRepository authorRepository;
    private final BookMapper modelMapper;

    @Override
    public AuthorDto addNew(AuthorDto authorDto) {
        return modelMapper.map(authorRepository.save(modelMapper.map(authorDto, Author.class)), AuthorDto.class);
    }

    @Override
    public Page<AuthorDto> getAll(String name, int page, int size, String sort, Boolean asc) {
        name = (name == null) ? "" : name.trim();
        asc = asc == null || asc;

        if (sort != null && !sortingList.contains(sort)) {
            throw new IllegalArgumentException("Invalid sort parameter: " + sort + ". Must be one of: " + sortingList);
        }

        Pageable pageable = (size > 0)
                ? PageRequest.of(page > 0 ? page - 1 : 0,
                size)
                : Pageable.unpaged();

        Page<Author> authors;

        if ("No_of_books".equalsIgnoreCase(sort)) {
            authors = authorRepository.findAllOrderByBookCount(name, asc, pageable);
        } else {
            String sortField = (sort == null) ? "name" : sort;

            pageable = (size > 0)
                    ? PageRequest.of(
                    page > 0 ? page - 1 : 0,
                    size,
                    Sort.by(
                            asc ? Sort.Order.asc(sortField) : Sort.Order.desc(sortField)
                    ).and(Sort.by(Sort.Order.asc("name")))
            ) : Pageable.unpaged();

            authors = authorRepository.findByNameLike(name, pageable);
        }

        return authors.map(modelMapper::AuthorEntityToDto);
    }


    @Override
    public AuthorDto getOne(Long id) {
        return modelMapper.AuthorEntityToDto(authorRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Author not found with id: " + id)
        ));
    }

    @Override
    public AuthorDto updateOne(Long id, AuthorDto authorDto) {
        Author author = authorRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Author not found with id: " + id)
        );
        authorDto.setAuthorId(id);

        if (authorDto.getAuthorImg() == null || authorDto.getAuthorImg().isEmpty()) {
            authorDto.setAuthorImg(author.getAuthorImg());
        }

        return addNew(authorDto);
    }

    @Override
    public void deleteOne(Long id) {
        Author author = authorRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Author not found with id: " + id)
        );
        authorRepository.delete(author);
    }

    @Override
    public List<String> getSortFilters() {
        return sortingList;
    }
}
