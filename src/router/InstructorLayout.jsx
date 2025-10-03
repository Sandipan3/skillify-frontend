import React from "react";
import { Outlet } from "react-router-dom";
import InstructorNavbar from "../components/InstructorNavbar";
import Footer from "../components/Footer";

const InstructorLayout = () => {
  return (
    <section className=" bg-gray-50">
      <InstructorNavbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default InstructorLayout;
