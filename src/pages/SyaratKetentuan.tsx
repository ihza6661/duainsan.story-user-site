
import React from 'react';

const SyaratKetentuan: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Syarat & Ketentuan</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Definisi</h2>
          <p>"Pembeli" atau "Anda" adalah pihak yang melakukan pemesanan untuk membeli produk dari Dua Insan Story.</p>
          <p>"Kami" atau "Milik Kami" mengacu pada Dua Insan Story.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Harga</h2>
          <p>Harga untuk produk atau layanan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Pembayaran</h2>
          <p>Semua pembayaran diproses melalui gateway pembayaran yang aman. Kami menerima berbagai metode pembayaran termasuk transfer bank, dompet digital, dan kartu kredit.</p>
          <p>Penting: Tidak ada pengembalian dana yang akan diberikan setelah pembayaran dilakukan.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Prosedur Pemesanan</h2>
          <p>Prosedur pemesanan akan diinformasikan lebih lanjut pada halaman produk atau melalui komunikasi langsung dengan tim kami.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Hak Cipta</h2>
          <p>Semua desain dan hak cipta adalah milik Dua Insan Story.</p>
          <p>Desain tidak boleh disalin, diubah, atau dijual kembali tanpa izin tertulis dari kami.</p>
          <p>Kami berhak menggunakan desain yang telah dibuat untuk portofolio atau katalog kami setelah acara Anda selesai.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Pembatalan</h2>
          <p>Jika pemesanan dibatalkan setelah proses produksi dimulai, pembeli tetap bertanggung jawab atas biaya produksi yang telah dikeluarkan.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Penerimaan Syarat & Ketentuan</h2>
          <p>Dengan melakukan pemesanan dan pembayaran, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.</p>
          <p>Kami berhak mengubah Syarat & Ketentuan ini tanpa pemberitahuan sebelumnya. Anda disarankan untuk memeriksa halaman ini secara berkala.</p>
        </div>
      </div>
    </div>
  );
};

export default SyaratKetentuan;
