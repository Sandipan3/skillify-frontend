import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import editCourseSchema from "../schema/editCourseSchema";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import deleteVideoToast from "../components/deleteVideoToast";

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

  // Load course data
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/course/${courseId}`);
      const c = res.data.data;

      setCourse({ ...c, videos: c.videos || [] });

      // Fill form with existing values
      setValue("title", c.title);
      setValue("description", c.description);
      setValue("price", c.price);
      setValue("videos", []);
      setThumbnailPreview(c.thumbnail?.url || null);
    } catch (err) {
      toast.error("Failed to load course");
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
      const file = thumbnailWatch[0];
      objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [thumbnailWatch]);

  // Video preview names
  useEffect(() => {
    if (videosWatch?.length > 0) {
      const arr = Array.from(videosWatch);
      setVideoNames(arr.map((v) => v.name));
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

      // tiny delay so user sees success message
      setTimeout(() => navigate("/i/courses"), 600);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete a single video

  const deleteVideo = async (videoId) => {
    if (!videoId) {
      toast.error("Invalid video ID");
      return;
    }

    deleteVideoToast(async () => {
      try {
        await api.delete(`/course/${courseId}/videos/${videoId}`);
        toast.success("Video deleted");
        fetchCourse();
      } catch {
        toast.error("Failed to delete video");
      }
    });
  };

  // Show loading page
  if (loading)
    return <p className="p-6 text-xl font-semibold text-center">Loading...</p>;

  // Show saving page
  if (saving)
    return (
      <p className="p-6 text-xl font-semibold text-center">
        Saving your changes…
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      {/* EDIT FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {/* Title */}
        <div>
          <label className="font-semibold">Course Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full mt-1 p-2 border rounded"
            disabled={saving}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            rows={5}
            {...register("description")}
            className="w-full mt-1 p-2 border rounded"
            disabled={saving}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full mt-1 p-2 border rounded"
            disabled={saving}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Grid: Thumbnail + Add Videos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div>
            <label className="font-semibold">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
              className="mt-2"
              disabled={saving}
            />

            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="mt-3 h-32 w-full object-cover rounded"
                alt="thumb"
              />
            )}
          </div>

          {/* Add new videos */}
          <div>
            <label className="font-semibold">Add New Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              {...register("videos")}
              className="mt-2"
              disabled={saving}
            />

            {videoNames.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700">
                {videoNames.map((name, idx) => (
                  <li key={idx}>📹 {name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full text-white font-semibold py-3 rounded-lg transition 
            ${saving ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* EXISTING VIDEOS LIST */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Existing Videos</h2>

        <div className="space-y-4">
          {course.videos?.map((v) => (
            <div
              key={v._id}
              className="bg-gray-100 p-4 rounded flex justify-between items-center"
            >
              {/* LEFT SIDE */}
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

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex gap-2 items-center">
                {/* Replace video */}
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                  Replace
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      try {
                        toast.loading("Replacing video...");
                        const formData = new FormData();
                        formData.append("videos", file);

                        await api.put(
                          `/course/${courseId}/videos/${v._id}/replace`,
                          formData,
                          {
                            headers: { "Content-Type": "multipart/form-data" },
                          }
                        );

                        toast.dismiss();
                        toast.success("Video replaced!");
                        fetchCourse();
                      } catch {
                        toast.dismiss();
                        toast.error("Replace failed");
                      }
                    }}
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
    </div>
  );
};

export default EditCourse;
