import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const TicketGate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTicket();
  }, []);

  const checkTicket = async () => {
    try {
      const res = await api.get("/tickets/me");
      const ticket = res.data.data.ticket;

      if (!ticket) {
        return navigate("/ticket/create");
      }

      if (ticket.status === "created") {
        return navigate("/ticket/status");
      }

      return navigate("/ticket/create");
    } catch (err) {
      console.error(err);
      navigate("/ticket/create");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Checking ticket...</div>;
  return null;
};

export default TicketGate;
