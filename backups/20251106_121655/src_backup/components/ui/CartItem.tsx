import { Product } from "@/lib/data";
import { useCart } from "./Cart";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartItemProps {
  product: Product;
}

const CartItem = ({ product }: CartItemProps) => {
  const { removeFromCart } = useCart();

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="h-24 w-24 mr-4 overflow-hidden rounded-md bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Button size="icon" variant="ghost" onClick={handleRemoveFromCart}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
