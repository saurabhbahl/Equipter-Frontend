import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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




// import { Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useEffect } from "react";
// import Loader from "./Loader";

// interface PrivateRouteProps {
//   role?: string;
// }

// export const PrivateRoute = ({ role }: PrivateRouteProps) => {
//   // const { token, user, loading } = useAuth();
//   // const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (!loading) {
//   //     if (!token) {
//   //       // If no token, redirect to login
//   //       navigate("/login", { replace: true });
//   //     } else if (role && user?.role !== role) {
//   //       // If role is specified and user role doesn't match, redirect to home
//   //       navigate("/", { replace: true });
//   //     }
//   //   }
//   // }, [loading, token, role, user, navigate]);

//   // if (loading) {
//   //   return <Loader />;
//   // }

//   // If token exists and role matches (if required), render the child routes
//   return <Outlet />;
// };
