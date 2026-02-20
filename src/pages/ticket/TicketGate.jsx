import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slice/authSlice";

const TicketGate = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) checkTicket();
  }, [user]);

  const checkTicket = async () => {
    try {
      const roles = user?.roles || [];
      let targetRole = null;
      let dashboardRoute = null;

      if (roles.includes("student") && !roles.includes("instructor")) {
        targetRole = "instructor";
        dashboardRoute = "/i";
      } else if (roles.includes("instructor") && !roles.includes("student")) {
        targetRole = "student";
        dashboardRoute = "/s";
      } else if (roles.includes("student") && roles.includes("instructor")) {
        return navigate("/s");
      }

      if (!targetRole) {
        return navigate("/");
      }

      const res = await api.get("/ticket/my");
      const ticket = res.data.data.ticket;

      // no active ticket
      if (!ticket) {
        return navigate("/ticket/create");
      }

      // pending tickets
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center  text-white">
        <p className="text-lg font-semibold animate-pulse">
          Checking ticket...
        </p>
      </div>
    );

  return null;
};

export default TicketGate;
