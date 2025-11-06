import React from 'react';
import { Home, Instagram, Music, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (

    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-27">
      {/* Hero Section */}
      <div className="container mx-auto px-10 py-10 max-w-4xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Pengembalian & Refund
          </h1>
          <p className="text-muted-foreground">Terakhir diperbarui: 05 November 2025</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="py-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {/* <Home className="w-4 h-4" /> */}
            <Link to="/" className="hover:text-foreground transition">Home</Link>
            <span>›</span>
            <span className="text-foreground">Pengembalian & Refund</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl text-foreground mb-6">Definisi</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex">
              <span className="mr-3">•</span>
              <span><strong>Pembeli atau "Anda"</strong> berarti pelanggan yang melakukan pemesanan untuk membeli produk Dekarda.</span>
            </li>
            <li className="flex">
              <span className="mr-3">•</span>
              <span><strong>Kami atau "Milik Kami"</strong> berarti Dekarda.</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-foreground mb-6">Produk Digital</h2>
          <p className="text-muted-foreground mb-4">
            Anda tidak dapat mengajukan pengembalian atau refund untuk produk digital yang telah Anda beli.
          </p>
          <p className="text-muted-foreground">
            Kami telah menyediakan preview atau akses ujicoba gratis produk kami sebelum Anda memutuskan untuk membeli. Oleh karena itu pastikan Anda benar-benar mengerti dan paham tentang produk yang Anda beli.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-foreground mb-6">Produk Fisik</h2>
          <p className="text-muted-foreground mb-4">
            Pertama, email pengajuan pengembalian harus dikirim dalam waktu 48 jam setelah menerima produk. Setelah itu, tidak ada klaim pengembalian atau refund yang dapat dilakukan dalam keadaan apa pun. Segala permasalahan seperti kartu yang rusak, jumlah kurang, dan lain sebagainya harus diberitahukan melalui email ke duainsan@story.com.
          </p>
          <p className="text-muted-foreground">
            Kami tidak menawarkan refund untuk barang yang rusak, cacat, atau hilang. Sebagai gantinya, kami akan mencetak ulang produk Anda sesuai dengan syarat dan ketentuan ini.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-foreground mb-6">Kepatuhan</h2>
          <p className="text-muted-foreground">
            Jika Anda (pembeli) tidak mematuhi ketentuan ini, kami tidak akan bertanggung jawab secara hukum atas keluhan ini atau keluhan lainnya yang seharusnya telah disampaikan dalam periode 3 hari tersebut.
          </p>
        </section>
      </div>
    </div>
  );
}
