import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { cardRise, reveal, viewportCard } from "../lib/motion";

// One of the three major projects. Iteration 04 reorganised the row into a
// single card with a fixed reading order — header (index badge, kicker, title),
// then the screenshot, then the copy and a hairline footer holding the stack and
// the repo link. The alternating sides, the floating body card and the giant
// parallaxed numeral are gone (they read as clutter). Description, stack and
// link are still always visible, and the screenshot is still shown whole:
// width:100% / height:auto, object-fit:contain, never cropped or letterboxed.
const ProjectFeature = ({
  name,
  img,
  imgWidth,
  imgHeight,
  description,
  stack = [],
  source,
  index,
}) => {
  const reduced = useReducedMotion();
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <motion.article className="project" {...reveal(reduced, cardRise, viewportCard)}>
      <header className="project__head">
        <span className="project__index" aria-hidden="true">
          {numeral}
        </span>
        <div className="project__headings">
          <p className="project__kicker">Featured project</p>
          <h3 className="project__title">{name}</h3>
        </div>
      </header>

      <div className="project__media">
        <span className="project__glow" aria-hidden="true" />
        <img
          className="project__shot"
          src={`${import.meta.env.BASE_URL}${img}`}
          alt={`${name} screenshot`}
          width={imgWidth}
          height={imgHeight}
          loading="lazy"
        />
      </div>

      <div className="project__body">
        <p className="project__desc">{description}</p>

        <div className="project__foot">
          <ul className="project__stack">
            {stack.map((tech) => (
              <li key={tech} className="tech-chip">
                {tech}
              </li>
            ))}
          </ul>

          {source && (
            <a
              className="project__link"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub aria-hidden="true" /> View repository
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

ProjectFeature.propTypes = {
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.string),
  source: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default ProjectFeature;
