
const VogueQuote = () => {
  return (
    <div className="bg-secondary min-h-32 flex flex-col justify-center items-center text-center px-4 py-14 relative">
      {/* Brand Logo */}
      <img
        src="/brand_logo/duainsan.png"
        alt="vogue"
        className="w-[100px] md:w-[140px]"
      />

      {/* Quote */}
      <div className="w-[340px] md:w-[500px] lg:w-[900px] xl:w-[1000px]">
        <p className="my-6 text-center text-[1.1rem] md:text-2xl max-w-5xl font-normal leading-relaxed tracking-wide>">
          “A small Grapic design studio, Specialising in wedding stationery. <br /> Created With Love. Let's begin our STORY”
        </p>
      </div>
    </div>
  );
};

export default VogueQuote;
