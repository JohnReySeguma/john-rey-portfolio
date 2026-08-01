import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const ProjectCard = ({ img, name, description, stack = [], source, preview, index }) => {
  return (
    <motion.article
      className="mission-card"
      initial={{ opacity: 0, y: 60, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="mission-card__tag">LOG #{String(index + 1).padStart(2, "0")}</div>

      <div className="mission-card__viewport">
        <img src={`${import.meta.env.BASE_URL}${img}`} alt={name} loading="lazy" />
        <div className="mission-card__scanline" />
      </div>

      <h3 className="mission-card__title">{name}</h3>
      <p className="mission-card__desc">{description}</p>

      <div className="mission-card__stack">
        {stack.length > 0 ? (
          stack.map((tech, i) => (
            <span key={i} className="mission-card__module">
              {tech}
            </span>
          ))
        ) : (
          <span className="mission-card__module">classified</span>
        )}
      </div>

      <div className="mission-card__links">
        {source && (
          <a href={source} target="_blank" rel="noreferrer" className="mission-card__link">
            <FaGithub /> source
          </a>
        )}
        {preview && preview !== "#" && (
          <a href={preview} target="_blank" rel="noreferrer" className="mission-card__link">
            <FaExternalLinkAlt /> live
          </a>
        )}
      </div>
    </motion.article>
  );
};

ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.string),
  img: PropTypes.string.isRequired,
  source: PropTypes.string,
  preview: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default ProjectCard;
