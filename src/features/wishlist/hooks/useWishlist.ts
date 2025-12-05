import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  getSharedWishlist,
  copyShareableLink,
} from '../services/wishlistService';

/**
 * Hook to fetch the user's wishlist
 */
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to check if a product is in the wishlist
 */
export const useCheckWishlist = (productId: number) => {
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: () => checkWishlist(productId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to add a product to the wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

/**
 * Hook to remove a product from the wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      // Invalidate wishlist queries to refetch
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

/**
 * Hook to fetch a shared wishlist
 */
export const useSharedWishlist = (token: string) => {
  return useQuery({
    queryKey: ['wishlist', 'shared', token],
    queryFn: () => getSharedWishlist(token),
    enabled: !!token,
  });
};

/**
 * Hook to copy shareable link
 */
export const useCopyShareableLink = () => {
  return useMutation({
    mutationFn: copyShareableLink,
  });
};
