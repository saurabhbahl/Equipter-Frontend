import { useAdminContext } from '../../../hooks/useAdminContext';
import LoaderSpinner from '../../utils/LoaderSpinner';
import TableHeading from '../../Table/TableHeading';
import ZonesTableRow from './ZonesTableRow';

const ZonesTable = () => {
  const headers = [
    "Sr.No.",
    "ID",
    "Zone Name",
    "Shipping Rate",
    "States Inside Zone",
    "Actions",
  ];
  const { zones, error, loading } = useAdminContext();

  if (loading?.zones)
    return (
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );

  if (error?.zones) {
    return <p className="text-red-600 text-center">{error.zones}</p>;
  }

  return (
    <>
      {zones  &&  zones?.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm !text-center text-gray-500 ">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {zones?.map((row: unknown, index: number) => (
                <ZonesTableRow key={index} zoneRow={row} no={index + 1} />
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
}

export default ZonesTable