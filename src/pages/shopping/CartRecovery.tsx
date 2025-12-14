import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alerts/alert";
import apiClient from "@/lib/api";
import { formatRupiah } from "@/lib/utils";

interface CartItem {
  product_name: string;
  variant_name: string;
  quantity: number;
  price: number;
}

interface AbandonedCartData {
  email: string;
  name: string;
  items: CartItem[];
  total: number;
  items_count: number;
  abandoned_at: string;
}

interface RecoveryError {
  error: "invalid_token" | "already_recovered" | "token_expired" | "recovery_failed";
  message: string;
  recovered_at?: string;
}

export default function CartRecovery() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [cartData, setCartData] = useState<AbandonedCartData | null>(null);
  const [error, setError] = useState<RecoveryError | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/cart");
      return;
    }

    fetchCartData();
  }, [token, navigate]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/v1/cart/recover/${token}`);
      setCartData(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch abandoned cart:", err);
      setError({
        error: err.response?.data?.error || "invalid_token",
        message: err.response?.data?.message || "Token pemulihan tidak valid.",
        recovered_at: err.response?.data?.recovered_at,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async () => {
    try {
      setRecovering(true);
      const response = await apiClient.post(`/v1/cart/recover/${token}`);
      
      setSuccess(true);
      
      // Show success message for 2 seconds then redirect to cart
      setTimeout(() => {
        navigate("/cart", { 
          state: { 
            message: response.data.message,
            recoveredCount: response.data.data?.recovered_items_count 
          } 
        });
      }, 2000);
    } catch (err: any) {
      console.error("Failed to recover cart:", err);
      setError({
        error: err.response?.data?.error || "recovery_failed",
        message: err.response?.data?.message || "Gagal memulihkan keranjang. Silakan coba lagi.",
      });
    } finally {
      setRecovering(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20 bg-background">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">
          Memuat keranjang Anda...
        </p>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="container mt-20 mx-auto max-w-2xl py-10">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <CardTitle className="text-2xl text-green-900">
              Keranjang Berhasil Dipulihkan!
            </CardTitle>
            <CardDescription className="text-green-700">
              Mengalihkan ke halaman keranjang...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-20 mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error.error === "invalid_token" && "Token Tidak Valid"}
            {error.error === "already_recovered" && "Sudah Dipulihkan"}
            {error.error === "token_expired" && "Token Kedaluwarsa"}
            {error.error === "recovery_failed" && "Gagal Memulihkan"}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {error.message}
            {error.recovered_at && (
              <span className="block mt-2 text-sm">
                Dipulihkan pada: {new Date(error.recovered_at).toLocaleString("id-ID")}
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="mt-6 text-center">
          <Button onClick={() => navigate("/cart")} className="mr-2">
            Lihat Keranjang
          </Button>
          <Button onClick={() => navigate("/products")} variant="outline">
            Lanjut Belanja
          </Button>
        </div>
      </div>
    );
  }

  // Cart data preview
  return (
    <div className="container mt-20 mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <ShoppingCart className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle className="text-2xl text-center">
            Pulihkan Keranjang Anda
          </CardTitle>
          <CardDescription className="text-center">
            Kami menemukan {cartData?.items_count} produk dalam keranjang Anda
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Cart items preview */}
          <div className="space-y-4 mb-6">
            {cartData?.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product_name}</h3>
                  {item.variant_name && (
                    <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Jumlah: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>{formatRupiah(cartData?.total || 0)}</span>
            </div>
          </div>

          {/* Info alert */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Informasi</AlertTitle>
            <AlertDescription>
              Produk yang sudah tidak tersedia tidak akan ditambahkan ke keranjang.
            </AlertDescription>
          </Alert>

          {/* Action buttons */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button
              onClick={handleRecover}
              disabled={recovering}
              className="flex-1"
              size="lg"
            >
              {recovering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memulihkan...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Pulihkan Keranjang
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate("/products")}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Lanjut Belanja
            </Button>
          </div>

          {/* Abandoned date */}
          {cartData?.abandoned_at && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Keranjang ditinggalkan pada:{" "}
              {new Date(cartData.abandoned_at).toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
