import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { Button } from "@/components/ui/buttons/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/dialogs/drawer";
import { formatRupiah, getImageUrl } from "@/lib/utils";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/data/scroll-area";

interface MobileCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile bottom drawer for quick cart preview
 * Accessible from header on all pages
 * Shows mini cart with items, total, and quick actions
 */
export function MobileCartDrawer({ open, onOpenChange }: MobileCartDrawerProps) {
  const { cart, isLoading, removeItem, isMutating } = useCart();
  const navigate = useNavigate();

  const handleViewFullCart = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId);
  };

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Keranjang Belanja</DrawerTitle>
            <DrawerDescription>Keranjang Anda kosong</DrawerDescription>
          </DrawerHeader>
          
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-6">
              Belum ada produk di keranjang Anda
            </p>
            <Button onClick={() => {
              onOpenChange(false);
              navigate("/products");
            }}>
              Mulai Belanja
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <DrawerTitle>Keranjang Belanja</DrawerTitle>
              <DrawerDescription>
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Cart Items - Scrollable */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-3">
            {cart.items.map((item) => {
              const placeholderImage = "/images/placeholder.svg";
              let imageToDisplay = item.variant?.images?.find(img => img.is_featured);
              
              if (!imageToDisplay) {
                imageToDisplay = { image: item.product.featured_image, is_featured: true };
              }
              
              if (!imageToDisplay && item.variant?.images?.length > 0) {
                imageToDisplay = item.variant.images[0];
              }
              
              const imageUrl = getImageUrl(imageToDisplay?.image_url);
              const variantDescription = item.customizations?.options?.map(opt => opt.value).join(' / ');

              return (
                <div 
                  key={item.id} 
                  className="flex gap-3 pb-3 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
                    onError={(e) => (e.currentTarget.src = placeholderImage)}
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 hover:text-destructive -mt-1"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isMutating}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    {variantDescription && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                        {variantDescription}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-semibold text-sm">
                        {formatRupiah(item.sub_total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary & Actions */}
        <DrawerFooter className="border-t pt-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="text-lg font-bold">
              {formatRupiah(cart.subtotal)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleCheckout} 
              className="w-full"
              disabled={isMutating}
            >
              Checkout
            </Button>
            <Button 
              onClick={handleViewFullCart} 
              variant="outline" 
              className="w-full"
            >
              Lihat Keranjang Lengkap
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
