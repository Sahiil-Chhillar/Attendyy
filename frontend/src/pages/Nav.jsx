import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Nav.css";
import UserDetails from "./UserDetails";
import logo from "../assets/logo192.png";
import logoutIcon from "../assets/logout.png";

const Nav = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUser({
        email,
        name: localStorage.getItem("name"),
        pno: localStorage.getItem("pno"),
        dob: localStorage.getItem("dob"),
        type: localStorage.getItem("type"),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="nav-container">
      <nav>
        <ul className="nav-links">
          {/* Home */}
          <li className="nav-link">
            <Link to="/">
              <img src={logo} alt="Home" style={{ width: "30px" }} />
            </Link>
          </li>

          {/* Logout (only when logged in) */}
          {user && (
            <li className="nav-link logout">
              <button
                onClick={handleLogout}
                style={{ background: "none", border: "none" }}
              >
                <img src={logoutIcon} alt="Logout" />
              </button>
            </li>
          )}
        </ul>

        {/* User info */}
        {user && <UserDetails user={user} />}
      </nav>
    </div>
  );
};

export default Nav;
