import { useState, useEffect, FormEvent } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShoppingCart } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { createGuestOrder, createOrder, getShippingCost } from '@/services/checkoutService';

import { useAuth } from '@/context/AuthContext';


import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

import { useNavigate } from 'react-router-dom';



const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "Mid-client-6W1y3oBKXW-BmodW";

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Shipping State
  const [shippingServices, setShippingServices] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingService, setShippingService] = useState<string>(" ");
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);



  useEffect(() => {
    if (user) {
      if (!user.address || !user.postal_code) {
        toast({
          title: "Alamat Profil Tidak Lengkap",
          description: "Mohon lengkapi alamat Anda di halaman profil sebelum melanjutkan checkout.",
          variant: "destructive",
        });
        // Optionally disable checkout button or redirect
      } else if (user.postal_code && selectedCourier) {
        const fetchShippingCost = async () => {
          setIsCalculatingCost(true);
          try {
            const response = await getShippingCost("78116", user.postal_code, 1000, selectedCourier);
            setShippingServices(response.rajaongkir.results[0].costs);
          } catch (error) {
            console.error("Error fetching shipping cost:", error);
            toast({
              title: "Gagal Menghitung Biaya Kirim",
              description: "Tidak dapat mengambil data biaya pengiriman.",
              variant: "destructive",
            });
          } finally {
            setIsCalculatingCost(false);
          }
        };
        fetchShippingCost();
      }
    } else {
      toast({
        title: "Login Diperlukan",
        description: "Mohon login untuk melanjutkan checkout. Checkout sebagai tamu tidak didukung tanpa alamat profil.",
        variant: "destructive",
      });
      // Optionally disable checkout button or redirect
    }
  }, [user.postal_code, selectedCourier, toast]);

  const handleServiceSelection = (value: string) => {
    const [service, cost] = value.split("|");
    setShippingService(service);
    setShippingCost(Number(cost));
  };





  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shippingCost === 0 && cart.items.some(item => item.product?.requires_shipping)) {
      toast({
        title: "Pilih Layanan Pengiriman",
        description: "Anda harus memilih layanan pengiriman terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullAddress = [
      user?.address,
      user?.city_name,
      user?.province_name,
      user?.postal_code,
    ]
      .filter(Boolean)
      .join(", ");

    formData.append("shipping_address", fullAddress);
    formData.append("destination_city_id", String(user?.city_id));
    formData.append("weight", "1000");
    formData.append("courier", selectedCourier);
    formData.append("shipping_cost", String(shippingCost));
    formData.append("shipping_service", shippingService);

    try {
      const order = user ? await createOrder(formData) : await createGuestOrder(formData);
      setSnapToken(order.snap_token);

      if (order.snap_token) {
        window.snap.pay(order.snap_token, {
          onSuccess: function (result) {
            console.log("success", result);
            toast({ title: "Pembayaran Berhasil!", description: "Anda akan diarahkan ke halaman konfirmasi pesanan." });
            navigate(`/order-confirmation/${order.data.id}`);
          },
          onPending: function (result) {
            console.log("pending", result);
            toast({ title: "Pembayaran Tertunda", description: "Selesaikan pembayaran Anda sebelum batas waktu." });
            navigate(`/order-confirmation/${order.data.id}`);
          },
          onError: function (result) {
            console.log("error", result);
            toast({ title: "Pembayaran Gagal", description: "Silakan coba lagi.", variant: "destructive" });
          },
          onClose: function () {
            toast({ title: "Pembayaran Dibatalkan", description: "Anda dapat melanjutkan pembayaran nanti dari halaman pesanan Anda." });
          }
        });
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join('\n') : error.response?.data?.message || "Terjadi kesalahan.";
      toast({ title: "Gagal Membuat Pesanan", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isCartLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
        <p className="mt-4 text-lg">Memuat Checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <ShoppingCart className="h-20 w-20 mx-auto text-gray-300" />
        <h1 className="text-3xl font-semibold mt-4">Keranjang Anda Kosong</h1>
        <p className="text-gray-500 mt-2">
          Anda tidak bisa melanjutkan ke checkout karena keranjang kosong.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Kontak Anda</CardTitle>
              <p className="text-sm text-gray-500">Kami akan mengirimkan konfirmasi pesanan ke email ini.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nama Anda</Label>
                <Input id="customer_name" name="customer_name" defaultValue={user?.full_name} placeholder="Nama Lengkap Anda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email Anda</Label>
                <Input id="customer_email" name="customer_email" type="email" defaultValue={user?.email} placeholder="email@example.com" required />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat Pengiriman</CardTitle>
              <p className="text-sm text-gray-500">Alamat pengiriman dari profil anda</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provinsi</Label>
                <p className="text-sm text-gray-500">{user?.province_name || ''}</p>
              </div>
              <div className="space-y-2">
                <Label>Kota/Kabupaten</Label>
                <p className="text-sm text-gray-500">{user?.city_name || ''}</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="shipping_address">Alamat Lengkap</Label>
                <p className="text-sm text-gray-500">{user?.address || ''}</p>
              </div>
              <div className="space-y-2">
                <Label>Kode Pos</Label>
                <p className="text-sm text-gray-500">{user?.postal_code || ''}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Data Pernikahan */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pernikahan</CardTitle>
              <p className="text-sm text-gray-500">Isi detail lengkap untuk undangan Anda.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Mempelai */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Mempelai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bride_full_name">Nama Lengkap Mempelai Wanita</Label>
                    <Input id="bride_full_name" name="bride_full_name" placeholder="Adinda Putri" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_full_name">Nama Lengkap Mempelai Pria</Label>
                    <Input id="groom_full_name" name="groom_full_name" placeholder="Budi Setiawan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_nickname">Nama Panggilan Mempelai Wanita</Label>
                    <Input id="bride_nickname" name="bride_nickname" placeholder="Dinda" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_nickname">Nama Panggilan Mempelai Pria</Label>
                    <Input id="groom_nickname" name="groom_nickname" placeholder="Budi" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_parents">Nama Orang Tua Mempelai Wanita</Label>
                    <Input id="bride_parents" name="bride_parents" placeholder="Bpk. Hermawan & Ibu Sri Lestari" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_parents">Nama Orang Tua Mempelai Pria</Label>
                    <Input id="groom_parents" name="groom_parents" placeholder="Bpk. Agus Salim & Ibu Wati" required />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Detail Acara */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detail Akad Nikah</h3>
                  <div className="space-y-2">
                    <Label htmlFor="akad_date">Tanggal Akad</Label>
                    <Input id="akad_date" name="akad_date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_time">Waktu Akad</Label>
                    <Input id="akad_time" name="akad_time" placeholder="09:00 WIB" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_location">Lokasi Akad</Label>
                    <Input id="akad_location" name="akad_location" placeholder="Masjid Raya Mujahidin" required />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detail Resepsi</h3>
                  <div className="space-y-2">
                    <Label htmlFor="reception_date">Tanggal Resepsi</Label>
                    <Input id="reception_date" name="reception_date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_time">Waktu Resepsi</Label>
                    <Input id="reception_time" name="reception_time" placeholder="19:00 WIB" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_location">Lokasi Resepsi</Label>
                    <Input id="reception_location" name="reception_location" placeholder="Gedung Pontianak Convention Center" required />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Data Pendukung */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Pendukung (Opsional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="gmaps_link">Link Google Maps</Label>
                  <Input id="gmaps_link" name="gmaps_link" type="url" placeholder="https://maps.app.goo.gl/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prewedding_photo">Foto Pre-wedding</Label>
                  <Input id="prewedding_photo" name="prewedding_photo" type="file" />
                  <p className="text-xs text-gray-500">Unggah satu foto untuk desain undangan Anda.</p>
                </div>
              </div>
            </CardContent>
          </Card>






        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.items.map((item) => {
                  return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {item.variant?.images && item.variant.images.length > 0 && (
                        <img src={item.variant.images[0].image} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.product?.name} x {item.quantity}</p>
                        <p className="text-xs text-gray-500">{item.customizations?.options?.map((opt: { name: string, value: string }) => opt.value).join(' / ')}</p>
                      </div>
                    </div>
                    <span>{formatRupiah(item.sub_total)}</span>
                  </div>
                )})}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Label htmlFor="courier">Kurir</Label>
                <Select onValueChange={setSelectedCourier} defaultValue={selectedCourier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kurir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jne">JNE</SelectItem>
                    <SelectItem value="pos">POS Indonesia</SelectItem>
                    <SelectItem value="jnt">J&T</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Label htmlFor="shipping-service">Layanan Pengiriman</Label>
                <Select onValueChange={handleServiceSelection} disabled={isCalculatingCost || shippingServices.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={isCalculatingCost ? "Menghitung..." : "Pilih layanan"} />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingServices.map((service) => (
                      <SelectItem key={service.service} value={`${service.service}|${service.cost[0].value}`}>
                        <div className="flex justify-between w-full">
                          <span>{service.description} ({service.service})</span>
                          <span>{formatRupiah(service.cost[0].value)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengiriman ({shippingService})</span>
                <span>{formatRupiah(shippingCost)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(cart.subtotal + shippingCost)}</span>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || isCalculatingCost || !user}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat Pesanan
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};


export default CheckoutPage;
