// src/features/reviews/components/ReviewList.tsx

import React from "react";
import { Review, ReviewSortOption } from "@/types/review";
import { ReviewCard } from "./ReviewCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { Button } from "@/components/ui/buttons/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
  sortBy: ReviewSortOption;
  onSortChange: (sort: ReviewSortOption) => void;
  onPageChange: (page: number) => void;
  onMarkHelpful?: (reviewId: number) => void;
  showProductName?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * ReviewList - Displays a list of reviews with sorting and pagination
 */
export function ReviewList({
  reviews,
  totalPages,
  currentPage,
  sortBy,
  onSortChange,
  onPageChange,
  onMarkHelpful,
  showProductName = false,
  loading = false,
  className,
}: ReviewListProps) {
  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada ulasan untuk produk ini.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Jadilah yang pertama memberikan ulasan!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {reviews.length} Ulasan
        </h3>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as ReviewSortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Terbaru</SelectItem>
            <SelectItem value="helpful">Paling Membantu</SelectItem>
            <SelectItem value="highest">Rating Tertinggi</SelectItem>
            <SelectItem value="lowest">Rating Terendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onMarkHelpful={onMarkHelpful}
            showProductName={showProductName}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
