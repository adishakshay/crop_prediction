import "./../styles/Footer.css";
import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";

function Footer() {
  const { lang } = useContext(LanguageContext);
  const t = languages[lang]; // translations

  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-logo">🌱 {t.footerLogo || "AgriAI"}</div>
        <p className="footer-tagline">
          {t.footerTagline || "Empowering Farmers with AI-driven Crop Recommendations"}
        </p>
      </div>

      <div className="footer-links">
        <a href="/">{t.footerHome || "Home"}</a>
        <a href="/about">{t.footerAbout || "About"}</a>
        <a href="/marketplace">{t.footerMarketplace || "Marketplace"}</a>
        <a href="/weather">{t.footerWeather || "Weather"}</a>
        <a href="/contact">{t.footerContact || "Contact"}</a>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {t.footerLogo || "AgriAI"}.{" "}
          {t.footerRights || "All Rights Reserved."}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
