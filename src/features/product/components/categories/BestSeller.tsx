// src/components/BestSeller.tsx (Refactored for general products)

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/features/product/services/productService";
import type { Product } from "@/features/product/services/productService";
import ProductCard from "@/features/product/components/ProductCard";
import ProductCardSkeleton from "@/features/product/components/ProductCardSkeleton";

const BestSeller = () => {
  // Fetch a general list of products from the API
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "featured"], // Use a different key like 'featured' to cache this list separately
    queryFn: () => fetchProducts({}), // Fetch without any parameters
  });

  // Take the first 8 products from the API response to display
  const products = productData?.data.slice(0, 8) || [];

  return (
    <div className="px-4 text-center">
      <h2 className="inline-block text-lg sm:text-xl font-medium mb-4 sm:mb-6 uppercase tracking-widest mt-6 bg-background text-muted-foreground px-6 py-2 rounded-full shadow-sm">
        BestSeller
      </h2>
      <div className="flex space-x-5 overflow-x-scroll pb-6 sm:pb-10 custom-scrollbar">
        {isLoading ? (
          // Display skeletons while loading
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4 h-full"
            >
              <ProductCardSkeleton />
            </div>
          ))
        ) : isError ? (
          // Display an error message if the fetch fails
          <p className="text-red-500">Tidak dapat memuat produk.</p>
        ) : (
          // Render the products once they are loaded
          products.map((item: Product) => (
            <div
              key={item.id}
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4 h-full"
            >
              <ProductCard product={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
