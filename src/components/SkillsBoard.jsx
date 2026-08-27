import { useId, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TabFilter from "./TabFilter";
import Skill from "./Skill";
import { staggerContainerTight } from "../lib/motion";

const ALL = "All";

// Section controller (ADR-0010): owns the active category and renders the
// TabFilter primitive over a filtered tile grid. Records arrive as props.
// Every count shown is derived from those records, never written by hand.
const SkillsBoard = ({ skills, categories }) => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(ALL);
  const uid = useId();

  const tabs = [ALL, ...categories];
  const panelId = `${uid}-panel`;
  const visible =
    active === ALL ? skills : skills.filter((skill) => skill.category === active);

  // Cheap enough to derive on every render; no memo, no stale-dep risk.
  const counts = tabs.reduce(
    (acc, tab) => ({
      ...acc,
      [tab]:
        tab === ALL
          ? skills.length
          : skills.filter((skill) => skill.category === tab).length,
    }),
    {}
  );

  const gridMotion = reduced
    ? {}
    : {
        variants: staggerContainerTight,
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
      };

  return (
    <div className="skills-board">
      <div className="skills-board__bar">
        <TabFilter
          label="Filter skills by category"
          tabs={tabs}
          value={active}
          onChange={setActive}
          panelId={panelId}
          idPrefix={uid}
          counts={counts}
        />
        <p className="skills-board__tally">
          <strong>{visible.length}</strong> shown
        </p>
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${tabs.indexOf(active)}`}
        className="skills-board__panel"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={active} className="skill-grid" {...gridMotion}>
            {visible.map((skill) => (
              <Skill key={skill.label} file={skill.file} label={skill.label} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
};

SkillsBoard.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SkillsBoard;
