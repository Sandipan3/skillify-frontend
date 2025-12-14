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
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data;
      setCourse({ ...c, videos: c.videos || [] });
    } catch {
      toast.error("Failed to load course");
      setCourse({ videos: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const deleteVideo = (videoId) => {
    toast((t) => (
      <DeleteConfirmationToast
        t={t}
        message="Delete this video?"
        onConfirm={async () => {
          await toast.promise(
            api
              .delete(`/course/${courseId}/videos/${videoId}`)
              .then(fetchCourse),
            {
              loading: "Deleting video...",
              success: { message: "Video deleted", duration: 2000 },
              error: "Delete failed",
            }
          );
        }}
      />
    ));
  };

  const replaceVideo = async (videoId, file) => {
    if (!file || replacingVideoId) return;

    setReplacingVideoId(videoId);

    const formData = new FormData();
    formData.append("videos", file);

    await toast.promise(
      api
        .put(`/course/${courseId}/videos/${videoId}/replace`, formData)
        .then(fetchCourse),
      {
        loading: "Replacing video...",
        success: "Video replaced",
        error: "Replace failed",
      }
    );

    setReplacingVideoId(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Videos</h1>

      {course.videos.length === 0 && (
        <p className="text-gray-500">No videos yet</p>
      )}

      <div className="space-y-3">
        {course.videos.map((v) => (
          <div
            key={v._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <p className="font-medium">{v.title}</p>

            <div className="flex gap-2">
              <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
                {replacingVideoId === v._id ? "Replacing..." : "Replace"}
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  disabled={replacingVideoId === v._id}
                  onChange={(e) => replaceVideo(v._id, e.target.files[0])}
                />
              </label>

              <button
                onClick={() => deleteVideo(v._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
