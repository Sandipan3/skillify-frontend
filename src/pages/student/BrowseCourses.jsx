import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/course?page=${page}`);
        setCourses(res.data.data.courses);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page]);

  if (loading) return <p>Loading courses...</p>;

  if (courses.length === 0) {
    return <p>No courses available</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            onClick={() =>
              navigate(`/s/courses/${course._id}`, { state: { course } })
            }
            className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md"
          >
            <img
              src={course.thumbnail?.url}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.instructor?.name}</p>

              <p className="mt-2 font-medium">
                {course.price === 0 ? "Free" : `₹${course.price}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default BrowseCourses;
