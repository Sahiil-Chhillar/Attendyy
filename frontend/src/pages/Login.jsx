import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SHA256 } from "crypto-js";
import "../styles/Login.css";
import image512 from "../assets/logo512.png";
import image192 from "../assets/logo192.png";
import see from "../assets/see.png";
import hide from "../assets/hide.png";
// import dotenv from "dotenv";
// dotenv.config();

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("token");
  const computeHash = (input) => SHA256(input).toString();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    let password = e.target.password.value;
    if (!email || !password) {
      alert("Please fill all the fields");
      return;
    }
    password = computeHash(password);
    password = computeHash(email + password);
    try {
      const response = await axios.post(`${API_URL}/users/signin`, {
        email,
        password,
      });

      const { user, type, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("type", type);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);
      localStorage.setItem("pno", user.pno);
      localStorage.setItem("dob", user.dob);

      const session_id = searchParams.get("session_id");
      const teacher = searchParams.get("email");

      if (type === "student") {
        if (session_id && teacher) {
          navigate(
            `/student-dashboard?session_id=${session_id}&email=${teacher}`,
            { replace: true }
          );
        } else {
          navigate("/student-dashboard", { replace: true });
        }
      } else {
        navigate("/teacher-dashboard", { replace: true });
      }
    } catch (error) {
      alert("Invalid email or password");
      e.target.password.value = "";
    }
  };

  useEffect(() => {
    if (!token) return;

    const type = localStorage.getItem("type");
    const session_id = searchParams.get("session_id");
    const teacher = searchParams.get("email");

    if (type === "teacher") {
      navigate("/teacher-dashboard", { replace: true });
    } else {
      if (session_id && teacher) {
        navigate(
          `/student-dashboard?session_id=${session_id}&email=${teacher}`,
          { replace: true }
        );
      } else {
        navigate("/student-dashboard", { replace: true });
      }
    }
  }, [token, navigate, searchParams]);

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={image512} alt="full" />
      </div>

      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={image192} alt="logo" />
          </div>

          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>

            <form onSubmit={handleLoginSubmit}>
              <input type="email" name="email" placeholder="Email" />

              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ padding: 0 }}
                >
                  <img
                    src={showPassword ? hide : see}
                    alt="toggle"
                    className={showPassword ? "hide" : "see"}
                  />
                </button>
              </div>

              <div className="login-center-options">
                <Link
                  to="/forgot-password"
                  className="forgot-pass-link"
                  style={{ color: "#76ABAE" }}
                >
                  Forgot password?
                </Link>
              </div>

              <div className="login-center-buttons">
                <button type="submit">Log In</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#76ABAE" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
