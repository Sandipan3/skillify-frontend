import React from "react";
import toast from "react-hot-toast";

const DeleteConfirmationToast = ({
  message = "Are you sure you want to delete this item?",
  onConfirm,
  t,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const handleConfirm = async () => {
    toast.dismiss(t.id);
    await onConfirm();
  };

  const handleCancel = () => {
    toast.dismiss(t.id);
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-lg min-w-[260px]">
      <p className="font-medium text-gray-800">{message}</p>

      <div className="flex gap-2 justify-end">
        <button
          className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>

        <button
          className="bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 transition"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationToast;
