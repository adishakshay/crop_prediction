import { useContext } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import { motion } from "framer-motion";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";
import "./../styles/Home.css";

import HeroImage from "./../assets/Gemini_Generated_Image_kuyxrkuyxrkuyxrk.png";

function Home() {
  const { lang } = useContext(LanguageContext);
  const t = languages[lang]; // translations

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
            {t.homeTitle}
          </motion.h1>

          <motion.p
            className="home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t.homeSubtitle}
          </motion.p>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/recommendations" className="home-cta-btn">
              {t.submitBtn || "Get Started"}
            </Link>
          </motion.div>
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
          🌟 {t.featureSectionTitle || "Why Choose NetPlough?"}
        </motion.h2>

        <div className="home-feature-cards">
          {[
            {
              img: "https://cdn-icons-png.flaticon.com/512/2903/2903560.png",
              title: t.feature1Title,
              desc: t.feature1Desc,
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              title: t.feature2Title,
              desc: t.feature2Desc,
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png",
              title: t.feature3Title,
              desc: t.feature3Desc,
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
          {t.videoSection}
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
            src="https://www.youtube.com/embed/2xrh6EciCZk"
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
