
import React from "react";

const faqs = [
  {
    question: "Apakah membuat undangan digital gratis?",
    answer:
      "Undangan website Satu Momen gratis selama masa uji coba (free trial) 12 jam setelah itu kamu dapat memilih paket yang tersedia.",
  },
  {
    question: "Apakah ada batas kirim undangan?",
    answer:
      "Tidak ada batas untuk kirim undangan digital website dari Satu Momen. Cukup satu undangan untuk banyak tamu.",
  },
  {
    question: "Apakah ada batas revisinya?",
    answer:
      "Undangan website online di Satu Momen tidak ada batas revisi, kamu dapat merevisi kapan saja di mana saja selama akun masih aktif.",
  },
  {
    question: "Berapa undangan yang bisa dibuat?",
    answer:
      "Jika kamu sudah membeli atau upgrade paket di Satu Momen kamu dapat membuat undangan sesuai dengan credit point yang kamu miliki. 1 undangan membutuhkan 20 credit point.",
  },
  {
    question: "Berapa lama proses pembuatannya?",
    answer:
      "Untuk membuat undangan link atau digital di Satu Momen membutuhkan waktu sekitar 10 menit dan bisa langsung mengirim.",
  },
  {
    question: "Apa yang dimaksud dengan masa aktif?",
    answer:
      "Masa aktif pada undangan adalah masa undangan online dapat diakses. Jika masa aktif berakhir maka undangan tidak dapat diakses.",
  },
  {
    question: "Apakah tema bisa di custom?",
    answer:
      "Tentu saja kamu bisa custom desain website undangan nikah dan acara apapun di Satu Momen dengan menambah Add On custom tema.",
  },
  {
    question: "Apakah ada program reseller?",
    answer:
      "Ada! kami menawarkan paket lengkap usaha undangan digital website sudah termasuk: custom domain, custom branding, sales page dan lain-lain kamu bisa hubungi admin untuk info lebih lengkap.",
  },
];

export default function FaqSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-semibold text-secondary mb-12">FAQs</h2>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 leading-relaxed">
        {faqs.map((faq, index) => (
          <div className="px-4" key={index}>
            <h3 className="text-lg font-semibold mb-2">
              {faq.question}
            </h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
