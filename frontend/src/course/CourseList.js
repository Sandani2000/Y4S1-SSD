import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import DOMPurify from "dompurify";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState("approved");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      let response;
      if (activeTab === "approved") {
        response = await axios.get(
          DOMPurify.sanitize("http://localhost:4003/api/v1/course/getApproved")
        );
        
      } else if (activeTab === "pending") {
        response = await axios.get(
          DOMPurify.sanitize("http://localhost:4003/api/v1/course/getPending")
        );
      } else if (activeTab === "rejected") {
        response = await axios.get(
          DOMPurify.sanitize("http://localhost:4003/api/v1/course/getRejected")
        );
      }
      console.log("🚀 ~ fetchCourses ~ response:", response.data)
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses. Please try again later.");
    }
  };

  async function fetchCsrfToken() {
    try {
      const response = await fetch("http://localhost:4003/api/v1/csrf-token", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw error;
    }
  }

  const handleViewDetails = (courseId) => {
    setExpandedCourseId(courseId === expandedCourseId ? null : courseId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = (courseId) => {
    navigate(`/edit/${courseId}`);
  };

  const handleDelete = async () => {
    try {
      const csrfToken = await fetchCsrfToken();

      const sanitizedUrl = DOMPurify.sanitize(
        `http://localhost:4003/api/v1/course/delete/${courseToDelete}`
      );

      await axios.delete(
        sanitizedUrl,
        {},
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      fetchCourses();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Error deleting course. Please try again later.");
    }
  };

  const handleShowConfirmationModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmationModal(true);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }



  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Course Management</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
          onClick={() => navigate("/addCourse")}
        >
          Add New Course
        </button>

        <div className="flex space-x-4">
          {["approved", "pending", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-2 px-4 font-medium ${
                activeTab === tab
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              } transition duration-200`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Courses
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-200 hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {DOMPurify.sanitize(course.CourseName)}
            </h2>
            {course.preview && (
              <img
                src={DOMPurify.sanitize(
                  `http://localhost:4003/${course.preview.replace("\\", "/")}`
                )}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
                onClick={() => handleViewDetails(course._id)}
              />
            )}
            {expandedCourseId === course._id && (
              <div className="text-gray-700">
                <p className="mb-2">
                  <span className="font-semibold">Instructor: </span>
                  {DOMPurify.sanitize(course.instructor)}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Description: </span>
                  {DOMPurify.sanitize(course.description)}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Duration: </span>
                  {DOMPurify.sanitize(course.duration)}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Level: </span>
                  {DOMPurify.sanitize(course.level)}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Price: </span>${course.price}
                </p>
                <h3 className="text-lg font-semibold mb-2">Lessons:</h3>
                <ul className="list-disc pl-6">
                  {course.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex} className="mb-2">
                      <div>
                        <span className="font-semibold">Title:</span>{" "}
                        {DOMPurify.sanitize(lesson.title)}
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>{" "}
                        {DOMPurify.sanitize(lesson.description)}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex space-x-4 mt-4">
                  {course.lectureNotes && (
                    <a
                      href={DOMPurify.sanitize(
                        `http://localhost:4003/${course.lectureNotes.replace(
                          "\\",
                          "/"
                        )}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Notes
                    </a>
                  )}
                  {course.lectureVideos && (
                    <a
                      href={DOMPurify.sanitize(
                        `http://localhost:4003/${course.lectureVideos.replace(
                          "\\",
                          "/"
                        )}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Videos
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleViewDetails(course._id)}
                className="text-blue-600 hover:underline"
              >
                {expandedCourseId === course._id ? "Hide Details" : "View Details"}
              </button>

              {activeTab === "pending" && (
                <button
                  onClick={() => handleEdit(course._id)}
                  className="text-green-600 hover:underline mr-2"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleShowConfirmationModal(course._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this course?"
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default CourseList;
