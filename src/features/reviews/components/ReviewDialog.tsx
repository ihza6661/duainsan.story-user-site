// src/features/reviews/components/ReviewDialog.tsx

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewForm, ReviewFormData } from "./ReviewForm";
import { createReview, updateReview } from "@/services/review/reviewService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialogs/dialog";
import { toast } from "@/hooks/ui/use-toast";
import { Review } from "@/types/review";
import { getErrorMessage } from "@/lib/types";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderItemId: number;
  productId: number;
  productName: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

/**
 * ReviewDialog - Modal wrapper for ReviewForm
 * Handles creating or editing a review
 */
export function ReviewDialog({
  open,
  onOpenChange,
  orderItemId,
  productId,
  productName,
  existingReview,
  onSuccess,
}: ReviewDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!existingReview;

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      createReview({
        order_item_id: orderItemId,
        product_id: productId,
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      }),
    onSuccess: (response) => {
      toast({
        title: "Ulasan Berhasil Dikirim!",
        description: "Terima kasih atas ulasan Anda. Ulasan Anda sedang menunggu persetujuan admin.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewable-products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-summary"] });
      
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal Mengirim Ulasan",
        description: getErrorMessage(error, "Terjadi kesalahan saat mengirim ulasan."),
        variant: "destructive",
      });
    },
  });

  // Update review mutation
  const updateMutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      updateReview(existingReview!.id, {
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      }),
    onSuccess: (response) => {
      toast({
        title: "Ulasan Berhasil Diperbarui!",
        description: "Perubahan ulasan Anda telah disimpan.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewable-products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-summary"] });
      
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal Memperbarui Ulasan",
        description: getErrorMessage(error, "Terjadi kesalahan saat memperbarui ulasan."),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: ReviewFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Ulasan" : "Tulis Ulasan"}
          </DialogTitle>
          <DialogDescription>
            Bagikan pengalaman Anda dengan produk ini. Ulasan Anda akan membantu pembeli lain.
          </DialogDescription>
        </DialogHeader>
        
        <ReviewForm
          orderItemId={orderItemId}
          productId={productId}
          productName={productName}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={
            existingReview
              ? {
                  rating: existingReview.rating,
                  comment: existingReview.comment || "",
                }
              : undefined
          }
          isEdit={isEdit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
