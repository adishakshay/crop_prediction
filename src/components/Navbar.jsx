import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "./../assets/NetPlough_logo.png"; // ✅ Import logo
import "./../styles/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

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
    localStorage.setItem("isLoggedIn", "false"); // don’t delete user
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
          <span className="navbar-logo-text">NetPlough</span>
        </div>

        {/* Hamburger */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>

        {/* Links */}
        <ul className={`navbar-links ${menuOpen ? "navbar-active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/cropform" onClick={() => setMenuOpen(false)}>Crop Form</Link></li>
          <li><Link to="/recommendations" onClick={() => setMenuOpen(false)}>Recommendations</Link></li>
          <li><Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link></li>
          <li><Link to="/weather" onClick={() => setMenuOpen(false)}>Weather</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>History</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>

          {/* Mobile Actions */}
          <div className="navbar-actions-mobile">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="navbar-login-btn" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="navbar-signup-btn" onClick={() => setMenuOpen(false)}>Signup</Link>
              </>
            ) : (
              <button onClick={() => setShowLogoutModal(true)} className="navbar-logout-btn">
                Logout
              </button>
            )}
          </div>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="navbar-login-btn">Login</Link>
              <Link to="/signup" className="navbar-signup-btn">Signup</Link>
            </>
          ) : (
            <button onClick={() => setShowLogoutModal(true)} className="navbar-logout-btn">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="navbar-logout-modal-overlay">
          <div className="navbar-logout-modal">
            <h3>Are you sure you want to logout?</h3>
            <div className="navbar-logout-modal-actions">
              <button className="navbar-confirm-btn" onClick={confirmLogout}>Yes, Logout</button>
              <button className="navbar-cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
