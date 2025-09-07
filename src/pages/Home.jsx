import { motion } from "framer-motion";
import "./../styles/Home.css";

import HeroImage from "./../assets/Gemini_Generated_Image_kuyxrkuyxrkuyxrk.png";


function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="home-container">
        <motion.div
          className="home-hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="home-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            🌾 Welcome to NetPlough
          </motion.h1>

          <motion.p
            className="home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Smart farming made simple — AI-powered crop recommendations,
            investment insights, and a trusted farmer marketplace, all in one
            place.
          </motion.p>

          <motion.a
            href="/cropform"
            className="home-cta-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.div>

        <motion.div
          className="home-hero-media"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.img
            src={HeroImage}
            alt="Smart Farming"
            className="home-hero-img"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          🌟 Why Choose NetPlough?
        </motion.h2>

        <div className="home-feature-cards">
          {[
            {
              img: "https://cdn-icons-png.flaticon.com/512/2903/2903560.png",
              title: "AI Crop Recommendations",
              desc: "Get the best crop suggestions based on soil, climate, and region.",
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              title: "Farmer Marketplace",
              desc: "Connect with trusted buyers & sellers in your region.",
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png",
              title: "Weather Insights",
              desc: "Stay updated with real-time weather forecasts for smart farming.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="home-feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.3 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <img src={feature.img} alt={feature.title} />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="home-video">
        <motion.h2
          className="home-section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          🎥 See How It Works
        </motion.h2>

        <motion.div
          className="home-video-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ayW4GZ9wGmc"
            title="Farming AI Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </section>
    </>
  );
}

export default Home;
