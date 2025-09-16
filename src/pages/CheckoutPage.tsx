import React, { useState, FormEvent } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShoppingCart } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { createGuestOrder, createOrder } from '@/services/checkoutService';
import { useAuth } from '@/context/AuthContext';

import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    shipping_address: '',
    bride_full_name: '',
    groom_full_name: '',
    bride_nickname: '',
    groom_nickname: '',
    bride_parents: '',
    groom_parents: '',
    akad_date: '',
    akad_time: '',
    akad_location: '',
    reception_date: '',
    reception_time: '',
    reception_location: '',
    gmaps_link: '',
    prewedding_photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, prewedding_photo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    // Append all formData fields to the FormData object
    Object.entries(formData).forEach(([key, value]) => {
      // Append all fields, even if empty, so backend can validate required fields
      if (key === "prewedding_photo" && value instanceof File) {
        data.append(key, value);
      } else if (key !== "prewedding_photo") {
        data.append(key, String(value));
      }
    });

    try {
      let order;
      if (user) {
        order = await createOrder(data);
      } else {
        order = await createGuestOrder(data);
      }
      toast({
        title: "Pesanan Berhasil Dibuat!",
        description: "Anda akan segera dihubungi oleh tim kami untuk proses selanjutnya.",
      });
      const orderId = order.id; // Access order.id directly
      navigate(`/order-confirmation/${orderId}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      let errorMessage = "Terjadi kesalahan saat memproses pesanan Anda.";
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Convert validation errors object to a string
          errorMessage = Object.values(error.response.data.errors).flat().join('\n');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast({
        title: "Gagal Membuat Pesanan",
        description: errorMessage,
        variant: "destructive",
      });
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
                <Input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Nama Lengkap Anda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email Anda</Label>
                <Input id="customer_email" name="customer_email" type="email" value={formData.customer_email} onChange={handleChange} placeholder="email@example.com" required />
              </div>
            </CardContent>
          </Card>

          {/* Form Data Pernikahan */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pernikahan</CardTitle>
              <p className="text-sm text-gray-500">Silakan isi detail lengkap untuk undangan Anda.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Mempelai */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Mempelai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bride_full_name">Nama Lengkap Mempelai Wanita</Label>
                    <Input id="bride_full_name" name="bride_full_name" value={formData.bride_full_name} onChange={handleChange} placeholder="Adinda Putri" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_full_name">Nama Lengkap Mempelai Pria</Label>
                    <Input id="groom_full_name" name="groom_full_name" value={formData.groom_full_name} onChange={handleChange} placeholder="Budi Setiawan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_nickname">Nama Panggilan Mempelai Wanita</Label>
                    <Input id="bride_nickname" name="bride_nickname" value={formData.bride_nickname} onChange={handleChange} placeholder="Dinda" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_nickname">Nama Panggilan Mempelai Pria</Label>
                    <Input id="groom_nickname" name="groom_nickname" value={formData.groom_nickname} onChange={handleChange} placeholder="Budi" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_parents">Nama Orang Tua Mempelai Wanita</Label>
                    <Input id="bride_parents" name="bride_parents" value={formData.bride_parents} onChange={handleChange} placeholder="Bpk. Hermawan & Ibu Sri Lestari" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_parents">Nama Orang Tua Mempelai Pria</Label>
                    <Input id="groom_parents" name="groom_parents" value={formData.groom_parents} onChange={handleChange} placeholder="Bpk. Agus Salim & Ibu Wati" required />
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
                    <Input id="akad_date" name="akad_date" type="date" value={formData.akad_date} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_time">Waktu Akad</Label>
                    <Input id="akad_time" name="akad_time" value={formData.akad_time} onChange={handleChange} placeholder="09:00 WIB" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_location">Lokasi Akad</Label>
                    <Input id="akad_location" name="akad_location" value={formData.akad_location} onChange={handleChange} placeholder="Masjid Raya Mujahidin" required />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detail Resepsi</h3>
                  <div className="space-y-2">
                    <Label htmlFor="reception_date">Tanggal Resepsi</Label>
                    <Input id="reception_date" name="reception_date" type="date" value={formData.reception_date} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_time">Waktu Resepsi</Label>
                    <Input id="reception_time" name="reception_time" value={formData.reception_time} onChange={handleChange} placeholder="19:00 WIB" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_location">Lokasi Resepsi</Label>
                    <Input id="reception_location" name="reception_location" value={formData.reception_location} onChange={handleChange} placeholder="Gedung Pontianak Convention Center" required />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Data Pendukung */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Pendukung (Opsional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="gmaps_link">Link Google Maps</Label>
                  <Input id="gmaps_link" name="gmaps_link" type="url" value={formData.gmaps_link} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prewedding_photo">Foto Pre-wedding</Label>
                  <Input id="prewedding_photo" name="prewedding_photo" type="file" onChange={handleFileChange} />
                  <p className="text-xs text-gray-500">Unggah satu foto untuk desain undangan Anda.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alamat Pengiriman */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat Pengiriman</CardTitle>
              <p className="text-sm text-gray-500">Alamat untuk pengiriman produk fisik.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_address">Alamat Lengkap Pengiriman</Label>
                <Textarea id="shipping_address" name="shipping_address" value={formData.shipping_address} onChange={handleChange} placeholder="Jl. Khatulistiwa No. 1, Pontianak" required className="h-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const STORAGE_URL = import.meta.env.VITE_PUBLIC_STORAGE_URL;
                  const placeholderImage = "/images/placeholder.svg";
                  let imageToDisplay = item.variant?.images?.find(img => img.is_featured) || item.product.featured_image || item.variant?.images?.[0];
                  const imageUrl = imageToDisplay?.image ? `${STORAGE_URL}${imageToDisplay.image}` : placeholderImage;

                  return (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <img src={imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" onError={(e) => (e.currentTarget.src = placeholderImage)} />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
                        </div>
                      </div>
                      <p>{formatRupiah(item.sub_total)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="text-sm">Akan dihitung</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatRupiah(cart.subtotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6">
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Membuat Pesanan...' : 'Buat Pesanan'}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
