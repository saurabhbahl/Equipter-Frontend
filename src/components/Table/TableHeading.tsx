// import React from 'react';

// interface TableHeadingProps {
//   headers: string[];
// }

// const TableHeading: React.FC<TableHeadingProps> = ({ headers }) => {
//   return (
//     <thead className="bg-gray-200 rounde border-b  border-black">
//       <tr>
//         {headers.map((header, index) => (
//           <th key={index} className="px-6 py-3 text-center font-semibold text-gray-700">
//             {header}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// };

// export default TableHeading;
// import React from 'react';

// interface TableHeadingProps {
//   headers: string[];
// }

// const TableHeading: React.FC<TableHeadingProps> = ({ headers }) => {
//   return (
//     <thead className="bg-gray-100">
//       <tr>
//         {headers.map((header, index) => (
//           <th
//             key={index}
//             className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${ header.toLowerCase().includes("action") ?"text-right":""}`}
//           >
//             {header}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// };

// export default TableHeading;

import React from 'react';

interface TableHeadingProps {
  headers: string[];
}

const TableHeading: React.FC<TableHeadingProps> = ({ headers }) => {
  return (
    <thead className="text-xs leading-4 font-semibold text-gray-700 bg-gray-100">
      <tr>
        {headers.map((header, index) => (
          <th key={index} className={`px-6 py-3 text-left ${header.toLowerCase().includes("actions") ? "text-right" : ""}`}>
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeading;
