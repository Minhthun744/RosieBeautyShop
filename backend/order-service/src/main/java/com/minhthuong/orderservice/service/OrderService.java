package com.minhthuong.orderservice.service;

import com.minhthuong.orderservice.domain.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    public Order saveOrder(Order order);
    public List<Order> findAllOrders();
    public Optional<Order> findById(Long id);
    boolean existsOrderWithProductId(Long productId);
}
