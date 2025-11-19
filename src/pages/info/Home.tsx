import DuaInsanQuotes from "@/components/layout/sections/DuaInsanQuotes";
import ExploreTheNewestTrend from "@/components/layout/sections/ExploreTheNewestTrend";
import WhyDuaInsan from "@/components/layout/sections/WhyDuaInsan";
import ActualBrandSlider from "@/components/ui/ActualBrandSlider";
import CategoryGrid from "@/components/ui/CategoryGrid";
import Newsletter from "@/components/ui/Newsletter";
import { Hero } from "@/features/home/components/Hero";
import FaqSection from "@/features/info/components/FaqSection";
import MetodePembayaran from "@/features/info/components/MetodePembayaran";
import BestSeller from "@/features/product/components/categories/BestSeller";
import OrderSteps from "@/pages/info/CaraMemesan";

const Home = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Hero />
      <CategoryGrid />
      <BestSeller />
      <WhyDuaInsan />
      <ExploreTheNewestTrend />
      <OrderSteps />
      <DuaInsanQuotes />
      <MetodePembayaran />
      <FaqSection />
      <Newsletter />
      <ActualBrandSlider />
    </div>
  );
};

export default Home;
