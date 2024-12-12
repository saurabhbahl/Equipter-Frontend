import { useState, useEffect } from "react";
import CustomSlider from "../components/CustomSlider";
import InputField from "../../../components/utils/InputFeild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

const ViewSingleProduct = () => {
  const [activeTab, setActiveTab] = useState("cash");
  const [modalAccessory, setModalAccessory] = useState(null);

  // Build lists data
  const buildLists = [
    { title: "GVWR", value: "7,500 lbs" },
    { title: "Lift Capacity", value: "4,000 lbs" },
    { title: "Lift Height", value: "12’-0”" },
    { title: "Container", value: "4.1 cu yds" },
  ];

  // Accessories data
  const accessoriesList = [
    {
      id: "RoofChute",
      name: "8' Roof Chute",
      price: 165,
      description: "Roof chute description.",
    },
    {
      id: "GutterProtector",
      name: "8' Gutter Protector",
      price: 154,
      description: "Gutter protector description.",
    },
    {
      id: "RearKit",
      name: "Rear Extension Kit",
      price: 489,
      description: "Rear extension kit description.",
    },
    {
      id: "TrackMat",
      name: "2' x 6' Track Mat",
      price: 329,
      description: "Track mat description.",
    },
    {
      id: "Outrigger",
      name: '18" x 18" Outrigger Pad',
      price: 79,
      description: "Outrigger pad description.",
    },
    {
      id: "TireSealant",
      name: "Tire Sealant Kit",
      price: 195,
      description: "Tire sealant kit description.",
    },
  ];

  // Shipping options data
  const shippingOptions = [
    { id: "pickup", name: "Pick-up", price: 0 },
    { id: "delivery", name: "Delivery to the State of: PA", price: 400 },
  ];

  // Initialize accessories state
  const initialAccessoriesState = {};
  accessoriesList.forEach((acc) => {
    initialAccessoriesState[acc.id] = { selected: false, qty: 1 };
  });

  // Selections state
  const [selections, setSelections] = useState({
    baseUnitQty: 1,
    accessories: initialAccessoriesState,
    shippingOption: null,
  });

  // Total prices state
  const [totalPrices, setTotalPrices] = useState({
    basePrice: 38900,
    addOns: 0,
    netPrice: 38900,
  });

  // Update total prices when selections change
  useEffect(() => {
    let basePrice = 38900 * selections.baseUnitQty;
    let addOns = 0;

    Object.keys(selections.accessories).forEach((accId) => {
      const accessory = selections.accessories[accId];
      if (accessory.selected) {
        const accessoryInfo = accessoriesList.find((item) => item.id === accId);
        if (accessoryInfo) {
          addOns += accessoryInfo.price * accessory.qty;
        }
      }
    });

    let shippingPrice = 0;
    if (selections.shippingOption) {
      const shippingOption = shippingOptions.find(
        (option) => option.id === selections.shippingOption
      );
      if (shippingOption) {
        shippingPrice = shippingOption.price;
      }
    }

    const netPrice = basePrice + addOns + shippingPrice;

    setTotalPrices({
      basePrice,
      addOns,
      netPrice,
    });
  }, [selections]);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // TabSlider component
  const TabSlider = ({ slides }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const nextSlide = () => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
      setCurrentSlideIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    };

    return (
      <div className="tab-slider-wrapper pt-4">
        <div className="tab-slider slider-custom-nav">
          <div className="tab-slide-item">
            <img
              src={slides[currentSlideIndex].imageSrc}
              alt={slides[currentSlideIndex].title}
              className="slide-image w-full"
            />
            <div className="slide-details tab-slide-content bg-custom-gray-300 flex justify-between items-center px-5 py-7 w-full -mt-10 relative">
              <h3 className="font-semibold text-black text-25 md:text-27">
                {slides[currentSlideIndex].title}
              </h3>
              <img
                src="https://via.placeholder.com/20x20?text=i"
                alt="Info"
                className="info-icon w-5 cursor-pointer"
                onClick={() => setModalAccessory(slides[currentSlideIndex])}
              />
            </div>
          </div>
          {/* Navigation */}
          <div className="slider-navigation flex justify-between mt-4">
            <button onClick={prevSlide} className="px-4 py-2 bg-gray-300">
              Prev
            </button>
            <button onClick={nextSlide} className="px-4 py-2 bg-gray-300">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-component">
      {/* Main content */}
      <main>
        <section className="content-with-sidebar py-20">
          <div className="w-[80%] mx-auto ">
            <div className="block md:flex gap-5 w-full">
              {/* Left content */}
              <div className="content-block w-full md:w-2/3 xs:px-4 md:px-0">
                {/* Build + Buy heading */}
                <div className="main-heading -mb-16 top-6 relative z-10 hidden md:block">
                  <h1 className="uppercase font-robot">Build + Buy</h1>
                </div>
                {/* Image Slider */}
                <div className="images-slides-wrapper relative z-10 pb-14 my-8">
                  <CustomSlider />
                </div>

                {/* Build lists content */}
                <div className="build-lists-content md:px-10 flex">
                  {buildLists.map((item, index) => (
                    <div key={index} className="build-lists-col w-3/12 px-3">
                      <h4 className="font-roboto text-xxs md:text-lg">
                        {item.title}
                      </h4>
                      <h3 className="font-robot text-sm md:text-3xl heading-bottom-border">
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              {/* Sidebar content */}
              <div className="sidebar-block w-full md:w-1/3 md:pl-8 xs:px-4 md:px-0 pt-12 md:pt-0">
                <div className="text-center font-robot mb-9">
                  <h2 className="text-custom-black-200 text-6xl md:text-5xl 3xl:text-64">
                    4000
                  </h2>
                  <p className="text-custom-black-200 text-lg md:text-19">
                    The Towable Roofing Trailer
                  </p>
                </div>
                {/* Tabs Section */}
                <div className="tabs-section tabs font-robot sidebar-tabs-block">
                  <ul className="tabs-nav roofing-tabs-nav flex gap-12 border-b-4 border-custom-orange-100">
                    <li
                      className={`tab-title min-w-36 ${
                        activeTab === "cash" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("cash")}
                    >
                      <p className="tab-title-link cursor-pointer pb-2 inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">
                        Cash
                      </p>
                    </li>
                    <li
                      className={`tab-title min-w-36 ${
                        activeTab === "financing" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("financing")}
                    >
                      <p className="tab-title-link pb-2 cursor-pointer inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">
                        Financing
                      </p>
                    </li>
                  </ul>
                  {/* Tab Content */}
                  <div className="tabs-content pt-5 md:pt-8">
                    {activeTab === "cash" ? (
                      // Cash tab content
                      <div className="tab-content">
                        {/* Price content block */}
                        <div className="price-content-block pb-3">
                          <table className="min-w-full overflow-hidden">
                            <thead>
                              <tr>
                                <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">
                                  Base Price
                                </th>
                                <th></th>
                                <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">
                                  Add-Ons
                                </th>
                                <th></th>
                                <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">
                                  Net Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
                                  ${totalPrices.basePrice.toLocaleString()}{" "}
                                  <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">
                                    +
                                  </span>
                                </td>
                                <td></td>
                                <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
                                  ${totalPrices.addOns.toLocaleString()}{" "}
                                  <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">
                                    =
                                  </span>
                                </td>
                                <td></td>
                                <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
                                  ${totalPrices.netPrice.toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* Base unit quantity */}
                        <div className="flex gap-6 justify-between pt-7 items-center">
                          <h3 className="font-semibold text-lg md:text-xl leading-6">
                            Equipter 4000 Base Unit
                          </h3>
                          <form className="flex gap-3 items-center">
                            <p className="text-md font-bold text-gray-500">
                              QTY
                            </p>
                            <InputField
                              name="qty"
                              placeholder="1"
                              required
                              id="1"
                              // label="Qty"
                              classes="!w-14"
                              type="number"
                              value={selections.baseUnitQty.toString()}
                              key="qty"
                              onChange={(e) => {
                                setSelections((prevState) => ({
                                  ...prevState,
                                  baseUnitQty: parseInt(e.target.value) || 1,
                                }));
                              }}
                            />
                          </form>
                        </div>
                        {/* Accessories */}
                        <div className="accessories-block mt-9">
                          <h3 className="font-semibold text-lg md:text-xl text-center mb-7">
                            Add-On Accessories
                          </h3>
                          <div className="accessories-info">
                            {accessoriesList.map((accessory) => (
                              <div
                                key={accessory.id}
                                className={`accessories-col mb-3 ${
                                  selections.accessories[accessory.id].selected
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3 gap-x-2">
                                  <form className="flex items-center justify-between gap-3">
                                    <InputField
                                      name="check"
                                      required
                                      type="checkbox"
                                      id={accessory.id}
                                      classes="  form-checkbox !text-black !flex-shrink-0"
                                      value={selections.baseUnitQty.toString()}
                                      key="qty"
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelections((prevState) => ({
                                          ...prevState,
                                          accessories: {
                                            ...prevState.accessories,
                                            [accessory.id]: {
                                              ...prevState.accessories[
                                                accessory.id
                                              ],
                                              selected: isChecked,
                                            },
                                          },
                                        }));
                                      }}
                                    />
                                    <label
                                      htmlFor={accessory.id}
                                      className={`font-semibold text-black ${
                                        selections.accessories[accessory.id]
                                          .selected
                                          ? ""
                                          : "opacity-50"
                                      } text-base md:text-17`}
                                    >
                                      {accessory.name}
                                    </label>
                                  </form>
                                  <div className="price-col flex-shrink-0">
                                    <div className="flex gap-3 items-center">
                                      <h4
                                        className={`text-black ${
                                          selections.accessories[accessory.id]
                                            .selected
                                            ? ""
                                            : "opacity-50"
                                        } font-semibold text-base md:text-17`}
                                      >
                                        ${accessory.price}
                                      </h4>
                                      <div
                                        onClick={() =>
                                          setModalAccessory(accessory)
                                        }
                                        className="border px-2 rounded-full bg-gray-200/50 cursor-pointer"
                                      >
                                        <FontAwesomeIcon icon={faInfo} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {selections.accessories[accessory.id]
                                  .selected && (
                                  <>
                                    {accessory.slides && (
                                      <TabSlider slides={accessory.slides} />
                                    )}
                                    <form className="flex gap-3 items-center justify-end mt-3">
                                      <p className="text-md font-bold text-gray-500">
                                        QTY
                                      </p>
                                      <InputField
                                        name={`${accessory.id}-qty`}
                                        placeholder="1"
                                        required
                                        id={`${accessory.id}-qty`}
                                        classes="!w-14"
                                        value={selections.accessories[accessory.id].qty}
                                        type="number"
                                        key={`${accessory.id}-qty`}
                                        onChange={(e) => {
                                          const qty =
                                            parseInt(e.target.value) || 1;
                                          setSelections((prevState) => ({
                                            ...prevState,
                                            accessories: {...prevState.accessories,[accessory.id]: {...prevState.accessories[accessory.id],qty: qty,},},
                                          }));
                                        }}
                                      />
                                    </form>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Shipping options */}
                        <div className="shipping-block mt-9">
                          <h3 className="font-semibold text-lg md:text-xl text-center mb-7">
                            Shipping Options
                          </h3>
                          <div className="accessories-info">
                            {shippingOptions.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center justify-between mb-3 gap-x-2"
                              >
                                <form className="flex items-center justify-between gap-3">
                                  <input
                                    type="radio"
                                    id={option.id}
                                    name="shippingOption"
                                    className="form-checkbox text-black flex-shrink-0"
                                    checked={
                                      selections.shippingOption === option.id
                                    }
                                    onChange={() => {
                                      setSelections((prevState) => ({
                                        ...prevState,
                                        shippingOption: option.id,
                                      }));
                                    }}
                                  />
                                  <label
                                    htmlFor={option.id}
                                    className="font-semibold text-black opacity-50 text-base md:text-17"
                                  >
                                    {option.name}
                                  </label>
                                </form>
                                <div className="price-col flex-shrink-0">
                                  <h4 className="text-black opacity-50 font-semibold text-base md:text-17">
                                    ${option.price}
                                  </h4>
                                </div>
                              </div>
                            ))}
                            <p className="text-custom-black-25 text-13 md:text-sm">
                              *Tax, title, and registration fees will be
                              additional costs.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Financing tab content
                      <div className="tab-content">
                        <p>Financing options will be displayed here.</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Order block */}
                <div className="order-block border-t border-custom-gray-400 pt-9 mt-7">
                  <h2 className="text-2xl md:text-25 font-semibold text-center">
                    Order Your Equipter 4000
                  </h2>
                  <h3 className="font-semibold text-base md:text-17 text-black opacity-50 text-center">
                    Est. Delivery: Jul – Aug 2024
                  </h3>
                  <div className="button-block flex items-center gap-14 mt-6 justify-center">
                    <a
                      href="#"
                      className="inline-block bg-black bg-opacity-10 text-white hover:bg-custom-orange hover:text-white hover:bg-opacity-100 px-6 py-3 text-base md:text-15 leading-5 transition-all text-center"
                    >
                      Send Build
                    </a>
                    <a
                      href="#"
                      className="inline-block hover:bg-black hover:bg-opacity-10 text-white bg-custom-orange hover:text-white px-7 py-3 text-base md:text-15 leading-5 transition-all text-center"
                    >
                      Continue
                    </a>
                  </div>
                  <p className="text-center text-black opacity-25 text-sm mt-7">
                    To talk to a rep call: 
                    <a
                      href="tel:717-661-3591"
                      className="underline hover:no-underline"
                    >
                      717-661-3591
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Modal for accessory info */}
      {modalAccessory && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-5 relative">
            <span
              className="close absolute top-2 right-2 text-2xl cursor-pointer"
              onClick={() => setModalAccessory(null)}
            >
              &times;
            </span>
            <h2 className="text-xl font-bold mb-4">
              {modalAccessory.title || modalAccessory.name}
            </h2>
            <p>{modalAccessory.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSingleProduct;


































// import React, { useState } from "react";
// import React, { useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const ImageSlider = ({ images }) => {
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const openLightbox = (index) => {
//     setCurrentSlide(index);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => {
//     setLightboxOpen(false);
//   };

//   // Main Slider Settings
//   const sliderSettings = {
//     centerMode: true,
//     centerPadding: "150px",
//     slidesToShow: 1,
//     arrows: false,
//     autoplay: true,
//     dots: true,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           centerMode: true,
//           centerPadding: "40px",
//           slidesToShow: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           centerMode: true,
//           centerPadding: "20px",
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   // Lightbox Slider Settings
//   const lightboxSettings = {
//     centerMode: true,
//     centerPadding: "250px",
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     initialSlide: currentSlide,
//     dots: false,
//     arrows: false,
//   };

//   return (
//     <div>
//       {/* Main Slider */}
//       <div className="image-slider">
//         <Slider {...sliderSettings}>
//           {images.map((image, index) => (
//             <div
//               key={index}
//               className="image-item p-2"
//               onClick={() => openLightbox(index)}
//             >
//               <img
//                 src={image.src}
//                 alt={`Slide ${index}`}
//                 className="w-full h-auto object-contain rounded-md transition-transform duration-500 transform hover:scale-105"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Lightbox Modal */}
//       {lightboxOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//           <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full">
//             {/* Close Button */}
//             <button
//               onClick={closeLightbox}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
//             >
//               &times;
//             </button>
//             {/* Lightbox Slider */}
//             <div className="p-6">
//               <Slider {...lightboxSettings}>
//                 {images.map((image, index) => (
//                   <div key={index} className="modal-slider">
//                     <div className="flex flex-col md:flex-row bg-white p-6 gap-6 items-center">
//                       <img
//                         src={image.src}
//                         alt={`Slide ${index}`}
//                         className="w-full md:w-1/2 h-auto object-contain"
//                       />
//                       <div className="slide-details md:w-1/2 text-center md:text-left">
//                         <p className="text-lg font-medium">
//                           Details about image {index + 1}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </Slider>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageSlider;
