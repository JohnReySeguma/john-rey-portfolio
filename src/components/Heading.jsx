import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { headingRise, reveal, viewportHeading } from "../lib/motion";

// Section heading primitive. Iteration 03 adds an index mark: a large ghosted
// numeral sitting behind the title as a decorative section counter, plus a
// gradient rule. The numeral is aria-hidden — it carries no information a
// screen-reader user needs.
const Heading = ({ eyebrow, title, index, align = "start" }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`section-head section-head--${align}`}
      {...reveal(reduced, headingRise, viewportHeading)}
    >
      {index && (
        <span className="section-head__numeral" aria-hidden="true">
          {index}
        </span>
      )}

      <div className="section-head__text">
        {eyebrow && <span className="section-head__eyebrow">{eyebrow}</span>}
        <h2 className="section-head__title">{title}</h2>
        <span className="section-head__rule" aria-hidden="true" />
      </div>
    </motion.div>
  );
};

Heading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  index: PropTypes.string,
  align: PropTypes.oneOf(["start", "center"]),
};

export default Heading;
