import { useState } from "react";
import Slider from "react-slick";
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

const AccessorySlider = ({
  accessories,
  onClose,
  selections,
  setSelections,
}: IAccessorySliderProps) => {
  const [flash, setFlash] = useState(false);

  if (accessories.length === 0) return null;

  const placeholderImg = "https://via.placeholder.com/600x400?text=No+Image";

  const handleAddAccessory = (currentAccessory: IAccessory) => {

    setSelections((prev: SelectionsType) => {
      const prevAccessory = prev.accessories[currentAccessory.id] || {
        selected: false,
        qty: 1,
      };
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

    // Trigger flash animation
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  // Slider settings
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    arrows: false,
    centerPadding: "50px",
    slidesToShow: 3,
    speed: 500,
    // beforeChange: (oldIndex, newIndex) => {
    //   setCurrentIndex(newIndex);
    // },
  };

  return (
    <div className="fixed z-50 inset-0 h-full p-5 bg-black bg-opacity-40 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-12 text-black text-2xl hover:text-gray-600 font-bold"
      >
        X
      </button>
      <div className="relative  w-full p ">
        <Slider {...settings}>
          {accessories.map((acc) => {
            const selectedAcc = selections.accessories[acc.id];
            const featureImg = acc?.images.filter((e) => e.is_featured == true);
            const isSelected = selectedAcc?.selected;
            const qty = selectedAcc?.qty || 0;

            return (
              <div key={acc.id} className="m- flex p-9   h-[600px]  ">
                <div className="flex w-full p-9 h-full gap-5 justify-center items-center bg-white ">
                  <div className="h-[100%] w-[50%]">
                    <img
                      src={featureImg[0]?.image_url || placeholderImg}
                      alt={acc.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-[50%] flex flex-col items-start justify-start">
                    <h3 className="font-semibold capitalize ">{acc.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {acc.description}
                    </p>
                    {isSelected && (
                      <p
                        className={`text-sm font-semibold mb-2 ${
                          flash ? "animate-pulse text-green-600" : "text-black"
                        }`}
                      >
                        Qty: {qty}
                      </p>
                    )}
                    <button
                      className="btn-yellow text-xs px-3 self-end"
                      onClick={() => handleAddAccessory(acc)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default AccessorySlider;
