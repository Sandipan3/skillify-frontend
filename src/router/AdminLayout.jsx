import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminLAyout = () => {
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      <Footer />
    </section>
  );
};

export default AdminLAyout;
