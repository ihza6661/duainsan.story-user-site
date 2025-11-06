import { useContext } from "react";
import { CartContext, CartContextType } from "./cart-context";

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};


