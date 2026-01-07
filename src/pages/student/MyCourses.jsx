import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/course/student-courses");
        setCourses(res.data.data.courses);
      } catch (err) {
        setError("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleUnenrollCourse = (e, courseId) => {
    e.stopPropagation();

    const toastId = toast(
      <div className="bg-white p-4 rounded-md  flex flex-col gap-3">
        <p className="font-medium text-gray-800">Unenroll from this course?</p>

        <div className="flex justify-end gap-2">
          {/* Cancel */}
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancel
          </button>

          {/* Unenroll */}
          <button
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            onClick={async () => {
              toast.dismiss(toastId);

              await toast.promise(
                api.delete(`/enrollment/unenroll/${courseId}`),
                {
                  loading: "Unenrolling...",
                  success: "Successfully unenrolled",
                  error: "Failed to unenroll",
                }
              );

              setCourses((prev) =>
                prev.filter((course) => course._id !== courseId)
              );
            }}
          >
            Unenroll
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <p>Loading your courses...</p>;
  if (error) return <p>{error}</p>;

  if (courses.length === 0) {
    return <p>You are not enrolled in any courses yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          onClick={() =>
            navigate(`/s/learn/${course._id}`, { state: { course } })
          }
          className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition relative"
        >
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />

          <div className="p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">{course.title}</h3>

            <button
              onClick={(e) => handleUnenrollCourse(e, course._id)}
              className="px-3 py-1.5 text-sm text-red-600 rounded hover:text-white hover:bg-red-500 transition"
            >
              Unenroll
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCourses;
