import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";

const CoursePreview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${courseId}`);
        setCourse(res.data.data.course);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading course...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return null;

  const handleClick = async () => {
    if (course.price === 0) {
      try {
        const enrollPromise = api.post("/enrollments/enroll-free", {
          courseId: course._id,
        });

        await toast.promise(enrollPromise, {
          loading: "Enrolling, please wait...",
          success: "Enrolled successfully",
          error: (error) =>
            error?.response?.data?.message || "Unable to enroll",
        });

        navigate(`/s/learn/${course._id}`);
        return;
      } catch (error) {
        console.error("Free enrollment failed", error);
      }
    }

    // paid course
    navigate(`/s/checkout/${course._id}`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <img
        src={course.thumbnail?.url}
        alt={course.title}
        className="w-full h-64 object-cover rounded"
      />

      <h1 className="text-2xl font-bold mt-4">{course.title}</h1>

      <p className="text-gray-600 mt-2">
        Instructor: {course.instructor?.name}
      </p>

      <p className="mt-4">{course.description}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-semibold">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </span>

        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {course.price === 0 ? "Enroll Now" : "Buy Course"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;
