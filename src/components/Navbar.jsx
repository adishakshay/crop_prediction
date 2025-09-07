import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import logo from "./../assets/NetPlough_logo.png"; 
import "./../styles/Navbar.css";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const { lang } = useContext(LanguageContext);
  const t = languages[lang];

  useEffect(() => {
    const user = localStorage.getItem("user");
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(!!user && loggedIn);

    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(!!user && loggedIn);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const confirmLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
    setShowLogoutModal(false);
    window.dispatchEvent(new Event("storage"));
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="navbar-container">
        {/* ✅ Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="NetPlough Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">{t.navLogo || "NetPlough"}</span>
        </div>

        {/* Hamburger */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>

        {/* Links */}
        <ul className={`navbar-links ${menuOpen ? "navbar-active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>{t.navHome || "Home"}</Link></li>
          <li><Link to="/cropform" onClick={() => setMenuOpen(false)}>{t.navCropForm || "Crop Form"}</Link></li>
          <li><Link to="/recommendations" onClick={() => setMenuOpen(false)}>{t.navRecommendations || "Recommendations"}</Link></li>
          <li><Link to="/marketplace" onClick={() => setMenuOpen(false)}>{t.navMarketplace || "Marketplace"}</Link></li>
          <li><Link to="/weather" onClick={() => setMenuOpen(false)}>{t.navWeather || "Weather"}</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>{t.navHistory || "History"}</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>{t.navAbout || "About"}</Link></li>

          {/* Mobile Actions */}
          <div className="navbar-actions-mobile">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="navbar-login-btn" onClick={() => setMenuOpen(false)}>
                  {t.navLogin || "Login"}
                </Link>
                <Link to="/signup" className="navbar-signup-btn" onClick={() => setMenuOpen(false)}>
                  {t.navSignup || "Signup"}
                </Link>
              </>
            ) : (
              <>
                <Link to="/userprofile" className="navbar-profile-btn" onClick={() => setMenuOpen(false)}>
                  <FaUserCircle size={24} /> {t.navProfile || "Profile"}
                </Link>
                <button onClick={() => setShowLogoutModal(true)} className="navbar-logout-btn">
                  {t.navLogout || "Logout"}
                </button>
              </>
            )}
          </div>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="navbar-login-btn">{t.navLogin || "Login"}</Link>
              <Link to="/signup" className="navbar-signup-btn">{t.navSignup || "Signup"}</Link>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogoutModal(true)} className="navbar-logout-btn">
                {t.navLogout || "Logout"}
              </button>
              <Link to="/userprofile" className="navbar-profile-btn" title={t.navProfile || "Profile"}>
                <FaUserCircle size={28} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="navbar-logout-modal-overlay">
          <div className="navbar-logout-modal">
            <h3>{t.navLogoutConfirm || "Are you sure you want to logout?"}</h3>
            <div className="navbar-logout-modal-actions">
              <button className="navbar-confirm-btn" onClick={confirmLogout}>{t.navLogoutYes || "Yes, Logout"}</button>
              <button className="navbar-cancel-btn" onClick={() => setShowLogoutModal(false)}>{t.navCancel || "Cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
