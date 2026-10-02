package com.project.lms.backend.service;

import com.project.lms.backend.dto.AuthorDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AuthorService {

    AuthorDto addNew(AuthorDto authorDto);

    Page<AuthorDto> getAll(String name, int page, int size, String sort, Boolean asc);

    AuthorDto getOne(Long id);

    AuthorDto updateOne(Long id, AuthorDto authorDto);

    void deleteOne(Long id);

    List<String> getSortFilters();
}
