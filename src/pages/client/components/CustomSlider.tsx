import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

function CustomSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "180px",
    slidesToShow: 1,
    arrows: false,
    autoplay: true,
    dots: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    customPaging: (i) => (
      <div
        onClick={() => setCurrentSlide(i)}
        className="w-[90px] h-[13.6px] bg-gray-300  transition-opacity duration-300 opacity-50"
      >
        {/* Active dot */}
        {i === currentSlide && <div className="bg-orange-500 h-full "></div>}
      </div>
    ),
    dotsClass: "slick-dots flex justify-center gap-6 mt-4",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "20px",
        },
      },
    ],
  };

  const slides = [
    "https://www.equipter.com/hubfs/EQ5400-220818_Equipter_039-600x400-9801ebf.png",
    "https://www.equipter.com/hubfs/EQ4000-220818_Equipter_023-600x422-85ae06e.png",
    "https://equipter.s3.us-east-1.amazonaws.com/images/products/1733312665968-EQ4000-220818_Equipter_023-600x422-85ae06e.webp",
    "https://www.equipter.com/hubfs/7000_051_600.png",
  ];

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        return;
      }}
      className=" slider-container min-h-full my-6 w-full m-auto"
    >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`flex transition-all ease-in duration-300 justify-end items-center p-0 my-6 min-h-full  ${
              index === currentSlide
                ? "opacity-100 scale-105 z-10"
                : "scale-60 z-0 opacity-30"
            }`}
          >
            <img
              onClick={(e) => e.preventDefault()}
              src={slide}
              alt={`Slide ${index + 1}`}
              draggable="false"
              style={{
                outline: "none",
                pointerEvents: "none",
                border: "none",
              }}
              className={`w-full transition-all ease-in duration-300 max-w-[611px] min-w-[611px] object-contain ${
                index === currentSlide ? "scale-105" : "scale-100"}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomSlider;
