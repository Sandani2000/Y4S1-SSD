import { useState } from "react";
import { useCookies } from "react-cookie";
import logoImage from "../../assets/Edu-logo.png";
import PopUp from "../../components/PopUp";

export default function Login() {
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [tokenCookie, setTokenCookie] = useCookies(["token"]);
  const [roleCookie, setRoleCookie] = useCookies("role");
  const [userIdCookie, setUserIdCookie] = useCookies("userId");

  // API - loginHandler
  const loginHandler = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(`http://localhost:4001/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Handle JWT token storage
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); 

        setTokenCookie("token", responseData.token, { path: "/", expires: expirationDate });
        setRoleCookie("role", responseData.role, { path: "/", expires: expirationDate });
        setUserIdCookie("userId", responseData.user_id, { path: "/", expires: expirationDate });

        window.location.href = "/";
      } else if (response.status === 404) {
        setPopupMessage("Oh no! 🫣 You are not registered in our system. Please sign up.");
        setShowPopup(true);
      } else if (response.status === 401) {
        setPopupMessage("Invalid Credentials 🤥");
        setShowPopup(true);
      } else if (response.status === 500) {
        setPopupMessage("Internal server error. Please try again later.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:4001/auth/google";
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && <PopUp heading="Login Failed!" message={popupMessage} onClose={closePopup} />}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src={logoImage} alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button
              onClick={googleLogin}
              className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign in with Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a href="/register" className="font-semibold leading-6 text-green-900 hover:text-green-800">
              Sign up now!
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
