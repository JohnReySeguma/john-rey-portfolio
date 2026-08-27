import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { item, riseItem } from "../lib/motion";

// One stack tile: the icon sits in its own tinted plate above the label, and
// the tile carries a corner notch that fills with the accent gradient on hover.
const Skill = ({ file, label }) => {
  const reduced = useReducedMotion();

  return (
    <motion.li className="skill-chip" variants={item(reduced, riseItem)}>
      <span className="skill-chip__plate">
        <img
          src={`${import.meta.env.BASE_URL}skills/${file}`}
          alt={label}
          className="skill-chip__icon"
          loading="lazy"
        />
      </span>
      <span className="skill-chip__label">{label}</span>
      <span className="skill-chip__notch" aria-hidden="true" />
    </motion.li>
  );
};

Skill.propTypes = {
  file: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Skill;
