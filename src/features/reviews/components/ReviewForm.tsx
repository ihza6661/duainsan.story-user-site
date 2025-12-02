// src/features/reviews/components/ReviewForm.tsx

import React, { useState } from "react";
import { StarRatingInput } from "./StarRatingInput";
import { Button } from "@/components/ui/buttons/button";
import { Card } from "@/components/ui/utils/card";
import { Textarea } from "@/components/ui/forms/textarea";
import { Label } from "@/components/ui/forms/label";
import { X, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  orderItemId: number;
  productId: number;
  productName: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    comment: string;
  };
  isEdit?: boolean;
  loading?: boolean;
  className?: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
  images: File[];
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ReviewForm - Form for submitting or editing a review
 */
export function ReviewForm({
  orderItemId,
  productId,
  productName,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  loading = false,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate total images
    if (images.length + files.length > MAX_IMAGES) {
      setErrors({ images: `Maksimal ${MAX_IMAGES} gambar` });
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ images: `Ukuran gambar maksimal 5MB` });
        continue;
      }

      if (!file.type.startsWith("image/")) {
        setErrors({ images: "File harus berupa gambar" });
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setErrors({ ...errors, images: "" });
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (rating === 0) {
      newErrors.rating = "Rating wajib diisi";
    }

    if (comment.trim().length > 1000) {
      newErrors.comment = "Komentar maksimal 1000 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
        images,
      });

      // Cleanup
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isEdit ? "Edit Ulasan" : "Tulis Ulasan"}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Produk: <span className="font-medium">{productName}</span>
        </p>

        {/* Rating Input */}
        <div className="mb-6">
          <Label className="mb-2 block">Rating *</Label>
          <StarRatingInput
            value={rating}
            onChange={setRating}
            size="lg"
            disabled={loading}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment Textarea */}
        <div className="mb-6">
          <Label htmlFor="comment" className="mb-2 block">
            Ulasan Anda (Opsional)
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagikan pengalaman Anda dengan produk ini..."
            rows={5}
            maxLength={1000}
            disabled={loading}
            className="resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              {comment.length}/1000 karakter
            </p>
            {errors.comment && (
              <p className="text-xs text-red-600">{errors.comment}</p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <Label className="mb-2 block">
            Tambahkan Foto (Opsional, Max {MAX_IMAGES})
          </Label>

          {imagePreviews.length < MAX_IMAGES && (
            <label className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Klik untuk upload gambar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </label>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={loading}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Mengirim..." : isEdit ? "Update Ulasan" : "Kirim Ulasan"}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
