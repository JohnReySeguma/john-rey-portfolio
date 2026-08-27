import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { IoExpand, IoTrophy } from "react-icons/io5";
import { item, riseItem } from "../lib/motion";

// A record in the awards wall. The whole card is one control: an overlay
// <button> covers it so the card is clickable and keyboard-reachable while the
// award still renders as a real <h3> (a heading is not valid inside a button).
// `featured` gives the first record a wider, taller cell so the wall is
// deliberately asymmetric rather than a uniform grid.
const AchievementCard = ({
  award,
  category,
  event,
  thumb,
  count,
  hasVideo = false,
  featured = false,
  onOpen,
}) => {
  const reduced = useReducedMotion();

  return (
    <motion.li
      className={`award-card${featured ? " award-card--featured" : ""}`}
      variants={item(reduced, riseItem)}
    >
      <button
        type="button"
        className="award-card__open"
        onClick={onOpen}
        aria-label={`${award} — ${event}. Open photos`}
      />

      <div className="award-card__media">
        <img src={thumb} alt="" loading="lazy" />
        <span className="award-card__veil" aria-hidden="true" />
        <span className="award-card__trophy" aria-hidden="true">
          <IoTrophy />
        </span>
        {(hasVideo || count > 1) && (
          <span className="award-card__badge">
            <IoExpand aria-hidden="true" />
            {hasVideo ? "Video" : `${count} photos`}
          </span>
        )}
      </div>

      <div className="award-card__body">
        <h3 className="award-card__award">{award}</h3>
        {category && <p className="award-card__category">{category}</p>}
        <p className="award-card__event">{event}</p>
        <span className="award-card__cue" aria-hidden="true">
          View photos
        </span>
      </div>
    </motion.li>
  );
};

AchievementCard.propTypes = {
  award: PropTypes.string.isRequired,
  category: PropTypes.string,
  event: PropTypes.string.isRequired,
  thumb: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  hasVideo: PropTypes.bool,
  featured: PropTypes.bool,
  onOpen: PropTypes.func.isRequired,
};

export default AchievementCard;
