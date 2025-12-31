import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!location.state) {
      toast.error("Invalid payment flow");
      navigate("/s/courses");
      return;
    }

    const verifyPayment = async () => {
      try {
        await api.post("/student/verify-payment", location.state);

        setStatus("success");
        toast.success("Enrollment successful!");

        setTimeout(() => {
          navigate(`/s/my-courses`);
        }, 1500);
      } catch (err) {
        setStatus("failed");
        toast.error(
          err.response?.data?.message || "Payment verification failed"
        );
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center h-[70vh]">
      {status === "verifying" && <p>Verifying payment...</p>}
      {status === "success" && (
        <p className="text-green-600 text-lg font-semibold">
          Payment successful! Redirecting...
        </p>
      )}
      {status === "failed" && (
        <p className="text-red-600 text-lg font-semibold">
          Payment failed. Please contact support.
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
