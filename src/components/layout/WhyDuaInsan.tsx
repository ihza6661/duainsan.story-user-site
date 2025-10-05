import {
  FaHandshake,
  FaPaintBrush,
  FaStar,
  FaLightbulb,
  FaBoxes,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaHandshake className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Legacy of Trust Since 2015",
    desc: "Pilihan Terbaik di Kota Pontianak.",
  },
  {
    icon: <FaPaintBrush className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Original Designs, Crafted with Meaning",
    desc: "Desain eksklusif, bukan sekadar undangan. Setiap koleksi di DuaInsan.Story diciptakan dari konsep orisinal menggabungkan estetika klasik-modern dalam satu karya penuh makna.",
  },
  {
    icon: <FaStar className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Premium Quality, Affordable Beauty",
    desc: "Kualitas premium, harga yang lebih bersahabat. Kami menghadirkan standar tinggi dalam bahan, cetak, dan finishing tanpa membuatmu khawatir soal budget.",
  },
  {
    icon: <FaLightbulb className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Tailored to Your Love Story",
    desc: "Kami percaya setiap kisah itu unik. Dari pilihan warna hingga detail kecil, semuanya dirancang untuk mencerminkan siapa kamu dan perjalanan cintamu.",
  },
  {
    icon: <FaBoxes className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Low MOQ, High Personalization",
    desc: "Pernikahan intim? Tidak masalah. Bisa pesan mulai dari quantity kecil, tetap dengan personalisasi penuh. Karena yang berarti bukan jumlahnya, tapi ceritanya.",
  },
  {
    icon: <FaHeadset className="text-shop-gray text-2xl md:text-3xl" />,
    title: "Seamless Process, Heartfelt Service",
    desc: "Dari konsultasi hingga pengiriman semua dibuat mudah dan nyaman. Tim kami hadir dengan kehangatan, profesionalisme, dan perhatian pada setiap detail.",
  },
];

const WhyDuaInsan = () => {
  return (
    <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 bg-gray-50">
      <h2 className="text-shop-text text-center text-2xl sm:text-3xl lg:text-4xl font-serif italic mb-10 md:mb-14">
        Why <span className="">DuaInsan.story</span>?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="shrink-0">{feature.icon}</div>
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-1">
                {feature.title}
              </h3>
              <p className="text-shop-dark-gray text-sm sm:text-base">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyDuaInsan;
