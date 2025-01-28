import { faHome, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isExp, isTokenExpired } from "../../utils/axios";

export const CancelPage = () => {
  const [searchParams] = useSearchParams();
  const nav=useNavigate()
  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if(!session_id){
      nav("/not-found")
 
    }
    const result = isTokenExpired(session_id) as isExp
    if (result.isExp == true) {
      nav("/")
    }
  }, []);

  return (
    <div className="bg-custom-cream min-h-screen px-4 py-16 font-work-sans">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white  shadow-lg p-8">
          <div className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="text-custom-orange text-6xl mb-4"
            />
            <h1 className="text-32 text-custom-gray mb-2">Payment Cancelled</h1>
            <p className="text-custom-gray-200 text-19 text-center mb-6">
              Your payment was not completed. You can try again or return to our
              homepage.
            </p>
            <Link
              to="/"
              className="w-full text-custom-gray-200 text-19 px-4 py-3  border border-custom-med-gray
                        hover:bg-custom-light-gray transition-colors duration-200 text-center
                        flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
