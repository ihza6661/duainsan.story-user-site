import React from "react";

const CaraPembayaran: React.FC = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-16 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Cara Pembayaran</h2>

        <ol className="space-y-6 list-decimal list-inside">
          <li>
            <strong>Pilih Produk:</strong> Tambahkan produk yang diinginkan ke dalam keranjang belanja.
          </li>
          <li>
            <strong>Checkout:</strong> Klik tombol checkout dan isi data pengiriman dengan lengkap.
          </li>
          <li>
            <strong>Pilih Metode Pembayaran:</strong> Pilih salah satu metode pembayaran yang tersedia (transfer bank, e-wallet, dsb).
          </li>
          <li>
            <strong>Lakukan Pembayaran:</strong> Lakukan pembayaran sesuai dengan instruksi yang diberikan.
          </li>
          <li>
            <strong>Konfirmasi Pembayaran:</strong> Unggah bukti transfer atau konfirmasi pembayaran secara otomatis jika tersedia.
          </li>
          <li>
            <strong>Pesanan Diproses:</strong> Setelah pembayaran dikonfirmasi, pesanan akan segera diproses dan dikirim.
          </li>
        </ol>

        <div className="mt-10 text-center">
          <p className="text-gray-600">Jika ada pertanyaan, hubungi tim kami melalui <strong>WhatsApp</strong> atau <strong>Email</strong>.</p>
        </div>
      </div>
    </section>
  );
};

export default CaraPembayaran;
