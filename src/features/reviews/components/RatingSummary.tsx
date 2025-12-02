// src/features/reviews/components/RatingSummary.tsx

import React from "react";
import { StarRating } from "./StarRating";
import { RatingSummary as RatingSummaryType } from "@/types/review";
import { Progress } from "@/components/ui/feedback/progress";

interface RatingSummaryProps {
  summary: RatingSummaryType;
  onFilterByRating?: (rating: number | null) => void;
  className?: string;
}

/**
 * RatingSummary - Displays overall rating and rating breakdown
 */
export function RatingSummary({
  summary,
  onFilterByRating,
  className,
}: RatingSummaryProps) {
  const { total_reviews, average_rating, rating_breakdown } = summary;

  return (
    <div className={className}>
      {/* Overall Rating */}
      <div className="mb-6 flex items-center gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white">
            {average_rating.toFixed(1)}
          </div>
          <StarRating rating={average_rating} size="lg" className="mt-2" />
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Berdasarkan {total_reviews} ulasan
          </p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const data = rating_breakdown[rating];
          const count = data?.count || 0;
          const percentage = data?.percentage || 0;

          return (
            <button
              key={rating}
              onClick={() => onFilterByRating?.(rating)}
              className="flex w-full items-center gap-2 text-sm hover:opacity-80 transition-opacity"
              type="button"
            >
              <span className="w-12 text-right font-medium text-gray-700 dark:text-gray-300">
                {rating} ⭐
              </span>
              <Progress value={percentage} className="h-2 flex-1" />
              <span className="w-16 text-left text-gray-600 dark:text-gray-400">
                {count} ({percentage}%)
              </span>
            </button>
          );
        })}
      </div>

      {/* Clear Filter Button */}
      {onFilterByRating && (
        <button
          onClick={() => onFilterByRating(null)}
          className="mt-4 w-full text-sm text-primary hover:underline"
          type="button"
        >
          Tampilkan Semua
        </button>
      )}
    </div>
  );
}
