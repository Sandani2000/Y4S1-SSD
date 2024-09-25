import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import EnrollBackground from "../assets/enroll.jpg";
import HeroCover from "./HeroCover";
import NavBar from "./NavBar";
import { GiProgression } from "react-icons/gi";
import { IoTime } from "react-icons/io5";
import { FaBookReader } from "react-icons/fa";
import Modal from "./Modal";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization

const Enroll = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const learnerId = "123f55396a149b001f8a1234";
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          DOMPurify.sanitize(`http://localhost:4003/api/v1/course/getApproved`)
        ); // Sanitize the API URL

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchAllCourses();
  }, []);

  const handleEnroll = async (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const confirmEnroll = async (course) => {
    const learnerId = "123f55396a149b001f8a1234";
    try {
      const response = await axios.post(
        DOMPurify.sanitize(
          `http://localhost:4002/learner/course/enroll?courseId=${course._id}`
        ),
        { learnerId }
      ); // Sanitize URL and input data

      if (response.status === 200) {
        navigate("/enroll/success");
      } else {
        navigate("/enroll/unsuccess");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const confirmEnrollBtn = async (course) => {
    const learnerId = "123f55396a149b001f8a1234";
    try {
      const response = await axios.post(
        DOMPurify.sanitize(
          `http://localhost:4002/learner/course/enroll?courseId=${course._id}`
        ),
        { learnerId }
      ); // Sanitize URL and input data

      if (response.status === 200) {
        alert("You have successfully enrolled in this course");
        navigate("/enrolledCourses");
      } else {
        navigate("/enroll/unsuccess");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const callPayment = async (course) => {
    const learnerId = "123f55396a149b001f8a1234";
    const imagePath = course.preview.replace(/\\/g, "/");

    const items = {
      products: [
        {
          name: DOMPurify.sanitize(course.CourseName),
          price: course.price,
          images: [DOMPurify.sanitize(`http://localhost:4003/${imagePath}`)],
          quantity: 1,
        },
      ],
    };

    try {
      const response = await axios.post(
        DOMPurify.sanitize(`http://localhost:4004/api/payment`),
        { items }
      );

      if (response.status === 200) {
        const paymentUrl = DOMPurify.sanitize(response.data.url); // Sanitize the redirect URL
        // Validate the URL before redirection
        const isValidUrl = paymentUrl.startsWith("http://localhost:4004");
        if (isValidUrl) {
          window.location.href = paymentUrl; // Proceed with safe URL
        } else {
          console.error("Potential malicious redirect detected.");
          navigate("/enroll/unsuccess");
        }
      } else {
        navigate("/enroll/unsuccess");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      navigate("/enroll/unsuccess");
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div
        className="relative inset-0 z-0 bg-center bg-cover"
        style={{ height: "40vh" }}
      >
        <div className="absolute inset-0 z-0 bg-green-900">
          {/* <NavBar /> */}
        </div>
        <header className="absolute px-10 mb-2 top-10 md:top-52">
          <div className="items-start justify-center text-center">
            <h2 className="text-lg font-bold text-white md:text-4xl">
              Featured Courses
            </h2>
          </div>
        </header>
      </div>

      {/* Display enrolled courses */}
      <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((course) => {
          const sanitizedPreviewUrl = DOMPurify.sanitize(
            course.preview.replace("\\", "/")
          );
          return (
            <div
              key={course._id}
              className="overflow-hidden bg-white rounded-lg shadow-lg"
            >
              <img
                className="object-cover object-center w-full h-40 shadow-lg"
                src={DOMPurify.sanitize(
                  `http://localhost:4003/${sanitizedPreviewUrl}`
                )} // Sanitize the image URL
                alt={DOMPurify.sanitize(course.CourseName)} // Sanitize the alt text
              />

              <div className="flex flex-col px-2 py-4">
                <div className="mb-2 ">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {DOMPurify.sanitize(course.CourseName)}{" "}
                    {/* Sanitize the course name */}
                  </h3>
                </div>

                <div className="flex flex-row ">
                  <div className="flex flex-row flex-1 gap-1 justify-left ">
                    <GiProgression />
                    <p className="">{DOMPurify.sanitize(course.level)}</p>{" "}
                    {/* Sanitize level */}
                  </div>
                  <div className="flex flex-row flex-1 gap-1 justify-left">
                    <FaBookReader />
                    <p>{course.lessons.length}</p> lessons
                  </div>
                  <div className="flex flex-row flex-1 gap-1 justify-left">
                    <IoTime />
                    <p>{DOMPurify.sanitize(course.duration)}</p>{" "}
                    {/* Sanitize duration */}
                  </div>
                </div>

                <div className="flex flex-row justify-around gap-1 item-center ">
                  <div className="flex flex-row p-0 justify-centeritems-center">
                    <p className="text-xl font-bold text-stone-900 ">
                      LKR {course.price}
                    </p>
                  </div>
                  <div>
                    <Link
                      onClick={() => handleEnroll(course)}
                      className="items-center justify-center block px-4 py-2 font-bold text-center text-gray-800 bg-gray-200 border-2 rounded tex-center hover:bg-gray-800 focus:outline-none focus:shadow-outline border-gray-950 hover:text-gray-100"
                    >
                      Enroll me
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <h2 className="font-sans text-xl font-bold">
            {DOMPurify.sanitize(selectedCourse.CourseName)}{" "}
            {/* Sanitize course name */}
          </h2>
          <img
            src={DOMPurify.sanitize(
              `http://localhost:4003/${selectedCourse.preview.replace(
                "\\",
                "/"
              )}`
            )} // Sanitize image URL
          />
          <div className="flex flex-row items-center justify-around px-2 pt-2 pb-1 rounded-lg">
            <div className="flex flex-row justify-center flex-1 gap-1 ">
              <GiProgression />
              <p className="">
                {DOMPurify.sanitize(selectedCourse.level)}
              </p>{" "}
              {/* Sanitize level */}
            </div>
            <div className="flex flex-row justify-center flex-1 gap-1">
              <FaBookReader />
              <p>{selectedCourse.lessons.length}</p> lessons
            </div>
            <div className="flex flex-row justify-center flex-1 gap-1">
              <IoTime />
              <p>{DOMPurify.sanitize(selectedCourse.duration)}</p>{" "}
              {/* Sanitize duration */}
            </div>
          </div>

          <div className="py-2 pb-2 font-semibold text-justify">
            Instructor: {DOMPurify.sanitize(selectedCourse.instructor)}{" "}
            {/* Sanitize instructor */}
          </div>
          <div className="py-2 pb-2 text-justify">
            {DOMPurify.sanitize(selectedCourse.description)}{" "}
            {/* Sanitize description */}
          </div>
          <div className="flex flex-row justify-between pt-2">
            <p>Price</p>
            <p className="font-sans text-lg font-bold ">
              LKR {selectedCourse.price}
            </p>
          </div>
          <button
            className="w-full px-5 py-2 text-white bg-green-600"
            onClick={() => confirmEnrollBtn(selectedCourse)}
          >
            Confirm Enrollment
          </button>
          <button
            className="w-full px-5 py-2 mt-2 text-white bg-blue-600"
            onClick={() => callPayment(selectedCourse)}
          >
            Proceed to Payment
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Enroll;
