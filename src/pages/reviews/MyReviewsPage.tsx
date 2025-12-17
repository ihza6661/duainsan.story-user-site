// src/pages/reviews/MyReviewsPage.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyReviews,
  getReviewableProducts,
  deleteReview,
  type ReviewableProduct,
} from "@/services/review/reviewService";
import { Review } from "@/types/review";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Button } from "@/components/ui/buttons/button";
import { Badge } from "@/components/ui/utils/badge";
import { Separator } from "@/components/ui/layout-ui/separator";
import {
  Loader2,
  Star,
  Trash2,
  Edit,
  ShoppingBag,
  ImageIcon,
} from "lucide-react";
import { toast } from "@/hooks/ui/use-toast";
import { ReviewDialog } from "@/features/reviews/components/ReviewDialog";
import { getImageUrl } from "@/lib/utils";
import { getErrorMessage } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/dialogs/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialogs/dialog";

export function MyReviewsPage() {
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ReviewableProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  // Fetch my reviews
  const { data: myReviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => getMyReviews(),
  });

  // Fetch reviewable products
  const { data: reviewableData, isLoading: reviewableLoading } = useQuery({
    queryKey: ["reviewable-products"],
    queryFn: getReviewableProducts,
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      toast({
        title: "Ulasan Berhasil Dihapus",
        description: "Ulasan Anda telah dihapus.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewable-products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal Menghapus Ulasan",
        description: getErrorMessage(
          error,
          "Terjadi kesalahan saat menghapus ulasan."
        ),
        variant: "destructive",
      });
    },
  });

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setSelectedProduct(null);
    setReviewDialogOpen(true);
  };

  const handleWriteReview = (product: ReviewableProduct) => {
    setSelectedProduct(product);
    setSelectedReview(null);
    setReviewDialogOpen(true);
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteMutation.mutate(reviewToDelete.id);
    }
  };

  const myReviews = myReviewsData?.data || [];
  const reviewableProducts = reviewableData?.data || [];

  if (reviewsLoading || reviewableLoading) {
    return (
      <div className="container mt-20 mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Ulasan Saya</h1>

        {/* My Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ulasan Anda ({myReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Anda belum memberikan ulasan.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm text-foreground">
                          {review.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge
                            variant={
                              review.is_approved ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {review.is_approved
                              ? "Disetujui"
                              : "Menunggu Persetujuan"}
                          </Badge>
                          {review.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              ⭐ Unggulan
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReview(review)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(review)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        {review.comment}
                      </p>
                    )}

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {review.images.slice(0, 3).map((image, index) => (
                          <Dialog key={image.id}>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setSelectedImageIndex(index)}
                                className="relative w-16 h-16 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={getImageUrl(image.image_url)}
                                  alt={image.alt_text || "Review image"}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                  <ImageIcon className="h-4 w-4 text-white opacity-0 hover:opacity-100" />
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <img
                                src={getImageUrl(image.image_url)}
                                alt={
                                  image.alt_text || `Review image ${index + 1}`
                                }
                                className="w-full rounded-lg"
                              />
                            </DialogContent>
                          </Dialog>
                        ))}
                        {review.images.length > 3 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground hover:bg-muted/80 transition-colors border border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                  <ImageIcon className="h-5 w-5 mx-auto mb-1" />
                                  <div>+{review.images.length - 3}</div>
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                                {review.images.map((image, index) => (
                                  <div
                                    key={image.id}
                                    className="relative aspect-square overflow-hidden rounded-lg border"
                                  >
                                    <img
                                      src={getImageUrl(image.image_url)}
                                      alt={
                                        image.alt_text ||
                                        `Review image ${index + 1}`
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    )}

                    {review.admin_response && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-xs font-semibold text-foreground mb-1">
                          Tanggapan Admin:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.admin_response}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(review.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                      {review.helpful_count > 0 && (
                        <span>
                          👍 {review.helpful_count} orang merasa membantu
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviewable Products Section */}
        {reviewableProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Produk Yang Dapat Diulas ({reviewableProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewableProducts.map((product) => (
                  <div
                    key={product.order_item_id}
                    className="flex items-center gap-4 border rounded-lg p-4"
                  >
                    <img
                      src={getImageUrl(product.product.image)}
                      alt={product.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {product.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pesanan #{product.order_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dibeli pada{" "}
                        {new Date(product.purchased_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleWriteReview(product)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Tulis Ulasan
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {myReviews.length === 0 && reviewableProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Belum Ada Ulasan
              </h3>
              <p className="text-muted-foreground mb-4">
                Anda belum memiliki produk yang dapat diulas. Belanja sekarang
                dan bagikan pengalaman Anda!
              </p>
              <Button variant="default" asChild>
                <a href="/products">Jelajahi Produk</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      {(selectedReview || selectedProduct) && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          orderItemId={selectedProduct?.order_item_id || 0}
          productId={
            selectedReview?.product.id || selectedProduct?.product.id || 0
          }
          productName={
            selectedReview?.product.name || selectedProduct?.product.name || ""
          }
          existingReview={selectedReview}
          onSuccess={() => {
            toast({
              title: "Berhasil!",
              description: selectedReview
                ? "Ulasan Anda telah diperbarui."
                : "Ulasan Anda telah dikirim.",
            });
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            queryClient.invalidateQueries({
              queryKey: ["reviewable-products"],
            });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setReviewDialogOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Ulasan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
