import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onDelete }) => {
  if (!course) return null;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col hover:shadow-2xl transition">
      {/* Thumbnail */}
      <img
        src={course.thumbnail?.url}
        alt={course.title}
        className="h-40 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        {/* Title */}
        <h2 className="text-lg font-semibold line-clamp-2">{course.title}</h2>

        {/* Created Date */}
        <p className="text-sm text-gray-500">
          Created: {course.createdAt?.slice(0, 10)}
        </p>

        {/* Video Count */}
        <p className="text-sm text-gray-600">Videos: {course.videos?.length}</p>

        {/* Students Count */}
        <p className="text-sm text-gray-600">
          Students Enrolled: {course.enrolledCount ?? 0}
        </p>

        {/* Price */}
        <p className="text-sm font-medium text-gray-700">
          Price: ₹{course.price}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-2 grid grid-cols-3 gap-2">
          {/* Edit */}
          <Link
            to={`/i/courses/${course._id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 text-center rounded transition"
          >
            Edit
          </Link>

          {/* Videos */}
          <Link
            to={`/i/courses/${course._id}/videos`}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 text-center rounded transition"
          >
            Videos
          </Link>

          {/* Delete */}
          <button
            onClick={() => onDelete(course._id)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
