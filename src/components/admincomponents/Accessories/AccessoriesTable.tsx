import AccessoriesTableRow from "./AccessoriesTableRow";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { useAdminContext } from "../../../hooks/useAdminContext";
import TableHeading from "../../Table/TableHeading";
import { Accessory } from "./AccessoriesSchema";

const AccessoriesTable = () => {
  const headers = ["Sr.No.", "ID", "Name", "Price", "Stock", "Actions"];
  const { accessories, error, loading } = useAdminContext();

  if (loading.accessories)
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );

  if (error?.accessories) {
    return <p className="text-red-600 text-center">{error.accessories}</p>;
  }

  return (
    <>
      {accessories.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm !text-center text-gray-500 ">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {accessories?.map((accessory:unknown, index:number) => (
                <AccessoriesTableRow
                  key={index}
                  accessory={accessory as Accessory}
                  id={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p className="text-custom-orange text-center">No Accessories Found</p>
          ;
        </div>
      )}
    </>
  );
};

export default AccessoriesTable;

