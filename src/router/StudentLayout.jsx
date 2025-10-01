import React from "react";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default StudentLayout;
