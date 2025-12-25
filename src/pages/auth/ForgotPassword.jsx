import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import forgotPasswordSchema from "../../api/api";
import api from "../../api/api";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const forgotPromise = api.post("/auth/forgot-password", data);

      await toast.promise(forgotPromise, {
        loading: "Sending reset link...",
        success: "If the email exists, a reset link has been sent",
        error: (err) => err?.response?.data?.message || "Something went wrong",
      });

      reset();
    } catch {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 border rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
