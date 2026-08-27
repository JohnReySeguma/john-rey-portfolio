import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { IoArrowDown } from "react-icons/io5";
import socials from "../content/socials";
import hero from "../content/hero";
import { item, reveal, riseItem, staggerContainer } from "../lib/motion";

// The hero is the one section with depth: a mesh of two blurred accent fields
// over a dot grid and an offset frame behind the portrait. Every decorative
// layer is aria-hidden. Iteration 04 removed the stack ticker that used to close
// the section; the hero now ends on the social row over a hairline rule.
const Hero = ({ img, firstName, lastName }) => {
  const reduced = useReducedMotion();
  const name = `${firstName} ${lastName}`;

  return (
    <div id="about" className="hero">
      <div className="hero__backdrop" aria-hidden="true">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
        <span className="hero__mesh" />
      </div>

      <motion.div className="hero__inner" {...reveal(reduced, staggerContainer)}>
        <motion.div className="hero__portrait" variants={item(reduced, riseItem)}>
          <span className="hero__portrait-frame" aria-hidden="true" />
          <span className="hero__portrait-glow" aria-hidden="true" />
          <img src={`${import.meta.env.BASE_URL}${img}`} alt={name} />
          <span className="hero__portrait-tag">{hero.role}</span>
        </motion.div>

        <div className="hero__body">
          <motion.p className="hero__status" variants={item(reduced, riseItem)}>
            <span className="hero__status-dot" aria-hidden="true" />
            {hero.status}
          </motion.p>

          <motion.h1 className="hero__name" variants={item(reduced, riseItem)}>
            <span className="hero__name-line">{firstName}</span>{" "}
            <span className="hero__name-line hero__name-line--accent">{lastName}</span>
          </motion.h1>

          <motion.p className="hero__intro" variants={item(reduced, riseItem)}>
            {hero.intro}
          </motion.p>

          <motion.div className="hero__actions" variants={item(reduced, riseItem)}>
            {hero.ctas.map(({ label, href, variant }) => (
              <a key={href} className={`hero__cta hero__cta--${variant}`} href={href}>
                {label}
                {variant === "primary" && <IoArrowDown aria-hidden="true" />}
              </a>
            ))}
          </motion.div>

          <motion.ul className="hero__socials" variants={item(reduced, riseItem)}>
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__social"
                  aria-label={social.icon.replace(".svg", "")}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}socials/${social.icon}`}
                    alt={social.icon.replace(".svg", "")}
                  />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </div>
  );
};

Hero.propTypes = {
  img: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default Hero;
