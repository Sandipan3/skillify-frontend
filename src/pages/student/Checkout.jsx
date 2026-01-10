import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import loadRazorpay from "../../utils/loadRazorpay.js";

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedCourse = location.state?.course;

  const [course, setCourse] = useState(passedCourse || null);
  const [loading, setLoading] = useState(!passedCourse);

  useEffect(() => {
    if (passedCourse) return;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${courseId}`);
        setCourse(res.data.data.course);
      } catch (err) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, passedCourse]);

  const startPayment = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay failed to load");
        return;
      }

      const res = await api.post("/payment/enroll-paid", { courseId });
      const order = res.data.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Course Platform",
        handler: function (response) {
          navigate("/s/payment-status", {
            state: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            },
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">Price</span>
        <span className="text-lg font-bold">₹{course.price}</span>
      </div>

      <button
        onClick={startPayment}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
