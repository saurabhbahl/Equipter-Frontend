// // import React from "react";

// // const Products = () => {
// //   return (
// //     <div className="container">
// //       {/* Header */}
// //       <header>
// //         <a href="/">
// //           <img src="images/logo.png" alt="Logo" width="64px" />
// //         </a>
// //       </header>

// //       {/* Main Content */}
// //       <main>
// //         <section className="content-with-sidebar pb-20">
// //           <div className="block md:flex w-full">
// //             {/* Content Block */}
// //             <div className="content-block w-full md:w-2/3 xs:px-4 md:px-0">
// //               <div className="main-heading -mb-16 relative z-10 hidden md:block">
// //                 <h1 className="uppercase font-robot">Build + Buy</h1>
// //               </div>
// //               <div className="images-slides-wrapper pb-14">
// //                 <div className="image-slider slider-custom-nav">
// //                   {["images/EQ4000-220818_Equipter_011_1.jpg", "images/EQ4000-220818_Equipter_01_2.jpg", "images/slide-3.jpg", "images/slide-4.jpg"].map((src, index) => (
// //                     <div key={index} className="image-item">
// //                       <img src={src} className="w-full h-full object-contain" alt={`Slide ${index + 1}`} />
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div className="build-lists-content md:px-10 flex">
// //                 {[
// //                   { title: "GVWR", value: "7,500 lbs" },
// //                   { title: "Lift Capacity", value: "4,000 lbs" },
// //                   { title: "Lift Height", value: "12’-0”" },
// //                   { title: "Container", value: "4.1 cu yds" },
// //                 ].map((item, index) => (
// //                   <div key={index} className="build-lists-col w-3/12 px-3">
// //                     <h4 className="font-roboto text-xxs md:text-lg">{item.title}</h4>
// //                     <h3 className="font-robot text-sm md:text-3xl heading-bottom-border">{item.value}</h3>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Sidebar Block */}
// //             <div className="sidebar-block w-full md:w-1/3 md:pl-8 xs:px-4 md:px-0 pt-12 md:pt-0">
// //               <div className="text-center font-robot mb-9">
// //                 <h2 className="text-custom-black-200 text-6xl md:text-5xl 3xl:text-64">4000</h2>
// //                 <p className="text-custom-black-200 text-lg md:text-19">The Towable Roofing Trailer</p>
// //               </div>

// //               <div className="tabs-section tabs font-robot sidebar-tabs-block">
// //                 {/* Tabs Navigation */}
// //                 <ul className="tabs-nav roofing-tabs-nav flex gap-12 border-b-4 border-custom-orange-100">
// //                   <li className="tab-title active min-w-36">
// //                     <a href="#cash" className="tab-title-link pb-2 inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">
// //                       Cash
// //                     </a>
// //                   </li>
// //                   <li className="tab-title min-w-36">
// //                     <a href="#financing" className="tab-title-link pb-2 inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">
// //                       Financing
// //                     </a>
// //                   </li>
// //                 </ul>

// //                 {/* Tabs Content */}
// //                 <div id="roofing-tabs-content" className="tabs-content pt-5 md:pt-8">
// //                   <div id="cash" className="tab-content">
// //                     <div className="price-content-block pb-3">
// //                       <table className="min-w-full overflow-hidden">
// //                         <thead>
// //                           <tr>
// //                             <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Base Price</th>
// //                             <th></th>
// //                             <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Add-Ons</th>
// //                             <th></th>
// //                             <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Net Price</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           <tr>
// //                             <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
// //                               $38,900
// //                               <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">+</span>
// //                             </td>
// //                             <td></td>
// //                             <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
// //                               $995
// //                               <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">=</span>
// //                             </td>
// //                             <td></td>
// //                             <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">$40,295</td>
// //                           </tr>
// //                         </tbody>
// //                       </table>
// //                     </div>

// //                     <div className="tabs-scroll-content overflow-hidden overflow-y-scroll">
// //                       <div className="flex gap-6 justify-between pt-7 items-center">
// //                         <h3 className="font-semibold text-lg md:text-xl leading-6">Equipter 4000 Base Unit</h3>
// //                         <form className="flex gap-3 items-center">
// //                           <label htmlFor="qty" className="font-semibold text-15 md:text-lg uppercase">
// //                             Qty
// //                           </label>
// //                           <input
// //                             type="number"
// //                             id="qty"
// //                             name="qty"
// //                             min="1"
// //                             className="border border-solid border-custom-black-200 w-7 h-7 text-center text-custom-black-200 placeholder:text-custom-black-200 outline-none"
// //                             placeholder="1"
// //                             required
// //                           />
// //                         </form>
// //                       </div>
// //                       {/* Add similar JSX for the other sections as per the HTML structure */}
// //                     </div>
// //                   </div>

// //                   {/* Financing Tab */}
// //                   <div id="financing" className="tab-content">
// //                     {/* Add Financing Tab Content */}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Order Block */}
// //               <div className="order-block border-t border-custom-gray-400 pt-9 mt-7">
// //                 <h2 className="text-2xl md:text-25 font-semibold text-center">Order Your Equipter 4000</h2>
// //                 <h3 className="font-semibold text-base md:text-17 text-black opacity-50 text-center">Est. Delivery: Jul – Aug 2024</h3>
// //                 <div className="button-block flex items-center gap-14 mt-6 justify-center">
// //                   <a
// //                     href="#"
// //                     className="inline-block bg-black bg-opacity-10 text-white hover:bg-custom-orange hover:text-white hover:bg-opacity-100 px-6 py-3 text-base md:text-15 leading-5 transition-all text-center"
// //                   >
// //                     Send Build
// //                   </a>
// //                   <a
// //                     href="#"
// //                     className="inline-block hover:bg-black hover:bg-opacity-10 text-white bg-custom-orange hover:text-white px-7 py-3 text-base md:text-15 leading-5 transition-all text-center"
// //                   >
// //                     Continue
// //                   </a>
// //                 </div>
// //                 <p className="text-center text-black opacity-25 text-sm mt-7">
// //                   To talk to a rep call:{" "}
// //                   <a href="tel:717-661-3591" className="underline hover:no-underline">
// //                     717-661-3591
// //                   </a>
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // };

// // export default Products;

// import  { useState, useEffect } from 'react';

// const Products = () => {
//   // State variables
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [activeTab, setActiveTab] = useState('cash');
//   const [modalAccessory, setModalAccessory] = useState(null);

//   // Images for the main slider
//   const images = [
//     'https://www.equipter.com/hubfs/Equipter_4000_ProPage_WorkMode1.jpg',
//     'https://www.equipter.com/hubfs/Equipter_4000_ProPage_WorkMode1.jpg',
//     'https://www.equipter.com/hubfs/Equipter_4000_ProPage_WorkMode1.jpg',
//     'https://www.equipter.com/hubfs/Equipter_4000_ProPage_WorkMode1.jpg',
//   ];

//   // Build lists data
//   const buildLists = [
//     { title: 'GVWR', value: '7,500 lbs' },
//     { title: 'Lift Capacity', value: '4,000 lbs' },
//     { title: 'Lift Height', value: '12’-0”' },
//     { title: 'Container', value: '4.1 cu yds' },
//   ];

//   // Accessories data
//   const accessoriesList = [
//     {
//       id: 'roofingPackage',
//       name: 'Roofing Accessories Package',
//       price: 995,
//       description: 'Roofing accessories package description.',
//       slides: [
//         {
//           id: 'slide1',
//           imageSrc: 'https://via.placeholder.com/400x300?text=Roofing+Package+1',
//           title: '8\' Roof Chute (x2)',
//           description: 'Roof chutes help to channel debris towards the container, so you can keep working without worrying about moving the Equipter 4000 lift frequently.',
//         },
//         {
//           id: 'slide2',
//           imageSrc: 'https://via.placeholder.com/400x300?text=Roofing+Package+2',
//           title: '8\' Roof Chute (x2)',
//           description: 'Roof chutes help to channel debris towards the container.',
//         },
//         // Add more slides as needed
//       ],
//     },
//     {
//       id: 'premiumPackage',
//       name: 'Premium Accessories Package',
//       price: 2675,
//       description: 'Premium accessories package description.',
//       slides: [
//         {
//           id: 'slide1',
//           imageSrc: 'https://via.placeholder.com/400x300?text=Premium+Package+1',
//           title: '8\' Gutter Protector (x1)',
//           description: 'Gutter protectors help to protect gutters during work.',
//         },
//         // Add more slides as needed
//       ],
//     },
//     {
//       id: 'RoofChute',
//       name: '8\' Roof Chute',
//       price: 165,
//       description: 'Roof chute description.',
//     },
//     {
//       id: 'GutterProtector',
//       name: '8\' Gutter Protector',
//       price: 154,
//       description: 'Gutter protector description.',
//     },
//     {
//       id: 'RearKit',
//       name: 'Rear Extension Kit',
//       price: 489,
//       description: 'Rear extension kit description.',
//     },
//     {
//       id: 'TrackMat',
//       name: '2\' x 6\' Track Mat',
//       price: 329,
//       description: 'Track mat description.',
//     },
//     {
//       id: 'Outrigger',
//       name: '18" x 18" Outrigger Pad',
//       price: 79,
//       description: 'Outrigger pad description.',
//     },
//     {
//       id: 'TireSealant',
//       name: 'Tire Sealant Kit',
//       price: 195,
//       description: 'Tire sealant kit description.',
//     },
//   ];

//   // Shipping options data
//   const shippingOptions = [
//     { id: 'pickup', name: 'Pick-up', price: 0 },
//     { id: 'delivery', name: 'Delivery to the State of: PA', price: 400 },
//   ];

//   // Initialize accessories state
//   const initialAccessoriesState = {};
//   accessoriesList.forEach((acc) => {
//     initialAccessoriesState[acc.id] = { selected: false, qty: 1 };
//   });

//   // Selections state
//   const [selections, setSelections] = useState({
//     baseUnitQty: 1,
//     accessories: initialAccessoriesState,
//     shippingOption: null,
//   });

//   // Total prices state
//   const [totalPrices, setTotalPrices] = useState({
//     basePrice: 38900,
//     addOns: 0,
//     netPrice: 38900,
//   });

//   // Main image slider autoplay
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000); // change image every 3 seconds
//     return () => clearInterval(interval);
//   }, [images.length]);

//   // Update total prices when selections change
//   useEffect(() => {
//     let basePrice = 38900 * selections.baseUnitQty;
//     let addOns = 0;

//     Object.keys(selections.accessories).forEach((accId) => {
//       const accessory = selections.accessories[accId];
//       if (accessory.selected) {
//         const accessoryInfo = accessoriesList.find((item) => item.id === accId);
//         if (accessoryInfo) {
//           addOns += accessoryInfo.price * accessory.qty;
//         }
//       }
//     });

//     let shippingPrice = 0;
//     if (selections.shippingOption) {
//       const shippingOption = shippingOptions.find((option) => option.id === selections.shippingOption);
//       if (shippingOption) {
//         shippingPrice = shippingOption.price;
//       }
//     }

//     const netPrice = basePrice + addOns + shippingPrice;

//     setTotalPrices({
//       basePrice,
//       addOns,
//       netPrice,
//     });
//   }, [selections]);

//   // Handle tab click
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   // TabSlider component
//   const TabSlider = ({ slides }) => {
//     const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

//     const nextSlide = () => {
//       setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     };

//     const prevSlide = () => {
//       setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
//     };

//     return (
//       <div className="tab-slider-wrapper pt-4">
//         <div className="tab-slider slider-custom-nav">
//           <div className="tab-slide-item">
//             <img src={slides[currentSlideIndex].imageSrc} alt={slides[currentSlideIndex].title} className="slide-image w-full" />
//             <div className="slide-details tab-slide-content bg-custom-gray-300 flex justify-between items-center px-5 py-7 w-full -mt-10 relative">
//               <h3 className="font-semibold text-black text-25 md:text-27">{slides[currentSlideIndex].title}</h3>
//               <img
//                 src="https://via.placeholder.com/20x20?text=i"
//                 alt="Info"
//                 className="info-icon w-5 cursor-pointer"
//                 onClick={() => setModalAccessory(slides[currentSlideIndex])}
//               />
//             </div>
//           </div>
//           {/* Navigation */}
//           <div className="slider-navigation flex justify-between mt-4">
//             <button onClick={prevSlide} className="px-4 py-2 bg-gray-300">Prev</button>
//             <button onClick={nextSlide} className="px-4 py-2 bg-gray-300">Next</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="products-component">
//       {/* Header */}
//       <header>
//         <div className="container">
//           <a href="#"><img src="https://via.placeholder.com/64" alt="Logo" width="64px" /></a>
//         </div>
//       </header>
//       {/* Main content */}
//       <main>
//         <section className="content-with-sidebar pb-20">
//           <div className="container">
//             <div className="block md:flex w-full">
//               {/* Left content */}
//               <div className="content-block w-full md:w-2/3 xs:px-4 md:px-0">
//                 {/* Main heading */}
//                 <div className="main-heading -mb-16 relative z-10 hidden md:block">
//                   <h1 className="uppercase font-robot">Build + Buy</h1>
//                 </div>
//                 {/* Image Slider */}
//                 <div className="images-slides-wrapper pb-14 hidden">
//                   <div className="image-slider slider-custom-nav">
//                     {/* Slider images */}
//                     {images.map((imageSrc, index) => (
//                       <div
//                         key={index}
//                         className={`image-item ${index === activeImageIndex ? 'active' : ''}`}
//                         style={{
//                           display: index === activeImageIndex ? 'block' : 'none',
//                         }}
//                       >
//                         <img src={imageSrc} alt={`Slide ${index + 1}`} className="w-full h-full object-contain" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <ImageSlider images={images} />
//                 {/* Build lists content */}
//                 <div className="build-lists-content md:px-10 flex">
//                   {buildLists.map((item, index) => (
//                     <div key={index} className="build-lists-col w-3/12 px-3">
//                       <h4 className="font-roboto text-xxs md:text-lg">{item.title}</h4>
//                       <h3 className="font-robot text-sm md:text-3xl heading-bottom-border">{item.value}</h3>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Sidebar content */}
//               <div className="sidebar-block w-full md:w-1/3 md:pl-8 xs:px-4 md:px-0 pt-12 md:pt-0">
//                 <div className="text-center font-robot mb-9">
//                   <h2 className="text-custom-black-200 text-6xl md:text-5xl 3xl:text-64">4000</h2>
//                   <p className="text-custom-black-200 text-lg md:text-19">The Towable Roofing Trailer</p>
//                 </div>
//                 {/* Tabs Section */}
//                 <div className="tabs-section tabs font-robot sidebar-tabs-block">
//                   <ul className="tabs-nav roofing-tabs-nav flex gap-12 border-b-4 border-custom-orange-100">
//                     <li
//                       className={`tab-title min-w-36 ${activeTab === 'cash' ? 'active' : ''}`}
//                       onClick={() => handleTabClick('cash')}
//                     >
//                       <a href="#roofing-tab1" className="tab-title-link pb-2 inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">Cash</a>
//                     </li>
//                     <li
//                       className={`tab-title min-w-36 ${activeTab === 'financing' ? 'active' : ''}`}
//                       onClick={() => handleTabClick('financing')}
//                     >
//                       <a href="#roofing-tab2" className="tab-title-link pb-2 inline-block text-custom-black-25 font-semibold text-lg md:text-xl leading-6">Financing</a>
//                     </li>
//                   </ul>
//                   {/* Tab Content */}
//                   <div id="roofing-tabs-content" className="tabs-content pt-5 md:pt-8">
//                     {activeTab === 'cash' ? (
//                       // Cash tab content
//                       <div id="roofing-tab1" className="tab-content">
//                         {/* Price content block */}
//                         <div className="price-content-block pb-3">
//                           <table className="min-w-full overflow-hidden">
//                             <thead>
//                               <tr>
//                                 <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Base Price</th>
//                                 <th></th>
//                                 <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Add-Ons</th>
//                                 <th></th>
//                                 <th className="text-left text-custom-black-25 text-sm md:text-15 font-semibold">Net Price</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               <tr>
//                                 <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
//                                   ${totalPrices.basePrice.toLocaleString()} <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">+</span>
//                                 </td>
//                                 <td></td>
//                                 <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
//                                   ${totalPrices.addOns.toLocaleString()} <span className="text-15 leading-9 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">=</span>
//                                 </td>
//                                 <td></td>
//                                 <td className="text-custom-orange-100 align-middle font-semibold text-3xl md:text-32">
//                                   ${totalPrices.netPrice.toLocaleString()}
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                         {/* Base unit quantity */}
//                         <div className="flex gap-6 justify-between pt-7 items-center">
//                           <h3 className="font-semibold text-lg md:text-xl leading-6">Equipter 4000 Base Unit</h3>
//                           <form className="flex gap-3 items-center">
//                             <label htmlFor="baseUnitQty" className="font-semibold text-15 md:text-lg uppercase">Qty</label>
//                             <input
//                               type="number"
//                               id="baseUnitQty"
//                               name="baseUnitQty"
//                               min="1"
//                               className="border border-solid border-custom-black-200 w-14 h-10 text-center text-custom-black-200 placeholder:text-custom-black-200 outline-none"
//                               value={selections.baseUnitQty}
//                               onChange={(e) => {
//                                 const qty = parseInt(e.target.value) || 1;
//                                 setSelections((prevState) => ({
//                                   ...prevState,
//                                   baseUnitQty: qty,
//                                 }));
//                               }}
//                               required
//                             />
//                           </form>
//                         </div>
//                         {/* Accessories */}
//                         <div className="accessories-block mt-9">
//                           <h3 className="font-semibold text-lg md:text-xl text-center mb-7">Add-On Accessories</h3>
//                           <div className="accessories-info">
//                             {accessoriesList.map((accessory) => (
//                               <div key={accessory.id} className={`accessories-col mb-3 ${selections.accessories[accessory.id].selected ? 'active' : ''}`}>
//                                 <div className="flex items-center justify-between mb-3 gap-x-2">
//                                   <form className="flex items-center justify-between gap-3">
//                                     <input
//                                       type="checkbox"
//                                       id={accessory.id}
//                                       className="form-checkbox text-black flex-shrink-0"
//                                       checked={selections.accessories[accessory.id].selected}
//                                       onChange={(e) => {
//                                         const isChecked = e.target.checked;
//                                         setSelections((prevState) => ({
//                                           ...prevState,
//                                           accessories: {
//                                             ...prevState.accessories,
//                                             [accessory.id]: {
//                                               ...prevState.accessories[accessory.id],
//                                               selected: isChecked,
//                                             },
//                                           },
//                                         }));
//                                       }}
//                                     />
//                                     <label htmlFor={accessory.id} className={`font-semibold text-black ${selections.accessories[accessory.id].selected ? '' : 'opacity-50'} text-base md:text-17`}>{accessory.name}</label>
//                                   </form>
//                                   <div className="price-col flex-shrink-0">
//                                     <div className="flex gap-3 items-center">
//                                       <h4 className={`text-black ${selections.accessories[accessory.id].selected ? '' : 'opacity-50'} font-semibold text-base md:text-17`}>${accessory.price}</h4>
//                                       <img
//                                         src="https://via.placeholder.com/20x20?text=i"
//                                         alt="Info"
//                                         className="w-5"
//                                         onClick={() => setModalAccessory(accessory)}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
//                                 {selections.accessories[accessory.id].selected && (
//                                   <>
//                                     {accessory.slides && <TabSlider slides={accessory.slides} />}
//                                     <form className="flex gap-3 items-center justify-end mt-3">
//                                       <label htmlFor={`${accessory.id}-qty`} className="font-semibold text-15 md:text-lg uppercase text-black">Qty</label>
//                                       <input
//                                         type="number"
//                                         id={`${accessory.id}-qty`}
//                                         name={`${accessory.id}-qty`}
//                                         min="1"
//                                         className="border border-solid border-custom-black-200 w-14 h-10 text-center text-custom-black-200 placeholder:text-custom-black-200 outline-none"
//                                         value={selections.accessories[accessory.id].qty}
//                                         onChange={(e) => {
//                                           const qty = parseInt(e.target.value) || 1;
//                                           setSelections((prevState) => ({
//                                             ...prevState,
//                                             accessories: {
//                                               ...prevState.accessories,
//                                               [accessory.id]: {
//                                                 ...prevState.accessories[accessory.id],
//                                                 qty: qty,
//                                               },
//                                             },
//                                           }));
//                                         }}
//                                         required
//                                       />
//                                     </form>
//                                   </>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                         {/* Shipping options */}
//                         <div className="shipping-block mt-9">
//                           <h3 className="font-semibold text-lg md:text-xl text-center mb-7">Shipping Options</h3>
//                           <div className="accessories-info">
//                             {shippingOptions.map((option) => (
//                               <div key={option.id} className="flex items-center justify-between mb-3 gap-x-2">
//                                 <form className="flex items-center justify-between gap-3">
//                                   <input
//                                     type="radio"
//                                     id={option.id}
//                                     name="shippingOption"
//                                     className="form-checkbox text-black flex-shrink-0"
//                                     checked={selections.shippingOption === option.id}
//                                     onChange={() => {
//                                       setSelections((prevState) => ({
//                                         ...prevState,
//                                         shippingOption: option.id,
//                                       }));
//                                     }}
//                                   />
//                                   <label htmlFor={option.id} className="font-semibold text-black opacity-50 text-base md:text-17">{option.name}</label>
//                                 </form>
//                                 <div className="price-col flex-shrink-0">
//                                   <h4 className="text-black opacity-50 font-semibold text-base md:text-17">${option.price}</h4>
//                                 </div>
//                               </div>
//                             ))}
//                             <p className="text-custom-black-25 text-13 md:text-sm">*Tax, title, and registration fees will be additional costs.</p>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       // Financing tab content
//                       <div id="roofing-tab2" className="tab-content">
//                         {/* Similar structure as Cash tab but with different calculations */}
//                         {/* For brevity, not fully implemented */}
//                         <p>Financing options will be displayed here.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {/* Order block */}
//                 <div className="order-block border-t border-custom-gray-400 pt-9 mt-7">
//                   <h2 className="text-2xl md:text-25 font-semibold text-center">Order Your Equipter 4000</h2>
//                   <h3 className="font-semibold text-base md:text-17 text-black opacity-50 text-center">Est. Delivery: Jul – Aug 2024</h3>
//                   <div className="button-block flex items-center gap-14 mt-6 justify-center">
//                     <a href="#" className="inline-block bg-black bg-opacity-10 text-white hover:bg-custom-orange hover:text-white hover:bg-opacity-100 px-6 py-3 text-base md:text-15 leading-5 transition-all text-center">Send Build</a>
//                     <a href="#" className="inline-block hover:bg-black hover:bg-opacity-10 text-white bg-custom-orange hover:text-white px-7 py-3 text-base md:text-15 leading-5 transition-all text-center">Continue</a>
//                   </div>
//                   <p className="text-center text-black opacity-25 text-sm mt-7">To talk to a rep call: <a href="tel:717-661-3591" className="underline hover:no-underline">717-661-3591</a></p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       {/* Modal for accessory info */}
//       {modalAccessory && (
//         <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal-content bg-white p-5 relative">
//             <span className="close absolute top-2 right-2 text-2xl cursor-pointer" onClick={() => setModalAccessory(null)}>&times;</span>
//             <h2 className="text-xl font-bold mb-4">{modalAccessory.title || modalAccessory.name}</h2>
//             <p>{modalAccessory.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;

// // import React, { useState } from "react";
// // import React, { useState } from "react";
// // import Slider from "react-slick";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // const ImageSlider = ({ images }) => {
// //   const [lightboxOpen, setLightboxOpen] = useState(false);
// //   const [currentSlide, setCurrentSlide] = useState(0);

// //   const openLightbox = (index) => {
// //     setCurrentSlide(index);
// //     setLightboxOpen(true);
// //   };

// //   const closeLightbox = () => {
// //     setLightboxOpen(false);
// //   };

// //   // Main Slider Settings
// //   const sliderSettings = {
// //     centerMode: true,
// //     centerPadding: "150px",
// //     slidesToShow: 1,
// //     arrows: false,
// //     autoplay: true,
// //     dots: true,
// //     responsive: [
// //       {
// //         breakpoint: 768,
// //         settings: {
// //           centerMode: true,
// //           centerPadding: "40px",
// //           slidesToShow: 1,
// //         },
// //       },
// //       {
// //         breakpoint: 480,
// //         settings: {
// //           centerMode: true,
// //           centerPadding: "20px",
// //           slidesToShow: 1,
// //         },
// //       },
// //     ],
// //   };

// //   // Lightbox Slider Settings
// //   const lightboxSettings = {
// //     centerMode: true,
// //     centerPadding: "250px",
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //     initialSlide: currentSlide,
// //     dots: false,
// //     arrows: false,
// //   };

// //   return (
// //     <div>
// //       {/* Main Slider */}
// //       <div className="image-slider">
// //         <Slider {...sliderSettings}>
// //           {images.map((image, index) => (
// //             <div
// //               key={index}
// //               className="image-item p-2"
// //               onClick={() => openLightbox(index)}
// //             >
// //               <img
// //                 src={image.src}
// //                 alt={`Slide ${index}`}
// //                 className="w-full h-auto object-contain rounded-md transition-transform duration-500 transform hover:scale-105"
// //               />
// //             </div>
// //           ))}
// //         </Slider>
// //       </div>

// //       {/* Lightbox Modal */}
// //       {lightboxOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
// //           <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full">
// //             {/* Close Button */}
// //             <button
// //               onClick={closeLightbox}
// //               className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
// //             >
// //               &times;
// //             </button>
// //             {/* Lightbox Slider */}
// //             <div className="p-6">
// //               <Slider {...lightboxSettings}>
// //                 {images.map((image, index) => (
// //                   <div key={index} className="modal-slider">
// //                     <div className="flex flex-col md:flex-row bg-white p-6 gap-6 items-center">
// //                       <img
// //                         src={image.src}
// //                         alt={`Slide ${index}`}
// //                         className="w-full md:w-1/2 h-auto object-contain"
// //                       />
// //                       <div className="slide-details md:w-1/2 text-center md:text-left">
// //                         <p className="text-lg font-medium">
// //                           Details about image {index + 1}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </Slider>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ImageSlider;

// // import React, { useState, useEffect } from 'react';

// const ImageSlider = ({ images }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000); // Change the duration as needed
//     return () => clearInterval(interval);
//   }, [images.length]);

//   return (
//     <div className="relative w-full h-64 overflow-hidden bg-gray-100 border border-gray-300 rounded-md">
//       {images.map((image, index) => (
//         <div
//           key={index}
//           className={`absolute inset-0 transition-opacity duration-1000 ${
//             index === currentIndex ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <img src={image} alt={`Slide ${index}`} className="w-full h-full object-contain rounded-md" />
//         </div>
//       ))}
//       <div className="absolute bottom-0 w-full flex justify-center space-x-2 py-4">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-4 h-4 mx-1 rounded-full ${
//               index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
//             }`}
//           ></button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // export default ImageSlider;

// import { useEffect, useState } from "react";
// import SingleProductComponent from "../components/SingleProductComponent";
// import { ClientProductService } from "./ClientProductService";
// import MetaComponent from "../../../utils/MetaComponent";
// import { useClientContext } from "../../../hooks/useClientContext";
// import LoaderSpinner from "../../../components/utils/LoaderSpinner";

// const Products = () => {
//   // const [productsData, setProductsData] = useState([]);
//   const { products, setProducts, loading, setLoading } = useClientContext();
//   const ProductService = new ClientProductService();
//   const fetchData = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, products: true }));
//       const allProducts = await ProductService.getAllProductsWithImages();
//       // const data = await response.json();
//       console.log(allProducts);
//       const featuredImageUrl = allProducts?.Product_Images__r?.records.filter(
//         (data) => data.Is_Featured__c == true
//       );
//       console.log(featuredImageUrl);
//       setProducts(allProducts?.records);
//       setLoading((prev) => ({ ...prev, products: false }));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     if (products.length < 1) {
//       fetchData();
//     }
//   }, []);
//   if (loading.products) {
//     <div className="w-full h-full flex justify-center my-20">
//       <LoaderSpinner />
//     </div>;
//   }

//   return (
//     <div>
//       <MetaComponent title="Products" />
//       {products.map((prod: any) => (
//         <SingleProductComponent productDetail={prod} />
//       ))}
//     </div>
//   );
// };

// export default Products;

import { useEffect } from "react";
import SingleProductComponent from "../components/SingleProductComponent";
import { ClientProductService } from "./ClientProductService";
import MetaComponent from "../../../utils/MetaComponent";
import { useClientContext } from "../../../hooks/useClientContext";
import LoaderSpinner from "../../../components/utils/LoaderSpinner";

const Products = () => {
  const { products, setProducts, loading, setLoading } = useClientContext();
  const ProductService = new ClientProductService();

  // Fetch Products Data
  const fetchData = async () => {
    try {
      const allProducts = await ProductService.getAllProductsWithImages();
      setProducts(allProducts?.records || []);
      setLoading((prev) => ({ ...prev, products: false }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    if (products.length < 1) {
      setLoading((prev) => ({ ...prev, products: true }));
      fetchData();
    }
  }, []);

  if (loading.products) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoaderSpinner />
      </div>
    );
  }

  // Render Products
  return (
    <div className=" ">
      <MetaComponent title="Products" />
      {products.length > 0 ? (
        <div>
          <MetaComponent title="Products" />
          {products.map((prod: any, index: number) => (
            <SingleProductComponent productDetail={prod} key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center py-20">
          <p className="text-gray-600 font-medium text-lg">
            No products found.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
