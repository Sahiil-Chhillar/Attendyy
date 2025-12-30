import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Dashboard.css";
import NewSession from "./NewSession";
import SessionDetails from "./SessionDetails";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

// FlashCard component (moved outside)
const FlashCard = ({ session, onClick }) => (
  <div className="flashcard" onClick={onClick}>
    <div className="front">
      <h4>{session.name}</h4>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [sessionList, setSessionList] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  // FETCH SESSIONS
  const fetchSessions = async () => {
    try {
      const res = await axios.post(`${API_URL}/sessions/getSessions`, {
        token,
      });
      setSessionList(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE SESSION DETAILS
  const openSessionDetails = (sessionId) => {
    const session = sessionList.find((s) => s.session_id === sessionId);
    setCurrentSession(session ? [session] : null);
    setShowSessionDetails(true);
  };

  const closeSessionDetails = () => {
    setShowSessionDetails(false);
    setCurrentSession(null);
  };

  // TOGGLE CREATE SESSION POPUP
  const toggleCreatePopup = () => {
    setShowCreatePopup((prev) => !prev);
  };

  // AUTH GUARD + INITIAL LOAD
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetchSessions();
  }, [token, navigate]);

  return (
    <div className="dashboard-main">
      {/* HEADER */}
      <div className="row1">
        <div className="heading">
          <h2>Your Sessions</h2>
        </div>
        <div className="createbtncol">
          <button onClick={toggleCreatePopup} className="createbtn">
            Create Session
          </button>
        </div>
      </div>

      {/* SESSION LIST */}
      <div className="session-list">
        {sessionList.length > 0 ? (
          sessionList.map((session) => (
            <FlashCard
              key={session.session_id}
              session={session}
              onClick={() => openSessionDetails(session.session_id)}
            />
          ))
        ) : (
          <p>No sessions found</p>
        )}
      </div>

      {/* SESSION DETAILS */}
      {showSessionDetails && currentSession && (
        <div className="popup-overlay">
          <SessionDetails
            currentSession={currentSession}
            toggleSessionDetails={closeSessionDetails}
          />
        </div>
      )}

      {/* CREATE SESSION */}
      {showCreatePopup && (
        <div className="popup-overlay">
          <NewSession togglePopup={toggleCreatePopup} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
