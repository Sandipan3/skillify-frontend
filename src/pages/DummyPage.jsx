import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser, selectCurrentUser } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DummyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <p>This page fetches protected user data upon loading.</p>
      <p>
        <strong>Status:</strong>{" "}
        {user ? `User "${user.name}" loaded.` : "Loading..."}
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default DummyPage;
