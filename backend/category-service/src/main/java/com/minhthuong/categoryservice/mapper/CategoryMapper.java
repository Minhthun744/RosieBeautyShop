package com.minhthuong.categoryservice.mapper;

import com.minhthuong.categoryservice.dto.CategoryDTO;
import com.minhthuong.categoryservice.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    @Mapping(target = "id", source = "id")
    CategoryDTO toDto(Category category);

    @Mapping(target = "id", source = "id")
    Category toEntity(CategoryDTO categoryDTO);
}