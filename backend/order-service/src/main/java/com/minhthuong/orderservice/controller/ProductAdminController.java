package com.minhthuong.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minhthuong.orderservice.domain.Product;
import com.minhthuong.orderservice.service.OrderService;
import com.minhthuong.orderservice.feignclient.ProductClient;

@RestController
@RequestMapping("/api/order-service/admin/products")
public class ProductAdminController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductClient productClient;

    // API kiểm tra sản phẩm có thể xóa không
    @GetMapping("/{id}/can-delete")
    public ResponseEntity<Boolean> canDeleteProduct(@PathVariable("id") Long productId) {
        // Kiểm tra sản phẩm có tồn tại không
        Product product = productClient.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        // Nếu sản phẩm chưa từng có đơn hàng nào thì cho phép xóa
        boolean hasOrder = orderService.existsOrderWithProductId(productId);
        return ResponseEntity.ok(!hasOrder);
    }
}
