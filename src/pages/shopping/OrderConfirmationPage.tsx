import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/features/order/services/orderService'; // We'll create this
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/utils/card';
import { formatRupiah, getImageUrl } from '@/lib/utils';

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId, // Only run query if orderId is available
  });

  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
        <p className="mt-4 text-lg">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <XCircle className="h-12 w-12 mx-auto text-red-500" />
        <h1 className="text-3xl font-semibold mt-4">Gagal Memuat Pesanan</h1>
        <p className="text-gray-500 mt-2">
          Terjadi kesalahan saat memuat detail pesanan Anda: {error?.message || 'Unknown error'}.
        </p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Kembali ke Beranda</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <XCircle className="h-12 w-12 mx-auto text-red-500" />
        <h1 className="text-3xl font-semibold mt-4">Pesanan Tidak Ditemukan</h1>
        <p className="text-gray-500 mt-2">
          Detail pesanan yang Anda cari tidak ditemukan.
        </p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
        <h1 className="text-4xl font-bold mt-4 text-green-700">Pesanan Berhasil Dibuat!</h1>
        <p className="text-lg text-gray-600 mt-2">Terima kasih atas pesanan Anda. Detail pesanan Anda ada di bawah.</p>
        <p className="text-md text-gray-500 mt-1">Admin kami akan segera menghubungi Anda untuk proses selanjutnya.</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Detail Pesanan #{order.order_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Tanggal Pesanan:</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Pesanan:</p>
              <p className="font-semibold capitalize">{order.order_status.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Pembayaran:</p>
              <p className="font-semibold capitalize">{order.payment_status.replace(/_/g, ' ')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Alamat Pengiriman:</p>
              <p className="font-semibold">{order.shipping_address}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Item Pesanan</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item) => {
              const variantImage = item.product.variants.find(v => v.id === item.variant.id)?.images[0]?.image_url;
              const imageUrl = variantImage ? getImageUrl(variantImage) : '/placeholder.svg';
              return (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-4">
                  <img 
                    src={imageUrl} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Harga Satuan: {formatRupiah(item.unit_price)}</p>
                  </div>
                </div>
                <p className="font-semibold">{formatRupiah(item.sub_total)}</p>
              </div>
            )})}
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Pesanan</span>
              <span className="font-semibold">{formatRupiah(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jumlah Dibayar</span>
              <span className="font-semibold">{formatRupiah(order.amount_paid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Sisa Tagihan</span>
              <span className="font-bold text-lg">{formatRupiah(order.remaining_balance)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/orders" className="text-blue-600 hover:underline">Lihat Semua Pesanan Anda</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
