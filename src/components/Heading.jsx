import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Heading = ({ firstWord, secondWord, eyebrow }) => {
  return (
    <motion.div
      className="station-heading"
      initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {eyebrow && <span className="station-heading__eyebrow">// {eyebrow}</span>}
      <h2 className="station-heading__title">
        <span className="station-heading__bracket">&lt;</span>
        {firstWord}
        <span className="station-heading__accent">{secondWord}</span>
        <span className="station-heading__bracket">/&gt;</span>
      </h2>
    </motion.div>
  );
};

Heading.propTypes = {
  firstWord: PropTypes.string.isRequired,
  secondWord: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
};

export default Heading;
