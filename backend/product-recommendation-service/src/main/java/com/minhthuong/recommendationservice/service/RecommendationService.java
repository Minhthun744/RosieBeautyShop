package com.minhthuong.recommendationservice.service;

import java.util.List;

import com.minhthuong.recommendationservice.model.Recommendation;

public interface RecommendationService {
    Recommendation getRecommendationById(Long recommendationId);

    Recommendation saveRecommendation(Recommendation recommendation);

    List<Recommendation> getAllRecommendationByProductName(String productName);

    void deleteRecommendation(Long id);
}
