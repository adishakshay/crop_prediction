// ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PopupLogin from "./PopupLogin";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn && showPopup) {
    return <PopupLogin message="Please login/signup to access this page!" />;
  }

  return children;
};

export default ProtectedRoute;
