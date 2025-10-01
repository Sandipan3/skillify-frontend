import React from "react";
import { Outlet } from "react-router-dom";

const AdminLAyout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AdminLAyout;
