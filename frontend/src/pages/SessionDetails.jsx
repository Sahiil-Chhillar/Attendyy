import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/SessionDetails.css";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const SessionDetails = ({ currentSession, toggleSessionDetails }) => {
  const [qr, setQR] = useState("");

  const session = currentSession?.[0];
  const token = localStorage.getItem("token");

  // fetch QR only once when session changes
  useEffect(() => {
    if (!session) return;

    const fetchQR = async () => {
      try {
        const res = await axios.post(`${API_URL}/sessions/getQR`, {
          session_id: session.session_id,
          token,
        });
        setQR(res.data.url);
      } catch (error) {
        console.error("Error fetching QR:", error);
      }
    };

    fetchQR();
  }, [session, token]);

  const copyQR = async () => {
    await navigator.clipboard.writeText(qr);
    alert("QR link copied!");
  };

  const showImage = (e) => {
    const image = e.target.src;
    const imageWindow = window.open("", "_blank");
    imageWindow.document.write(
      `<img src="${image}" alt="student" style="width:50%" />`
    );
  };

  const getDistanceColor = (distance, radius) => ({
    distance,
    color: distance <= parseFloat(radius) ? "green" : "red",
  });

  if (!session) return null;

  return (
    <div className="popup">
      <button onClick={toggleSessionDetails}>
        <strong>X</strong>
      </button>

      <div className="popup-inner">
        <div className="popup-content">
          {/* SESSION DETAILS */}
          <div className="session-details">
            <p>
              <strong>Session Name</strong>: {session.name}
            </p>
            <p>
              <strong>Session Date</strong>: {session.date.split("T")[0]}
            </p>
            <p>
              <strong>Session Time</strong>: {session.time}
            </p>
            <p>
              <strong>Session Duration</strong>: {session.duration}
            </p>
            <p>
              <strong>Session Location</strong>: {session.location}
            </p>
            <p>
              <strong>Session Radius</strong>: {session.radius} meters
            </p>
          </div>

          {/* QR CODE */}
          <div className="qr-code">
            {qr && <QRCodeCanvas value={qr} size={200} />}
            <button onClick={copyQR} className="copybtn">
              Copy
            </button>
          </div>
        </div>

        {/* STUDENT LIST */}
        <div className="student-list scrollable-content">
          <p>Students Attended:</p>

          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>IP</th>
                <th>Date</th>
                <th>Email</th>
                <th>Distance</th>
                <th>Image</th>
              </tr>
            </thead>

            <tbody>
              {session.attendance.map((student, index) => {
                const distanceData = getDistanceColor(
                  student.distance,
                  session.radius
                );

                return (
                  <tr key={index}>
                    <td>{student.regno}</td>
                    <td>{student.IP}</td>
                    <td>{student.date.split("T")[0]}</td>
                    <td>{student.student_email}</td>
                    <td
                      className="distance"
                      style={{ color: distanceData.color }}
                    >
                      {distanceData.distance}
                    </td>
                    <td>
                      {student.image ? (
                        <img
                          src={student.image}
                          alt="student"
                          className="student-image"
                          width={100}
                          onClick={showImage}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
