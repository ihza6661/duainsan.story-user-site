import { getImageUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { CartItem as CartItemType } from "@/services/cartService";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const placeholderImage = "/images/placeholder.svg";

  // --- ROBUST IMAGE LOGIC ---
  // 1. Prioritize the featured image from the variant.
  let imageToDisplay = item.variant?.images?.find(img => img.is_featured);

  // 2. If not found, fall back to the main product's featured image.
  if (!imageToDisplay) {
    imageToDisplay = item.product.featured_image;
  }

  // 3. If still no image, take the VERY FIRST image from the variant's gallery.
  if (!imageToDisplay && item.variant?.images?.length > 0) {
    imageToDisplay = item.variant.images[0];
  }

  // 4. Construct the final URL safely.
  const imageUrl = getImageUrl(imageToDisplay?.image);

  const variantDescription = item.customizations?.options?.map(opt => opt.value).join(' / ');

  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="flex flex-col sm:flex-row items-start gap-4 p-4">

        <div className="flex-1 w-full">

          <div className="flex justify-between items-start gap-3 sm:gap-4">
            {/* LEFT: Product info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground text-base md:text-lg">{item.product.name}</h3>
                  {variantDescription && (
                    <p className="text-sm">{variantDescription}</p>
                  )}
                  <p className="font-medium mt-1 sm:hidden">
                    {formatRupiah(item.unit_price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-red-500 -mt-2 -mr-2"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Hapus ${item.product.name} dari keranjang`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* RIGHT: Product image */}
            <img
              src={imageUrl}
              alt={item.product.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md border flex-shrink-0"
              onError={(e) => (e.currentTarget.src = placeholderImage)}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="icon" className="w-8 h-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= item.product.min_order_quantity}
                aria-label="Kurangi kuantitas"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                min={item.product.min_order_quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || item.product.min_order_quantity)}
                className="text-center w-20 h-8 rounded-md"
                aria-label={`Kuantitas untuk ${item.product.name}`}
              />
              <Button
                variant="outline" size="icon" className="w-8 h-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                aria-label="Tambah kuantitas"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <p className="hidden sm:block text-gray-500 font-medium">{formatRupiah(item.unit_price)}</p>
              <p className="font-bold text-base md:text-lg">{formatRupiah(item.sub_total)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
