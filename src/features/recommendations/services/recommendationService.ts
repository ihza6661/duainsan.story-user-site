import api from '@/lib/api';
import type { Product } from '@/features/product/services/productService';

export interface RecommendationResponse {
  message: string;
  data: Product[];
}

/**
 * Get personalized recommendations for authenticated user
 * Falls back to popular products for guests
 */
export const getPersonalizedRecommendations = async (): Promise<RecommendationResponse> => {
  const response = await api.get('/recommendations/personalized');
  return response.data;
};

/**
 * Get popular products (most ordered)
 */
export const getPopularProducts = async (): Promise<RecommendationResponse> => {
  const response = await api.get('/recommendations/popular');
  return response.data;
};

/**
 * Get similar products based on category
 * @param productId The product ID to find similar products for
 */
export const getSimilarProducts = async (productId: number): Promise<RecommendationResponse> => {
  const response = await api.get(`/recommendations/similar/${productId}`);
  return response.data;
};

/**
 * Get trending products (recently popular)
 */
export const getTrendingProducts = async (): Promise<RecommendationResponse> => {
  const response = await api.get('/recommendations/trending');
  return response.data;
};

/**
 * Get new arrivals (recently added products)
 */
export const getNewArrivals = async (): Promise<RecommendationResponse> => {
  const response = await api.get('/recommendations/new-arrivals');
  return response.data;
};
