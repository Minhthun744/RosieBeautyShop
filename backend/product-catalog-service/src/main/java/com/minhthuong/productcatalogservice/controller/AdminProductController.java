package com.minhthuong.productcatalogservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.minhthuong.productcatalogservice.entity.Product;
import com.minhthuong.productcatalogservice.http.header.HeaderGenerator;
import com.minhthuong.productcatalogservice.service.ImageService;
import com.minhthuong.productcatalogservice.service.ProductService;
import com.minhthuong.productcatalogservice.client.CategoryClient;
import com.minhthuong.productcatalogservice.dto.CategoryDto;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @Autowired
    private CategoryClient categoryClient;

    @PostMapping(consumes = { MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Product> addProduct(@RequestParam("productName") String productName,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam(value="categoryId", required = false) Long categoryId,
            @RequestParam("availability") int availability,
            @RequestParam(value="categoryName", required = false) String categoryName,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest request) {
        try {
            // Create product object
            Product product = new Product();
            product.setProductName(productName);
            product.setPrice(price);
            product.setDescription(description);
            product.setAvailability(availability);

            Long resolvedCategoryId = categoryId;
            if(resolvedCategoryId==null){
                // create new category if name provided
                if(categoryName!=null && !categoryName.isBlank()){
                    CategoryDto dto = new CategoryDto();
                    dto.setName(categoryName);
                    dto.setActive(true);
                    CategoryDto created = categoryClient.createCategory(dto);
                    resolvedCategoryId = created.getId();
                } else {
                    return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.BAD_REQUEST);
                }
            }
            product.setCategoryId(resolvedCategoryId);

            // Process main image
            if (image != null && !image.isEmpty()) {
                String imageFileName = imageService.storeImage(image);
                product.setImageUrl(imageFileName);
            }

            Product savedProduct = productService.addProduct(product);
            return new ResponseEntity<>(
                    savedProduct,
                    headerGenerator.getHeadersForSuccessPostMethod(request, savedProduct.getId()),
                    HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    headerGenerator.getHeadersForError(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", consumes = { MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Long id,
            @RequestParam("productName") String productName,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam(value="categoryId", required = false) Long categoryId,
            @RequestParam("availability") int availability,
            @RequestParam(value="categoryName", required = false) String categoryName,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
            }

            // Update product fields
            existingProduct.setProductName(productName);
            existingProduct.setPrice(price);
            existingProduct.setDescription(description);
            existingProduct.setAvailability(availability);

            Long resolvedCategoryId = categoryId;
            if(resolvedCategoryId==null && categoryName!=null && !categoryName.isBlank()){
                CategoryDto dto = new CategoryDto();
                dto.setName(categoryName);
                dto.setActive(true);
                CategoryDto created = categoryClient.createCategory(dto);
                resolvedCategoryId = created.getId();
            }
            if(resolvedCategoryId!=null){
                existingProduct.setCategoryId(resolvedCategoryId);
            }

            // Process main image
            if (image != null && !image.isEmpty()) {
                // Delete old image if it exists
                if (existingProduct.getImageUrl() != null) {
                    imageService.deleteImage(existingProduct.getImageUrl());
                }

                String imageFileName = imageService.storeImage(image);
                existingProduct.setImageUrl(imageFileName);
            }

            Product updatedProduct = productService.updateProduct(id, existingProduct);
            return new ResponseEntity<>(
                    updatedProduct,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    headerGenerator.getHeadersForError(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
            }

            // Delete product image
            if (product.getImageUrl() != null) {
                imageService.deleteImage(product.getImageUrl());
            }

            productService.deleteProduct(id);
            return new ResponseEntity<>(
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    headerGenerator.getHeadersForError(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/can-delete")
    public ResponseEntity<Boolean> canDeleteProduct(@PathVariable("id") Long id) {
        // Gọi service để kiểm tra logic thực tế
        boolean canDelete = productService.canDeleteProduct(id);
        return ResponseEntity.ok(canDelete);
    }
}
