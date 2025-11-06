// src/components/ui/ProductCardSkeleton.tsx

import React from 'react';

/**
 * Komponen ProductCardSkeleton digunakan sebagai placeholder visual
 * saat data produk sedang diambil dari server.
 * Ini meningkatkan pengalaman pengguna dengan memberikan feedback bahwa konten sedang dimuat.
 */
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group product-card block bg-white overflow-hidden h-full">
      {/* Kita menggunakan div kosong dengan class `animate-pulse` dan `bg-gray-200` 
        untuk membuat efek placeholder yang berdenyut.
      */}
      <div className="animate-pulse">
        {/* Placeholder untuk gambar produk */}
        <div className="aspect-square w-full bg-gray-200"></div>

        <div className="p-2">
          {/* Placeholder untuk judul produk */}
          <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded"></div>
          
          {/* Placeholder untuk harga produk */}
          <div className="mt-3 h-6 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
