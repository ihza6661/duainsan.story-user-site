import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/features/product/components/ProductCard';
import { Product } from '@/features/product/services/productService';
import {
  getPersonalizedRecommendations,
  getPopularProducts,
  getSimilarProducts,
  getTrendingProducts,
  getNewArrivals,
} from '../services/recommendationService';

interface RecommendedProductsProps {
  type: 'personalized' | 'popular' | 'similar' | 'trending' | 'new-arrivals';
  productId?: number;
  title?: string;
  limit?: number;
}

export const RecommendedProducts = ({
  type,
  productId,
  title,
  limit = 8,
}: RecommendedProductsProps) => {
  const getRecommendations = () => {
    switch (type) {
      case 'personalized':
        return getPersonalizedRecommendations();
      case 'popular':
        return getPopularProducts();
      case 'similar':
        if (!productId) throw new Error('productId is required for similar recommendations');
        return getSimilarProducts(productId);
      case 'trending':
        return getTrendingProducts();
      case 'new-arrivals':
        return getNewArrivals();
      default:
        throw new Error(`Unknown recommendation type: ${type}`);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations', type, productId],
    queryFn: getRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getDefaultTitle = () => {
    switch (type) {
      case 'personalized':
        return 'Rekomendasi untuk Anda';
      case 'popular':
        return 'Produk Populer';
      case 'similar':
        return 'Produk Serupa';
      case 'trending':
        return 'Sedang Trending';
      case 'new-arrivals':
        return 'Produk Terbaru';
      default:
        return 'Rekomendasi Produk';
    }
  };

  const displayTitle = title || getDefaultTitle();

  if (error) {
    console.error('Failed to load recommendations:', error);
    return null;
  }

  const products = data?.data || [];
  const displayProducts = products.slice(0, limit);

  if (!isLoading && displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 text-center">
      <div className="container mx-auto px-4">
        <h2 className="inline-block text-lg sm:text-xl font-medium mb-4 sm:mb-6 uppercase tracking-widest mt-6 bg-background text-muted-foreground px-6 py-2 rounded-full shadow-sm">
          {displayTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: limit }).map((_, index) => (
                <ProductCard
                  key={`skeleton-${index}`}
                  product={{} as Product}
                  loading={true}
                />
              ))
            : displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
};
