import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminTicketRequests() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/tickets?page=${page}`);
      setTickets(res.data.data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/tickets/${id}`, { action });
      fetchTickets();
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <div>
      <h2>Pending Role Requests</h2>

      {tickets.map((t) => (
        <div key={t._id}>
          <p>{t.user?.email}</p>
          <p>Requested: {t.requestedRole}</p>

          <button onClick={() => handleAction(t._id, "approved")}>
            Approve
          </button>

          <button onClick={() => handleAction(t._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}

      <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>Prev</button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
