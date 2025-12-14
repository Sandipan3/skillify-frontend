import React, { useEffect, useState } from "react";
import api from "../api/api";
import CourseCard from "../components/CourseCard";
import toast from "react-hot-toast";
import DeleteCourseToast from "../components/DeleteCourseToast";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch instructor courses for specific page
  const fetchCourses = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await api.get(`/course/my-courses?page=${pageNumber}`);

      const list = res.data.data.courses;
      const updatedCourses = await Promise.all(
        list.map(async (course) => {
          try {
            const enrollRes = await api.get(
              `/enrollment/enrollment-count/${course._id}`
            );
            return { ...course, enrolledCount: enrollRes.data.data.count };
          } catch {
            return { ...course, enrolledCount: 0 };
          }
        })
      );

      setCourses(updatedCourses);
      setPage(res.data.data.page);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error("Failed to load courses");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  // Delete course using toast
  const deleteCourse = async (courseId) => {
    try {
      await toast.promise(api.delete(`/course/${courseId}`), {
        loading: "Deleting course...",
        success: "Course deleted successfully!",
        error: (err) => err?.response?.data?.message || "Delete failed",
      });

      fetchCourses(page);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {loading && <p>Loading...</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}

      {/* Responsive Grid:
          Mobile/Tablets → 1 column
          Desktop → 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!loading &&
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={deleteCourse}
            />
          ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="mt-8 flex justify-center items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded border ${
            page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded border ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InstructorCourses;
