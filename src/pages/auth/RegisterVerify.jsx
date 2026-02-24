import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";
import verifyRegisterSchema from "../../schema/verifyRegisterSchema";

const RegisterVerify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyRegisterSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!state?.email) {
      navigate("/register");
    }
  }, [state, navigate]);

  const onSubmit = async (data) => {
    try {
      const verifyPromise = api.post("/auth/register/verify", {
        email: state.email,
        otp: data.otp,
      });

      await toast.promise(verifyPromise, {
        loading: "Verifying OTP...",
        success: "Email verified successfully",
        error: (err) =>
          err?.response?.data?.message || "OTP verification failed",
      });

      navigate("/login");
    } catch (error) {
      //toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-md rounded-lg p-6 w-full max-w-md bg-zinc-200">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Your <br />
          <span className="text-purple-800">Email</span>
        </h2>

        <p className="text-center text-sm mb-4 text-gray-700">
          Enter the 6-digit OTP sent to <br />
          <strong>{state?.email}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              disabled={isSubmitting}
              {...register("otp")}
              className={`w-full border p-2 rounded-md text-center tracking-widest text-lg
                ${errors.otp ? "border-red-500" : ""}
                ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}
              `}
            />
            {errors.otp && (
              <p className="text-xs text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterVerify;
