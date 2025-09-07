import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ phone: "" });
  const [otpStage, setOtpStage] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("❌ Please enter a valid 10-digit phone number");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.phone === formData.phone) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setOtpStage(true);
    } else {
      alert("❌ Phone number not found. Please Signup first.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      localStorage.setItem("isLoggedIn", "true");  // mark session only
      window.dispatchEvent(new Event("storage"));
      alert("✅ Login successful!");
      navigate("/");
    }else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="login-container">
      {!otpStage ? (
        <form className="login-form" onSubmit={handlePhoneSubmit}>
          <h2 className="login-title">Login</h2>

          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            className="login-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">Send OTP</button>

          <p className="login-text">
            Don’t have an account? <Link to="/signup" className="login-link">Signup</Link>
          </p>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleOtpSubmit}>
          <h2 className="login-title">Enter OTP</h2>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="login-input"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            maxLength={6}
            required
          />

          <button type="submit" className="login-btn">Verify OTP</button>

          <p className="login-text">Generated OTP: <b>{generatedOtp}</b></p>
        </form>
      )}
    </div>
  );
};

export default Login;
