import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import selectRoleSchema from "../../schema/selectRoleSchema";
import api from "../../api/api";
import { getUser } from "../../slice/authSlice";

const SelectRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(selectRoleSchema),
    defaultValues: {
      newRole: "",
    },
  });

  const handleRoleClick = (role) => {
    setValue("newRole", role);
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/select-role", data, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Role updated!");

      const user = await dispatch(getUser()).unwrap();

      const roles = user.roles || [];

      if (roles.includes("instructor")) {
        return navigate("/i");
      }

      if (roles.includes("student")) {
        return navigate("/s");
      }

      toast.error("Invalid role");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-md rounded-lg p-6 w-full max-w-md bg-zinc-200">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Choose Your <br />
          <span className="text-purple-800">Skillify Role</span>
        </h2>

        <p className="text-center mb-6 text-sm text-gray-700">
          Select how you want to use the platform.
        </p>

        <button
          disabled={isSubmitting}
          onClick={() => handleRoleClick("student")}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mb-4 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Student"}
        </button>

        <button
          disabled={isSubmitting}
          onClick={() => handleRoleClick("instructor")}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Instructor"}
        </button>
      </div>
    </section>
  );
};

export default SelectRole;
