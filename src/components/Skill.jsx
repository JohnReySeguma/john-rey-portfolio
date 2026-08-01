import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Skill = ({ skill }) => {
  const label = skill.replace(/\.(svg|png)$/, "");

  return (
    <motion.div
      className="module"
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.85 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -6, scale: 1.06 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}skills/${skill}`}
        alt={label}
        className="module__img"
      />
      <span className="module__label">{label}</span>
    </motion.div>
  );
};

Skill.propTypes = {
  skill: PropTypes.string.isRequired,
};

export default Skill;
