// src/features/reviews/components/ProductReviewsSection.tsx

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductReviews, getProductRatingSummary, markReviewAsHelpful } from "@/services/review/reviewService";
import { ReviewSortOption, ReviewFilters } from "@/types/review";
import { RatingSummary } from "./RatingSummary";
import { ReviewList } from "./ReviewList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout-ui/tabs";
import { Button } from "@/components/ui/buttons/button";
import { Filter } from "lucide-react";
import { toast } from "@/hooks/ui/use-toast";

interface ProductReviewsSectionProps {
  productId: number;
  productName: string;
  className?: string;
}

/**
 * ProductReviewsSection - Complete reviews section for product detail page
 * Includes rating summary, filters, and review list
 */
export function ProductReviewsSection({
  productId,
  productName,
  className,
}: ProductReviewsSectionProps) {
  const [filters, setFilters] = useState<ReviewFilters>({
    sort_by: "latest",
    per_page: 10,
    page: 1,
  });

  // Fetch rating summary
  const { data: ratingSummaryData } = useQuery({
    queryKey: ["review-summary", productId],
    queryFn: () => getProductRatingSummary(productId),
  });

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["product-reviews", productId, filters],
    queryFn: () => getProductReviews(productId, filters),
  });

  const handleSortChange = (sortBy: ReviewSortOption) => {
    setFilters({ ...filters, sort_by: sortBy, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    // Scroll to reviews section
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFilterByRating = (rating: number | null) => {
    setFilters({
      ...filters,
      rating: rating || undefined,
      page: 1,
    });
  };

  const handleFilterWithImages = () => {
    setFilters({
      ...filters,
      with_images: !filters.with_images,
      page: 1,
    });
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      await markReviewAsHelpful(reviewId);
      toast({
        title: "Terima kasih!",
        description: "Ulasan ini ditandai sebagai membantu",
      });
      refetch();
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  if (!ratingSummaryData) {
    return null;
  }

  return (
    <section id="reviews-section" className={className}>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Ulasan Produk
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Rating Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <RatingSummary
                summary={ratingSummaryData.data}
                onFilterByRating={handleFilterByRating}
              />

              {/* Filter with Images */}
              <Button
                variant={filters.with_images ? "default" : "outline"}
                className="w-full mt-4"
                onClick={handleFilterWithImages}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filters.with_images ? "Semua Ulasan" : "Dengan Foto"}
              </Button>
            </div>
          </div>

          {/* Right Side - Review List */}
          <div className="lg:col-span-3">
            {filters.rating && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filter: {filters.rating} ⭐
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterByRating(null)}
                >
                  Hapus
                </Button>
              </div>
            )}

            <ReviewList
              reviews={reviewsData?.data || []}
              totalPages={reviewsData?.meta.last_page || 1}
              currentPage={reviewsData?.meta.current_page || 1}
              sortBy={filters.sort_by || "latest"}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onMarkHelpful={handleMarkHelpful}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
