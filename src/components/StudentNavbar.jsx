import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "../slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: "0%",
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const navLinks = [
  { to: "/s", label: "Dashboard" },
  { to: "/s/courses", label: "Browse Courses" },
  { to: "/s/my-courses", label: "My Courses" },
];

const StudentNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const roles = user?.roles || [];
  const isInstructor = roles.includes("instructor");
  const isAdmin = roles.includes("admin");

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileOpen(false);
  };

  // instructor movement
  const handleInstructorMove = () => {
    setMobileOpen(false);

    if (isInstructor) {
      navigate("/i");
      return;
    }

    navigate("/ticket"); // request instructor role
  };

  return (
    <nav className="bg-blue-500 text-gray-200 p-4">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center">
        <h1 className="text-xl font-bold">Skillify</h1>

        <div className="flex gap-8 items-center">
          {/* Student links */}
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-white">
              {link.label}
            </Link>
          ))}

          {/* Admin quick switch */}
          {isAdmin && (
            <Link to="/a" className="text-sm hover:text-white">
              Admin
            </Link>
          )}

          {/* Instructor movement */}
          <button
            onClick={handleInstructorMove}
            className="text-sm hover:text-white"
          >
            {isInstructor ? "Instructor Dashboard" : "Become Instructor"}
          </button>

          <button onClick={handleLogout} className="hover:text-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center relative z-[60]">
        <h1 className="text-xl font-bold">Skillify</h1>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed top-0 right-0 h-full w-64 bg-blue-500 z-50 p-6 flex flex-col gap-6"
            >
              <div className="h-10"></div>

              {/* Student links */}
              {navLinks.map((link) => (
                <motion.li key={link.to} variants={itemVariants}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              {/* Admin switch */}
              {isAdmin && (
                <motion.li variants={itemVariants}>
                  <Link
                    to="/a"
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-white"
                  >
                    Admin Panel
                  </Link>
                </motion.li>
              )}

              {/* Instructor movement */}
              <motion.li variants={itemVariants}>
                <button
                  onClick={handleInstructorMove}
                  className="text-sm hover:text-white text-left"
                >
                  {isInstructor ? "Instructor Dashboard" : "Become Instructor"}
                </button>
              </motion.li>

              <motion.li variants={itemVariants}>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-300 text-left"
                >
                  Logout
                </button>
              </motion.li>
            </motion.ul>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default StudentNavbar;
