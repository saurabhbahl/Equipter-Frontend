import React from 'react';

interface TableHeadingProps {
  headers: string[];
}

const TableHeading: React.FC<TableHeadingProps> = ({ headers }) => {
  return (
    <thead className="text-xs bg-gradient-to-b to-slate-800 from-black leading-4 font-bold text-gray-100 text-left">
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
