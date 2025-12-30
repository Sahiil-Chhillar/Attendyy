import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logout.css";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        const timer = setTimeout(() => {
            navigate("/", { replace: true });
        }, 1000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="logout-main">
            <h1>Logout Successful!</h1>
            <p>You will be redirected to the signup page in 1 second...</p>
        </div>
    );
};

export default Logout;