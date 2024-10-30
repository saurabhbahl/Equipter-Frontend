import CustomersTableRow from "./CustomerTableRow";


const CustomersTable = () => {
  const customers = [
    {
      name: "A ",
      email: "a@gmail.com",
      spent: "$2,890.66",
      country: "US",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    {
      name: "B",
      email: "b@gmail.com",
      spent: "$2,767.04",
      country: "DE",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    {
      name: "C",
      email: "c@gmail.com",
      spent: "$2,996.00",
      country: "FR",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    {
      name: "D",
      email: "d@gmail.com",
      spent: "$1,220.66",
      country: "IT",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    {
      name: "E",
      email: "e@gmail.com",
      spent: "$1,890.66",
      country: "GB",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
  ];

  return (
    <div className="overflow-auto shadow-lg rounded-lg">
      <table className="min-w-full table-auto bg-white">
        <thead>
          <tr className="border-b border-gray-200 text-center">
            <th className="px-6 py-4 font-semibold text-gray-500">Name</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Spent</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Country</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <CustomersTableRow key={index} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
