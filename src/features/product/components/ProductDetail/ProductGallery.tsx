import { getImageUrl } from "@/lib/utils";
import React from "react";
import { ProductImage } from "@/features/product/services/productService";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const placeholderImage = "/images/placeholder.svg";

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center rounded-lg">
        Gambar tidak tersedia
      </div>
    );
  }

  return (
    <div className="overflow-hidden pt-20">
      {images.map((image, index) => {
        const imageUrl = getImageUrl(image?.image_url);
        return (
          <div key={image.id || index} className="grid grid-cols-1 gap-2">
            <img
              src={imageUrl}
              alt={image.alt_text ?? `${productName} - Gambar ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = placeholderImage)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGallery;
