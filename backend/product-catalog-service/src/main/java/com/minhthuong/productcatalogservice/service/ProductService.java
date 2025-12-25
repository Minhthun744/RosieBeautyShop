package com.minhthuong.productcatalogservice.service;

import java.util.List;
import java.math.BigDecimal;

import com.minhthuong.productcatalogservice.entity.Product;

public interface ProductService {
    public List<Product> getAllProduct();

    public List<Product> getAllProductByCategoryId(Long categoryId);

    public Product getProductById(Long id);

    public List<Product> getAllProductsByName(String name);

    public Product addProduct(Product product);

    public Product updateProduct(Long id, Product product);

    public void deleteProduct(Long productId);

    public List<Product> searchProducts(String name, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy, String sortDirection);

    // Thêm method kiểm tra sản phẩm có thể xoá không
    public boolean canDeleteProduct(Long productId);
}

