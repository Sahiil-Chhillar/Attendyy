import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/NewSession.css";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const NewSession = ({ togglePopup }) => {
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");

  const token = localStorage.getItem("token");

  const createQR = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const duration = form.duration.value.trim();
    const time = form.time.value.trim();
    const radius = form.radius.value;

    if (!name || !duration || !time) {
      alert("Please fill all the fields");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;

        const payload = {
          token,
          session_id: generateUUID(),
          date: new Date().toISOString().split("T")[0],
          time,
          name,
          duration,
          location,
          radius,
        };

        try {
          const res = await axios.post(`${API_URL}/sessions/create`, payload);
          setQrData(res.data.url);
          setShowQR(true);
        } catch (err) {
          console.error(err);
          alert("Error creating session");
        }
      },
      (error) => {
        console.error(error);
        alert("Please allow location access to create a session");
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const copyQR = async () => {
    await navigator.clipboard.writeText(qrData);
    alert("Session link copied!");
  };

  return (
    <div className="new-popup">
      <button onClick={togglePopup}>
        <strong>X</strong>
      </button>

      {!showQR && (
        <div className="popup-inner">
          <h5>Create a New Session</h5>

          <form onSubmit={createQR}>
            <input type="text" name="name" placeholder="Session Name" />
            <input type="text" name="duration" placeholder="Duration" />
            <input type="text" name="time" placeholder="Time" />

            <select name="radius">
              <option value="50">50 meters</option>
              <option value="75">75 meters</option>
              <option value="100">100 meters</option>
              <option value="150">150 meters</option>
            </select>

            <button type="submit">Create Session</button>
          </form>
        </div>
      )}

      {showQR && (
        <div className="qr-code">
          <QRCodeCanvas value={qrData} size={200} />
          <button onClick={copyQR}>Copy</button>
        </div>
      )}
    </div>
  );
};
export default NewSession;
