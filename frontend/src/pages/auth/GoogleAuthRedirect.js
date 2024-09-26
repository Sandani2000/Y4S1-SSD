import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthRedirectHandler() {
    const [tokenCookie, setTokenCookie] = useCookies(["token"]);
    const [roleCookie, setRoleCookie] = useCookies("role");
    const [userIdCookie, setUserIdCookie] = useCookies("userId");
    const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const role = urlParams.get("role");
    const userId = urlParams.get("userId");

    if (token && role && userId) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      setTokenCookie("token", token, { path: "/", expires: expirationDate });
      setRoleCookie("role", role, { path: "/", expires: expirationDate });
      setUserIdCookie("userId", userId, { path: "/", expires: expirationDate });

      navigate("/");
    } else {
      console.error("Missing token, role, or user ID in the URL");
      navigate("/login");
    }
  }, [setTokenCookie, setRoleCookie, setUserIdCookie, navigate]);

  return null;
}
