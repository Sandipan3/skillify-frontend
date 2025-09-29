import React from "react";
import { Outlet } from "react-router-dom";

const AdminLAyout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminLAyout;
