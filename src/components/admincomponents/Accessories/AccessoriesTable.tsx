import { useEffect, useState } from "react";
import AccessoriesTableRow from "./AccessoriesTableRow";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { useAdminContext } from "../../../hooks/useAdminContext";
import AccessoriesService from "./AccessoriesService";
import TableHeading from "../../Table/TableHeading";

const AccessoriesTable = () => {
  // const [accessories, setAccessories] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const headers = ["Sr.No.", "Name", "Price", "Stock", "Actions"];
  const {
    accessories,
    error,
    loading,
    setAccessories,
    setError,
    setLoading,
  } = useAdminContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, accessories: false }));
      setError((prev) => ({ ...prev, accessories: "" }));

      try {
        const data = await AccessoriesService.fetchAccessories();
        console.log(data);
        setAccessories(data);
      } catch (error) {
        console.log(error);
        setError((prev) => ({
          ...prev,
          accessories: error.message || "Unexpected error occured",
        }));
      } finally {
        setLoading({ accessories: false });
      }
    };
    fetchData();
  }, []);
  if (loading.accessories)
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );
  if (error?.accessories) return <div> {error.accessories}</div>;

  return (
    <div className="overflow-auto shadow-lg rounded">
      <table className="w-full mx-auto   bg-white">
      
        <TableHeading headers={headers} />
        <tbody>
          {accessories?.map((accessory, index) => (
            <AccessoriesTableRow
              key={index}
              accessory={accessory}
              id={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessoriesTable;

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+CreatedById,+Description__c,+LastModifiedById,+OwnerId,+Price__c,+Quantity__c+FROM+Accessory__c",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching products: ${response.statusText}`);
//       }

//       const data = await response.json();
// console.log(data)
//       setAccesories(data.records);
//     } catch (error:any) {
//       setError(error.message );
//     } finally {
//       setLoading(false);
//     }
//   };
