import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default UserLayout;
