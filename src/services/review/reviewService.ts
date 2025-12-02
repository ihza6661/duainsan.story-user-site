// src/services/review/reviewService.ts

import apiClient from "@/lib/api";
import {
  Review,
  ReviewResponse,
  ReviewListResponse,
  RatingSummaryResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewFilters,
} from "@/types/review";

/**
 * Get reviews for a specific product (public).
 */
export const getProductReviews = async (
  productId: number,
  filters?: ReviewFilters
): Promise<ReviewListResponse> => {
  const params = new URLSearchParams();

  if (filters?.rating) params.append("rating", filters.rating.toString());
  if (filters?.with_images) params.append("with_images", "true");
  if (filters?.sort_by) params.append("sort_by", filters.sort_by);
  if (filters?.per_page) params.append("per_page", filters.per_page.toString());
  if (filters?.page) params.append("page", filters.page.toString());

  const response = await apiClient.get<ReviewListResponse>(
    `/v1/customer/products/${productId}/reviews?${params.toString()}`
  );

  return response.data;
};

/**
 * Get rating summary for a specific product (public).
 */
export const getProductRatingSummary = async (
  productId: number
): Promise<RatingSummaryResponse> => {
  const response = await apiClient.get<RatingSummaryResponse>(
    `/v1/customer/products/${productId}/reviews/summary`
  );

  return response.data;
};

/**
 * Get a single review by ID (public).
 */
export const getReviewById = async (reviewId: number): Promise<ReviewResponse> => {
  const response = await apiClient.get<ReviewResponse>(
    `/v1/customer/reviews/${reviewId}`
  );

  return response.data;
};

/**
 * Mark a review as helpful (public).
 */
export const markReviewAsHelpful = async (reviewId: number): Promise<ReviewResponse> => {
  const response = await apiClient.post<ReviewResponse>(
    `/v1/customer/reviews/${reviewId}/helpful`
  );

  return response.data;
};

/**
 * Get the authenticated customer's own reviews.
 * Requires authentication.
 */
export const getMyReviews = async (page?: number): Promise<ReviewListResponse> => {
  const params = page ? `?page=${page}` : "";
  const response = await apiClient.get<ReviewListResponse>(
    `/v1/reviews/my${params}`
  );

  return response.data;
};

/**
 * Create a new review.
 * Requires authentication.
 */
export const createReview = async (
  data: CreateReviewRequest
): Promise<ReviewResponse> => {
  const formData = new FormData();

  formData.append("order_item_id", data.order_item_id.toString());
  formData.append("product_id", data.product_id.toString());
  formData.append("rating", data.rating.toString());

  if (data.comment) {
    formData.append("comment", data.comment);
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
  }

  const response = await apiClient.post<ReviewResponse>("/v1/reviews", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Update an existing review.
 * Requires authentication.
 */
export const updateReview = async (
  reviewId: number,
  data: UpdateReviewRequest
): Promise<ReviewResponse> => {
  const formData = new FormData();

  formData.append("rating", data.rating.toString());

  if (data.comment) {
    formData.append("comment", data.comment);
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
  }

  // Use POST with _method override for Laravel PUT with FormData
  formData.append("_method", "PUT");

  const response = await apiClient.post<ReviewResponse>(
    `/v1/reviews/${reviewId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/**
 * Delete a review.
 * Requires authentication.
 */
export const deleteReview = async (reviewId: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/reviews/${reviewId}`
  );

  return response.data;
};
