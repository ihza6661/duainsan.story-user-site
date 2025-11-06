import { Link } from "react-router-dom";
import Newsletter from "@/components/ui/feature/Newsletter";
import { products } from "@/lib/data";
import ExploreTheNewestTrend from "@/components/layout/sections/ExploreTheNewestTrend";
import ActualBrandSlider from "@/components/ui/feature/ActualBrandSlider";
import CategoryGrid from "@/components/ui/CategoryGrid";
import WhyDuaInsan from "@/components/layout/sections/WhyDuaInsan";
import OrderSteps from "@/pages/info/CaraMemesan";
import DuaInsanQuotes from "@/components/layout/sections/DuaInsanQuotes";
import BestSeller from "@/components/product/categories/BestSeller";
import { Hero } from "@/components/hero/Hero";

const Home = () => {
  const highlight = [
    {
      id: 1,
      title: "Green",
      image: "/highlight/2.png",
    },
    {
      id: 2,
      title: "Brown",
      image: "/highlight/3.png",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Hero />

      <CategoryGrid />
      <BestSeller />
      <ExploreTheNewestTrend />

      <WhyDuaInsan />

      <OrderSteps />

      <DuaInsanQuotes />

      {/* Termin Pembayaran dan Free items Information */}
      <section className="pt-10 sm:pt-12 md:pt-16 bg-background">
        <div className="">
          <p className="text-center pt-10 text-xl">Cara Order via WhatsApp</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            {highlight.map((post) => (
              <Link
                key={post.id}
                to={`/highlights/${post.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] p-5 sm:p-20 m-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-contain rounded-2xl"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ActualBrandSlider />

      <Newsletter />
    </div>
  );
};

export default Home;
