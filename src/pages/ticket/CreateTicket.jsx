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

      await api.post("/tickets", { requestedRole });

      toast.success("Request submitted");
      navigate("/ticket/status");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // 🚫 safety guard
  if (!requestedRole) {
    return <div>You are not eligible for role change.</div>;
  }

  return (
    <div>
      <h2>Request Role Change</h2>

      <p>
        <b>Requested Role:</b> {requestedRole}
      </p>

      <form onSubmit={handleSubmit}>
        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
