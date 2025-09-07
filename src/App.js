import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import CropForm from "./pages/CropForm";
import Recommendations from "./pages/Recommendations";
import History from "./pages/History";
import About from "./pages/About";
import Marketplace from "./pages/Marketplace";
import Weather from "./pages/Weather";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Userprofile from "./pages/Userprofile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="/cropform" element={<CropForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
