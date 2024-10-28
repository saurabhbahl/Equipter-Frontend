import { useState } from "react";
import InputField from "../../components/InputFeild";
import { IUserLogin, userSchema } from "../../types/zodschemas/UserSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "../../components/LoaderSpinner";
import Loader from "../../components/Loader";

interface LoginResponse {
  success: boolean;
  message: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<IUserLogin>({
    email: "",
    password: "",
  });

  const nav = useNavigate();
  const { loginAction, token: storedToken } = useAuth();

  const [errors, setErrors] = useState<IUserLogin>({
    email: null,
    password: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [serverResponse, setServerResponse] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
    setServerResponse(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerResponse(null);

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: IUserLogin = { email: null, password: null };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IUserLogin;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Login action
    const loginResponse: LoginResponse = await loginAction(formData);

    setLoading(false);

    if (loginResponse?.success) {
      setServerResponse({
        type: "success",
        message: "Login successful! Redirecting...",
      });
      nav("/");
    } else {
      setServerResponse({
        type: "error",
        message: loginResponse.message || "Invalid email or password.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  if (storedToken) {
    return <Loader />;
  }

  return (
    <div className="p-9 my-36 md:p-8 font-work-sans w-full">
      <div className="max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
          Login Here
        </h2>
        <p className="mb-5 text-center text-custom-gray">
          Fill out the form below to login into Equipter.
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

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Email Input */}
          <InputField
            label="Email"
            placeholder="Email Address"
            type="text"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            error={errors.email as string}
          />

          {/* Password Input */}
          <div className="relative mb-5">
            <InputField
              label="Password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              error={errors.password as string}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[38px] cursor-pointer"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
          </div>

          <p
            className="text-md font-semibold text-right mb-3 text-custom-orange/80 transition-all duration-100 hover:text-custom-orange cursor-pointer"
            onClick={() => nav("/forget-password")}
          >
            Forgot Password?
          </p>

          {/* Submit Button with Loading Spinner */}
          <div className="col-span-1 md:col-span-2 w-full text-center">
            <button
              type="submit"
              className="btn-yellow flex items-center justify-center w-full text-md transition-transform duration-150 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <LoaderSpinner /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
