import React from "react";
import metodePembayaran from "@/assets/metode-pembayaran.webp";

const MetodePembayaran = () => {
  return (
    <section className="bg-secondary rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-10 md:px-12">
      {/* Text Section */}
      <div className="max-w-3xl container">
        <h2 className="text-3xl font-bold mb-4">
          Metode pembayaran lengkap
        </h2>
        <p className="mb-6 leading-relaxed">
          Gak perlu mikirin biaya transfer antar bank, kamu bisa pilih metode
          pembayaran bank / e-wallet sesuai dengan yang sering kamu pake.
        </p>
        <button
          className="bg-primary hover:bg-primary/80 font-medium px-6 py-3 rounded-full transition-colors"
          type="button"
        >
          Daftar & Coba Gratis →
        </button>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0 w-full md:w-[45%]">
        <img
          src={metodePembayaran}
          alt="Metode pembayaran yang tersedia"
          className="w-full h-auto object-contain mx-auto max-w-md"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default MetodePembayaran;
