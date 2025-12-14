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
    toast(
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete this video?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(); // dismiss all current toasts (or target specific if multiple)

              toast.promise(
                api
                  .delete(`/course/${courseId}/videos/${videoId}`)
                  .then(async () => {
                    await fetchCourse();
                  }),
                {
                  loading: "Deleting video...",
                  success: "Video deleted successfully!",
                  error: (err) =>
                    err.response?.data?.message || "Failed to delete video",
                },
                {
                  success: { duration: 3000 },
                  error: { duration: 4000 },
                }
              );
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
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
