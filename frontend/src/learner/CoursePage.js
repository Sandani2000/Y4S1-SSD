import React, {useState} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LessonsList from "./LessonsList";
import Resources from "./Resources";
import {useNavigate} from "react-router-dom";
import {GiProgression} from "react-icons/gi";
import {IoTime} from "react-icons/io5";
import {FaBookReader, FaLongArrowAltLeft} from "react-icons/fa";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization

const CoursePage = () => {
  const course = JSON.parse(localStorage.getItem("courseData"));
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Sanitize path for course preview
  const sanitizedPreviewUrl = DOMPurify.sanitize(
    `http://localhost:4003/${course.preview.replace("\\", "/")}`
  );

  const handleUnenroll = async () => {
    try {
      const learnerId = "123f55396a149b001f8a1234";
      const courseId = course.courseId;

      const response = await axios.post(
        DOMPurify.sanitize("http://localhost:4002/learner/course/unenroll"),
        {
          learnerId,
          courseId,
        }
      );

      alert("You unenrolled successfully"); // Success alert

      // Make request to local notification microservice
      await axios.post(
        DOMPurify.sanitize("http://localhost:4005/api/v1/notification/add"),
        {
          title: "Successful Unenrollment",
          message: "You have successfully unenrolled from the course",
          role: "admin",
        },
        {
          headers: {
            Authorization: "Key here", // Replace with your SendGrid API key
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/enrolledCourses");
      console.log(response.data.message); // Log success message
    } catch (error) {
      console.error("Error unenrolling:", error);
    }
  };

  const handleNavigation = () => {
    navigate("/enrolledCourses");
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-row justify-center object-cover w-full max-w-full px-20 py-20 rounded-lg shadow-md max-h-80 gap-28 bg-slate-200">
        <div className="mb-6 h-9 w-96">
          <img
            src={sanitizedPreviewUrl} // Use sanitized URL
            alt={DOMPurify.sanitize(course.CourseName)} // Sanitize the alt text
          />
        </div>
        <div>
          <div>
            <h1 className="mb-4 text-5xl font-semibold">
              {DOMPurify.sanitize(course.CourseName)}{" "}
              {/* Sanitize the course name */}
            </h1>
            <p className="mb-6 text-xl text-gray-600">
              {DOMPurify.sanitize(course.description)}{" "}
              {/* Sanitize the course description */}
            </p>
          </div>

          <div className="flex flex-row items-center justify-center px-10 pt-4 pb-2 border-2 rounded-lg bg-slate-100">
            <div className="flex flex-row justify-center flex-1 gap-2 ">
              <GiProgression />
              <p>
                {DOMPurify.sanitize(course.level)}{" "}
                {/* Sanitize the course level */}
              </p>
            </div>
            <div className="flex flex-row justify-center flex-1 gap-2">
              <FaBookReader />
              <p>{course.lessons.length}</p> lessons
            </div>
            <div className="flex flex-row justify-center flex-1 gap-2">
              <IoTime />
              <p>
                {DOMPurify.sanitize(course.duration)}{" "}
                {/* Sanitize the course duration */}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start justify-start w-full px-10 mt-3">
        <div className="w-3/4 py-4">
          <div className="flex flex-row">
            <button
              onClick={handleNavigation}
              className="flex flex-row justify-around w-1/4 px-4 py-2 rounded-xl hover:bg-green-950 hover:text-slate-100 hover:border-2 hover:border-slate-200 text-slate-100 bg-slate-800 focus:outline-none focus:shadow-outline "
            >
              <FaLongArrowAltLeft />
              Back to Enrollments
            </button>
          </div>
          <h2 className="mt-8 mb-4 text-2xl font-semibold">Chapters</h2>
          <LessonsList
            lessons={course.lessons}
            courseId={course._id}
            lessonsCompleted={course.lessonsCompleted}
          />
        </div>
        <div className="flex flex-col w-1/4 px-4 py-4">
          <button
            onClick={handleUnenroll}
            className="w-full px-4 py-2 text-white bg-red-500 rounded shadow-lg hover:bg-red-600 focus:outline-none focus:shadow-outline"
          >
            Unenroll
          </button>
          <Resources
            lectureNotes={course.lectureNotes}
            lectureVideos={course.lectureVideos}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
