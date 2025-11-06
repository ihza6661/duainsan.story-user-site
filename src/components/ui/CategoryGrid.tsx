// src/components/CategoryGrid.tsx (Refactored)

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/ecommerce/productService"; // Import the API function
import type { ProductCategory } from "@/services/ecommerce/productService"; // Import the type

// Skeleton component for a better loading experience
const CategorySkeleton = () => (
  <div className="relative h-[500px] bg-gray-200 animate-pulse"></div>
);

const CategoryGrid = () => {
  
  // Fetch categories from the API using React Query
  const { data: categories, isLoading, isError, error } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Handle the loading state
  if (isLoading) {
    return (
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <CategorySkeleton />
        </div>
      </section>
    );
  }

  // Handle the error state
  if (isError) {
    return (
      <section className="text-center py-20">
        <p className="text-red-500">Ada kesalahan dalam memuat kategori: {error.message}</p>
      </section>
    );
  }

  return (
    <section>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {categories?.map((category) => (
            <div key={category.id} className="relative group overflow-hidden">
              {/* Use the category slug from the API for the link */}
              <Link to={`/products/category/${category.slug}`} className="block">
                <div className="relative h-[500px] overflow-hidden">
                  <img
                    // Use the image_url from the API
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
                    <h3 className="text-3xl text-white shadow-sm font-medium mb-2 tracking-wider">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
