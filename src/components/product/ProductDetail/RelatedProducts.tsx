// src/components/product/RelatedProducts.tsx

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/ecommerce/productService";
import ProductCard from "@/components/ui/feature/ProductCard";
import ProductCardSkeleton from "@/components/ui/feature/ProductCardSkeleton";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: number;
}

const RelatedProducts = ({ categorySlug, currentProductId }: RelatedProductsProps) => {
  // Gunakan React Query untuk mengambil produk berdasarkan kategori
  const { data: paginatedProducts, isLoading, isError } = useQuery({
    // Query key dibuat unik berdasarkan kategori agar tidak tumpang tindih
    queryKey: ['related_products', categorySlug],
    queryFn: () => fetchProducts({ category: categorySlug }),
  });

  // Filter produk yang sedang ditampilkan dan batasi jumlahnya
  const relatedProducts = paginatedProducts?.data
    .filter(item => item.id !== currentProductId) // Jangan tampilkan produk yang sama
    .slice(0, 4); // Ambil 4 produk pertama

  if (isError || !relatedProducts || relatedProducts.length === 0) {
    // Jika tidak ada produk terkait atau terjadi error, jangan render apapun
    return null;
  }

  return (
    <section className="py-10 bg-background">
      <h2 className="text-lg sm:text-2xl font-normal mb-4 sm:mb-6 text-center uppercase tracking-widest pt-6 sm:pt-16 text-foreground">
        Produk yang anda mungkin suka      </h2>
      <div className="custom-scrollbar flex space-x-2 overflow-x-scroll pb-6 sm:pb-10 m-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4 h-full">
              <ProductCardSkeleton />
            </div>
          ))
        ) : (
          relatedProducts.map((item) => (
            <div
              key={item.id}
              className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4 h-full"
            >
              <ProductCard product={item} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
