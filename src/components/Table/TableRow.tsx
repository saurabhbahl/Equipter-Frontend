// // const TableRow = ({ columns, actions }:any) => {
// //   return (
// //     <tr className="border-b text-center border-gray-200 hover:bg-gray-100">
// //       {columns.map((col:any, index:number) => (
// //         <td key={index} className="px-6 py-4 text-custom-gray-500">
// //           {col}
// //         </td>
// //       ))}
// //       {actions && (
// //         <td className="px-6 py-4 text-center">
// //           {actions.map((action:any, index:number) => (
// //             <button
// //               key={index}
// //               title={action.title}
// //               className={`text-custom-gray-500 mx-2 ${action.className}`}
// //               onClick={action.onClick}
// //             >
// //               {action.icon}
// //             </button>
// //           ))}
// //         </td>
// //       )}
// //     </tr>
// //   );
// // };

// // export default TableRow;

// const TableRow = ({ columns, actions }: any) => {
//   return (
//     <tr className="bg-gray-200/30 border-b border-gray-200 hover:bg-gray-200 transition duration-200">
//       {columns.map((col: any, index: number) => (
//         <td
//           key={index}
//           className="px-6 text-center capitalize py-4 text-gray-700 font-medium text-sm whitespace-nowrap"
//         >
//           {col}
//         </td>
//       ))}
//       {actions && (
//         <td className="px-6 py-4 text-center">
//           <div className="flex items-center justify-center space-x-2">
//             {actions.map((action: any, index: number) => (
//               <button
//                 key={index}
//                 title={action.title}
//                 className={`p-2 rounded-full hover:bg-gray-100 transition duration-200 text-gray-600 ${action.className}`}
//                 onClick={action.onClick}
//               >
//                 {action.icon}
//               </button>
//             ))}
//           </div>
//         </td>
//       )}
//     </tr>
//   );
// };

// export default TableRow;
import React from "react";

interface TableRowProps {
  columns: any[];
  actions?: any[];
}

const TableRow: React.FC<TableRowProps> = ({ columns, actions }) => {
  return (
    <tr className="bg-white border-b capitalize hover:bg-gray-50 transition-colors">
      {columns.map((col, index) => (
        <td
          key={index}
          className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
        >
          {col}
        </td>
      ))}
      {actions && (
        <td className="px-6 py-4 text-right">
          <div className="flex items-center  justify-end space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                title={action.title}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 ${action.className}`}
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
};

export default TableRow;
