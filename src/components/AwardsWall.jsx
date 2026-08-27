import { useState } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import AchievementCard from "./AchievementCard";
import FacebookEmbed from "./FacebookEmbed";
import Lightbox from "./Lightbox";
import { reveal, staggerContainerTight } from "../lib/motion";

const src = (file) => `${import.meta.env.BASE_URL}awards/${file}`;

// Section controller (ADR-0010): owns which record is open and which of its
// images is showing, and composes the shared Lightbox. Records arrive as props.
const AwardsWall = ({ achievements }) => {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState(null);
  const [index, setIndex] = useState(0);

  const record = achievements.find((entry) => entry.id === openId) || null;
  // The video poster is already shown full width by FacebookEmbed, so it is not
  // repeated in the stage below it.
  const images = record
    ? record.images
        .filter((file) => !(record.video && record.video.poster === file))
        .map(src)
    : [];

  const open = (id) => {
    setIndex(0);
    setOpenId(id);
  };

  return (
    <div className="awards">
      <motion.ul
        className="awards-wall"
        {...reveal(reduced, staggerContainerTight)}
      >
        {achievements.map((entry, i) => (
          <AchievementCard
            key={entry.id}
            award={entry.award}
            category={entry.category}
            event={entry.event}
            thumb={src(entry.images[0])}
            count={entry.images.length}
            hasVideo={Boolean(entry.video)}
            featured={i === 0}
            onOpen={() => open(entry.id)}
          />
        ))}
      </motion.ul>

      <Lightbox
        open={Boolean(record)}
        title={record ? `${record.award} — ${record.event}` : ""}
        images={images}
        index={index}
        onIndex={setIndex}
        onClose={() => setOpenId(null)}
      >
        {record && record.video && (
          <FacebookEmbed video={record.video} posterAlt={record.event} />
        )}
      </Lightbox>
    </div>
  );
};

AwardsWall.propTypes = {
  achievements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      award: PropTypes.string.isRequired,
      category: PropTypes.string,
      event: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      video: PropTypes.shape({
        url: PropTypes.string.isRequired,
        poster: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        embed: PropTypes.bool.isRequired,
      }),
    })
  ).isRequired,
};

export default AwardsWall;
