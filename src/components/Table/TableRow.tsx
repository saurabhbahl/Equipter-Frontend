import React from "react";
interface Action {
  title: string;
  className?: string;
  onClick: () => void;
  icon: React.ReactNode;
}
interface TableRowProps {
  columns: React.ReactNode[];
  actions?: Action[];
}

const TableRow: React.FC<TableRowProps> = ({ columns, actions }) => {
  return (
    <tr className="bg-gray-100  border-b border-gray-400 capitalize hover:bg-gray-200 transition-colors">
      {columns.map((col, index) => (
        <td
          key={index}
          className="px-5 py-3 text-sm text-left text-gray-700 whitespace-nowrap"
        >
          {col}
        </td>
      ))}
      {actions && (
        <td className="px-6 py-3 text-right">
          <div className="flex items-left  justify-end space-x-1">
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
