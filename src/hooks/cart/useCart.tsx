import React, { createContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  Cart
} from "@/services/ecommerce/cartService";
import type { AddToCartPayload } from "@/services/ecommerce/cartService";
import { useCart } from "@/hooks/cart/use-cart";

// Ekspor kembali tipe ini agar mudah diakses
export type { AddToCartPayload };

import { CartContext, CartContextType } from '@/hooks/cart/cart-context';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. MENGAMBIL DATA KERANJANG (FETCHING)
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      console.log('useCart: fetchCart called');
      const fetchedCart = await fetchCart();
      console.log('useCart: fetchedCart result:', fetchedCart);
      return fetchedCart;
    },
  });

  const onMutationSuccess = () => {
    console.log('useCart: onMutationSuccess - invalidating cart query');
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  // 2. SEMUA AKSI PERUBAHAN (MUTATIONS)
  const { mutate: addToCartMutate, isPending: isAdding } = useMutation({
    mutationFn: apiAddToCart,
    onSuccess: (data, variables, context: { onSuccess?: () => void } | undefined) => {
      onMutationSuccess();
      toast.success("Produk berhasil ditambahkan!");
      context?.onSuccess?.();
    },
    onError: (error) => toast.error(`Gagal: ${error.message}`),
  });

  const { mutate: updateQuantityMutate, isPending: isUpdating } = useMutation({
    mutationFn: apiUpdateCartItem,
    onSuccess: onMutationSuccess,
    onError: (error) => toast.error(`Gagal update: ${error.message}`),
  });

  const { mutate: removeItemMutate, isPending: isRemoving } = useMutation({
    mutationFn: apiRemoveCartItem,
    onSuccess: () => {
        onMutationSuccess();
        toast.info("Item dihapus dari keranjang.");
    },
    onError: (error) => toast.error(`Gagal menghapus: ${error.message}`),
  });
  
  const { mutate: clearCartMutate, isPending: isClearing } = useMutation({
    mutationFn: apiClearCart,
    onSuccess: onMutationSuccess,
    onError: (error) => toast.error(`Gagal: ${error.message}`),
  });

  const isMutating = isAdding || isUpdating || isRemoving || isClearing;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart: (payload, callbacks) => addToCartMutate(payload, { onSuccess: callbacks?.onSuccess }),
        updateQuantity: (itemId, quantity) => updateQuantityMutate({ itemId, quantity }),
        removeItem: removeItemMutate,
        clearCart: clearCartMutate,
        isMutating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};