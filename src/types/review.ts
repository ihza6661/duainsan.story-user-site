// src/types/review.ts

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  is_approved: boolean;
  is_featured: boolean;
  helpful_count: number;
  admin_response: string | null;
  admin_responded_at: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    full_name: string;
  };
  product: {
    id: number;
    name: string;
  };
  admin_responder?: {
    id: number;
    full_name: string;
  };
  images: ReviewImage[];
}

export interface ReviewImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface ReviewResponse {
  message: string;
  data: Review;
}

export interface ReviewListResponse {
  message: string;
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RatingSummary {
  total_reviews: number;
  average_rating: number;
  rating_breakdown: {
    [key: number]: {
      count: number;
      percentage: number;
    };
  };
}

export interface RatingSummaryResponse {
  message: string;
  data: RatingSummary;
}

export interface CreateReviewRequest {
  order_item_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  images?: File[];
}

export interface UpdateReviewRequest {
  rating: number;
  comment?: string;
  images?: File[];
}

export type ReviewSortOption = 'latest' | 'helpful' | 'highest' | 'lowest';

export interface ReviewFilters {
  rating?: number;
  with_images?: boolean;
  sort_by?: ReviewSortOption;
  per_page?: number;
  page?: number;
}
