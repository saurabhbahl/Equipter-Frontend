import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

function CustomSlider({ slides }:{slides:string[]}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "90px",
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
    dotsClass: "slick-dots  ",
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          centerPadding: "0px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          centerPadding: "60px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          centerPadding: "30px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          centerPadding: "0px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480, // xs
        settings: {
          centerPadding: "5px",
          slidesToShow: 1,
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
        className={`
                w-full transition-all ease-in duration-300 
                mx-auto
                 max-h-[300px] min-h-[300px]        
                
               min-w-[300px]  max-w-[300px] 
           
                md:min-w-[450px] md:min-h-[350px] md:max-w-[450px] md:max-h-[350px]
                lg:min-w-[526px] lg:min-h-[380px] lg:max-w-[526px] lg:max-h-[380px]
                xl:min-w-[602px] xl:min-h-[526px] xl:max-w-[602px] xl:max-h-[526px]
             lg:p-5
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
