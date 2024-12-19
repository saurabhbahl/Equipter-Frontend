import InputField from "../../components/utils/InputFeild";
import { useState } from "react";
import { forgetPasswordSchema } from "../../types/zodschemas/UserSchemas";
import axios, { AxiosError } from "axios";
import { BackendUrl } from "../../utils/useEnv";
import LoaderSpinner from "../../components/utils/LoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEnvelopeCircleCheck,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/utils/Loader";
import { useAuth } from "../../hooks/useAuth";

interface IForgetPassword {
  email: string;
}
interface IErrorRes {
  message: string;
}

const ForgetPassword = () => {
  const [formData, setFormData] = useState<IForgetPassword>({
    email: "",
  });
  const { token: storedToken } = useAuth();

  const [emailSent, setEmailSent] = useState(false);

  const [errors, setErrors] = useState<IForgetPassword>({
    email: "",
  });

  const [serverResponse, setServerResponse] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setServerResponse(null);
  };

  const sendForgetPasswordEmail = async () => {
    try {
      const response = await axios.post(
        `${BackendUrl}/auth/forget-password`,
        {
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = response.data;
      if (!res.success) {
        setServerResponse({
          type: "error",
          message: res.message || "Failed to send password reset email.",
        });
      } else {
        setEmailSent(true);
        setServerResponse({
          type: "success",
          message: `Password reset email sent successfully to ${formData.email}. Please check your email.`,
        });
      }
    } catch (err) {
      const error = err as AxiosError<IErrorRes>;
      if (error.response) {
        setServerResponse({
          type: "error",
          message: error.response.data?.message || "An error occurred.",
        });
      } else if (error.request) {
        setServerResponse({
          type: "error",
          message: "No response from the server.",
        });
      } else {
        setServerResponse({
          type: "error",
          message: "An error occurred.",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = forgetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: IForgetPassword = { email: "" };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IForgetPassword;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    await sendForgetPasswordEmail();

    setLoading(false);
  };
  if (storedToken) {
    return <Loader />;
  }

  return (
    <div className="p-9 my-16 md:p-8 font-work-sans w-full">
      {!emailSent ? (
        <div className="max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
          <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
            Reset Your Password
          </h2>
          <p className="mb-5 text-center text-custom-gray">
            We will send you an email to reset your password.
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
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            {/* Submit Button with Loading Spinner */}
            <div className="col-span-1 md:col-span-2 w-full text-center mt-5">
              <button
                type="submit"
                className="btn-yellow flex items-center justify-center w-full text-md transition-transform duration-150 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <LoaderSpinner /> : "Send Email"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg text-center">
          <FontAwesomeIcon
            icon={faEnvelopeCircleCheck}
            className="text-green-500 text-4xl mb-4"
          />
          <h2 className="lg:text-3xl text-2xl font-semibold text-custom-gray text-center uppercase mb-4">
            Email Sent!
          </h2>
          <p className="text-custom-gray mb-5">
            A password reset email has been sent to
            {formData.email ? (
              <strong> {formData.email}</strong>
            ) : (
              " entered email"
            )}
            . Please check your inbox and follow the instructions to reset your
            password.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
