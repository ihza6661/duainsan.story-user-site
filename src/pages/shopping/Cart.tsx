import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/utils/card";
import { Trash2, Loader2, ShoppingCart } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { formatRupiah } from "@/lib/utils";
import { CartItem } from "@/features/cart/components/CartItem";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, clearCart, isMutating } =
    useCart();
  const navigate = useNavigate();

  const debouncedUpdateQuantity = useDebouncedCallback(updateQuantity, 500);

  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20 bg-background">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">Memuat Keranjang Anda...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-semibold mt-4 text-foreground">Keranjang Anda Kosong</h1>
        <p className="text-muted-foreground mt-2">
          Jelajahi produk kami dan temukan produk yang Anda sukai!
        </p>
        <Button asChild className="mt-6">
          <Link to="/products">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <div className="flex flex-col w-full mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Keranjang Belanja Anda</h1>
        <Button variant="outline" onClick={clearCart} disabled={isMutating} className="mt-4 w-fit rounded-lg">
          <Trash2 className="w-4 h-4 mr-2" />
          Kosongkan Keranjang
        </Button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 relative ${isMutating ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Kolom Kiri: Daftar Item */}

        <div className="col-span-1 md:col-span-2 rounded-xl shadow-sm">
          <Card className="h-full shadow-none bg-background">
            <CardContent className="p-0 sm:p-2 md:p-4">
              <div className="divide-y divide-border">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={debouncedUpdateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Ringkasan Belanja */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-sm rounded-xl">
            <CardHeader className="bg-muted/50 rounded-t-xl py-4">
              <CardTitle className="text-lg font-semibold text-center">Ringkasan Belanja</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="text-right">Akan dihitung saat checkout</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatRupiah(cart.subtotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="rounded-b-xl py-4">
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full"
                disabled={isMutating}
              >
                Lanjut ke Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

