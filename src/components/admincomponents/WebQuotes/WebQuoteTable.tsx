import LoaderSpinner from "../../utils/LoaderSpinner";
import { useAdminContext } from "../../../hooks/useAdminContext";
import TableHeading from "../../Table/TableHeading";
import WebQuoteTableRow from "./WebQuoteTableRow";
import { IQuotes } from "./WebQuoteSchema";

const WebQuoteTable = () => {
  const headers = [
    "Sr.No.",
    "ID",
    "Product",
    "Total Price",
    "Zone",
    "Stage",
    "Shipping",
    "Financing",
    "Created At"
  ];
  const { webquotes, error, loading } = useAdminContext();

  if (loading.webquotes)
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );

  if (error?.webquotes) {
    return <p className="text-red-600 text-center">{error.webquotes}</p>;
  }
  return (
    <>
      {webquotes &&  webquotes?.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm !text-center text-gray-500 ">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {webquotes?.map((quote: IQuotes, index: number) => (
                <WebQuoteTableRow key={index} webquote={quote} no={index + 1} />
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

export default WebQuoteTable;
