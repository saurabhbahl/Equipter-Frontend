import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface PrivateRouteProps {
  role?: string;
}

export const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { token, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) {
      if (window.history.length > 2) {
        navigate("/");
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [loading, token, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (role && user?.role !== role) {
    console.log("first");
    console.log(role, user);
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
      return;
    } else {
      navigate("/", { replace: true });
    }
  }

  return <Outlet />;
};
