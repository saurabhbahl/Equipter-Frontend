// function Loader({ span, roles = "status" }: { span?: string; roles?: string }) {
//   return (
//     <div className="flex flex-col items-center w-full h-full justify-center">
//       <div
//         className="w-8 h-8 border-4 border-cyan rounded-full border-b-custom-orange animate-spin"
//         role={roles}
//       />
//       <span className="ml-2">{span}</span>
//     </div>
//   );
// }

// export default Loader;

// import './Loader.css';  

// function Loader({ span, roles = "status" }: { span?: string; roles?: string }) {
//   return (
//     <div className="flex flex-col items-center w-full h-full justify-center ">
    
//       <div className="logo-container loader" role={roles}>
//         <div className="black-triangle"></div>
//         <div className="orange-triangle"></div>
//       </div>
//       {span && <span className="ml-2">{span}</span>}
//     </div>
//   );
// }

// export default Loader;



// const Loader = ({ span, roles = "status" }: { span?: string; roles?: string }) => {
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <svg
//         width="55"
//         height="55"
//         viewBox="0 0 100 100"
//         xmlns="http://www.w3.org/2000/svg"
//         role={roles}
//         style={{ display: 'auto', margin: '0 auto' }}
//       >
//         {/* Black Triangle */}
//         <polygon
//           points="50,0 100,50 0,50"
//           fill="black"
//           style={{
//             transformOrigin: "50px 50px",
//             animation: "rotateBlack 1.5s infinite"
//           }}
//         />

//         {/* Orange Triangle */}
//         <polygon
//           points="0,50 50,100 100,50"
//           fill="#ea7600"
//           style={{
//             transformOrigin: "50px 50px",
//             animation: "rotateOrange 1.5s infinite"
//           }}
//         />

//         {/* SVG Animations */}
//         <style>
//           {`
//             @keyframes rotateBlack {
//               0% {
//                 transform: rotate(0deg);
//               }
//               50% {
//                 transform: rotate(180deg);
//               }
//               100% {
//                 transform: rotate(360deg);
//               }
//             }
//             @keyframes rotateOrange {
//               0% {
//                 transform: rotate(0deg);
//               }
//               50% {
//                 transform: rotate(-180deg);
//               }
//               100% {
//                 transform: rotate(-360deg);
//               }
//             }
//           `}
//         </style>
//       </svg>
//       {span && <span className="ml-2">{span}</span>}
//     </div>
//   );
// };

// export default Loader;
const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-40">
      <svg
        width="55"
        height="55"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
         className="m-auto"
      >
        {/* Black Triangle */}
        <polygon
          points="50,0 100,50 0,50"
          fill="black"
          style={{
            transformOrigin: "50px 50px",
            animation: "rotateBlack 1.5s infinite"
          }}
        />

        {/* Orange Triangle */}
        <polygon
          points="0,50 50,100 100,50"
          fill="#ea7600"
          style={{
            transformOrigin: "50px 50px",
            animation: "rotateOrange 1.5s infinite"
          }}
        />

        {/* SVG Animations */}
        <style>
          {`
            @keyframes rotateBlack {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes rotateOrange {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(-180deg);
              }
              100% {
                transform: rotate(-360deg);
              }
            }
          `}
        </style>
      </svg>
      {/* {span && <span className="ml-2 text-white">{span}</span>} */}
    </div>
  );
};

export default Loader;
