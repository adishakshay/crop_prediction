// PopupLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/PopupLogin.css"; // We'll style it

const PopupLogin = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>⚠️ Attention!</h3>
        <p>{message}</p>
        <div className="popup-buttons">
          <button onClick={() => navigate("/login")} className="popup-btn login">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="popup-btn signup">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupLogin;
