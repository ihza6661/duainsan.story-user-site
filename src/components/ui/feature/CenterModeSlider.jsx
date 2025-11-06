import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VideoSliderWithAutoplayOnFocus = ({ videos }) => {
  const sliderRef = useRef(null);
  const videoRefs = useRef([]);
  const [focusedSlide, setFocusedSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
    beforeChange: (current, next) => {
      if (videoRefs.current[current]) {
        videoRefs.current[current].pause();
      }
      setFocusedSlide(next);
    },
    afterChange: (current) => {
      if (current === focusedSlide && videoRefs.current[current]) {
        videoRefs.current[current].play();
      }
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="mx-auto">
      <Slider ref={sliderRef} {...settings}>
        {videos.map((video, index) => (
          <div key={video.id} className="relative focus:outline-none" onFocus={() => sliderRef.current?.slickGoTo(index)}>
            {/* <div className="absolute top-0 left-0 w-full py-2 text-center text-xs text-gray-700 font-semibold">
              FEATURED THIS SEASON
            </div> */}
            <div className="p-2 relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.src}
                className="w-full h-auto object-cover rounded-md shadow-md"
                muted // It's often a good practice to start muted for autoplay
                loop
              />
            </div>
          </div>
        ))}
      </Slider>
      {/* <div className="text-center mt-6">
        <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 focus:outline-none">
          CHECK COLLECTION
        </button>
      </div> */}
    </div>
  );
};

const ExampleUsage = () => {
  const videos = [
    { id: 1, src: "/videos/featured1.mp4", alt: "Featured Video 1" },
    { id: 2, src: "/videos/featured2.mp4", alt: "Featured Video 2" },
    { id: 3, src: "/videos/featured3.mp4", alt: "Featured Video 3" },
    { id: 4, src: "/videos/featured4.mp4", alt: "Featured Video 4" },
    { id: 5, src: "/videos/featured5.mp4", alt: "Featured Video 5" },
    { id: 6, src: "/videos/featured6.mp4", alt: "Featured Video 6" },
    { id: 7, src: "/videos/featured7.mp4", alt: "Featured Video 7" },
  ];

  return <VideoSliderWithAutoplayOnFocus videos={videos} />;
};

export default ExampleUsage;