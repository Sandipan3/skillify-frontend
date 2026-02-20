import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const CreateTicket = () => {
  const [requestedRole, setRequestedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedRole) return alert("Select role");

    try {
      setLoading(true);

      await api.post("/tickets", { requestedRole });

      alert("Request submitted");
      navigate("/ticket/status");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Request Role Change</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={requestedRole}
          onChange={(e) => setRequestedRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
