import { useEffect, useState } from "react";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { getUser } from "../../slice/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RoleStatus() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const res = await api.get("/ticket/my");
      const ticketData = res.data.data.ticket;
      setTicket(ticketData);

      //determine redirect safely
      const reqRoute = ticketData?.requestedRole === "student" ? "/s" : "/i";

      //auto refresh role after approval
      if (ticketData?.status === "approved") {
        await dispatch(getUser()).unwrap();

        setTimeout(() => {
          navigate(reqRoute);
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        Loading...
      </div>
    );

  if (!ticket)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        No ticket found
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Role Request Status
        </h2>

        <div className="space-y-2 text-gray-700 text-center">
          <p>
            <b>Requested Role:</b> {ticket.requestedRole}
          </p>
          <p>
            <b>Status:</b> {ticket.status}
          </p>
        </div>

        {ticket.status === "created" && (
          <p className="text-yellow-600 font-medium text-center">
            Waiting for admin approval
          </p>
        )}

        {ticket.status === "approved" && (
          <p className="text-green-600 font-medium text-center">
            Approved! Redirecting...
          </p>
        )}

        {ticket.status === "rejected" && (
          <p className="text-red-600 font-medium text-center">
            Request rejected
          </p>
        )}
      </div>
    </div>
  );
}
