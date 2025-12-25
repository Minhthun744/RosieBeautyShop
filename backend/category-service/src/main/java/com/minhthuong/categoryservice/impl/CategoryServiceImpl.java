package com.minhthuong.categoryservice.impl;

import com.minhthuong.categoryservice.dto.CategoryDTO;
import com.minhthuong.categoryservice.exception.ResourceNotFoundException;
import com.minhthuong.categoryservice.mapper.CategoryMapper;
import com.minhthuong.categoryservice.model.Category;
import com.minhthuong.categoryservice.repository.CategoryRepository;
import com.minhthuong.categoryservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + name));
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category with name " + categoryDTO.getName() + " already exists");
        }
        Category category = categoryMapper.toEntity(categoryDTO);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        if (!existingCategory.getName().equals(categoryDTO.getName()) && 
            categoryRepository.existsByName(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category with name " + categoryDTO.getName() + " already exists");
        }
        
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());
        existingCategory.setActive(categoryDTO.isActive());
        
        return categoryMapper.toDto(categoryRepository.save(existingCategory));
    }

    @Override
@Transactional
public void deleteCategory(Long id) {
    if (!categoryRepository.existsById(id)) {
        throw new ResourceNotFoundException("Category not found with id: " + id);
    }
    // Kiểm tra tồn tại sản phẩm thuộc category này thông qua Feign client hoặc REST
    if (hasProductInCategory(id)) {
        throw new IllegalStateException("Không thể xoá category vì đã có sản phẩm thuộc category này!");
    }
    categoryRepository.deleteById(id);
}

@Autowired
private org.springframework.web.client.RestTemplate restTemplate;

private boolean hasProductInCategory(Long categoryId) {
    String url = "http://localhost:8081/api/products/by-category/" + categoryId;
    try {
        java.util.List<?> products = restTemplate.getForObject(url, java.util.List.class);
        return products != null && !products.isEmpty();
    } catch (Exception e) {
        // Nếu có lỗi khi gọi service khác, mặc định KHÔNG cho xoá để tránh mất dữ liệu
        return true;
    }
}
}