import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import resetPasswordSchema from "../../schema/resetPasswordSchema";
import api from "../../api/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const resetPromise = api.post(`/auth/reset-password/${token}`, {
        password: data.password,
      });

      await toast.promise(resetPromise, {
        loading: "Resetting password...",
        success: "Password reset successful",
        error: (err) =>
          err?.response?.data?.message || "Invalid or expired link",
      });

      navigate("/login");
    } catch (error) {
      toast.error(err?.response?.data?.message || "Invalid or expired link");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 border rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 mt-3"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-amber-500 text-white py-2 rounded mt-4"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
