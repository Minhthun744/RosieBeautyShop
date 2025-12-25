package com.minhthuong.productcatalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.minhthuong.productcatalogservice.entity.Product;

import java.util.List;
import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
       public List<Product> findAllByCategoryId(Long categoryId);

       public List<Product> findAllByProductName(String name);

       @Query("SELECT p FROM Product p WHERE " +
                     "(:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
                     "(:categoryId IS NULL OR p.categoryId = :categoryId) AND " +
                     "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
                     "(:maxPrice IS NULL OR p.price <= :maxPrice)")
       public List<Product> searchProducts(
                     @Param("name") String name,
                     @Param("categoryId") Long categoryId,
                     @Param("minPrice") BigDecimal minPrice,
                     @Param("maxPrice") BigDecimal maxPrice,
                     Sort sort);
}