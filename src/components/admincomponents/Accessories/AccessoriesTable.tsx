import AccessoriesTableRow from "./AccessoriesTableRow";

const AccessoriesTable = () => {
  const accessories = [
    {
      name: "Wireless Headphones",
      category: "Audio",
      price: "$99.99",
      stockStatus: "In Stock",

      image:
        "https://images.pexels.com/photos/3387138/pexels-photo-3387138.jpeg",
    },
    {
      name: "Smart Watch",
      category: "Wearable",
      price: "$199.99",
      stockStatus: "Low Stock",

      image: "https://images.pexels.com/photos/338727/pexels-photo-338727.jpeg",
    },
    {
      name: "Bluetooth Speaker",
      category: "Audio",
      price: "$49.99",
      stockStatus: "Out of Stock",
    },
    {
      name: "Phone Case",
      category: "Mobile",
      price: "$15.99",
      stockStatus: "In Stock",
      image: "https://images.pexels.com/photos/351186/pexels-photo-351186.jpeg",
    },
    {
      name: "Fitness Tracker",
      category: "Wearable",
      price: "$79.99",
      stockStatus: "In Stock",
      image: "https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg",
    },
  ];

  return (
    <div className="overflow-auto shadow-lg rounded-lg">
      <table className="w-full mx-auto   bg-white">
        <thead>
          <tr className="border-b border-gray-200 text-center">
            <th className="px-6 py-4 font-semibold text-gray-500">Image</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Name</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Category</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Price</th>
            <th className="px-6 py-4 font-semibold text-gray-500">Stock</th>
          </tr>
        </thead>
        <tbody>
          {accessories.map((accessory, index) => (
            <AccessoriesTableRow key={index} accessory={accessory} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessoriesTable;
