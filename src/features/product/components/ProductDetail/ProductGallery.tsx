// src/components/product/ProductGallery.tsx (Dengan Carousel)

import { getImageUrl } from "@/lib/utils";
import React from 'react';
import { ProductImage } from '@/features/product/services/productService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Impor CSS untuk Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const placeholderImage = "/images/placeholder.svg";

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
        Gambar tidak tersedia
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden pt-16 sm:pt-20 px-4 md:px-0">
      <Swiper
        // Install modules
        modules={[Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper" // Anda bisa menambahkan styling custom di sini
        loop={images.length > 1} // Aktifkan loop jika ada lebih dari 1 gambar
      >
        {images.map((image) => {
          const imageUrl = getImageUrl(image?.image_url);
          return (
            <SwiperSlide key={image.id}>
              <div className="aspect-square w-full">
                <img
                  src={imageUrl}
                  alt={image.alt_text ?? `${productName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = placeholderImage)}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductGallery;