import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "../utils/useEnv";

const Header = () => {
  const { token, logOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
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
        } catch (error: any) {
          const { data } = error.response;
          if (data && data.message === "Access denied." && !data.success) {
            setIsAdmin(false);
            return;
          } else if (data && data.message === "Invalid token." && !data.success) {
            logOut();
          } else if (data && data.message === "Token expired." && !data.success) {
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
  }, [token]);

  if (isLoading) {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4 py-1.5">
        <Link to={"/"}>
          <img src={logo} alt="Logo" width="64px" />
        </Link>
        <nav className="flex items-center space-x-5 font-work-sans text-md">
          {!token ? (
            <>
              <Link to={"/"} className="text-custom-orange hover:text-custom-orange/70 transition">
                Home
              </Link>
              <Link to={"/login"} className="text-custom-orange hover:text-custom-orange/70 transition">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to={"/"} className="text-custom-orange hover:text-custom-orange/70 transition">
                Home
              </Link>
              <Link to={"/sample"} className="text-custom-orange hover:text-custom-orange/70 transition">
                Sample
              </Link>
              {isAdmin && (
                <Link to={"/admin"} className="text-custom-orange hover:text-custom-orange/70 transition">
                  Admin
                </Link>
              )}
              <button
                onClick={() => logOut()}
                className="btn-yellow text-sm p-2  transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
