import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Heading from "./Heading";
import socials from "../content/socials";
import Typewriter from "typewriter-effect";

const Hero = (props) => {
  return (
    <div className="container">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.3, rotate: 10 }}
        whileTap={{
          scale: 0.8,
          rotate: -90,
          borderRadius: "100%",
        }}
        className="pfp"
      >
        <img src={`${import.meta.env.BASE_URL}${props.img}`} alt="Profile" />
      </motion.div>

      <Heading firstWord="Who" secondWord="AmI?" />

      <div className="hero-typewriter">
        <h3>I Am A</h3>
        <Typewriter
          options={{
            strings: ["Junior Software Developer", "Robotics Enthusiast", "Tech Innovator"],
            autoStart: true,
            loop: true,
          }}
          className="typewriter"
        />
      </div>

      <div className="button-effect">
        <div className="hero-text">
          <p className="hero-desc">{props.description}</p>
        </div>

        <br />
        <br />
        Find me on:
        <div className="hero-socials">
          {socials.map((social, index) => (
            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
              <img
                src={`${import.meta.env.BASE_URL}socials/${social.icon}`}
                alt={social.icon}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Hero;