package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.BookDto;
import com.project.lms.backend.dto.CategoryDto;
import com.project.lms.backend.entity.Book;
import com.project.lms.backend.entity.Category;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.BookRepository;
import com.project.lms.backend.repository.CategoryRepository;
import com.project.lms.backend.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookMapper modelMapper;

    @Override
    public CategoryDto addNew(CategoryDto categoryDto) {
        categoryDto.setName(categoryDto.getName().toUpperCase());
        return modelMapper.map(categoryRepository.save(modelMapper.map(categoryDto, Category.class)), CategoryDto.class);
    }

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream().map(e -> modelMapper.map(e, CategoryDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<CategoryDto> getAllLikeName(String name) {
        return categoryRepository.findAllLikeName(name).stream().map(e -> modelMapper.map(e, CategoryDto.class)).collect(Collectors.toList());
    }

    @Override
    public CategoryDto getOne(Long id) {
        return modelMapper.map(categoryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category not found with id: " + id)
        ), CategoryDto.class);
    }

    @Override
    public CategoryDto updateOne(Long id, CategoryDto categoryDto) {
        getOne(id);
        categoryDto.setCategoryId(id);
        return addNew(categoryDto);
    }

    @Override
    public void deleteOne(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category not found with id: " + id)
        );

        if (category.getBooks() != null) {
            for (Book book : category.getBooks()) {
                bookRepository.delete(book);
            }
        }
        categoryRepository.delete(category);
    }

    @Override
    public List<BookDto> getBooksByCategory(Long id) {
        Set<Book> books = categoryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category not found with id: " + id)).getBooks();

        return books.stream().map(modelMapper::entityToDto).sorted(Comparator.comparing(BookDto::getTitle)).toList();
    }
}
