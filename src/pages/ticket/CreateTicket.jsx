import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slice/authSlice";
import toast from "react-hot-toast";

const CreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  let requestedRole = null;

  if (user?.roles?.includes("student")) {
    requestedRole = "instructor";
  } else if (user?.roles?.includes("instructor")) {
    requestedRole = "student";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedRole) {
      return toast.error("Role change not allowed");
    }

    try {
      setLoading(true);

      await api.post("/ticket/create", { requestedRole });

      toast.success("Request submitted");
      navigate("/ticket/status");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  if (!requestedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        You are not eligible for role change.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Request Role Change
        </h2>

        <div className="text-center text-gray-700">
          <p>
            Requested Role:{" "}
            <span className="font-semibold capitalize">{requestedRole}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center">
          <button
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
