// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { useEffect } from "react";

// interface PrivateRouteProps {
//   role?: string;
// }

// export const PrivateRoute = ({ role }: PrivateRouteProps) => {
//   const { token, user } = useAuth();
//   console.log(token);
//   useEffect(()=>{
//     if (!token) {
//       // console.log("call")
//       return <Navigate to="/login" />;
//     }
//   }, [token]);

//   if (role && user?.role !== role) {
//     return <Navigate to="/" />;
//   }

//   return <Outlet />;
// };
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { useEffect, useState } from "react";

// interface PrivateRouteProps {
//   role?: string;
// }

// export const PrivateRoute = ({ role }: PrivateRouteProps) => {
//   const { token, user } = useAuth();
//   const [authorized, setAuthorized] = useState<boolean | null>(null);

//   useEffect(() => {
//     if (!token) {
//       setAuthorized(false);
//     } else if (role && user?.role !== role) {
//       setAuthorized(false);
//     } else {
//       setAuthorized(true);
//     }
//   }, [token, role, user]);

//   if (authorized === null) {
//     return <div>Loading...</div>;
//   }

//   return authorized ? <Outlet /> : <Navigate to={token ? "/" : "/login"} />;
// };
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import Loader from "./Loader";

// interface PrivateRouteProps {
//   role?: string;
// }

// export const PrivateRoute = ({ role }: PrivateRouteProps) => {
//   const { token, user, loading } = useAuth();

//   if (loading) {
//     return <Loader />;
//   }

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (role && user?.role !== role) {
//     return <Navigate to="/" />;
//   }

//   return <Outlet />;
// };
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
      navigate(-1);
    }
  }, [loading, token, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (role && user?.role !== role) {
    console.log("first")
    console.log(role,user)
    // return <Navigate to="/" />;
    navigate(-1);
  }

  return <Outlet />;
};
