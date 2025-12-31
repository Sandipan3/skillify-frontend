import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/enrollment/getMyEnrollments");
        setEnrollments(res.data.data.enrollments);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      {enrollments.length === 0 ? (
        <div className="border rounded p-6 text-center">
          <p className="text-gray-600 mb-4">
            You haven’t enrolled in any courses yet.
          </p>
          <button
            onClick={() => navigate("/s/courses")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="border rounded overflow-hidden"
            >
              <img
                src={enrollment.course.thumbnail}
                alt={enrollment.course.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {enrollment.course.title}
                </h3>

                {/* Placeholder for progress */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div className="bg-blue-600 h-2 rounded w-[0%]" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Progress tracking coming soon
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/s/learn/${enrollment.course._id}`)}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
