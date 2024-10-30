const LoaderSpinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white mr-2"
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
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>

    // <div className="flex flex-col items-center w-full h-full justify-center">
    //   <div
    //     className="w-8 h-8 border-4 border-cyan rounded-full border-b-custom-orange animate-spin"
    //     // role={roles}
    //   />
    //   {/* <span className="ml-2">{span}</span> */}
    // </div>
  );
};

export default LoaderSpinner;
