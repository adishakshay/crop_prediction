import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/About.css";
import {
  FaSeedling,
  FaRupeeSign,
  FaShieldAlt,
  FaBug,
  FaCloudSun,
  FaHandshake,
  FaTractor,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";


const About = () => {
  const navigate = useNavigate();
  return (
    <div className="about-container">
      <h1 className="about-title">🌱 About NetPlough</h1>

      {/* Intro */}
      <p className="about-intro">
        Farming is the backbone of our nation, but farmers often struggle with
        uncertainty—about crops, weather, diseases, and profits. At
        <strong> NetPlough</strong>, we are changing that. Using the power of
        Artificial Intelligence, we provide simple, practical, and
        farmer-friendly solutions that help farmers make smarter decisions and
        get better yields.
      </p>

      {/* Story / Mission / Vision */}
      <section className="about-story-vision">
        <div className="about-card-highlight">
          <h2>📖 Our Story</h2>
          <p>
            NetPlough was born out of a simple idea:{" "}
            <em>
              what if every farmer had access to the same intelligence that
              scientists and experts use?
            </em>{" "}
            We saw farmers losing profits due to wrong crop choices, unexpected
            weather, and lack of timely information. That’s why we built
            NetPlough — a platform that brings technology directly to the soil.
          </p>
        </div>

        <div className="about-card-highlight">
          <h2>🎯 Our Mission</h2>
          <p>
            To empower every farmer with data-driven insights that turn
            agriculture into a profitable and sustainable livelihood.
          </p>
        </div>

        <div className="about-card-highlight">
          <h2>💡 Our Vision</h2>
          <p>
            A future where no farmer suffers from uncertainty—where technology
            and tradition work hand in hand to create prosperous farming
            communities.
          </p>
        </div>
      </section>

      {/* Benefits / Features */}
      <h2 className="about-subtitle">🌾 What Farmers Get with NetPlough</h2>
      <div className="about-benefits">
        <div className="about-card">
          <FaSeedling className="about-icon" />
          <h3>Easy Crop Predictions</h3>
          <p>
            AI-powered recommendations for the best crops based on soil, climate,
            and market demand.
          </p>
        </div>

        <div className="about-card">
          <FaRupeeSign className="about-icon" />
          <h3>Profit Estimations</h3>
          <p>
            Get clear insights into investment, yield, and profit before
            planting. No more guesswork.
          </p>
        </div>

        <div className="about-card">
          <FaShieldAlt className="about-icon" />
          <h3>Policy & Market Updates</h3>
          <p>
            Stay updated with crop policies, subsidies, and latest government
            schemes.
          </p>
        </div>

        <div className="about-card">
          <FaBug className="about-icon" />
          <h3>Disease Prediction</h3>
          <p>
            Detect early signs of crop diseases with AI alerts and get
            recommendations to protect your harvest.
          </p>
        </div>

        <div className="about-card">
          <FaCloudSun className="about-icon" />
          <h3>Weather Insights</h3>
          <p>
            Receive accurate, location-based forecasts to plan irrigation,
            sowing, and harvesting.
          </p>
        </div>

        <div className="about-card">
          <FaHandshake className="about-icon" />
          <h3>Farmer Marketplace</h3>
          <p>
            Connect directly with buyers and suppliers for seeds, fertilizers,
            and fair crop sales.
          </p>
        </div>

        <div className="about-card">
          <FaTractor className="about-icon" />
          <h3>Smart Farming Tools</h3>
          <p>
            Access modern farming techniques, irrigation tips, and precision
            agriculture support.
          </p>
        </div>

        <div className="about-card">
          <FaChartLine className="about-icon" />
          <h3>Market Trends</h3>
          <p>
            Know which crops are in demand and make informed planting decisions
            for better profits.
          </p>
        </div>
      </div>

      {/* Impact Section */}
      <section className="about-section impact">
        <h2>🌍 Our Impact</h2>
        <div className="about-impact-grid">
          <div className="impact-item">
            <FaUsers className="impact-icon" />
            <h3>10,000+</h3>
            <p>Farmers empowered</p>
          </div>
          <div className="impact-item">
            <FaSeedling className="impact-icon" />
            <h3>50+</h3>
            <p>Crops analyzed</p>
          </div>
          <div className="impact-item">
            <FaCloudSun className="impact-icon" />
            <h3>24x7</h3>
            <p>Weather monitoring</p>
          </div>
          <div className="impact-item">
            <FaRupeeSign className="impact-icon" />
            <h3>₹5 Cr+</h3>
            <p>Profit impact delivered</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>🚜 Be Part of the NetPlough Movement</h2>
        <p>
          Join us in transforming farming into a smarter, more profitable, and
          sustainable practice. Whether you are a farmer, researcher, or
          partner—together, we can shape the future of agriculture.
        </p>
        <button className="about-cta-btn" onClick={() => navigate("/recommendations")}>
          Get Started with NetPlough
        </button>
      </section>
    </div>
  );
};

export default About;
