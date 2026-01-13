import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slice/authSlice";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);

  const [counts, setCounts] = useState({
    adminCount: 0,
    instructorCount: 0,
    studentCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/counts");
        setCounts(res.data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to fetch counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) return <p className="p-6">Loading Dashboard...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <h3 className="text-2xl font-bold text-black ">
        Welcome <span className="text-purple-500 italic">{user.name}</span>
      </h3>
      {/*Count cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Total Students</h2>
          <p className="text-3xl font-bold">{counts.studentCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Total Instructors</h2>
          <p className="text-3xl font-bold">{counts.instructorCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Total Admins</h2>
          <p className="text-3xl font-bold">{counts.adminCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
