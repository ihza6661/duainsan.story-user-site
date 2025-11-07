import { Link } from "react-router-dom";

const ExploreTheNewestTrend = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto space-y-2 sm:space-y-6">
      <p className="text-base">
        Discover the latest trends
      </p>

      <p className="px-0 sm:px-0 md:px-0 lg:px-4 text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide leading-tight break-words">
        elegant invitations
        <span className="inline-block mx-2 align-middle">
          <img
            src="1.jpg"
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-[72px] md:h-[72px] lg:w-[89px] lg:h-[89px] rounded-full object-cover"
          />
        </span>
        and charming
        <span className="inline-block mx-2 align-middle">
          <img
            src="2.jpeg"
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-[72px] md:h-[72px] lg:w-[89px] lg:h-[89px] rounded-full object-cover"
          />
        </span>
        card
        <span className="inline-block mx-2 align-middle">
          <img
            src="3.jpeg"
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-[72px] md:h-[72px] lg:w-[89px] lg:h-[89px] rounded-full object-cover"
          />
        </span>
        designs!
      </p>
      <div className="pt-1">
        <Link
          to="/products"
          className="relative text-sm border-b transition-all duration-300 group hover:border-transparent">
          VIEW ALL COLLECTIONS
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    </div>
  );
};

export default ExploreTheNewestTrend;
