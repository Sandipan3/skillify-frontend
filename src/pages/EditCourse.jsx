import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import editCourseSchema from "../schema/editCourseSchema";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DeleteVideoToast from "../components/DeleteVideoToast";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState({ videos: [] });

  // previews
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoNames, setVideoNames] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editCourseSchema),
  });

  const thumbnailWatch = watch("thumbnail");
  const videosWatch = watch("videos");

  // Load course
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data;

      setCourse({ ...c, videos: c.videos || [] });

      // populate form
      setValue("title", c.title);
      setValue("description", c.description);
      setValue("price", c.price);
      setValue("upiId", ""); // allow edit / overwrite
      setValue("videos", []);

      setThumbnailPreview(c.thumbnail?.url || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // Thumbnail preview
  useEffect(() => {
    let objectUrl;
    if (thumbnailWatch?.length > 0) {
      objectUrl = URL.createObjectURL(thumbnailWatch[0]);
      setThumbnailPreview(objectUrl);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [thumbnailWatch]);

  // Video preview names
  useEffect(() => {
    if (videosWatch?.length > 0) {
      setVideoNames(Array.from(videosWatch).map((v) => v.name));
    } else {
      setVideoNames([]);
    }
  }, [videosWatch]);

  // Submit edit
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price ?? 0);

      if (data.upiId) {
        formData.append("upiId", data.upiId);
      }

      if (data.thumbnail?.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      if (data.videos?.length > 0) {
        for (let file of data.videos) {
          formData.append("videos", file);
        }
      }

      await api.put(`/course/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course updated successfully!");
      await fetchCourse();
      setTimeout(() => navigate("/i/courses"), 600);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // Replace video
  const replaceVideo = async (videoId, file) => {
    if (!file) return;

    const toastId = toast.loading("Replacing video...");
    try {
      const formData = new FormData();
      formData.append("videos", file);

      await api.put(`/course/${courseId}/videos/${videoId}/replace`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss(toastId);
      toast.success("Video replaced!");
      fetchCourse();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Replace failed");
    }
  };

  // Delete video
  const deleteVideo = async (videoId) => {
    DeleteVideoToast(async () => {
      const toastId = toast.loading("Deleting video...");
      try {
        await api.delete(`/course/${courseId}/videos/${videoId}`);
        toast.dismiss(toastId);
        toast.success("Video deleted");
        fetchCourse();
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || "Delete failed");
      }
    });
  };

  if (loading)
    return <p className="p-6 text-xl font-semibold text-center">Loading...</p>;

  if (saving)
    return (
      <p className="p-6 text-xl font-semibold text-center">
        Saving your changes…
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        <div>
          <label className="font-semibold">Course Title</label>
          <input
            {...register("title")}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea
            rows={5}
            {...register("description")}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            {...register("price")}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* UPI ID */}
        <div>
          <label className="font-semibold">UPI ID</label>
          <input
            type="text"
            {...register("upiId")}
            placeholder="example@upi"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
              className="mt-2"
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="mt-3 h-32 w-full object-cover rounded"
                alt="Thumbnail"
              />
            )}
          </div>

          <div>
            <label className="font-semibold">Add New Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              {...register("videos")}
              className="mt-2"
            />
            {videoNames.length > 0 && (
              <ul className="mt-2 text-sm">
                {videoNames.map((name, i) => (
                  <li key={i}>📹 {name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg"
        >
          Save Changes
        </button>
      </form>

      {/* Existing Videos */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Existing Videos</h2>

        <div className="space-y-4">
          {course.videos.map((v) => (
            <div
              key={v._id}
              className="bg-gray-100 p-4 rounded flex justify-between"
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

              <div className="flex gap-2">
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded">
                  Replace
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => replaceVideo(v._id, e.target.files[0])}
                  />
                </label>

                <button
                  onClick={() => deleteVideo(v._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
