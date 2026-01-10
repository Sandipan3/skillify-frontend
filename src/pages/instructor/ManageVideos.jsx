import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorVideo from "../../components/InstructorVideo";
import api from "../../api/api";

const ManageVideos = () => {
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState({ videos: [] });
  const [replacingVideoId, setReplacingVideoId] = useState(null);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data.course;
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

  // DELETE VIDEO
  const deleteVideo = (videoId) => {
    const toastId = toast(
      <div className="bg-white p-4 flex flex-col gap-3">
        <p className="font-medium">Delete this video?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={async () => {
              toast.dismiss(toastId);

              await toast.promise(
                api.delete(`/course/${courseId}/videos/${videoId}`),
                {
                  loading: "Deleting video...",
                  success: "Video deleted",
                  error: "Delete failed",
                }
              );
              setCourse((prev) => ({
                ...prev,
                videos: prev.videos.filter((v) => v._id !== videoId),
              }));
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  // REPLACE VIDEO
  const replaceVideo = async (videoId, file) => {
    if (!file || replacingVideoId) return;

    setReplacingVideoId(videoId);

    const formData = new FormData();
    formData.append("videos", file);

    try {
      const res = await toast.promise(
        api.put(`/course/${courseId}/videos/${videoId}/replace`, formData),
        {
          loading: "Replacing video...",
          success: "Video replaced successfully",
          error: "Replace failed",
        }
      );

      const updatedVideo = res.data.data.video;

      setCourse((prev) => ({
        ...prev,
        videos: prev.videos.map((v) => (v._id === videoId ? updatedVideo : v)),
      }));
    } catch (error) {
      console.error("Error replacing video:", error);
    } finally {
      setReplacingVideoId(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Videos</h1>

      {course.videos.length === 0 && (
        <p className="text-gray-500">No videos yet</p>
      )}

      {course.videos?.map((video) => (
        <InstructorVideo
          key={video._id}
          video={video}
          replacing={replacingVideoId === video._id}
          onReplace={(file) => replaceVideo(video._id, file)}
          onDelete={() => deleteVideo(video._id)}
        />
      ))}
    </div>
  );
};

export default ManageVideos;
