import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slice/authSlice";

const LandingPage = () => {
  const user = useSelector(selectCurrentUser);

  if (user?.role === "admin") return <Navigate to="/a" />;
  if (user?.role === "instructor") return <Navigate to="/i" />;
  if (user?.role === "student") return <Navigate to="/s" />;
  if (user?.role === "user") return <Navigate to="/u" />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Skillify</h1>

      <p className="text-gray-600 mb-6">Learn. Teach. Grow.</p>

      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
