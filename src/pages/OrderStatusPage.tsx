import { getImageUrl } from "@/lib/utils";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, fetchOrders } from '@/services/orderService';
import { Loader2 } from 'lucide-react';

const statusMap: { [key: string]: { text: string; variant: "default" | "secondary" | "destructive" } } = {
  pending_payment: { text: "Menunggu Pembayaran", variant: "secondary" },
  processing: { text: "Sedang Diproses", variant: "default" },
  packing: { text: "Sedang Dikemas", variant: "default" },
  shipped: { text: "Telah Dikirim", variant: "default" },
  completed: { text: "Selesai", variant: "default" },
  cancelled: { text: "Dibatalkan", variant: "destructive" },
};

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId?: string }>();

  // Fetch single order if orderId is present
  const { data: orderData, isLoading: isOrderLoading, isError: isOrderError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  // Fetch list of orders if no orderId is present
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: !orderId,
  });

  const STORAGE_URL = import.meta.env.VITE_PUBLIC_STORAGE_URL || '';

  // --- Loading State ---
  if (isOrderLoading || isOrdersLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
        <p className="mt-4 text-lg">Memuat Data Pesanan...</p>
      </div>
    );
  }

  // --- Error State ---
  if (isOrderError || isOrdersError) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-red-500">Gagal Memuat Pesanan</h1>
        <p className="text-gray-600">Terjadi kesalahan saat mengambil data pesanan Anda. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // --- Render Single Order Detail ---
  if (orderId) {
    const order = orderData;
    if (!order) {
      return (
        <div className="container mt-20 mx-auto text-center py-20">
          <h1 className="text-2xl font-bold">Pesanan Tidak Ditemukan</h1>
          <p className="text-gray-600">Pesanan dengan ID {orderId} tidak ditemukan.</p>
        </div>
      );
    }

    const statusInfo = statusMap[order.order_status] || { text: "Status Tidak Diketahui", variant: "secondary" };

    return (
      <div className="container mt-20 mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                  <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                  <p className="text-sm text-gray-500">Pesanan #{order.order_number}</p>
                </div>
                <Badge variant={statusInfo.variant} className="text-base">
                  {statusInfo.text}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Ringkasan Pesanan */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tanggal Pesanan</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Pembayaran</p>
                  <p className="font-medium text-lg text-primary">{formatRupiah(order.total_amount)}</p>
                </div>
              </div>

              <Separator />

              {/* Item yang Dipesan */}
              <div>
                <h3 className="font-semibold mb-4">Item yang Dipesan</h3>
                <div className="space-y-4">
                  {(order.items || []).map(item => {
                    const imageUrl = getImageUrl(item.product.featured_image?.image);
                    return (
                      <div key={item.id} className="flex items-start space-x-4">
                        <img src={imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md border" />
                        <div className="flex-grow">
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Varian: {item.variant?.options?.map(o => o.value).join(', ') || '-'}</p>
                        </div>
                        <p className="text-sm font-medium">{formatRupiah(item.sub_total)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Detail Pernikahan & Pengiriman */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Informasi Pernikahan</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Mempelai:</span> {order.custom_data?.bride_full_name} & {order.custom_data?.groom_full_name}</p>
                    <p><span className="text-gray-500">Akad:</span> {order.custom_data?.akad_date && new Date(order.custom_data.akad_date).toLocaleDateString('id-ID')} di {order.custom_data?.akad_location}</p>
                    <p><span className="text-gray-500">Resepsi:</span> {order.custom_data?.reception_date && new Date(order.custom_data.reception_date).toLocaleDateString('id-ID')} di {order.custom_data?.reception_location}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Alamat Pengiriman</h3>
                  <p className="text-sm whitespace-pre-line">{order.shipping_address}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Render List of Orders ---
  const orders = ordersData;
  if (!orders || orders.length === 0) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Belum Ada Pesanan</h1>
        <p className="text-gray-600">Anda belum memiliki pesanan apapun. Silakan jelajahi produk kami!</p>
        <Link to="/products" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Pesanan Anda</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const statusInfo = statusMap[order.order_status] || { text: "Status Tidak Diketahui", variant: "secondary" };
          return (
            <Card key={order.id}>
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-grow mb-2 md:mb-0">
                  <Link to={`/status-pesanan/${order.id}`} className="text-lg font-semibold hover:underline">
                    Pesanan #{order.order_number}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  
                  <p className="text-md font-bold">Total: {formatRupiah(order.total_amount)}</p>
                </div>
                <Badge variant={statusInfo.variant} className="text-base">
                  {statusInfo.text}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusPage;
