import { useEffect, useState } from "react";
import api from "../../api/api";

export default function RoleStatus() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const res = await api.get("/ticket/my");
      setTicket(res.data.data.ticket);
    } catch (err) {
      console.error(err);
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

        <div className="space-y-2 text-gray-700">
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
            Approved — please login again
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
