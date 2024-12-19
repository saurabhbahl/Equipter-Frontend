import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IAccessory } from "../../types/ClientSchemas";

interface IAccessorySliderProps {
  accessories: IAccessory[];
  onClose: () => void;
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
}
interface AccessorySelection {
  selected: boolean;
  qty: number;
}
interface SelectionsType {
  baseUnitQty: number;
  accessories: {
    [accId: string]: AccessorySelection;
  };
  shippingOption: string | null;
}

function AccessorySlider({
  accessories,
  onClose,
  selections,
  setSelections,
}: IAccessorySliderProps) {
  const [flash, setFlash] = useState(false);


  const handleAddAccessory = (currentAccessory: IAccessory) => {
    setSelections((prev: SelectionsType) => {
      const prevAccessory = prev.accessories[currentAccessory.id] || {
        selected: false,
        qty: 0,
      };
   
      if (prevAccessory.qty >= 5) {
       
        return prev;
      }
      if (prevAccessory.selected == false) {
        return {
          ...prev,
          accessories: {
            ...prev.accessories,
            [currentAccessory.id]: {
              selected: true,
              qty: prevAccessory.qty,
            },
          },
        };
      }
      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          [currentAccessory.id]: {
            selected: true,
            qty: prevAccessory.qty + 1,
          },
        },
      };
    });

    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };


  const settings = {
    className: "center",
    arrows: false,
    centerMode: true,
    infinite: true,
    centerPadding: "250px",
    slidesToShow: 1,
    speed: 500,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 1,
          centerPadding: "150px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };
  function truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  return (
    <div className="fixed z-30 inset-0 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute z-50 top-4 right-4 sm:top-6 sm:right-6 text-lg text-black xl:text-5xl hover:text-gray-600 font-bold"
        aria-label="Close Slider"
      >
        &times;
      </button>
      <div className="w-full   ">
        <Slider {...settings}>
          {accessories.map((acc) => {
            const selectedAcc = selections.accessories[acc.id];
            const featureImg = acc?.images.filter((e) => e.is_featured == true);
            const isSelected = selectedAcc?.selected;
            const qty = selectedAcc?.qty || 0;
            return (
              <div key={acc.id} className="px-2 min-h-full">
                {/* Modal Container */}
                <div className="min-h-full">
                  <div className="flex flex-col md:flex-row h-full bg-white shadow-lg overflow-hidden ">
                    {/* Image Section */}
                    <div className="w-full md:w-3/5 my-auto h-[250px] lg:h-[400px] flex items-center justify-center p-2">
                      <img
                        src={featureImg[0]?.image_url}
                        alt="Product Image"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Text and Button Section */}
                    <div className="w-full md:w-2/5  flex flex-col items-start justify-center p-3 lg:space-x-6 space-y-2">
                      <h3 className="font-semibold capitalize text-md lg:text-xl 2xl:text-2xl">
                        {acc.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                      {truncateText(acc.description, 50)}.....
                      </p>
                      {isSelected && (
                        <p
                          className={`text-sm font-semibold mb-2 ${
                            flash
                              ? "animate-pulse text-green-600"
                              : "text-black"
                          }`}
                        >
                          Qty: {qty}
                        </p>
                      )}
                      <button
                        className="btn-yellow text-xs sm:text-sm px-4 py-2 self-end"
                        onClick={() => handleAddAccessory(acc)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

export default AccessorySlider;
