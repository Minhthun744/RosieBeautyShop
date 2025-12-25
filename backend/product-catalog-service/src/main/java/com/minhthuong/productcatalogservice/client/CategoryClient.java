package com.minhthuong.productcatalogservice.client;

import com.minhthuong.productcatalogservice.dto.CategoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client to call category-service through Eureka / API-Gateway
 */
@FeignClient(name = "CATEGORY-SERVICE")
public interface CategoryClient {

    @GetMapping("/api/categories/{id}")
    CategoryDto getCategoryById(@PathVariable("id") Long id);

    @PostMapping("/api/categories")
    CategoryDto createCategory(@RequestBody CategoryDto categoryDto);
}
