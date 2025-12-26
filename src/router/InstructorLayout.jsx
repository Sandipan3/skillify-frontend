import React from "react";
import { Outlet } from "react-router-dom";
import InstructorNavbar from "../components/InstructorNavbar";
import Footer from "../components/Footer";

const InstructorLayout = () => {
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <InstructorNavbar />

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      <Footer />
    </section>
  );
};

export default InstructorLayout;
