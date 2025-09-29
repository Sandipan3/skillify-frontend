import { useDispatch } from "react-redux";
import { logoutUser } from "../slice/authSlice";
import React from "react";

const DashBoard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      Welcome to your DashBoard!
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashBoard;
