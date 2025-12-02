// src/features/reviews/components/ReviewCard.tsx

import React, { useState } from "react";
import { Review } from "@/types/review";
import { StarRating } from "./StarRating";
import { Card } from "@/components/ui/utils/card";
import { Badge } from "@/components/ui/utils/badge";
import { Button } from "@/components/ui/buttons/button";
import { ThumbsUp, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialogs/dialog";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: number) => void;
  showProductName?: boolean;
  className?: string;
}

/**
 * ReviewCard - Displays a single review with customer info, rating, comment, and images
 */
export function ReviewCard({
  review,
  onMarkHelpful,
  showProductName = false,
  className,
}: ReviewCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful && onMarkHelpful) {
      onMarkHelpful(review.id);
      setHasMarkedHelpful(true);
    }
  };

  const formattedDate = format(new Date(review.created_at), "d MMMM yyyy", {
    locale: localeId,
  });

  return (
    <Card className={cn("p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.customer.full_name}
            </h4>
            {review.is_verified && (
              <Badge variant="secondary" className="text-xs">
                ✓ Pembeli Terverifikasi
              </Badge>
            )}
            {review.is_featured && (
              <Badge variant="default" className="text-xs">
                ⭐ Ulasan Pilihan
              </Badge>
            )}
          </div>

          {showProductName && review.product && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Produk: {review.product.name}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      {review.comment && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {review.comment}
        </p>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {review.images.map((image, index) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedImageIndex(index)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || `Review image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                    <ImageIcon className="h-5 w-5 text-white opacity-0 hover:opacity-100" />
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Review image ${index + 1}`}
                  className="w-full rounded-lg"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Admin Response */}
      {review.admin_response && (
        <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border-l-4 border-primary">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Respon dari Penjual
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {review.admin_response}
          </p>
          {review.admin_responded_at && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(review.admin_responded_at), "d MMMM yyyy", {
                locale: localeId,
              })}
            </p>
          )}
        </div>
      )}

      {/* Footer - Helpful Button */}
      <div className="mt-4 flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkHelpful}
          disabled={hasMarkedHelpful}
          className="text-gray-600 dark:text-gray-400"
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          {hasMarkedHelpful ? "Terima kasih!" : "Membantu"}
          {review.helpful_count > 0 && (
            <span className="ml-1">({review.helpful_count})</span>
          )}
        </Button>
      </div>
    </Card>
  );
}
