import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";

const Landing = () => {
  const user = useSelector(selectCurrentUser);

  if (user?.role === "admin") return <Navigate to="/a" />;
  if (user?.role === "instructor") return <Navigate to="/i" />;
  if (user?.role === "student") return <Navigate to="/s" />;
  if (user?.role === "user") return <Navigate to="/u" />;

  return (
    <div>
      <h1>Skillify</h1>
      <p>Learn. Teach. Grow.</p>
    </div>
  );
};
