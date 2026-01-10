import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import CourseCard from "../../components/CourseCard";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (pageNumber = 1) => {
    setLoading(true);
    try {
      //TODO: Fix N+1 api calls
      const res = await api.get(`/course/my-courses?page=${pageNumber}`); // api call = 1

      const list = res.data.data.courses;
      const updatedCourses = await Promise.all(
        list.map(async (course) => {
          try {
            const enrollRes = await api.get(
              `/enrollment/enrollment-count/${course._id}` //api call = N
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
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  const deleteCourse = (courseId) => {
    const toastId = toast(
      <div className="bg-white p-4  flex flex-col gap-3">
        <p className="font-medium">Delete this course and all its content?</p>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={async () => {
              toast.dismiss(toastId);

              const deletePromise = api.delete(`/course/${courseId}`);

              await toast.promise(deletePromise, {
                loading: "Deleting course...",
                success: "Course deleted successfully!",
                error: (err) => err?.response?.data?.message || "Delete failed",
              });

              await fetchCourses(page);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {loading && <p>Loading...</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!loading &&
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={() => deleteCourse(course._id)}
            />
          ))}
      </div>

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
