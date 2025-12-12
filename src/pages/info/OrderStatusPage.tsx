import { getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Badge } from "@/components/ui/utils/badge";
import { Button } from "@/components/ui/buttons/button";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@/components/ui/layout-ui/separator";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  fetchOrders,
  getFinalPaymentSnapToken,
  retryPayment,
  cancelOrder,
  downloadInvoice,
  type Order,
  type OrderItem,
} from "@/features/order/services/orderService";
import { Loader2, FileDown, Star, Camera } from "lucide-react";
import { toast } from "sonner";
import {
  getOrderStatusInfo,
  getPaymentStatusInfo,
  getPaymentOptionLabel,
} from "@/features/order/utils/statusLabels";
import { DesignProofViewer } from "@/features/order/components/DesignProofViewer";
import { CancelOrderDialog } from "@/features/order/components/CancelOrderDialog";
import { ReviewDialog } from "@/features/reviews/components/ReviewDialog";
import { UGCUploadForm } from "@/components/gallery/UGCUploadForm";

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const queryClient = useQueryClient();
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(
    null,
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(
    null,
  );
  const [ugcUploadOpen, setUgcUploadOpen] = useState(false);
  const [selectedOrderForUgc, setSelectedOrderForUgc] = useState<Order | null>(null);

  const invalidateOrderQueries = () => {
    if (orderId) {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  useEffect(() => {
    const loadMidtransScript = async () => {
      try {
        // Fetch config from backend
        // We use fetch directly here to avoid circular dependency or complex service setup for this simple call
        // Adjust the base URL as needed, assuming api is configured with base URL
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
        const url = baseUrl.endsWith("/v1")
          ? `${baseUrl}/config/payment`
          : `${baseUrl}/v1/config/payment`;
        const response = await fetch(url);
        const config = await response.json();

        const scriptUrl = config.snap_url;
        const clientKey = config.client_key;

        // Check if script is already loaded
        if (document.querySelector(`script[src="${scriptUrl}"]`)) return;

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error("Failed to load payment config", error);
        toast.error("Gagal memuat konfigurasi pembayaran.");
      }
    };

    loadMidtransScript();
  }, []);

  const payFinalMutation = useMutation<
    { snap_token: string; message?: string },
    Error,
    string
  >({
    mutationFn: (id: string) => getFinalPaymentSnapToken(id),
    onSuccess: (data) => {
      const snapInstance = window.snap;

      if (!snapInstance) {
        toast.error("Gagal memproses pembayaran. Snap.js belum dimuat.");
        return;
      }

      if (!data.snap_token) {
        toast.error(
          "Gagal memproses pembayaran. Token pembayaran tidak ditemukan.",
        );
        return;
      }

      snapInstance.pay(data.snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran sisa tagihan berhasil!");
          invalidateOrderQueries();
        },
        onPending: () => {
          toast.info("Menunggu pembayaran Anda...");
        },
        onError: () => {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          toast.info("Anda menutup pop-up pembayaran.");
        },
      });
    },
    onError: (error) => {
      toast.error(`Gagal mendapatkan token pembayaran: ${error.message}`);
    },
  });

  const retryPaymentMutation = useMutation<
    { snap_token: string; message: string },
    Error,
    string
  >({
    mutationFn: (id: string) => retryPayment(id),
    onMutate: (id) => {
      setRetryingOrderId(id);
    },
    onSuccess: (data) => {
      const snapInstance = window.snap;

      if (!snapInstance) {
        toast.error("Gagal memproses pembayaran. Snap.js belum dimuat.");
        return;
      }

      if (!data.snap_token) {
        toast.error(
          "Gagal memproses pembayaran. Token pembayaran tidak ditemukan.",
        );
        return;
      }

      snapInstance.pay(data.snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          invalidateOrderQueries();
        },
        onPending: () => {
          toast.info("Menunggu pembayaran Anda...");
        },
        onError: () => {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          toast.info("Anda menutup pop-up pembayaran.");
        },
      });
    },
    onError: (error) => {
      toast.error(`Gagal memulai pembayaran: ${error.message}`);
    },
    onSettled: () => {
      setRetryingOrderId(null);
    },
  });

  const handleRetryPayment = (id: string) => {
    retryPaymentMutation.mutate(id);
  };

  // Helper function to check if order can be cancelled
  const canCancelOrder = (order: Order): boolean => {
    // Terminal statuses that cannot be cancelled
    const terminalStatuses = ["Cancelled", "Refunded", "Failed", "Completed"];
    if (terminalStatuses.includes(order.order_status)) {
      return false;
    }

    // Has active cancellation request
    if (order.active_cancellation_request) {
      return false;
    }

    // Only these statuses can be cancelled
    const cancellableStatuses = ["Pending Payment", "Partially Paid", "Paid"];
    if (!cancellableStatuses.includes(order.order_status)) {
      return false;
    }

    // For paid orders, check 24-hour window
    if (
      order.order_status === "Paid" ||
      order.order_status === "Partially Paid"
    ) {
      const hoursSinceCreation = Math.floor(
        (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60),
      );
      if (hoursSinceCreation > 24) {
        return false;
      }
    }

    return true;
  };

  // Helper function to check if user can upload photos (completed orders)
  const canUploadPhoto = (order: Order): boolean => {
    return order.order_status === "Completed" && order.payment_status === "paid";
  };

  const handleUploadPhotoClick = (order: Order) => {
    setSelectedOrderForUgc(order);
    setUgcUploadOpen(true);
  };

  // Helper function to check if order has physical products
  const hasPhysicalProducts = (order: Order): boolean => {
    return order.items.some((item) => item.product.product_type === "physical");
  };

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      cancelOrder(orderId, { reason }),
    onSuccess: (data) => {
      toast.success(data.message);
      setShowCancelDialog(false);
      setOrderToCancel(null);
      invalidateOrderQueries();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membatalkan pesanan");
    },
  });

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (orderToCancel) {
      cancelOrderMutation.mutate({
        orderId: orderToCancel.id.toString(),
        reason,
      });
    }
  };

  // Helper function to check if invoice can be downloaded
  const canDownloadInvoice = (order: Order): boolean => {
    return (
      order.payment_status === "paid" ||
      order.payment_status === "partially_paid"
    );
  };

  // Handle invoice download
  const handleDownloadInvoice = async (orderId: string | number) => {
    try {
      setDownloadingInvoice(orderId.toString());
      await downloadInvoice(orderId);
      toast.success("Invoice berhasil diunduh!");
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Gagal mengunduh invoice. Silakan coba lagi.");
    } finally {
      setDownloadingInvoice(null);
    }
  };

  // Handle opening write review dialog
  const handleWriteReview = (item: OrderItem) => {
    setSelectedOrderItem(item);
    setReviewDialogOpen(true);
  };

  // Handle opening edit review dialog
  const handleEditReview = (item: OrderItem) => {
    setSelectedOrderItem(item);
    setReviewDialogOpen(true);
  };

  // Fetch single order if orderId is present
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  // Fetch list of orders if no orderId is present
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: !orderId,
  });

  // --- Loading State ---
  if (isOrderLoading || isOrdersLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">
          Memuat Data Pesanan...
        </p>
      </div>
    );
  }

  // --- Error State ---
  if (isOrderError || isOrdersError) {
    return (
      <div className="bg-card container mt-20 mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-destructive">
          Gagal Memuat Pesanan
        </h1>
        <p className="text-muted-foreground">
          Terjadi kesalahan saat mengambil data pesanan Anda. Silakan coba lagi
          nanti.
        </p>
      </div>
    );
  }

  // --- Render Single Order Detail ---
  if (orderId) {
    const order = orderData;
    if (!order) {
      return (
        <div className="container mt-20 mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-foreground">
            Pesanan Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground">
            Pesanan dengan ID {orderId} tidak ditemukan.
          </p>
        </div>
      );
    }

    const statusInfo = getOrderStatusInfo(order.order_status);
    const paymentStatusInfo = getPaymentStatusInfo(order.payment_status);

    const amountPaid = Number(order.amount_paid ?? 0);
    const remainingBalance = Number(
      order.remaining_balance ?? Math.max(order.total_amount - amountPaid, 0),
    );
    const paymentOptionLabel = getPaymentOptionLabel(order.payment_option);

    const handlePayFinal = () => {
      payFinalMutation.mutate(order.id.toString());
    };

    const isRetryingThisOrder =
      retryPaymentMutation.isPending && retryingOrderId === order.id.toString();

    return (
      <div className="container mt-20 mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                  <CardTitle>
                    <h1 className="text-2xl text-foreground">Detail Pesanan</h1>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Pesanan #{order.order_number}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge
                    variant={statusInfo.variant}
                    className="text-base text-center"
                  >
                    {statusInfo.text}
                  </Badge>
                  <Badge
                    variant={paymentStatusInfo.variant}
                    className="text-base text-center"
                  >
                    {paymentStatusInfo.text}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Ringkasan Pesanan */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-foreground">Tanggal Pesanan</p>
                  <p className="text-muted-foreground font-medium">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-foreground">Total Pesanan</p>
                  <p className="font-medium text-lg text-muted-foreground">
                    {formatRupiah(order.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-foreground">Jumlah Dibayar</p>
                  <p className="font-medium text-lg text-muted-foreground">
                    {formatRupiah(amountPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-foreground">Sisa Tagihan</p>
                  <p className="font-medium text-lg text-muted-foreground">
                    {formatRupiah(remainingBalance)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Item yang Dipesan */}
              <div>
                <h4 className="mb-4 text-foreground">Item yang Dipesan</h4>
                <div className="space-y-4">
                  {(order.items || []).map((item) => {
                    // Build image src using the utility function
                    const imageUrl = getImageUrl(
                      item.product.featured_image?.image_url,
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex items-start space-x-4 border-b pb-4 last:border-b-0"
                      >
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <div className="flex-grow">
                          <p className="text-foreground font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Jumlah: {item.quantity}
                          </p>
                          {item.product.product_type === "physical" && (
                            <p className="text-sm text-muted-foreground">
                              Varian:{" "}
                              {item.variant?.options
                                ?.map((o) => o.value)
                                .join(", ") || "-"}
                            </p>
                          )}

                          {/* Review Status/Button */}
                          {item.review ? (
                            <div className="mt-2 flex items-center gap-2">
                              <Badge
                                variant={
                                  item.review.is_approved
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {item.review.is_approved ? (
                                  <>
                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                    Sudah Diulas ({item.review.rating}/5)
                                  </>
                                ) : (
                                  "⏳ Ulasan Menunggu Persetujuan"
                                )}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReview(item)}
                                className="h-7 text-xs"
                              >
                                Edit Ulasan
                              </Button>
                            </div>
                          ) : item.can_review ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWriteReview(item)}
                              className="mt-2 h-8 text-xs"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Tulis Ulasan
                            </Button>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {formatRupiah(item.sub_total)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Opsi Pembayaran:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paymentOptionLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Detail Pernikahan & Pengiriman */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-4 text-foreground">Informasi Pernikahan</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span>Mempelai:</span>{" "}
                      {order.custom_data?.bride_full_name} &{" "}
                      {order.custom_data?.groom_full_name}
                    </p>
                    <p>
                      <span>Akad:</span>{" "}
                      {order.custom_data?.akad_date &&
                        new Date(
                          order.custom_data.akad_date,
                        ).toLocaleDateString("id-ID")}{" "}
                      di {order.custom_data?.akad_location}
                    </p>
                    <p>
                      <span>Resepsi:</span>{" "}
                      {order.custom_data?.reception_date &&
                        new Date(
                          order.custom_data.reception_date,
                        ).toLocaleDateString("id-ID")}{" "}
                      di {order.custom_data?.reception_location}
                    </p>
                  </div>
                </div>
                {hasPhysicalProducts(order) && (
                  <div>
                    <h4 className="mb-4 text-foreground">Alamat Pengiriman</h4>
                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                      {order.shipping_address}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Design Proof Section - Only for Physical Products */}
              {hasPhysicalProducts(order) && (
                <div>
                  <DesignProofViewer orderId={order.id} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                {order.payment_status === "pending" &&
                  order.order_status !== "Cancelled" && (
                    <Button
                      size="default"
                      variant="secondary"
                      onClick={() => handleRetryPayment(order.id.toString())}
                      disabled={isRetryingThisOrder}
                    >
                      {isRetryingThisOrder
                        ? "Membuka Pembayaran..."
                        : "Bayar Sekarang"}
                    </Button>
                  )}
                {order.payment_status === "partially_paid" &&
                  order.order_status !== "Cancelled" && (
                    <Button
                      onClick={handlePayFinal}
                      disabled={
                        payFinalMutation.isPending || remainingBalance <= 0
                      }
                    >
                      {payFinalMutation.isPending
                        ? "Membuka Pembayaran..."
                        : "Lakukan Pelunasan"}
                    </Button>
                  )}
                {canDownloadInvoice(order) && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(order.id)}
                    disabled={downloadingInvoice === order.id.toString()}
                  >
                    {downloadingInvoice === order.id.toString() ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <FileDown className="mr-2 h-4 w-4" />
                        Unduh Invoice
                      </>
                    )}
                  </Button>
                )}
                {canUploadPhoto(order) && (
                  <Button
                    variant="default"
                    onClick={() => handleUploadPhotoClick(order)}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Bagikan Foto
                  </Button>
                )}
                {canCancelOrder(order) && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelClick(order)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    Batalkan Pesanan
                  </Button>
                )}
              </div>

              {/* Cancellation Request Status */}
              {order.active_cancellation_request && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Permintaan Pembatalan Sedang Diproses
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Status:{" "}
                    <strong>
                      {order.active_cancellation_request.status === "pending"
                        ? "Menunggu Persetujuan"
                        : order.active_cancellation_request.status}
                    </strong>
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Alasan:{" "}
                    {order.active_cancellation_request.cancellation_reason}
                  </p>
                  {order.active_cancellation_request.admin_notes && (
                    <p className="text-sm text-yellow-700 mt-1">
                      Catatan Admin:{" "}
                      {order.active_cancellation_request.admin_notes}
                    </p>
                  )}
                </div>
              )}

              {(order.payment_status === "pending" ||
                order.payment_status === "partially_paid") &&
                order.order_status !== "Cancelled" &&
                !order.active_cancellation_request && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {order.payment_status === "pending"
                      ? "Lanjutkan pembayaran untuk memproses pesanan Anda."
                      : "Selesaikan pembayaran untuk melanjutkan pesanan Anda."}
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Cancel Order Dialog */}
          {orderToCancel && (
            <CancelOrderDialog
              open={showCancelDialog}
              onOpenChange={setShowCancelDialog}
              onConfirm={handleConfirmCancel}
              isLoading={cancelOrderMutation.isPending}
              orderNumber={orderToCancel.order_number}
            />
          )}

          {/* Review Dialog */}
          {selectedOrderItem && (
            <ReviewDialog
              open={reviewDialogOpen}
              onOpenChange={setReviewDialogOpen}
              orderItemId={selectedOrderItem.id}
              productId={selectedOrderItem.product.id}
              productName={selectedOrderItem.product.name}
              existingReview={
                selectedOrderItem.review
                  ? {
                      id: selectedOrderItem.review.id,
                      rating: selectedOrderItem.review.rating,
                      comment: selectedOrderItem.review.comment,
                      is_approved: selectedOrderItem.review.is_approved,
                      created_at: selectedOrderItem.review.created_at,
                      is_verified: false,
                      is_featured: false,
                      helpful_count: 0,
                      admin_response: null,
                      admin_responded_at: null,
                      updated_at: selectedOrderItem.review.created_at,
                      customer: { id: 0, full_name: "" },
                      product: {
                        id: selectedOrderItem.product.id,
                        name: selectedOrderItem.product.name,
                      },
                      images: [],
                    }
                  : null
              }
              onSuccess={() => {
                toast.success("Ulasan berhasil dikirim!");
                invalidateOrderQueries();
                setReviewDialogOpen(false);
              }}
            />
          )}

          {/* UGC Upload Dialog */}
          {selectedOrderForUgc && (
            <UGCUploadForm
              open={ugcUploadOpen}
              onOpenChange={setUgcUploadOpen}
              orderId={selectedOrderForUgc.id}
              onSuccess={() => {
                toast.success("Foto berhasil diunggah!");
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // --- Render List of Orders ---
  const orders = ordersData;
  if (!orders || orders.length === 0) {
    return (
      <div className="container rounded-md mt-20 text-center py-20">
        <div className="bg-card inline-block px-16 py-12 rounded-md shadow-md">
          <CardTitle>Belum Ada Pesanan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Silakan jelajahi produk kami!
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/80"
          >
            Jelajahi Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Daftar Pesanan Anda
        </h1>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.order_status);
            const paymentStatusInfo = getPaymentStatusInfo(
              order.payment_status,
            );
            const listAmountPaid = Number(order.amount_paid ?? 0);
            const listRemainingBalance = Number(
              order.remaining_balance ??
                Math.max(order.total_amount - listAmountPaid, 0),
            );
            return (
              <Card key={order.id}>
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-grow mb-2 md:mb-0">
                    <Link
                      to={`/status-pesanan/${order.id}`}
                      className="text-lg font-semibold hover:underline text-foreground"
                    >
                      Pesanan #{order.order_number}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Tanggal:{" "}
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-md font-bold text-foreground">
                      Total: {formatRupiah(order.total_amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sisa Tagihan: {formatRupiah(listRemainingBalance)}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge
                      variant={statusInfo.variant}
                      className="text-base text-center"
                    >
                      {statusInfo.text}
                    </Badge>
                    <Badge
                      variant={paymentStatusInfo.variant}
                      className="text-base text-center"
                    >
                      {paymentStatusInfo.text}
                    </Badge>
                    {order.payment_status === "pending" &&
                      order.order_status !== "Cancelled" && (
                        <Button
                          size="default"
                          variant="default"
                          className="rounded-full"
                          onClick={() =>
                            handleRetryPayment(order.id.toString())
                          }
                          disabled={
                            retryPaymentMutation.isPending &&
                            retryingOrderId === order.id.toString()
                          }
                        >
                          {retryPaymentMutation.isPending &&
                          retryingOrderId === order.id.toString()
                            ? "Membuka Pembayaran..."
                            : "Bayar Sekarang"}
                        </Button>
                      )}
                    {canDownloadInvoice(order) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(order.id)}
                        disabled={downloadingInvoice === order.id.toString()}
                      >
                        {downloadingInvoice === order.id.toString() ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengunduh...
                          </>
                        ) : (
                          <>
                            <FileDown className="mr-2 h-4 w-4" />
                            Invoice
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
