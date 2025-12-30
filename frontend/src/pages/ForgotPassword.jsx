import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SHA256 } from "crypto-js";
import image512 from "../assets/logo512.png";
import image192 from "../assets/logo192.png";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const token = localStorage.getItem("token");

  const computeHash = (input) => SHA256(input).toString();

  // STEP 1 → Send OTP
  const sendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/users/sendmail`, { email });
      setServerOtp(res.data.otp);
      setStep(2);
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  // STEP 2 → Verify OTP
  const verifyOtp = () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    if (parseInt(otp) === parseInt(serverOtp)) {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  // STEP 3 → Change Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !cpassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match");
      return;
    }

    let hashed = computeHash(password);
    hashed = computeHash(email + hashed);

    try {
      await axios.post(`${API_URL}/users/forgotpassword`, {
        email,
        password: hashed,
      });
      alert("Password changed successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Error updating password");
    }
  };

  // auto redirect if already logged in
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
            <h2>Forgot your password?</h2>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <p>Please enter your email</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendOtp}>Send OTP</button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <p>Please enter OTP</p>
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={verifyOtp}>Verify OTP</button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <p>Please enter new password</p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                />
                <button type="submit">Change Password</button>
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

export default ForgotPassword;
