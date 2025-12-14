import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import editCourseSchema from "../schema/editCourseSchema";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState({ videos: [] });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreviewNames, setVideoPreviewNames] = useState([]);

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

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data;

      setCourse({ ...c, videos: c.videos || [] });

      setValue("title", c.title);
      setValue("description", c.description);
      setValue("price", c.price);
      setValue("upiId", "");
      setValue("videos", []);

      if (!thumbnailWatch?.length) {
        setThumbnailPreview(c.thumbnail?.url || null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (!thumbnailWatch?.length) return;

    const file = thumbnailWatch[0];
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailWatch]);

  useEffect(() => {
    if (!videosWatch?.length) {
      setVideoPreviewNames([]);
      return;
    }

    setVideoPreviewNames(Array.from(videosWatch, (file) => file.name));
  }, [videosWatch]);

  const onSubmit = async (data) => {
    setSaving(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price ?? 0);

    if (data.upiId) formData.append("upiId", data.upiId);
    if (data.thumbnail?.length) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    if (data.videos?.length) {
      for (const file of data.videos) {
        formData.append("videos", file);
      }
    }

    try {
      const updatePromise = api.put(`/course/${courseId}`, formData);

      await toast.promise(updatePromise, {
        loading: "Saving changes...",
        success: "Course updated successfully!",
        error: (err) => err.response?.data?.message || "Update failed",
      });

      await fetchCourse();
      setTimeout(() => navigate("/i/courses"), 1500);
    } finally {
      setSaving(false);
    }
  };

  const replaceVideo = async (videoId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("videos", file);

    const replacePromise = api.put(
      `/course/${courseId}/videos/${videoId}/replace`,
      formData
    );

    await toast.promise(replacePromise, {
      loading: "Replacing video...",
      success: "Video replaced successfully!",
      error: (err) => err.response?.data?.message || "Replace failed",
    });

    await fetchCourse();
  };

  const deleteVideo = async (videoId) => {
    const deletePromise = api.delete(`/course/${courseId}/videos/${videoId}`);

    await toast.promise(deletePromise, {
      loading: "Deleting video...",
      success: "Video deleted successfully!",
      error: (err) => err.response?.data?.message || "Delete failed",
    });

    await fetchCourse();
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

        <div>
          <label className="font-semibold">UPI ID</label>
          <input
            {...register("upiId")}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Thumbnail</label>
            <input type="file" accept="image/*" {...register("thumbnail")} />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="mt-3 h-32 w-full object-cover rounded"
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
            />
            {videoPreviewNames.length > 0 && (
              <ul className="mt-2 text-sm">
                {videoPreviewNames.map((name, i) => (
                  <li key={i}>📹 {name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button className="w-full bg-amber-500 text-white py-3 rounded">
          Save Changes
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Existing Videos</h2>

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
              <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
                Replace
                <input
                  type="file"
                  accept="video/*"
                  hidden
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
  );
};

export default EditCourse;
