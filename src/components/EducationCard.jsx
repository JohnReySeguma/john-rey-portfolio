import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { IoSchool } from "react-icons/io5";
import { item, riseItem } from "../lib/motion";

// The card raises and reveals its accent rule on hover and on :focus-within
// (architecture §15.4). tabIndex makes that reveal keyboard-reachable; the two
// records hold no hidden facts, so there is nothing to expand. Iteration 03
// adds the ghosted end-year plate behind the card.
const EducationCard = ({ institution, program, start, end }) => {
  const reduced = useReducedMotion();

  return (
    <motion.li
      className="edu-card"
      variants={item(reduced, riseItem)}
      tabIndex={0}
    >
      <span className="edu-card__rule" aria-hidden="true" />
      <span className="edu-card__ghost" aria-hidden="true">
        {end}
      </span>
      <span className="edu-card__icon-plate" aria-hidden="true">
        <IoSchool className="edu-card__icon" />
      </span>
      <p className="edu-card__range">{`${start} – ${end}`}</p>
      <h3 className="edu-card__institution">{institution}</h3>
      <p className="edu-card__program">{program}</p>
    </motion.li>
  );
};

EducationCard.propTypes = {
  institution: PropTypes.string.isRequired,
  program: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

export default EducationCard;
