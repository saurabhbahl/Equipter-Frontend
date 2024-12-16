import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

function CustomSlider({ slides }:{slides:string[]}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "150px",
    slidesToShow: 1,
    arrows: false,
    autoplay: true,
    dots: true,
    beforeChange: (_:number, newIndex:number) => setCurrentSlide(newIndex),
    customPaging: (i:number) => (
      <div
        onClick={() => setCurrentSlide(i)}
        className="w-[10px] lg:w-[90px] lg:h-[13.6px] bg-gray-300 transition-opacity duration-300 opacity-50"
      >
        {i === currentSlide && <div className="bg-orange-500 h-full"></div>}
      </div>
    ),
    dotsClass: "slick-dots ",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: "120px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "60px",
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

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
      }}
      className=""
    >
      <Slider {...settings}>
        {slides.map((slide:string, index:number) => (
          <div
            key={index}
            className={` ${
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
              // className={`w-full transition-all ease-in duration-300  max-h-[251px] min-h-[251px]   md:max-h-[351px] md:min-h-[351px] my-5 lg:m-0 xl:max-h-[611px] xl:min-h-[611px] lg:max-h-[511px] lg:min-h-[511px] object-contain ${
              //   index === currentSlide ? "scale-105" : "scale-100"
              // }`}
              className={`
                w-full transition-all ease-in duration-300 
                max-h-[250px] min-h-[250px]        
                md:max-h-[350px] md:min-h-[350px]  
                lg:max-h-[550px] lg:min-h-[550px]  
                xl:max-h-[650px] xl:min-h-[650px]
                object-contain 
                ${index === currentSlide ? "scale-105" : "scale-100"}
              `}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomSlider;
