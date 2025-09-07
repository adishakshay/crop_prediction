import { useEffect, useState } from "react";
import { languages } from "../utils/languages";
import "./../styles/Userprofile.css";

function Userprofile() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("en");
  const [stage, setStage] = useState("view"); // view / verifyCurrent / otp / updateNew
  const [currentPhone, setCurrentPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const t = languages[lang];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Step 1: Verify current phone exists
  const handleCurrentPhoneSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(currentPhone)) {
      alert("❌ Please enter a valid 10-digit phone number");
      return;
    }
    if (user && user.phone === currentPhone) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setStage("otp");
      alert(`Generated OTP: ${otp}`); // in real app, send via SMS
    } else {
      alert("❌ Phone number does not match our records");
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      setStage("updateNew");
      setEnteredOtp("");
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  // Step 3: Update new phone number
  const handleNewPhoneSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(newPhone)) {
      alert("❌ Please enter a valid 10-digit phone number");
      return;
    }
    const updatedUser = { ...user, phone: newPhone };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setStage("view");
    alert("✅ Phone number updated successfully!");
    setCurrentPhone("");
    setNewPhone("");
  };

  if (!user) {
    return (
      <div className="userprofile-container">
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <label>{t.selectLanguage}: </label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="sd">Santhali (Jharkhand)</option>
            </select>
          </div>
          <h2>{t.profileTitle}</h2>
          <p>{t.noUser}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="userprofile-container">
      <div className="userprofile-card">
        <img
          src={user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="User Avatar"
          className="userprofile-avatar"
        />
        <h2>{user.name || "Farmer"}</h2>
        <p>{t.emailLabel}: {user.email}</p>
        <p>{t.roleLabel}: {user.role || "Farmer"}</p>

        {/* Language Selector */}
        <div style={{ margin: "15px 0" }}>
          <label>{t.selectLanguage}: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="sd">Santhali (Jharkhand)</option>
          </select>
        </div>

        {/* Change Phone Section */}
        {stage === "view" && (
          <button onClick={() => setStage("verifyCurrent")}>{t.changePhone}</button>
        )}

        {stage === "verifyCurrent" && (
          <form onSubmit={handleCurrentPhoneSubmit} style={{ marginTop: "15px" }}>
            <input
              type="text"
              placeholder="Enter Current Phone"
              value={currentPhone}
              onChange={(e) => setCurrentPhone(e.target.value)}
              className="userprofile-input"
              maxLength={10}
              required
            />
            <button type="submit" className="userprofile-btn">Send OTP</button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit} style={{ marginTop: "15px" }}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="userprofile-input"
              maxLength={6}
              required
            />
            <button type="submit" className="userprofile-btn">Verify OTP</button>
          </form>
        )}

        {stage === "updateNew" && (
          <form onSubmit={handleNewPhoneSubmit} style={{ marginTop: "15px" }}>
            <input
              type="text"
              placeholder="Enter New Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="userprofile-input"
              maxLength={10}
              required
            />
            <button type="submit" className="userprofile-btn">Update Phone</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Userprofile;
