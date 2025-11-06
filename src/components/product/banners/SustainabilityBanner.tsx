
const SustainabilityBanner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-black/30" />
      <button className="absolute top-4 left-4 bg-gray-700 bg-opacity-70 text-white p-2 rounded">
        ❚❚
      </button>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <span className="text-sm mb-2">Sustainability</span>
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          OUR FABRICS ARE DEVELOPED
          <br />
          SPECIFICALLY FOR US AND WE
          <br />
          ONLY PRODUCE QUALITY
          <br />
          APPAREL THAT LASTS.
        </h1>
      </div>
    </div>
  );
};

export default SustainabilityBanner;
