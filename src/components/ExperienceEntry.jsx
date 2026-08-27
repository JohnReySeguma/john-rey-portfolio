import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { item, riseItem } from "../lib/motion";

// One entry on the career timeline. Iteration 03 removed the highlights toggle:
// the highlights are part of the entry and are always visible. The entry sits
// on a gradient spine and carries a monogram tile plus a marker; the current
// role's marker pulses (and does not under prefers-reduced-motion).
const ExperienceEntry = ({
  company,
  title,
  type,
  start,
  end,
  current = false,
  highlights = [],
}) => {
  const reduced = useReducedMotion();
  const monogram = company.trim().charAt(0).toUpperCase();

  return (
    <motion.li
      className={`timeline__entry${current ? " timeline__entry--current" : ""}`}
      variants={item(reduced, riseItem)}
    >
      <span className="timeline__marker" aria-hidden="true" />

      <div className="timeline__head">
        <span className="timeline__monogram" aria-hidden="true">
          {monogram}
        </span>

        <div className="timeline__meta">
          <p className="timeline__range">
            {start}
            {" – "}
            {end}
            {current && <span className="timeline__ongoing">Ongoing</span>}
          </p>

          <h3 className="timeline__company">{company}</h3>
          <p className="timeline__title">{title}</p>
          <span className="timeline__badge">{type}</span>
        </div>
      </div>

      {highlights.length > 0 && (
        <ul className="timeline__highlights">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
    </motion.li>
  );
};

ExperienceEntry.propTypes = {
  company: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  current: PropTypes.bool,
  highlights: PropTypes.arrayOf(PropTypes.string),
};

export default ExperienceEntry;
