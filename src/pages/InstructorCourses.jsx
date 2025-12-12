import React, { useEffect, useState } from "react";
import api from "../api/api";
import CourseCard from "../components/CourseCard";
import toast from "react-hot-toast";
import DeleteCourseToast from "../components/DeleteCourseToast";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch instructor courses + enrolled count
  const fetchCourses = async () => {
    setLoading(true);

    try {
      const res = await api.get("/course/my-courses");
      const list = res.data.data.courses;

      // Add enrolled counts to each course
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
    } catch (err) {
      toast.error("Failed to load courses");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course using custom toast
  const deleteCourse = (id) => {
    toast((t) => (
      <DeleteCourseToast
        t={t}
        message="Are you sure you want to delete this course?"
        onConfirm={async () => {
          try {
            await api.delete(`/course/${id}`);
            toast.success("Course deleted");
            fetchCourses();
          } catch {
            toast.error("Failed to delete course");
          }
        }}
      />
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {loading && <p>Loading...</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={deleteCourse}
            />
          ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
