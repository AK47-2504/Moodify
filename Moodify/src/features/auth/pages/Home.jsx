// src/pages/Home/Home.jsx
import { useNavigate } from "react-router-dom";
import "../style/Home.scss";
import video from "../assests/videos/HeroVideo.mp4";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Background Video */}
      <video
        className="home__video"
        src={video}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="home__overlay" />

      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__content">
          <h1>
            Discover Music That Matches Your <span>Mood</span>
          </h1>

          <p>
            Moodify uses real-time facial expression detection to understand how
            you feel and recommends songs that resonate with your emotions.
          </p>

          <div className="home__buttons">
            <button onClick={() => navigate("/login")}>Get Started</button>

            <button className="secondary" onClick={() => navigate("/register")}>
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
