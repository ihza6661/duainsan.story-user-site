/**
 * Shared type definitions for the Dua Insan Story User Site
 */

/**
 * API Error Response structure
 */
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Analytics Item for tracking e-commerce events
 */
export interface AnalyticsItem {
  id: string | number;
  name: string;
  category?: string;
  quantity: number;
  price: number;
  brand?: string;
  variant?: string;
}

/**
 * Cart Item structure
 */
export interface CartItem extends AnalyticsItem {
  image?: string;
  type?: string;
}

/**
 * Helper function to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

/**
 * Helper function to extract error message from unknown error
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
