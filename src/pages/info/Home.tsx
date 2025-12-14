import DuaInsanQuotes from "@/components/layout/sections/DuaInsanQuotes";
import ExploreTheNewestTrend from "@/components/layout/sections/ExploreTheNewestTrend";
import InvitationFeatureSection from "@/components/layout/sections/FeatureSection";
import WhyDuaInsan from "@/components/layout/sections/WhyDuaInsan";
import ActualBrandSlider from "@/components/ui/ActualBrandSlider";
import CategoryGrid from "@/components/ui/CategoryGrid";
import Newsletter from "@/components/ui/Newsletter";
import { Hero } from "@/features/home/components/Hero";
import FaqSection from "@/features/info/components/FaqSection";
import MetodePembayaran from "@/features/info/components/MetodePembayaran";
import BestSeller from "@/features/product/components/categories/BestSeller";
import { RecommendedProducts } from "@/features/recommendations";
import OrderSteps from "@/pages/info/CaraMemesan";
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/seo/StructuredData";
// import { InstagramFeed } from "@/components/social/InstagramFeed";

const Home = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <OrganizationStructuredData
        name="Dua Insan Story"
        url="https://duainsanstory.eproject.tech"
        logo="https://duainsanstory.eproject.tech/newlogo.png"
        sameAs={[
          "https://instagram.com/duainsan.story",
          "https://facebook.com/duainsan.story",
        ]}
      />
      <WebsiteStructuredData
        name="Dua Insan Story"
        url="https://duainsanstory.eproject.tech"
        description="Platform undangan pernikahan digital dan cetak terbaik di Indonesia. Desain eksklusif, kualitas premium, dan layanan profesional untuk hari spesial Anda."
        searchUrl="https://duainsanstory.eproject.tech/products?search={search_term_string}"
      />
      <Hero />
      <InvitationFeatureSection />
      <CategoryGrid />
      <BestSeller />
      <RecommendedProducts type="personalized" limit={8} />
      <WhyDuaInsan />
      <ExploreTheNewestTrend />
      <RecommendedProducts type="trending" limit={8} />
      {/* <InstagramFeed maxPosts={4} /> */}
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
