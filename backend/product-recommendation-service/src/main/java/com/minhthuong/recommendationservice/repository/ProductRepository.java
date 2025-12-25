package com.minhthuong.recommendationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minhthuong.recommendationservice.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
