import React, { useState, useRef } from "react";
import axios from "axios";
import "../styles/StudentForm.css";

const StudentForm = ({ togglePopup }) => {
  const [token] = useState(localStorage.getItem("token") || "");
  const [image, setImage] = useState(null);
  const [photoData, setPhotoData] = useState(""); // captured photo preview

  const videoRef = useRef(null);

  /* ================= CAMERA ================= */

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    const photoDataUrl = canvas.toDataURL("image/png");
    const blob = await fetch(photoDataUrl).then((res) => res.blob());

    setImage(blob);
    setPhotoData(photoDataUrl);
    stopCamera();
  };

  const resetCamera = () => {
    setPhotoData("");
    setImage(null);
    startCamera();
  };

  /* ================= SUBMIT ================= */

  const attendSession = async (e) => {
    e.preventDefault();
    const regno = e.target.regno.value.trim();

    if (!regno || !image) {
      alert("Please fill all the fields");
      return;
    }

    // Get IP
    axios.defaults.withCredentials = false;
    const ipRes = await axios.get("https://api64.ipify.org?format=json");
    axios.defaults.withCredentials = true;

    const IP = ipRes.data.ip;

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude},${longitude}`;

        const formData = new FormData();
        formData.append("token", token);
        formData.append("regno", regno);
        formData.append("session_id", localStorage.getItem("session_id"));
        formData.append("teacher_email", localStorage.getItem("teacher_email"));
        formData.append("student_email", localStorage.getItem("email"));
        formData.append("IP", IP);
        formData.append("date", new Date().toISOString().split("T")[0]);
        formData.append("Location", locationString);
        formData.append("image", image, "attendance.png");

        try {
          const response = await axios.post(
            "http://localhost:5050/sessions/attend_session",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          document.querySelector(
            ".form-popup-inner"
          ).innerHTML = `<h5>${response.data.message}</h5>`;
        } catch (err) {
          console.error(err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  };

  /* ================= UI ================= */

  return (
    <div className="form-popup">
      <button type="button" onClick={togglePopup}>
        <strong>X</strong>
      </button>

      <div className="form-popup-inner">
        <h5>Enter Your Details</h5>

        {!photoData && <video ref={videoRef} width={300} autoPlay />}

        {photoData && <img src={photoData} width={300} alt="Captured" />}

        <div className="cam-btn">
          <button type="button" onClick={startCamera}>
            Start Camera
          </button>
          <button type="button" onClick={capturePhoto}>
            Capture
          </button>
          <button type="button" onClick={resetCamera}>
            Reset
          </button>
        </div>

        <form onSubmit={attendSession}>
          <input
            type="text"
            name="regno"
            placeholder="RegNo"
            autoComplete="off"
          />
          <button type="submit">Done</button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
