import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOrderById, downloadInvoice, type Order } from "@/features/order/services/orderService";
import { Loader2, CheckCircle, XCircle, FileDown } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Badge } from "@/components/ui/utils/badge";
import { Button } from "@/components/ui/buttons/button";
import { formatRupiah, getImageUrl } from "@/lib/utils";
import {
  getOrderStatusInfo,
  getPaymentStatusInfo,
} from "@/features/order/utils/statusLabels";
type VariantWithImages = {
  id: number;
  images?: Array<{ image_url?: string }>;
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper function to check if order has physical products
  const hasPhysicalProducts = (order: Order): boolean => {
    return order.items.some((item) => item.product.product_type === "physical");
  };

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId, // Only run query if orderId is available
  });

  const handleDownloadInvoice = async () => {
    if (!orderId) return;

    setIsDownloading(true);
    try {
      await downloadInvoice(orderId);
      toast({
        title: "Invoice Downloaded",
        description: "Invoice berhasil diunduh",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Gagal mengunduh invoice. Pastikan pembayaran telah lunas.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          Memuat detail pesanan...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <XCircle className="h-12 w-12 mx-auto text-destructive" />
        <h1 className="text-3xl font-semibold mt-4 text-foreground">
          Gagal Memuat Pesanan
        </h1>
        <p className="text-muted-foreground mt-2">
          Terjadi kesalahan saat memuat detail pesanan Anda:{" "}
          {error?.message || "Unknown error"}.
        </p>
        <Button asChild variant="link" className="mt-4 text-base">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <XCircle className="h-12 w-12 mx-auto text-destructive" />
        <h1 className="text-3xl font-semibold mt-4 text-foreground">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground mt-2">
          Detail pesanan yang Anda cari tidak ditemukan.
        </p>
        <Button asChild variant="link" className="mt-4 text-base">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const orderStatusInfo = getOrderStatusInfo(order.order_status);
  const paymentStatusInfo = getPaymentStatusInfo(order.payment_status);

  return (
    <div className="container mt-20 mx-auto px-4 py-12">
      <section className="bg-card relative overflow-hidden rounded-3xl border border-border/60 px-6 py-10 text-center shadow-[0_30px_80px_rgba(15,15,15,0.08)]">
        <div
          className="absolute inset-x-0 top-0 mx-auto h-40 w-40 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle className="text-foreground h-12 w-12" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Pesanan Berhasil
          </p>
          <h1 className="mt-3 text-4xl font-bold text-foreground">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Terima kasih atas pesanan Anda.
          </p>
          <p className="text-base text-muted-foreground">
            Pesanan anda akan segera diproses.
          </p>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              Pesanan #{order.order_number}
            </Badge>
            <Badge
              variant={orderStatusInfo.variant}
              className="px-4 py-1.5 text-sm"
            >
              Status Pesanan · {orderStatusInfo.text}
            </Badge>
            <Badge
              variant={paymentStatusInfo.variant}
              className="px-4 py-1.5 text-sm"
            >
              Status Pembayaran · {paymentStatusInfo.text}
            </Badge>
          </div>
        </div>
      </section>

      <Card className="mx-auto mt-10 max-w-4xl rounded-3xl border-border/60 shadow-xl backdrop-blur-sm">
        <CardHeader className="rounded-t-3xl bg-muted/30">
          <CardTitle className="text-foreground">Detail Pesanan</CardTitle>
          <CardDescription className="text-sm">
            Dibuat pada {orderDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Tanggal Pesanan
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {orderDate}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Status Pesanan
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {orderStatusInfo.text}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Status Pembayaran
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {paymentStatusInfo.text}
              </p>
            </div>
            {hasPhysicalProducts(order) && (
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Alamat Pengiriman
                </p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {order.shipping_address}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-foreground">
                Item Pesanan
              </h3>
              <span className="flex-1 border-t border-border/60" />
            </div>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => {
                const variants = (
                  item.product as { variants?: VariantWithImages[] }
                )?.variants;
                const variantImage = variants?.find(
                  (v) => v.id === item.variant.id,
                )?.images?.[0]?.image_url;
                const imageUrl = variantImage
                  ? getImageUrl(variantImage)
                  : "/placeholder.svg";
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-xl border border-border/60 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Jumlah: {item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Harga Satuan: {formatRupiah(item.unit_price)}
                        </p>
                      </div>
                    </div>
                    <div className="md:ml-auto text-left md:text-right">
                      <p className="text-base font-semibold text-foreground">
                        {formatRupiah(item.sub_total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total jumlah
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-6">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Total Pesanan</span>
                <span className="text-base font-semibold text-foreground">
                  {formatRupiah(order.total_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Jumlah Dibayar</span>
                <span className="text-base font-semibold text-foreground">
                  {formatRupiah(order.amount_paid)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-foreground">
                <span className="text-lg font-semibold">Sisa Tagihan</span>
                <span className="text-2xl font-bold text-card-foreground">
                  {formatRupiah(order.remaining_balance)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(order.payment_status === 'paid' || order.payment_status === 'partially_paid') && (
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </Button>
            )}
            <Button asChild className="w-full sm:w-auto">
              <Link to="/status-pesanan">Lihat Semua Pesanan Anda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
