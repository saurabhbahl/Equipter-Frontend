import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Loader from "./Loader";

export const PublicRoute = () => {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [token, navigate, loading]);
  if (loading) {
    return <Loader />;
  }

  return <Outlet />;
};
