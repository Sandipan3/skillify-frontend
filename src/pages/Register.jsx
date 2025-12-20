import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import SocialLogin from "../components/SocialLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "../schema/registerSchema";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const registerPromise = api.post("/auth/register/init", data);

      await toast.promise(registerPromise, {
        loading: "Sending OTP...",
        success: "OTP sent to your email",
        error: (err) => err?.response?.data?.message || "Failed to send OTP",
      });

      reset();

      navigate("/verify-otp", {
        state: { email: data.email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" shadow-md rounded-lg p-6 w-full max-w-md bg-zinc-200">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Your <br /> <span className="text-purple-800">Skillify</span>{" "}
          Account
        </h2>

        <form className="space-y-3 " onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className={`w-full border p-2 rounded-md ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full border p-2 rounded-md ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full border p-2 rounded-md ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-1 top-2.5"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Social Login Button */}
        <SocialLogin />

        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
