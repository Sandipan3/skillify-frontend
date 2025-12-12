import React, { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import deleteVideoToast from "../components/deleteVideoToast";

const ManageVideos = () => {
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  const [replacingVideoId, setReplacingVideoId] = useState(null);

  // Fetch course + videos
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      setCourse(res.data.data.course);
    } catch (err) {
      toast.error("Failed to load course");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // Delete video
  const deleteVideo = async (videoId) => {
    deleteVideoToast(async () => {
      try {
        await api.delete(`/course/${courseId}/videos/${videoId}`);
        toast.success("Video deleted");
        fetchCourse();
      } catch {
        toast.error("Failed to delete");
      }
    });
  };

  // Replace video
  const replaceVideo = async (videoId, file) => {
    if (!file) return;

    try {
      setReplacingVideoId(videoId);
      const formData = new FormData();
      formData.append("videos", file);

      await api.put(`/course/${courseId}/videos/${videoId}/replace`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Video replaced!");
      fetchCourse();
    } catch (err) {
      toast.error("Failed to replace");
    } finally {
      setReplacingVideoId(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!course) return <p className="p-6 text-red-600">Course not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Videos</h1>

      <p className="mb-4 text-gray-600">
        Course: <span className="font-semibold">{course.title}</span>
      </p>

      {/* VIDEOS LIST */}
      <div className="space-y-4">
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
              {/* Replace video */}
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                {replacingVideoId === v._id ? "Replacing..." : "Replace"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => replaceVideo(v._id, e.target.files[0])}
                  disabled={replacingVideoId === v._id}
                />
              </label>

              {/* Delete video */}
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
