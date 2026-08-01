import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import socials from "../content/socials";

const bootLines = [
  "> establishing uplink...",
  "> signal locked",
  "> decrypting crew manifest",
  "> welcome aboard",
];

const bootContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.35, delayChildren: 0.2 } },
};
const bootLine = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const dossierContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};
const dossierLine = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

// Boot sequence plays for this long, then unmounts and the profile reveals.
const BOOT_DURATION_MS = 2100;

// Splits the bio into short "log entries" — one per emoji-terminated
// sentence — instead of rendering it as a single dense paragraph.
const splitIntoLogEntries = (text) =>
  text
    .split(/(?<=\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)\s+/u)
    .map((line) => line.trim())
    .filter(Boolean);

const Hero = ({ img, description, title }) => {
  const [booted, setBooted] = useState(false);
  const logEntries = useMemo(() => splitIntoLogEntries(description), [description]);

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), BOOT_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="about" className="hero">
      <AnimatePresence>
        {!booted && (
          <motion.div
            className="hero__boot"
            variants={bootContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {bootLines.map((line) => (
              <motion.p key={line} variants={bootLine}>
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="hero__content"
        initial={false}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="hero__porthole"
          initial={false}
          animate={booted ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="hero__porthole-ring" />
          <img src={`${import.meta.env.BASE_URL}${img}`} alt="Profile" />
        </motion.div>

        <p className="hero__designation">{title}</p>

        <h1 className="hero__name">
          <span>&lt;</span>JohnRey<span className="hero__accent">Seguma/&gt;</span>
        </h1>

        <div className="hero__role">
          <span className="hero__role-label">CLASSIFICATION:</span>
          <Typewriter
            options={{
              strings: ["Junior Software Developer", "Robotics Enthusiast", "Tech Innovator"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        <motion.div
          className="hero__dossier"
          variants={dossierContainer}
          initial="hidden"
          animate={booted ? "visible" : "hidden"}
        >
          <span className="hero__dossier-heading">crew file // personnel log</span>
          {logEntries.map((line, i) => (
            <motion.p key={i} className="hero__dossier-line" variants={dossierLine}>
              <span className="hero__dossier-marker">{String(i + 1).padStart(2, "0")}</span>
              {line}
            </motion.p>
          ))}
        </motion.div>

        <div className="hero__channels">
          <span className="hero__channels-label">open comm channels</span>
          <div className="hero__channels-row">
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__channel"
                aria-label={social.icon.replace(".svg", "")}
              >
                <img
                  src={`${import.meta.env.BASE_URL}socials/${social.icon}`}
                  alt={social.icon.replace(".svg", "")}
                />
              </a>
            ))}
          </div>
        </div>

        <motion.a
          href="#projects"
          className="hero__scroll-cue"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          scroll to descend ↓
        </motion.a>
      </motion.div>
    </div>
  );
};

Hero.propTypes = {
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Hero;
