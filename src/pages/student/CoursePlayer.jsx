import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, PlayCircle } from "lucide-react";
import api from "../../api/api";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedCourse = location.state?.course;

  const [course, setCourse] = useState(passedCourse || null);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(!passedCourse);

  useEffect(() => {
    if (passedCourse?.videos) return;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${courseId}`);
        const courseData = res.data.data.course;

        if (!courseData.videos || courseData.videos.length === 0) {
          navigate(`/s/courses/${courseId}`);
          return;
        }

        setCourse(courseData);
      } catch (err) {
        navigate("/s");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, passedCourse, navigate]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{course.title}</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Course Content</h2>

        {course.videos.map((video, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={video._id} className="border-b last:border-none">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex justify-between items-center py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} />
                  <span className="font-medium">{video.title}</span>
                </div>

                <ChevronDown
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pb-4">
                  <video controls className="w-full rounded">
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePlayer;
