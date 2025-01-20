// import React, { ReactNode, useEffect } from "react";
// import ReactDOM from "react-dom";

// interface PortalProps {
//   type?: "error" | "info";
//   message?: string;
//   children?: React.ReactNode;
//   onClose: () => void;
//   isOpen?: boolean;
// }

// const Portal: React.FC<PortalProps> = ({
//   type,
//   message,
//   children,
//   onClose,
//   isOpen,
// }) => {
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   if (!isOpen) return null;

//   const isError = type === "error";
//   const isInfo = type === "info";

//   const backgroundColor = isError
//     ? "bg-red-200/80"
//     : isInfo
//     ? "bg-blue-200/80"
//     : "bg-gray-200";
//   const textColor = isError
//     ? "text-red-600"
//     : isInfo
//     ? "text-blue-600"
//     : "text-gray-700";
//   const buttonTextColor = isError
//     ? "text-red-500"
//     : isInfo
//     ? "text-blue-500"
//     : "text-gray-500";

//   return ReactDOM.createPortal(
//     <div className="fixed inset-0 flex justify-center w-full font-work-sans items-center bg-black bg-opacity-60 z-50">
//       <div className=" p-1.5 rounded shadow-lg bg-white max-w-[30%]">
//         {children ? (
//           <div>{children}</div>
//         ) : (
//           <div
//             className={`${backgroundColor} flex flex-col items-center p-1 rounded`}
//           >

//             <button
//               onClick={onClose}
//               className={`flex items-center self-end text-[15px] justify-center w-[35px] h-[25px] rounded border-2 border-gray-600 bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${buttonTextColor} mb-3`}
//             >
//               esc
//             </button>
//             <div className={`${textColor} p-1 mt-3 text-center font-medium`}>
//               <p>{message}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default Portal;


// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";

// interface PortalProps {
//   type: "error" | "info";
//   message: string;
//   onClose: () => void;
//   isOpen: boolean;
//   autoCloseDuration?: number;
// }

// const Portal: React.FC<PortalProps> = ({
//   type,
//   message,
//   onClose,
//   isOpen,
//   autoCloseDuration = 5000,
// }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!isOpen) return;

//     //  timer for auto-close and progress bar
//     const startTime = Date.now();
//     const interval = setInterval(() => {
//       const elapsed = Date.now() - startTime;
//       const newProgress = Math.min((elapsed / autoCloseDuration) * 100, 100);
//       setProgress(newProgress);

//       if (elapsed >= autoCloseDuration) {
//         clearInterval(interval);
//         onClose();
//       }
//     }, 80);

//     return () => clearInterval(interval);
//   }, [isOpen, autoCloseDuration, onClose]);

//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   if (!isOpen) return null;

//   const backgroundColor = type === "error" ? "bg-red-500" : "bg-blue-500";
//   const textColor = type === "error" ? "text-white" : "text-white";
//   const borderColor = type === "error" ? "border-red-600" : "border-blue-600";

//   return ReactDOM.createPortal(
//     <div className="fixed top-4 right-4 z-50 animate-slide-in">
//       <div
//         className={`relative p-6 rounded-lg shadow-lg ${backgroundColor} max-w-sm w-full border-2 ${borderColor}`}
//       >
//         {/* Notification content */}
//         <div className="flex items-center justify-between">
//           <p className={`text-lg font-medium ${textColor}`}>{message}</p>
//           <button
//             onClick={onClose}
//             aria-label="Close notification"
//             className="ml-4 text-gray-100 bg-transparent rounded-full p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           >
//             &times;
//           </button>
//         </div>
//         {/* Progress bar */}
//         <div
//           style={{ width: `${progress}%` }}
//           className={`h-1 mt-2 rounded-md ${type === "error" ? "bg-red-400" : "bg-blue-400"} transition-all duration-200`}
//         />
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default Portal;


// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";

// interface PortalProps {
//   type: "error" | "info";
//   message: string;
//   onClose: () => void;
//   isOpen: boolean;
//   autoCloseDuration?: number;
// }

// const Portal: React.FC<PortalProps> = ({
//   type,
//   message,
//   onClose,
//   isOpen,
//   autoCloseDuration = 5000,
// }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!isOpen) return;

//     const startTime = Date.now();
//     const interval = setInterval(() => {
//       const elapsed = Date.now() - startTime;
//       const newProgress = Math.min((elapsed / autoCloseDuration) * 100, 100);
//       setProgress(newProgress);

//       if (elapsed >= autoCloseDuration) {
//         clearInterval(interval);
//         onClose();
//       }
//     }, 80);

//     return () => clearInterval(interval);
//   }, [isOpen, autoCloseDuration, onClose]);

//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   if (!isOpen) return null;

//   const backgroundColor = type === "error" ? "bg-red-600" : "bg-blue-600";
//   const textColor = type === "error" ? "text-white" : "text-white";
//   const buttonColor = type === "error" ? "bg-red-400" : "bg-blue-400";

//   return ReactDOM.createPortal(
//     <div className="fixed top-4 right-4 z-50">
//       <div
//         className={`relative p-4 rounded-lg shadow-2xl ${backgroundColor} max-w-sm transition-all transform-gpu duration-300`}
//       >
//         <div className={`flex items-center justify-between ${textColor}`}>
//           <p className="text-md font-semibold">{message}</p>
//           <button
//             onClick={onClose}
//             aria-label="Close notification"
//             className={`ml-4 ${buttonColor} text-white rounded-full p-1 border border-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
//           >
//             &times;
//           </button>
//         </div>
//         <div className="h-1 mt-3 rounded-md overflow-hidden bg-gray-300">
//           <div
//             style={{ width: `${progress}%` }}
//             className={`h-full ${type === "error" ? "bg-red-300" : "bg-blue-300"} transition-all duration-300`}
//           />
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default Portal;

// import { faCheckCircle, faClose, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";

// interface PortalProps {
//   type: "success" | "error";
//   message: string;
//   onClose: () => void;
//   isOpen: boolean;
//   autoCloseDuration?: number;
// }

// const Portal: React.FC<PortalProps> = ({
//   type,
//   message,
//   onClose,
//   isOpen,
//   autoCloseDuration = 5000,
// }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!isOpen) return;

//     const startTime = Date.now();
//     const interval = setInterval(() => {
//       const elapsed = Date.now() - startTime;
//       const newProgress = Math.min((elapsed / autoCloseDuration) * 100, 100);
//       setProgress(newProgress);

//       if (elapsed >= autoCloseDuration) {
//         clearInterval(interval);
//         onClose();
//       }
//     }, 80);

//     return () => clearInterval(interval);
//   }, [isOpen, autoCloseDuration, onClose]);

//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   if (!isOpen) return null;

//   // Set styles based on notification type
//   const backgroundColor =
//     type === "error" ? "bg-custom-cream" : "bg-custom-cream";
//   const textColor = type === "error" ? "text-custom-red" : "text-custom-orange";
//   const icon =
//     type === "error" ? (
//       <span className="text-custom-red"><FontAwesomeIcon icon={faExclamationCircle}/></span>
//     ) : (
//       <span className="text-custom-orange"><FontAwesomeIcon icon={faCheckCircle}/></span>
//     );
//   const progressBarColor = type === "error" ? "bg-custom-red" : "bg-custom-orange";

//   return ReactDOM.createPortal(
//     <div className="fixed shadow-xl top-4 right-4 z-50">
//       <div
//         className={`flex flex-col p-4 rounded-lg shadow-lg ${backgroundColor} ${textColor} max-w-sm`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             {icon}
//             <p className="ml-2 text-sm font-medium">{message}</p>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close notification"
//             className="text-xl font-semibold focus:outline-none"
//           >
//            <FontAwesomeIcon icon={faClose}/>
//           </button>
//         </div>
//         {/* Progress Bar */}
//         <div className="h-1 mt-3 rounded-full overflow-hidden bg-custom-gray-300">
//           <div
//             style={{ width: `${progress}%` }}
//             className={`h-full ${progressBarColor} transition-all duration-300`}
//           />
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default Portal;