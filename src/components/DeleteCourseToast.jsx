import React from "react";
import toast from "react-hot-toast";

const DeleteCourseToast = ({ message, onConfirm, t }) => {
  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-lg min-w-[260px]">
      <p className="font-medium text-gray-800">{message}</p>

      <div className="flex gap-2 justify-end">
        <button
          className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
          onClick={async () => {
            toast.dismiss(t.id);
            await onConfirm();
          }}
        >
          Delete
        </button>

        <button
          className="bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 transition"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteCourseToast;
