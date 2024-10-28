import { Link, useParams } from "react-router-dom";
import InputField from "../../components/InputFeild";
import { useEffect, useState } from "react";
import { resetPasswordSchema } from "../../types/zodschemas/UserSchemas";
import axios from "axios";
import { BackendUrl } from "../../utils/useEnv";
import LoaderSpinner from "../../components/LoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faEye,
  faEyeSlash,
  faHourglassEnd,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { isTokenExpired } from "../../utils/axios";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";

interface IResetPassword {
  password: string | null;
  confirmPassword: string | null;
}
export interface ITokenRes {
  isExp: boolean;
  permission?: string;
}
const ResetPassword = () => {
  const {token: storedToken}=useAuth()
  const [formData, setFormData] = useState<IResetPassword>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<IResetPassword>({
    password: "",
    confirmPassword: "",
  });

  const [serverResponse, setServerResponse] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenExp, setIsTokenExp] = useState(false);
  const [invalidToken, setInValidToken] = useState(false);
  const { token } = useParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
    setServerResponse(null);
  };
  useEffect(() => {
    try {
      if (token?.includes(".")) {
        const res = isTokenExpired(token) as ITokenRes;

        setIsTokenExp(res.isExp);
      } else {
        setInValidToken(true);
      }
    } catch {
      setInValidToken(true);
    }
  }, []);
  async function resetPassword() {
    try {
      let res: any = await axios.post(
        `${BackendUrl}/auth/reset-password/${token}`,
        { password: formData.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res = res.data;
      console.log(res);

      if (!res.success) {
        setServerResponse({
          type: "error",
          message: res.message,
        });
      } else {
        setServerResponse({
          type: "success",
          message: res.message,
        });
        // setTimeout(() => navigate("/login"), 3000);
        setTimeout(() => setIsPasswordReset(true), 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerResponse({
          type: "error",
          message: error.response.data?.message || "An error occurred.",
        });
      } else {
        setServerResponse({ type: "error", message: "An error occurred." });
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: IResetPassword = {
        password: null,
        confirmPassword: null,
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IResetPassword;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setServerResponse({
        type: "error",
        message: "The Confirm Password and Password should be the same",
      });
      return;
    }

    setLoading(true);
    await resetPassword();
    setLoading(false);
  };
  if(storedToken){
    return <Loader/>
  }
  if (isTokenExp) {
    return (
      <div className="max-w-xl my-36 mx-auto px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        <FontAwesomeIcon
          icon={faHourglassEnd}
          className="text-red-500 text-4xl mb-4"
        />
        <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
          OOPS!
        </h2>
        <p className="text-custom-gray mb-5">
          The reset token has expired. Please request a new one to reset your
          password.
        </p>
        <Link to={"/forget-password"} className="btn-yellow">
          Request New
        </Link>
      </div>
    );
  }
  if (invalidToken) {
    return (
      <div className="max-w-xl my-36 mx-auto px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500 text-4xl mb-4"
        />
        <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
          OOPS!
        </h2>
        <p className="text-custom-gray mb-5">
          The reset token is invalid. Please request a new one to reset your
          password.
        </p>
        <Link to={"/forget-password"} className="btn-yellow">
          Request New
        </Link>
      </div>
    );
  }
  return (
    <div className="p-9 my-36 md:p-8 font-work-sans w-full">
      {isPasswordReset ? (
        <div className="max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-4xl mb-4"
          />
          <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
            Success!
          </h2>
          <p className="text-custom-gray mb-5">
            Your Password has been updated successfully.
          </p>
          <Link to={"/login"} className="btn-yellow">
            Login Now
          </Link>
        </div>
      ) : (
        <div className="max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
          <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
            Reset Your Password
          </h2>
          <p className="mb-5 text-center text-custom-gray">
            Please enter a new password below to reset your password.
          </p>
          <hr className="my-5 border-1" />
          {/* Server Response (Success or Error) */}
          {serverResponse && (
            <div
              className={`flex items-center p-2 mb-5 rounded-lg text-sm ${
                serverResponse.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {serverResponse.type === "error" ? (
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              )}
              <span>{serverResponse.message}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-4"
          >
            {/* New Password */}
            <div className="relative">
              <InputField
                label="New Password"
                placeholder="Enter your new password"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                error={errors.password as string}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <InputField
                label="Confirm Password"
                placeholder="Confirm your new password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleInputChange}
                error={errors.confirmPassword as string}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-9 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>

            {/* Submit Button with Loading Spinner */}
            <div className="text-center mt-5">
              <button
                type="submit"
                className="btn-yellow flex items-center justify-center w-full  text-md transition-transform duration-150 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <LoaderSpinner /> : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
