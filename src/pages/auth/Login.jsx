import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import SocialLogin from "../../components/SocialLogin";
import loginSchema from "../../schema/LoginSchema";
import { login, getUser } from "../../slice/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // LOGIN
      await toast.promise(dispatch(login(data)).unwrap(), {
        loading: "Logging in...",
        success: "Login successful",
        error: (err) => err || "Login failed",
      });

      // FETCH USER
      const user = await toast.promise(dispatch(getUser()).unwrap(), {
        loading: "Fetching profile...",
        error: (err) => err || "Login failed",
      });

      // welcome toast
      toast.success(`Welcome back, ${user.name}!`);

      const rolePriority = [
        { role: "admin", path: "/a/" },
        { role: "instructor", path: "/i/" },
        { role: "student", path: "/s/" },
        { role: "user", path: "/u/" },
      ];

      const match = rolePriority.find((r) =>
        (user.roles || []).includes(r.role),
      );

      if (!match) {
        toast.error("Login failed (Invalid Role)");
        navigate("/login");
        return;
      }

      navigate(match.path);
      reset();
    } catch (err) {
      //toast.error(err || "Login failed");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" shadow-md rounded-lg p-6 w-full max-w-md bg-zinc-200">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login To Your <br /> <span className="text-purple-800">Skillify</span>{" "}
          Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Loggin in..." : "Login"}
          </button>
        </form>

        {/* Social Login Button */}
        <SocialLogin />

        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
