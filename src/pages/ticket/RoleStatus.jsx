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
      const res = await api.get("/tickets/me");
      setTicket(res.data.data.ticket);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!ticket) return <div>No ticket found</div>;

  return (
    <div>
      <h2>Role Request Status</h2>

      <p>
        <b>Requested Role:</b> {ticket.requestedRole}
      </p>
      <p>
        <b>Status:</b> {ticket.status}
      </p>

      {ticket.status === "created" && <p> Waiting for admin approval</p>}

      {ticket.status === "approved" && <p> Approved — please login again</p>}

      {ticket.status === "rejected" && <p>Request rejected</p>}
    </div>
  );
}
