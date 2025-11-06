import React from 'react';
import { AlertCircle, DollarSign, CreditCard, FileText, Copyright, XCircle, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaPaintBrush, FaComments, FaPrint, FaCheckDouble, FaShippingFast } from 'react-icons/fa';

const SyaratKetentuan: React.FC = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Definisi",
      content: [
        { label: "Pembeli", text: '"Pembeli" atau "Anda" adalah pihak yang melakukan pemesanan untuk membeli produk dari Dua Insan Story.' },
        { label: "Kami", text: '"Kami" atau "Milik Kami" mengacu pada Dua Insan Story.' }
      ]
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Harga",
      content: [
        { text: "Harga untuk produk atau layanan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya." }
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Pembayaran",
      content: [
        { text: "Semua pembayaran diproses melalui gateway pembayaran yang aman. Kami menerima berbagai metode pembayaran termasuk transfer bank, dompet digital, dan kartu kredit." },
        { text: "Tidak ada pengembalian dana yang akan diberikan setelah pembayaran dilakukan.", highlight: true }
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Prosedur Pemesanan",
      content: [
        { text: "Prosedur pemesanan akan diinformasikan lebih lanjut pada halaman produk atau melalui komunikasi langsung dengan tim kami." }
      ]
    },
    {
      icon: <Copyright className="w-6 h-6" />,
      title: "Hak Cipta",
      content: [
        { text: "Semua desain dan hak cipta adalah milik Dua Insan Story." },
        { text: "Desain tidak boleh disalin, diubah, atau dijual kembali tanpa izin tertulis dari kami." },
        { text: "Kami berhak menggunakan desain yang telah dibuat untuk portofolio atau katalog kami setelah acara Anda selesai." }
      ]
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      title: "Pembatalan",
      content: [
        { text: "Jika pemesanan dibatalkan setelah proses produksi dimulai, pembeli tetap bertanggung jawab atas biaya produksi yang telah dikeluarkan.", highlight: true }
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Penerimaan Syarat & Ketentuan",
      content: [
        { text: "Dengan melakukan pemesanan dan pembayaran, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku." },
        { text: "Kami berhak mengubah Syarat & Ketentuan ini tanpa pemberitahuan sebelumnya. Anda disarankan untuk memeriksa halaman ini secara berkala." }
      ]
    }
  ];

  return (

    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-27">
      <div className="container mx-auto px-10 py-10 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-foreground mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-muted-foreground text-lg">
            Mohon baca dengan seksama sebelum melakukan pemesanan
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Important Notice */}
        <div className="border-l-4 border-primary p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-foreground font-semibold mb-2">Pemberitahuan Penting</h3>
              <p className="text-foreground text-sm leading-relaxed">
                Dengan melakukan pemesanan, Anda secara otomatis menyetujui seluruh syarat dan ketentuan yang tertera di halaman ini.
                Pastikan Anda memahami setiap poin sebelum melanjutkan transaksi.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border-2 border-border hover:bg-secondary transition-colors duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary p-3 text-primary-foreground mr-4 rounded">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl text-foreground">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3 ml-16">
                  {section.content.map((item, idx) => (
                    <div key={idx}>
                      {item.label && (
                        <span className="font-semibold text-foreground">{item.label}: </span>
                      )}
                      <p className={`text-muted-foreground leading-relaxed inline ${item.highlight ? ' text-foreground underline decoration-2' : ''
                        }`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="p-8 border-2 border-border">
            <h3 className="text-2xl text-primary mb-3">Ada Pertanyaan?</h3>
            <p className="mb-6 text-muted-foreground">
              Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan kami,
              jangan ragu untuk menghubungi tim kami.
            </p>
            <div className="text-center mt-12">
              <a
                href="https://wa.me/6281234567890" // Ganti dengan nomor WhatsApp Anda
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full shadow-md bg-background hover:bg-secondary transition-colors duration-300 text-lg"
              >
                <FaWhatsapp className="mr-3 text-2xl" />
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Terakhir diperbarui: November 2025</p>
        </div>
      </div>
    </div>
  );
};

export default SyaratKetentuan;
