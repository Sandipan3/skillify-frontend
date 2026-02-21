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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-6 flex justify-center border-b">
        <h1 className="text-2xl font-bold text-purple-700">Skillify</h1>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn. Teach. Grow.
          </h2>

          <p className="text-gray-600 mb-8">
            Skillify is your simple platform to learn new skills, teach what you
            know, and grow your career — all in one place.
          </p>

          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Skillify
      </footer>
    </div>
  );
};

export default LandingPage;
