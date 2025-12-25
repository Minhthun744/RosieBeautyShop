package com.minhthuong.productcatalogservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "order-service", url = "http://localhost:8082") // Cập nhật URL nếu cần
public interface OrderServiceClient {
    @GetMapping("/orders/exists-by-product")
    boolean existsOrderWithProductId(@RequestParam("productId") Long productId);
}
