import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";

const InstructorDashboard = () => {
  const user = useSelector(selectCurrentUser);

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    revenue: 0,
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    // Fetch all courses created by the instructor
    const coursesRes = await api.get("/course/my-courses");

    // Extract the list of courses
    const courses = coursesRes.data.data.courses;

    // Total number of courses (direct count)
    const totalCourses = courses.length;

    // Initialize totals
    let totalStudents = 0;
    let revenue = 0;

    // Loop through each course to get individual stats
    for (let course of courses) {
      // Fetch the total number of enrollments for this course

      const enrollRes = await api.get(
        `/enrollment/enrollment-count/${course._id}`
      );

      const enrolledCount = enrollRes.data.data.count ?? 0;

      // Add to global student count across all courses
      totalStudents += enrolledCount;

      // Calculate revenue:
      revenue += course.price * enrolledCount;
    }

    // Update dashboard stats state
    setStats({ totalCourses, totalStudents, revenue });

    // Show the 4 most recently created courses
    setRecentCourses(courses.slice(0, 4));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
      <h3 className="text-2xl font-bold text-black ">
        Welcome <span className="text-amber-500 italic">{user.name}</span>
      </h3>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Total Courses</h2>
          <p className="text-3xl font-bold">{stats.totalCourses}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Total Students</h2>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm">Revenue</h2>
          <p className="text-3xl font-bold">₹{stats.revenue}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <a
          href="/i/create"
          className="bg-amber-500 text-white px-6 py-2 rounded-lg"
        >
          Create Course
        </a>

        <a
          href="/i/courses"
          className="bg-gray-800 text-white px-6 py-2 rounded-lg"
        >
          Manage Courses
        </a>
      </div>

      {/* Recent Courses*/}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg p-4 flex gap-4 hover:shadow-xl"
            >
              <img
                src={course.thumbnail.url}
                alt=""
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex flex-col justify-between">
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-gray-500">
                  {course.createdAt.slice(0, 10)}
                </p>
                <a
                  href={`/i/courses/${course._id}/edit`}
                  className="text-amber-600 text-sm"
                >
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
