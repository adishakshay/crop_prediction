import "./../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-logo">🌱 AgriAI</div>
        <p className="footer-tagline">
          Empowering Farmers with AI-driven Crop Recommendations
        </p>
      </div>

      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/marketplace">Marketplace</a>
        <a href="/weather">Weather</a>
        <a href="/contact">Contact</a>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AgriAI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
