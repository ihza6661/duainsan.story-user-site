import api from '@/lib/api';
import type { Product } from '@/features/product/services/productService';

export interface WishlistItem {
  id: number;
  share_token: string;
  shareable_link: string;
  added_at: string;
  product: Product;
}

export interface WishlistResponse {
  message: string;
  data: {
    items: WishlistItem[];
    share_token: string | null;
    shareable_link: string | null;
  };
}

export interface AddToWishlistResponse {
  message: string;
  data: WishlistItem;
}

export interface SharedWishlistResponse {
  message: string;
  data: {
    items: WishlistItem[];
    user_name?: string;
  };
}

export interface CheckWishlistResponse {
  message: string;
  data: {
    in_wishlist: boolean;
    wishlist_id: number | null;
  };
}

/**
 * Get the current user's wishlist
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
  const response = await api.get('/wishlist');
  return response.data;
};

/**
 * Add a product to the wishlist
 * @param productId The ID of the product to add
 */
export const addToWishlist = async (productId: number): Promise<AddToWishlistResponse> => {
  const response = await api.post('/wishlist', { product_id: productId });
  return response.data;
};

/**
 * Remove a product from the wishlist
 * @param wishlistId The wishlist item ID to remove
 */
export const removeFromWishlist = async (wishlistId: number): Promise<{ message: string }> => {
  const response = await api.delete(`/wishlist/${wishlistId}`);
  return response.data;
};

/**
 * Check if a product is in the user's wishlist
 * @param productId The product ID to check
 */
export const checkWishlist = async (productId: number): Promise<CheckWishlistResponse> => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};

/**
 * Get a shared wishlist by token (public endpoint)
 * @param token The share token
 */
export const getSharedWishlist = async (token: string): Promise<SharedWishlistResponse> => {
  const response = await api.get(`/wishlist/shared/${token}`);
  return response.data;
};

/**
 * Copy shareable link to clipboard
 * @param shareableLink The link to copy
 */
export const copyShareableLink = (shareableLink: string): Promise<void> => {
  return navigator.clipboard.writeText(shareableLink);
};
