import { getImageUrl } from "@/lib/utils";
// src/components/product/ProductHero.tsx (Corrected)

import { useState, useEffect, useMemo, FC } from "react";
import {
  ProductDetail,
  ProductVariant,
  AttributeValue,
} from "@/services/ecommerce/productService";
import { AddToCartPayload } from "@/hooks/cart/useCart";
import { Button } from "@/components/ui/buttons/button";
import { toast } from "@/hooks/ui/use-toast";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { SocialShare } from "@/components/ui/feature/SocialShare";
import ProductGallery from "@/components/product/ProductDetail/ProductGallery";
import ProductQuantitySelector from "@/components/product/ProductDetail/ProductQuantitySelector";
import AddOnSelector from "@/components/product/selectors/AddOnSelector";

// This helper component needs to be updated to accept AttributeValue[]
const OptionSelector: FC<{
  title: string;
  options: AttributeValue[];
  selectedValueId: number | undefined;
  onOptionChange: (valueId: number) => void;
}> = ({ title, options, selectedValueId, onOptionChange }) => {
  // ... UI for a single group of options
  return (
    <div>
      <p className="font-semibold mb-2 capitalize">{title.replace("_", " ")}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((value) => (
          <Button
            key={value.id}
            variant={selectedValueId === value.id ? "default" : "outline"}
            onClick={() => onOptionChange(value.id)}
            className="rounded-md"
          >
            {value.value}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface ProductHeroProps {
  product: ProductDetail;
  onAddToCart: (payload: AddToCartPayload) => void;
}

const ProductHero: FC<ProductHeroProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(product.min_order_quantity || 100);
  const [showDescription, setShowDescription] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);

  useEffect(() => {
    setQuantity(product.min_order_quantity || 100);
    setSelectedOptions({});
    setSelectedAddOns([]);
  }, [product]);

  const activeVariant = useMemo<ProductVariant | undefined>(() => {
    const optionGroups = Object.keys(product.grouped_options);
    if (Object.keys(selectedOptions).length !== optionGroups.length) {
      return undefined;
    }
    const selectedIds = new Set(Object.values(selectedOptions));
    return product.variants.find(
      (variant) =>
        variant.options.length === selectedIds.size &&
        variant.options.every((opt) => selectedIds.has(opt.id))
    );
  }, [selectedOptions, product.variants, product.grouped_options]);

  const price = activeVariant ? activeVariant.price : product.base_price;

  const totalPrice = useMemo(() => {
    let finalPrice = price;
    selectedAddOns.forEach((addOnId) => {
      // This line uses `product.add_ons`
      const addOn = product.add_ons.find((add) => add.id === addOnId);
      if (addOn) finalPrice += addOn.price;
    });
    return finalPrice * quantity;
  }, [price, selectedAddOns, quantity, product.add_ons]); // <-- Add it here

  const pricePerItem = quantity > 0 ? totalPrice / quantity : 0;

  const handleOptionChange = (groupName: string, valueId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: valueId }));
  };

  const handleAddOnChange = (addOnId: number, isSelected: boolean) => {
    setSelectedAddOns((prev) =>
      isSelected ? [...prev, addOnId] : prev.filter((id) => id !== addOnId)
    );
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= product.min_order_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    if (!activeVariant) {
      toast({
        title: "Harap lengkapi semua pilihan varian.",
        variant: "destructive",
      });
      return;
    }
    const payload: AddToCartPayload = {
      variantId: activeVariant.id,
      quantity: quantity,
      addOns: selectedAddOns,
    };
    onAddToCart(payload);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallery
        images={
          activeVariant?.images.length
            ? activeVariant.images
            : product.featured_image
            ? [product.featured_image]
            : []
        }
        productName={product.name}
      />

      <div className="pt-0 md:pt-20 px-4 sm:px-8 md:px-12 lg:px-16 sticky top-24 self-start">
        <h1 className="text-2xl lg:text-3xl tracking-wide my-4 font-bold uppercase text-foreground">
          {product.name}
        </h1>

        <div className="mb-4">
          <div className="text-lg text-muted-foreground">
            Harga Satuan:
            {!activeVariant && <span className="text-sm"> Mulai dari </span>}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(pricePerItem)}
          </div>
          <div className="text-2xl text-primary font-bold pt-1">
            Total:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(totalPrice)}
          </div>
        </div>

        <div className="py-4 border-y border-border">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="text-foreground flex flex-row justify-between w-full items-center"
          >
            <p className="text-base tracking-widest font-normal">
              Deskripsi produk
            </p>
            {showDescription ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showDescription ? "max-h-[1000px] mt-4" : "max-h-0"
            }`}
          >
            <p className="text-base text-muted-foreground whitespace-pre-line">
              {product.description ?? "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>
        </div>

        <div className="space-y-6 my-6">
          {Object.entries(product.grouped_options).map(
            ([groupName, values]) => (
              <OptionSelector
                key={groupName}
                title={groupName}
                options={values}
                selectedValueId={selectedOptions[groupName]}
                onOptionChange={(valueId) =>
                  handleOptionChange(groupName, valueId)
                }
              />
            )
          )}

          <AddOnSelector
            addOns={product.add_ons}
            selectedAddOnIds={selectedAddOns}
            onAddOnChange={handleAddOnChange}
          />

          <ProductQuantitySelector
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            minOrder={product.min_order_quantity}
          />

          <Button
            onClick={handleAddToCartClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg tracking-widest flex items-center justify-center gap-2 text-base"
            disabled={!activeVariant}
          >
            <ShoppingCart className="w-5 h-5" />
            TAMBAH KE KERANJANG
          </Button>

           {!activeVariant && (
            <p className="text-sm text-center text-muted-foreground mt-2">
              Pilih semua opsi untuk melanjutkan.
            </p>
          )}

          <div className="pt-4 flex justify-center">
            <SocialShare
              url={window.location.href}
              title={product.name}
              media={getImageUrl(
                activeVariant?.images.length
                  ? activeVariant.images[0].image_url
                  : product.featured_image?.image_url
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
