import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import editCourseSchema from "../../schema/editCourseSchema";
import api from "../../api/api";
import InstructorVideo from "../../components/InstructorVideo";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // course passed from InstructorCourses ( CourseCard )
  const passedCourse = location.state?.course;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState(passedCourse || { videos: [] });

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
      const c = res.data.data.course;

      hydrateForm(c);
      setCourse({ ...c, videos: c.videos || [] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  // FORM HYDRATION
  const hydrateForm = (c) => {
    setValue("title", c.title);
    setValue("description", c.description);
    setValue("price", c.price);
    setValue("upiId", "");
    setValue("videos", []);
    setThumbnailPreview(c.thumbnail?.url || null);
  };

  // INITIAL LOAD
  useEffect(() => {
    if (passedCourse) {
      hydrateForm(passedCourse);
      setCourse({ ...passedCourse, videos: passedCourse.videos || [] });
      setLoading(false);
      return;
    }

    fetchCourse();
  }, [courseId, passedCourse]);

  // THUMBNAIL PREVIEW
  useEffect(() => {
    if (!thumbnailWatch?.length) return;

    const file = thumbnailWatch[0];
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailWatch]);

  //  VIDEO NAME PREVIEW
  useEffect(() => {
    if (!videosWatch?.length) {
      setVideoPreviewNames([]);
      return;
    }

    setVideoPreviewNames(Array.from(videosWatch, (file) => file.name));
  }, [videosWatch]);

  // UPDATE COURSE
  const onSubmit = async (data) => {
    setSaving(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price ?? 0);

    if (data.upiId) formData.append("upiId", data.upiId);
    if (data.thumbnail?.length) formData.append("thumbnail", data.thumbnail[0]);

    if (data.videos?.length) {
      for (const file of data.videos) {
        formData.append("videos", file);
      }
    }

    try {
      await toast.promise(api.put(`/course/${courseId}`, formData), {
        loading: "Saving changes...",
        success: "Course updated successfully!",
        error: (err) => err?.response?.data?.message || "Update failed",
      });
      navigate("/i/courses");
    } finally {
      setSaving(false);
    }
  };

  // REPLACE VIDEO
  const replaceVideo = async (videoId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("videos", file);

    const res = await toast.promise(
      api.put(`/course/${courseId}/videos/${videoId}/replace`, formData),
      {
        loading: "Replacing video...",
        success: "Video replaced successfully!",
        error: (err) => err?.response?.data?.message || "Replace failed",
      }
    );
    navigate("/i/courses");
  };

  // DELETE VIDEO
  const deleteVideo = async (videoId) => {
    await toast.promise(api.delete(`/course/${courseId}/videos/${videoId}`), {
      loading: "Deleting video...",
      success: "Video deleted successfully!",
      error: (err) => err?.response?.data?.message || "Delete failed",
    });

    setCourse((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v._id !== videoId),
    }));
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
            disabled={saving}
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
            disabled={saving}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            {...register("price")}
            className="w-full mt-1 p-2 border rounded"
            disabled={saving}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold">UPI ID</label>
          <input
            {...register("upiId")}
            className="w-full mt-1 p-2 border rounded"
            disabled={saving}
          />
          {errors.upiId && (
            <p className="text-red-500 text-sm">{errors.upiId.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
              disabled={saving}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
            )}
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="mt-2 h-32 w-full object-cover rounded"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Add New Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              {...register("videos")}
              disabled={saving}
            />
            {errors.videos && (
              <p className="text-red-500 text-sm">{errors.videos.message}</p>
            )}
            {videoPreviewNames.length > 0 && (
              <ul className="mt-1 text-sm space-y-1">
                {videoPreviewNames.map((name, i) => (
                  <li key={i}>📹 {name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded font-semibold ${
            saving ? "bg-gray-400 text-gray-700" : "bg-amber-500 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Existing Videos</h2>
        <div className="space-y-3">
          {course.videos.map((video) => (
            <InstructorVideo
              key={video._id}
              video={video}
              replacing={false}
              onReplace={(file) => replaceVideo(video._id, file)}
              onDelete={() => deleteVideo(video._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
