import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { FaCreditCard, FaShippingFast, FaStar } from "react-icons/fa";

const services = [
  {
    icon: <FaCreditCard className="w-8 h-8" />,
    title: "PEMBAYARAN",
    description: `Mudah, cepat, dan aman.
                  kami menerima QRIS & transfer bank.`,
  },
  {
    icon: <FaShippingFast className="w-8 h-8" />,
    title: "PENGIRIMAN & PENGANTARAN",
    description: `Pengiriman cepat ke seluruh Indonesia, sampai tepat waktu.
                  Kami pastikan undangan Anda tiba sebelum hari istimewa.`,
  },
  {
    icon: <FaStar className="w-8 h-8" />,
    title: "PRE ORDER 25 HARI",
    description: `Pesan lebih awal, nikmati diskon istimewa.`,
  },
];

const ProductServices = () => {
  return (
    <div className="py-6 px-10">
      {/* Slider for mobile */}
      <div className="block md:hidden w-full">
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          modules={[Autoplay, Pagination]}
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center text-center bg-card px-4 py-8">
                <div className="text-foreground">{service.icon}</div>
                <h3 className="pt-2 text-sm font-normal tracking-widest text-foreground">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Flex layout for desktop */}
      <div className="hidden md:flex flex-wrap justify-around gap-12">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="text-foreground">{service.icon}</div>
            <h3 className="pt-2 text-sm font-normal tracking-widest text-foreground">
              {service.title}
            </h3>
            <p className="text-xs text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductServices;
