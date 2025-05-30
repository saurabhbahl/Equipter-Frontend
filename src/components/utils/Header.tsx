// this is the global naviagation bar
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BackendUrl } from "../../utils/useEnv";
import { isTokenExpired } from "../../utils/axios";
import LoaderSpinner from "./LoaderSpinner";
import { useClientContext } from "../../hooks/useClientContext";
interface IExp {
  isExp: boolean;
}
interface ErrorResponse {
  success: boolean;
  message: string;
}
const Header = () => {
  const { token, logOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const {setStatesFn}=useClientContext()
  useEffect(()=>{
    setStatesFn()
  },[])

 

  useEffect(() => {
    const Exp = isTokenExpired(token) as IExp;
    if (Exp.isExp) {
      logOut();
    } else {
      const checkAdminRole = async () => {
        if (token) {
          try {
            const response = await axios.post(
              `${BackendUrl}/admin/check-admin`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setIsAdmin(response.data.success);
          } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            const data = error.response?.data;
            if (data && data.message === "Access denied." && !data.success) {
              setIsAdmin(false);
              return;
            } else if (
              data &&
              data.message === "Invalid token." &&
              !data.success
            ) {
              logOut();
            } else if (
              data &&
              data.message === "Token expired." &&
              !data.success
            ) {
              logOut();
            }
            setIsAdmin(false);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      };

      checkAdminRole();
    }
  }, [token]);

  if (isLoading) {
    return <LoaderSpinner/>;
  }
  
  return (
    <header className="bg-white shadow-md ">
      <div className="container mx-auto flex justify-between items-center p-4 py-1.5">
        {/* Left Placeholder */}
        <div className="w-1/3"></div>

        {/* Center Logo */}
        <div className="w-1/3 flex justify-center">
          <Link to="/">
            <img src={logo} alt="Logo" width="64px" />
          </Link>
        </div>

        {/* Right Buttons */}
        <div className="w-1/3 flex justify-end items-center space-x-5 font-work-sans text-md">
          {token && (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-custom-orange hover:text-custom-orange/70 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logOut}
                className="btn-yellow text-sm p-2 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
