import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import DeleteConfirmationToast from "../components/DeleteConfirmationToast";

const ManageVideos = () => {
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState({ videos: [] });
  const [replacingVideoId, setReplacingVideoId] = useState(null);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data;
      setCourse({ ...c, videos: c.videos || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load course");
      setCourse({ videos: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const deleteVideo = (videoId) => {
    toast.custom(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          message="Delete this video? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={async () => {
            try {
              await toast.promise(
                api
                  .delete(`/course/${courseId}/videos/${videoId}`)
                  .then(async (res) => {
                    await fetchCourse();
                    return res;
                  }),
                {
                  loading: "Deleting video...",
                  success: "Video deleted successfully!",
                  error: (err) =>
                    err.response?.data?.message || "Failed to delete video",
                },
                {
                  success: { duration: 3000 }, // normal auto-dismiss for success
                  error: { duration: 4000 },
                  loading: { duration: Infinity },
                }
              );
            } catch (error) {
              // This catch is redundant because toast.promise handles errors
              // But kept for safety
              toast.error(error?.response?.data?.message || "Delete failed");
            }
          }}
        />
      ),
      {
        duration: Infinity, // ← Critical: Keep open until user interacts
        // position: 'top-center', // optional: better for modals
      }
    );
  };
  const replaceVideo = async (videoId, file) => {
    if (!file) return;

    setReplacingVideoId(videoId);

    const formData = new FormData();
    formData.append("videos", file);

    try {
      await toast.promise(
        api
          .put(`/course/${courseId}/videos/${videoId}/replace`, formData)
          .then(async (res) => {
            await fetchCourse();
            return res;
          }),
        {
          loading: "Replacing video...",
          success: "Video replaced successfully!",
          error: (err) =>
            err.response?.data?.message || "Failed to replace video",
        },
        {
          success: { duration: 2000 },
          error: { duration: 3000 },
        }
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to replace video");
    } finally {
      setReplacingVideoId(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Videos</h1>

      <p className="mb-4 text-gray-600">
        Course: <span className="font-semibold">{course.title || "—"}</span>
      </p>

      <div className="space-y-4">
        {course.videos.length === 0 && (
          <p className="text-gray-500">No videos uploaded yet.</p>
        )}

        {course.videos.map((v) => (
          <div
            key={v._id}
            className="bg-white shadow border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{v.title}</p>
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm underline"
              >
                Watch Video
              </a>
            </div>

            <div className="flex gap-3 items-center">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                {replacingVideoId === v._id ? "Replacing..." : "Replace"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={replacingVideoId === v._id}
                  onChange={(e) => replaceVideo(v._id, e.target.files[0])}
                />
              </label>

              <button
                onClick={() => deleteVideo(v._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageVideos;
