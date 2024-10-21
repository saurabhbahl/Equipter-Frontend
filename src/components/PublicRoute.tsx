import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Loader from "./Loader";

export const PublicRoute = () => {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate(-1);
    }
  }, [token, navigate, loading]);
  if (loading) {
    return <Loader />;
  }

  return <Outlet />;
};
