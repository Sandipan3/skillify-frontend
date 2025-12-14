import toast from "react-hot-toast";

const DeleteVideoToast = (onConfirm) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-medium">Delete this video?</p>

      <div className="flex gap-2">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={async () => {
            toast.dismiss(t.id);
            await onConfirm();
          }}
        >
          Delete
        </button>

        <button
          className="bg-gray-200 px-3 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  ));
};

export default DeleteVideoToast;
