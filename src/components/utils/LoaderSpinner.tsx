// const LoaderSpinner = ({ classes }: { classes?: string }) => {
//   return (
//     <div className={`flex items-center justify-center ${classes}`}>
//       <svg
//         className="animate-spin h-6 w-6 text-custom-orange"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//       >
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//         ></circle>
//         <path
//           className="opacity-75"
//           fill="url(#loader-gradient)"
//           d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
//         ></path>
//         <defs>
//           <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" className="text-custom-orange" stopColor="#F97316" />
//             <stop offset="100%" className="text-orange-400" stopColor="#FB923C" />
//           </linearGradient>
//         </defs>
//       </svg>
//     </div>
//   );
// };

// export default LoaderSpinner;
const LoaderSpinner = ({ classes }: { classes?: string }) => {
  return (
    <div className={`flex items-center justify-center ${classes}`}>
      <svg
        className="animate-spin h-8 w-8 text-custom-orange"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="url(#loader-gradient)"
          d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
        ></path>
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-custom-orange" stopColor="#F97316" />
            <stop offset="100%" className="text-orange-400" stopColor="#FB923C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoaderSpinner;
