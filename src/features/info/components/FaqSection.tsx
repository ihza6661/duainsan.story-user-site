type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Apakah ada batas revisinya?",
    answer:
      "Undangan website online di Dua Insan Story tidak ada batas revisi.",
  },
  {
    question: "Berapa lama proses pembuatannya?",
    answer:
      "Untuk membuat undangan cetak di Dua Insan Story membutuhkan waktu sekitar 1-2 bulan.",
  },
  {
    question: "Apakah tema bisa di custom?",
    answer:
      "Tentu saja kamu bisa custom desain website undangan nikah dan acara apapun di Dua Insan Story dengan menambah Add On custom tema.",
  },
];

import React from "react";

const FaqSection: React.FC = () => {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="inline bg-card text-4xl font-semibold text-foreground rounded-lg px-4">
          Pertanyaan Umum
        </h2>
        <div className="grid md:grid-cols-2 leading-relaxed pt-4">
          {faqs.map((faq, index) => (
            <div className="px-4 py-4" key={index}>
              <div className="bg-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FaqSection;
