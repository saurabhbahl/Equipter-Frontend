import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  return (
   
    <div className="max-w-xl my-36 mx-auto px-6 py-8 bg-white shadow-lg rounded-lg text-center ">
      <div className="text-center">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-5xl text-orange-500 mb-4"
        />
        <h1 className="text-3xl font-semibold text-custom-gray mb-2">Oops!</h1>
        <p className="text-lg text-custom-gray mb-4">
          The page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You may have mistyped the address or the page may have moved.
        </p>
        <a href="/" className="btn-yellow">
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
