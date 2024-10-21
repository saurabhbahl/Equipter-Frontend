import toast from "react-hot-toast";

const CustomToast = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center w-full max-w-xs p-4 bg-white rounded-lg shadow-lg space-x-4 border-l-4 border-blue-500">
      <div className="flex-shrink-0">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.366-.446.962-.446 1.328 0l7.107 8.685c.344.42.05 1.052-.518 1.052H2.206c-.568 0-.862-.632-.518-1.052l7.107-8.685zM10 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-.75 2.75a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="text-gray-700">{message}</div>
      <button
        onClick={() => toast.dismiss()}
        className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        &#10005;
      </button>
    </div>
  );
};

export default CustomToast;
// toast.custom((t) => (
//     <div
//       className={`${
//         t.visible ? 'animate-enter' : 'animate-leave'
//       } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//     >
//       <div className="flex-1 w-0 p-4">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 pt-0.5">
//             <img
//               className="h-10 w-10 rounded-full"
//               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//               alt=""
//             />
//           </div>
//           <div className="ml-3 flex-1">
//             <p className="text-sm font-medium text-gray-900">
//               Emilia Gates
//             </p>
//             <p className="mt-1 text-sm text-gray-500">
//               Sure! 8:30pm works great!
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="flex border-l border-gray-200">
//         <button
//           onClick={() => toast.dismiss(t.id)}
//           className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   ))