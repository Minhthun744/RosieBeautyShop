package com.minhthuong.categoryservice.mapper;

import com.minhthuong.categoryservice.dto.CategoryDTO;
import com.minhthuong.categoryservice.model.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-08T17:14:15+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDTO toDto(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();

        categoryDTO.setId( category.getId() );
        categoryDTO.setActive( category.isActive() );
        categoryDTO.setCreatedAt( category.getCreatedAt() );
        categoryDTO.setDescription( category.getDescription() );
        categoryDTO.setName( category.getName() );
        categoryDTO.setUpdatedAt( category.getUpdatedAt() );

        return categoryDTO;
    }

    @Override
    public Category toEntity(CategoryDTO categoryDTO) {
        if ( categoryDTO == null ) {
            return null;
        }

        Category category = new Category();

        category.setId( categoryDTO.getId() );
        category.setCreatedAt( categoryDTO.getCreatedAt() );
        category.setUpdatedAt( categoryDTO.getUpdatedAt() );
        category.setActive( categoryDTO.isActive() );
        category.setDescription( categoryDTO.getDescription() );
        category.setName( categoryDTO.getName() );

        return category;
    }
}
