import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, PlayCircle } from "lucide-react";
import api from "../../api/api";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${courseId}`);
        const courseData = res.data.data.course;

        // 🚫 Not enrolled → redirect
        if (!courseData.videos || courseData.videos.length === 0) {
          navigate(`/s/courses/${courseId}`);
          return;
        }

        setCourse(courseData);
        setActiveVideo(courseData.videos[0]);
      } catch (err) {
        navigate("/s");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return null;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* 🎬 VIDEO PLAYER */}
      <div className="md:col-span-2 bg-black rounded-lg overflow-hidden">
        <video key={activeVideo.url} controls className="w-full h-[420px]">
          <source src={activeVideo.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="p-4 bg-white">
          <h1 className="text-xl font-semibold">{course.title}</h1>
          <p className="text-gray-600 mt-1">{activeVideo.title}</p>
        </div>
      </div>

      {/* 📚 VIDEO LIST (ACCORDION STYLE) */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Course Content</h2>

        {course.videos.map((video, index) => (
          <div key={video._id} className="border-b last:border-none">
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex justify-between items-center py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <PlayCircle size={18} />
                <span className="font-medium">{video.title}</span>
              </div>
              <ChevronDown
                className={`transition ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="pl-6 pb-3">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Play Video
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;
