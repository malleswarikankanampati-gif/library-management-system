package com.project.lms.backend.service;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    CategoryDto addNew(CategoryDto categoryDto);

    List<CategoryDto> getAll();

    List<CategoryDto> getAllLikeName(String name);

    CategoryDto getOne(Long id);

    CategoryDto updateOne(Long id, CategoryDto categoryDto);

    void deleteOne(Long id);

    List<BookDto> getBooksByCategory(Long id);
}
