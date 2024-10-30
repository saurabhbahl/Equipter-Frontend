import CustomersTable from "./CustomersTable";


const Customers = () => {
  return (
    <div className="mx-auto p-8 bg-white my-5">
      <div className="flex items-center justify-between pb-4 bg-white p-4 rounded-sm shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700">Customers</h1>
      </div>
      <CustomersTable />
    </div>
  );
};

export default Customers;
