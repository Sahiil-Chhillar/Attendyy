import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SHA256 } from "crypto-js";
import "../styles/Signup.css";
import image512 from "../assets/logo512.png";
import image192 from "../assets/logo192.png";
import see from "../assets/see.png";
import hide from "../assets/hide.png";
// import dotenv from "dotenv";
// dotenv.config();

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const Signup = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // STEP CONTROL
  const [step, setStep] = useState(1);

  // FORM STATE
  const [form, setForm] = useState({
    type: "student",
    name: "",
    email: "",
    otp: "",
    pno: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [serverOtp, setServerOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const computeHash = (input) => SHA256(input).toString();

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    if (!form.name || !form.email) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/users/sendmail`, {
        email: form.email,
      });
      setServerOtp(res.data.otp);
      setStep(2);
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = () => {
    if (!form.otp) {
      alert("Enter OTP");
      return;
    }

    if (parseInt(form.otp) === parseInt(serverOtp)) {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  // STEP 3 → NEXT
  const nextDetails = () => {
    if (!form.pno || !form.dob) {
      alert("Please fill all fields");
      return;
    }
    setStep(4);
  };

  // FINAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    let hashed = computeHash(form.password);
    hashed = computeHash(form.email + hashed);

    try {
      await axios.post(`${API_URL}/users/signup`, {
        name: form.name,
        email: form.email,
        password: hashed,
        pno: form.pno,
        type: form.type,
        dob: form.dob,
      });

      alert("Signup successful");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Signup failed");
    }
  };

  // AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="register-main">
      <div className="register-left">
        <img src={image512} alt="full" />
      </div>

      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            <img src={image192} alt="logo" />
          </div>

          <div className="register-center">
            <h2>Welcome to our website!</h2>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <input
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
                <button onClick={sendOtp}>Next</button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <input name="otp" placeholder="OTP" onChange={handleChange} />
                <button onClick={() => setStep(1)}>Edit Email</button>
                <button onClick={verifyOtp}>Submit</button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <input name="pno" placeholder="Phone" onChange={handleChange} />
                <input name="dob" type="date" onChange={handleChange} />
                <button onClick={() => setStep(2)}>Back</button>
                <button onClick={nextDetails}>Next</button>
              </>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <form onSubmit={handleSubmit}>
                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img src={showPassword ? hide : see} alt="toggle" />
                  </button>
                </div>

                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                  />
                </div>

                <button onClick={() => setStep(3)}>Back</button>
                <button type="submit">Sign Up</button>
              </form>
            )}
          </div>

          <p className="login-bottom-p">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#76ABAE" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
