import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";
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
  const { lang } = useContext(LanguageContext);
  const t = languages[lang];

  return (
    <div className="about-container">
      <h1 className="about-title">🌱 {t.aboutTitle}</h1>

      {/* Intro */}
      <p className="about-intro">{t.aboutIntro}</p>

      {/* Story / Mission / Vision */}
      <section className="about-story-vision">
        <div className="about-card-highlight">
          <h2>📖 {t.aboutStoryTitle}</h2>
          <p>{t.aboutStoryDesc}</p>
        </div>

        <div className="about-card-highlight">
          <h2>🎯 {t.aboutMissionTitle}</h2>
          <p>{t.aboutMissionDesc}</p>
        </div>

        <div className="about-card-highlight">
          <h2>💡 {t.aboutVisionTitle}</h2>
          <p>{t.aboutVisionDesc}</p>
        </div>
      </section>

      {/* Benefits / Features */}
      <h2 className="about-subtitle">🌾 {t.aboutBenefitsTitle}</h2>
      <div className="about-benefits">
        <div className="about-card">
          <FaSeedling className="about-icon" />
          <h3>{t.aboutBenefit1Title}</h3>
          <p>{t.aboutBenefit1Desc}</p>
        </div>

        <div className="about-card">
          <FaRupeeSign className="about-icon" />
          <h3>{t.aboutBenefit2Title}</h3>
          <p>{t.aboutBenefit2Desc}</p>
        </div>

        <div className="about-card">
          <FaShieldAlt className="about-icon" />
          <h3>{t.aboutBenefit3Title}</h3>
          <p>{t.aboutBenefit3Desc}</p>
        </div>

        <div className="about-card">
          <FaBug className="about-icon" />
          <h3>{t.aboutBenefit4Title}</h3>
          <p>{t.aboutBenefit4Desc}</p>
        </div>

        <div className="about-card">
          <FaCloudSun className="about-icon" />
          <h3>{t.aboutBenefit5Title}</h3>
          <p>{t.aboutBenefit5Desc}</p>
        </div>

        <div className="about-card">
          <FaHandshake className="about-icon" />
          <h3>{t.aboutBenefit6Title}</h3>
          <p>{t.aboutBenefit6Desc}</p>
        </div>

        <div className="about-card">
          <FaTractor className="about-icon" />
          <h3>{t.aboutBenefit7Title}</h3>
          <p>{t.aboutBenefit7Desc}</p>
        </div>

        <div className="about-card">
          <FaChartLine className="about-icon" />
          <h3>{t.aboutBenefit8Title}</h3>
          <p>{t.aboutBenefit8Desc}</p>
        </div>
      </div>

      {/* Impact Section */}
      <section className="about-section impact">
        <h2>🌍 {t.aboutImpactTitle}</h2>
        <div className="about-impact-grid">
          <div className="impact-item">
            <FaUsers className="impact-icon" />
            <h3>10,000+</h3>
            <p>{t.aboutImpactFarmers}</p>
          </div>
          <div className="impact-item">
            <FaSeedling className="impact-icon" />
            <h3>50+</h3>
            <p>{t.aboutImpactCrops}</p>
          </div>
          <div className="impact-item">
            <FaCloudSun className="impact-icon" />
            <h3>24x7</h3>
            <p>{t.aboutImpactWeather}</p>
          </div>
          <div className="impact-item">
            <FaRupeeSign className="impact-icon" />
            <h3>₹5 Cr+</h3>
            <p>{t.aboutImpactProfit}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>🚜 {t.aboutCtaTitle}</h2>
        <p>{t.aboutCtaDesc}</p>
        <button className="about-cta-btn" onClick={() => navigate("/recommendations")}>
          {t.aboutCtaBtn}
        </button>
      </section>
    </div>
  );
};

export default About;
