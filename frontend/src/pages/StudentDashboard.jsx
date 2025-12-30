import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/StudentDashboard.css";
import StudentForm from "./StudentForm";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");

  const [sessionList, setSessionList] = useState([]);
  const [showSessionForm, setShowSessionForm] = useState(false);

  // fetch student sessions
  const getStudentSessions = async () => {
    try {
      const res = await axios.post(`${API_URL}/sessions/getStudentSessions`, {
        token,
      });
      setSessionList(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStudentForm = (action) => {
    if (action === "open") {
      setShowSessionForm(true);
    } else {
      localStorage.removeItem("session_id");
      localStorage.removeItem("teacher_email");
      setShowSessionForm(false);
      navigate("/student-dashboard", { replace: true });
    }
  };

  const getDistanceColor = (distance, radius) => ({
    distance,
    color: distance <= parseFloat(radius) ? "green" : "red",
  });

  useEffect(() => {
    // auth guard
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getStudentSessions();

    // read query params
    const session_id = searchParams.get("session_id");
    const teacher_email = searchParams.get("email");

    if (session_id && teacher_email) {
      localStorage.setItem("session_id", session_id);
      localStorage.setItem("teacher_email", teacher_email);
      setShowSessionForm(true);
    } else {
      setShowSessionForm(false);
    }
  }, [token, navigate, searchParams]);

  return (
    <div className="dashboard-main">
      {/* SESSION LIST */}
      {!showSessionForm && (
        <div className="session-list">
          <h2>Your Sessions</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Image</th>
              </tr>
            </thead>

            <tbody>
              {sessionList.length > 0 ? (
                sessionList.map((session, index) => {
                  const dist = getDistanceColor(
                    session.distance,
                    session.radius
                  );

                  return (
                    <tr key={index}>
                      <td>{session.name}</td>
                      <td>{session.date.split("T")[0]}</td>
                      <td>{session.time}</td>
                      <td>{session.duration}</td>
                      <td style={{ color: dist.color }}>{dist.distance}</td>
                      <td>
                        {session.image ? (
                          <img src={session.image} alt="session" width={200} />
                        ) : (
                          "No Image"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">No sessions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SESSION FORM */}
      {showSessionForm && (
        <div className="popup-overlay">
          <StudentForm togglePopup={toggleStudentForm} />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
