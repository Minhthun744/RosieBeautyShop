package com.minhthuong.productcatalogservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.minhthuong.productcatalogservice.entity.Product;
import com.minhthuong.productcatalogservice.http.header.HeaderGenerator;
import com.minhthuong.productcatalogservice.service.ProductService;
import com.minhthuong.productcatalogservice.client.CategoryClient;
import com.minhthuong.productcatalogservice.dto.CategoryDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @Autowired
    private CategoryClient categoryClient;

    @GetMapping(value = "/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProduct();
        products.forEach(p -> {
            try {
                CategoryDto dto = categoryClient.getCategoryById(p.getCategoryId());
                if (dto != null) p.setCategoryName(dto.getName());
            } catch (Exception ignored) {}
        });
        if (!products.isEmpty()) {
            return new ResponseEntity<List<Product>>(
                    products,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/products", params = "categoryId")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam("categoryId") Long categoryId) {
        List<Product> products = productService.getAllProductByCategoryId(categoryId);
        products.forEach(p -> p.setCategoryName(categoryClient.getCategoryById(categoryId).getName()));
        if (!products.isEmpty()) {
            return new ResponseEntity<List<Product>>(
                    products,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable("id") long id) {
        Product product = productService.getProductById(id);
        if(product!=null){
            try{
                CategoryDto dto = categoryClient.getCategoryById(product.getCategoryId());
                if(dto!=null) product.setCategoryName(dto.getName());
            }catch(Exception ignored){}
        }
        if (product != null) {
            return new ResponseEntity<Product>(
                    product,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam("name") String name) {
        List<Product> products = productService.getAllProductsByName(name);
        if (!products.isEmpty()) {
            return new ResponseEntity<List<Product>>(
                    products,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/products/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "minPrice", required = false) String minPrice,
            @RequestParam(value = "maxPrice", required = false) String maxPrice,
            @RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDirection", required = false, defaultValue = "asc") String sortDirection) {

        try {
            BigDecimal minPriceBD = minPrice != null ? new BigDecimal(minPrice) : null;
            BigDecimal maxPriceBD = maxPrice != null ? new BigDecimal(maxPrice) : null;

            List<Product> products = productService.searchProducts(name, categoryId, minPriceBD, maxPriceBD, sortBy,
                    sortDirection);

            products.forEach(p -> {
                try {
                    CategoryDto dto = categoryClient.getCategoryById(p.getCategoryId());
                    if (dto != null) p.setCategoryName(dto.getName());
                } catch (Exception ignored) {}
            });

            if (!products.isEmpty()) {
                return new ResponseEntity<>(
                        products,
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            }
            return new ResponseEntity<>(
                    new ArrayList<>(),
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(
                    Collections.singletonMap("error", "Giá trị giá không hợp lệ"),
                    headerGenerator.getHeadersForError(),
                    HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    Collections.singletonMap("error", e.getMessage()),
                    headerGenerator.getHeadersForError(),
                    HttpStatus.BAD_REQUEST);
        }
    }

}
