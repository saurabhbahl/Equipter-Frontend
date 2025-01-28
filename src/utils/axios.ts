import axios, { AxiosError, AxiosResponse } from "axios";
import { BackendUrl } from "./useEnv";

export const apiClient = axios.create({
  baseURL: BackendUrl,
  timeout: 10000,
});
export interface isExp {
  isExp: boolean;
  permission: string;
}
export const isTokenExpired = (
  token: string | null = localStorage.getItem("token") || null
) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp < Date.now() / 1000;
    console.log("Decoded token payload: ", payload);
    console.log("Expiration check: ",isExpired);
    console.log("time", payload.exp - Date.now() / 1000);
    return {
      isExp: isExpired,
      permission: payload.role as string,
    };
  } catch {
    // console.error("Error decoding token or invalid token format", error);
    return {
      isExp: true,
      permission: "",
    };
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem("token");
    const isExp = isTokenExpired(token);
    // console.log(config.url)
    if (token && !(isExp as isExp)?.isExp) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
    return config;
  },
  (error) => {
    console.log("Axios Error Res", error.response);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (!(status >= 200 && status < 300)) {
        // Remove token and redirect to login
        localStorage.removeItem("token");
        window.location.replace("/login");
      }
    } else {
      console.error("Network or server error:", error);
    }
    return Promise.reject(error);
  }
);

export const publicApiClient = axios.create({
  baseURL: BackendUrl,
  timeout: 10000,
});
