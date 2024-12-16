// import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IUserLogin, User } from "../types/zodschemas/UserSchemas";
// import axios, { AxiosError } from "axios";
// import { BackendUrl } from "../utils/useEnv";
// import { isTokenExpired } from "../utils/axios";
// import { ITokenRes } from "../pages/auth/ResetPassword";
// import { LoginResponse } from "../pages/auth/LoginPage";

// export interface AuthContextType {
//   token: string | null;
//   user: User | null;
//   loginAction: (data: IUserLogin) => Promise<LoginResponse>;
//   logOut: () => void;
//   loading: boolean;
// }
// interface ErrorResponse {
//   message: string;
// }
// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       const isTokenExp = isTokenExpired(token) as ITokenRes;
//       if (isTokenExp.isExp == true) {
//         logOut();
//       } else {
//         setToken(storedToken);
//         const payload = JSON.parse(atob(storedToken.split(".")[1]));
//         setUser({ id: payload.userId, role: payload.role });
//       }
//     }
//     setLoading(false);
//   }, []);

//   const loginAction = async (data: IUserLogin) => {
//     try {
//       console.log(data);
//       const response = await axios.post(`${BackendUrl}/auth/login`, data);
//       const res = response.data;

//       if (res.success) {
//         setUser({ id: res.userData.id, role: res.userData.role });
//         setToken(res.token);
//         localStorage.setItem("token", res.token);
//         return res.success;
//       }
//     } catch (err) {
//       const error = err as AxiosError<ErrorResponse>;

//       return (
//         (error?.response?.data?.message as string) ||
//         "An unknown error occurred"
//       );
//     }
//   };

//   const logOut = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     // navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, loginAction, logOut, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IUserLogin, User } from "../types/zodschemas/UserSchemas";
import axios, { AxiosError } from "axios";
import { BackendUrl } from "../utils/useEnv";
import { isTokenExpired } from "../utils/axios";
import { ITokenRes } from "../pages/auth/ResetPassword";
import { LoginResponse } from "../pages/auth/LoginPage";

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loginAction: (data: IUserLogin) => Promise<LoginResponse>;
  logOut: () => void;
  loading: boolean;
}

interface ErrorResponse {
  message: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const isTokenExp = isTokenExpired(storedToken) as ITokenRes;
      if (isTokenExp.isExp) {
        logOut();
      } else {
        setToken(storedToken);
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({ id: payload.userId, role: payload.role });
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginAction = async (data: IUserLogin) => {
    try {
   
      const response = await axios.post(`${BackendUrl}/auth/login`, data);
      const res = response.data;

      if (res.success) {
        setUser({ id: res.userData.id, role: res.userData.role });
        setToken(res.token);
        localStorage.setItem("token", res.token);
        window.location.reload()
        return res.success;
      } else {
        return res.message || "Login failed";
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return (
        (error?.response?.data?.message as string) ||
        "An unknown error occurred"
      );
    }
  };

  const logOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
    window.location.reload()
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
