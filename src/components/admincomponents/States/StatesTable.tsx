import LoaderSpinner from "../../utils/LoaderSpinner";
import { useAdminContext } from "../../../hooks/useAdminContext";
import TableHeading from "../../Table/TableHeading";
import StatesTableRow from "./StatesTableRow";

const StatesTable = () => {
  const headers = [
    "Sr.No.",
    "ID",
    "State Name",
    "Zone Name",
    "Shipping Rate",
    "Is Delivery Paused",
    "Actions",
  ];
  const { states, error, loading } = useAdminContext();

  if (loading?.states)
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );

  if (error?.states) {
    return <p className="text-red-600 text-center">{error.states}</p>;
  }

  return (
    <>
      {states &&  states?.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm !text-center text-gray-500 ">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {states?.map((row: unknown, index: number) => (
                <StatesTableRow key={index} stateRow={row} no={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p className="text-custom-orange text-center my-9">No Items To Show</p>
        </div>
      )}
    </>
  );
};

export default StatesTable;
