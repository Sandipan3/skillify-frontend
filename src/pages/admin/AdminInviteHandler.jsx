import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";
import { getUser, tokenRefreshed } from "../../slice/authSlice";

const AdminInviteHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      toast.error("Invalid invite link");
      navigate("/unauthorized", { replace: true });
      return;
    }

    const acceptInvite = async () => {
      try {
        const res = await api.post("/admin/accept-invite", { token });
        const accessToken = res.data.data.accessToken;

        dispatch(tokenRefreshed(accessToken));

        await dispatch(getUser()).unwrap();

        toast.success("You are now an admin");
        navigate("/a", { replace: true });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid Invite");
        navigate("/unauthorized", { replace: true });
      }
    };

    acceptInvite();
  }, []);
  return <p className="p-6">Accepting admin invite...</p>;
};

export default AdminInviteHandler;
