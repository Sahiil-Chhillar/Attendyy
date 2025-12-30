import { useEffect, useRef, useState } from "react";
import "../styles/UserDetails.css";

const UserDetails = ({ user }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const ref = useRef(null);

  const toggle = () => {
    setShowUserDetails((prev) => !prev);
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  // close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowUserDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user?.name) return null;

  return (
    <div className="user-details" ref={ref}>
      <div className="user-icon" onClick={toggle}>
        <h3 style={{ color: "black", fontSize: "15px" }}>
          {getInitials(user.name)}
        </h3>
      </div>

      {showUserDetails && (
        <div className="user-details-container">
          <div className="user-details-popup">
            <p>
              <strong>Username:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.pno}
            </p>
            <p>
              <strong>DOB:</strong> {user.dob}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;