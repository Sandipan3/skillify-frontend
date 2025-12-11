import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleExternalToken } from "../slice/authSlice";
import toast from "react-hot-toast";

const ExternalLoginHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRedirect = (user) => {
    toast.success(`Welcome ${user.name}!`);

    const roleRoutes = {
      admin: "/a/",
      instructor: "/i/",
      student: "/s/",
      user: "/u/",
    };

    const path = roleRoutes[user.role] || "/login";

    if (!roleRoutes[user.role]) {
      toast.error("Login failed (Invalid Role)");
    }

    navigate(path);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");

    if (!accessToken) {
      // If no token, redirect immediately
      navigate("/login");
      return;
    }

    // Clean up the URL only if an access token was found
    urlParams.delete("access_token");
    window.history.replaceState({}, document.title, window.location.pathname);

    // DISPATCH & HANDLE SUCCESS/FAILURE IN ONE PLACE
    dispatch(handleExternalToken(accessToken))
      .unwrap()
      .then((user) => {
        // This is executed ONLY ONCE when the entire thunk succeeds
        handleRedirect(user);
      })
      .catch(() => {
        // This is executed ONLY ONCE when the entire thunk fails
        toast.error("Authentication failed!");
        navigate("/login");
      });
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold text-purple-600">
        Authenticating with Google... Please Wait.
      </p>
    </div>
  );
};

export default ExternalLoginHandler;
