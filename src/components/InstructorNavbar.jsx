import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../slice/authSlice";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InstructorNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileOpen(false);
  };

  // FULL instructor routes
  const navLinks = [
    { to: "/i", label: "Dashboard" },
    { to: "/i/create", label: "Create Course" },
    { to: "/i/courses", label: "My Courses" },
  ];

  return (
    <nav className="bg-amber-500 text-gray-200 p-4">
      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center">
        <h1 className="text-xl font-bold">Skillify</h1>
        <div className="flex gap-8">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.to} className="hover:text-white">
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="hover:text-red-600">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex justify-between items-center relative z-[60]">
        <h1 className="text-xl font-bold">Skillify</h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }} // off-screen
              animate={{ x: 0 }} // slide in
              exit={{ x: "100%" }} // off-screen
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed top-0 right-0 h-full w-64 bg-amber-500 z-50 p-6"
            >
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="hover:text-red-300 text-left"
                >
                  Logout
                </button>
              </div>
            </motion.div>

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

export default InstructorNavbar;
