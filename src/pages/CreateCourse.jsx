import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createCourseSchema from "../schema/createCourseSchema";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  // preview states
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreviewNames, setVideoPreviewNames] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCourseSchema),
  });

  // watch file inputs
  const thumbnailWatch = watch("thumbnail");
  const videosWatch = watch("videos");

  // handle thumbnail preview
  useEffect(() => {
    if (thumbnailWatch && thumbnailWatch.length > 0) {
      const file = thumbnailWatch[0];
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, [thumbnailWatch]);

  // handle video file preview
  useEffect(() => {
    if (videosWatch && videosWatch.length > 0) {
      const filesArray = Array.from(videosWatch);
      setVideoPreviewNames(filesArray.map((f) => f.name));
    } else {
      setVideoPreviewNames([]);
    }
  }, [videosWatch]);

  // SUBMIT FORM
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price ?? 0);

      formData.append("thumbnail", data.thumbnail[0]);

      for (let i = 0; i < data.videos.length; i++) {
        formData.append("videos", data.videos[i]);
      }

      await api.post("/course/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");
      navigate("/i/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create Course</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-xl p-6 space-y-8"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="font-semibold block">Course Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter a course title..."
            disabled={isSubmitting} // disable while submitting
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-semibold block">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full p-3 border rounded-lg"
            placeholder="Write a detailed course description..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="font-semibold block">Price (optional)</label>
          <input
            type="number"
            {...register("price")}
            className="w-full p-3 border rounded-lg"
            placeholder="0 for free"
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* GRID: THUMBNAIL + VIDEOS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="space-y-3">
            <label className="font-semibold block">Thumbnail</label>
            <div className="border rounded-lg p-3">
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                className="w-full"
                disabled={isSubmitting}
              />

              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message}
                </p>
              )}

              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  className="mt-3 h-32 w-full object-cover rounded-md"
                  alt="Thumbnail Preview"
                />
              )}
            </div>
          </div>

          {/* Video */}
          <div className="space-y-3">
            <label className="font-semibold block">Course Videos</label>
            <div className="border rounded-lg p-3">
              <input
                type="file"
                accept="video/*"
                multiple
                {...register("videos")}
                className="w-full"
                disabled={isSubmitting}
              />

              {errors.videos && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.videos.message}
                </p>
              )}

              {videoPreviewNames.length > 0 && (
                <ul className="mt-3 text-sm text-gray-800 space-y-1">
                  {videoPreviewNames.map((name, i) => (
                    <li key={i}>📹 {name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-semibold py-3 rounded-lg transition 
            ${isSubmitting ? "bg-gray-400 " : "bg-amber-500 "}`}
        >
          {isSubmitting ? "Creating Course..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
