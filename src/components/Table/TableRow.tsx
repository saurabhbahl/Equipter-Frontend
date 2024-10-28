
const TableRow = ({ columns, actions }:any) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      {columns.map((col:any, index:number) => (
        <td key={index} className="px-6 py-4 text-custom-gray-500">
          {col}
        </td>
      ))}
      {actions && (
        <td className="px-6 py-4 text-center">
          {actions.map((action:any, index:number) => (
            <button
              key={index}
              className={`text-custom-gray-500 mx-2 ${action.className}`}
              onClick={action.onClick}
            >
              {action.icon}
            </button>
          ))}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
