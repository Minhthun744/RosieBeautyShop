package com.minhthuong.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minhthuong.orderservice.domain.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByProductId(Long productId);
}
