import ProductTableRow from "./ProductTableRow";
import LoaderSpinner from "../../utils/LoaderSpinner";
import TableHeading from "../../Table/TableHeading";
import { useAdminContext } from "../../../hooks/useAdminContext";

const ProductTable = () => {
  const { products, loading, error } = useAdminContext();
  const headers = [
    "Sr.No.",
    "ID",
    "Name",
    "Price",
    "GVWR",
    "Downpayment",
    "Actions",
  ];
  if (loading.products) {
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );
  }

  if (error.products) {
    return <p className="text-red-600 text-center">{error.products}</p>;
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm text-center text-gray-500">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {products.map((product, index: number) => (
                <ProductTableRow
                  key={product.Id}
                  product={product}
                  no={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {" "}
          <p className="text-custom-orange text-center">No Products Found</p>
          ;
        </div>
      )}
    </>
  );
};

export default ProductTable;
