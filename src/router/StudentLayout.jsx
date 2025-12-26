import React from "react";
import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";

const StudentLayout = () => {
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <StudentNavbar />

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      <Footer />
    </section>
  );
};

export default StudentLayout;
