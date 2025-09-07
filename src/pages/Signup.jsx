import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", phone: "" });
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
      alert("⚠️ Phone number already registered. Please login.");
      navigate("/login");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpStage(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      localStorage.setItem("user", JSON.stringify(formData)); // keep permanent
      localStorage.setItem("isLoggedIn", "true");             // mark session
      window.dispatchEvent(new Event("storage"));
      alert("🎉 Signup successful! Welcome to NetPlough.");
      navigate("/");
    }else {
      alert("❌ Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      {!otpStage ? (
        <form className="signup-form" onSubmit={handlePhoneSubmit}>
          <h2 className="signup-title">Signup</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="signup-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">Send OTP</button>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/login" className="signup-link">Login</Link>
          </p>
        </form>
      ) : (
        <form className="signup-form" onSubmit={handleOtpSubmit}>
          <h2 className="signup-title">Verify OTP</h2>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="signup-input"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            maxLength={6}
            required
          />

          <button type="submit" className="signup-btn">Verify & Continue</button>

          <p className="signup-text">Generated OTP: <b>{generatedOtp}</b></p>
        </form>
      )}
    </div>
  );
};

export default Signup;
