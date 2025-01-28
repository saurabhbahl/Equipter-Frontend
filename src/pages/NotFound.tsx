import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-custom-cream min-h-[90vh] px-4 py-16 font-work-sans">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-6xl text-custom-orange mb-4"
            />
            <h1 className="text-32 text-custom-gray mb-2">Page Not Found</h1>
            <p className="text-custom-gray-200 text-19 text-center mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link
              to="/"
              className="w-full bg-custom-orange text-white text-19 px-4 py-3 
                        hover:bg-custom-orange/90 transition-colors duration-200 text-center
                        flex items-center justify-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;