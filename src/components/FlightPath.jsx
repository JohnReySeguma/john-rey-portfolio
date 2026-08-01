import { useScroll, useSpring, useTransform, motion } from "framer-motion";

// A fixed side rail with a winding trail. The rocket's position along the
// trail IS the scroll progress bar — no separate percentage bar needed.
const PATH_D =
  "M30,4 C55,60 6,110 30,170 C54,230 6,280 30,340 C54,400 6,450 30,510 " +
  "C54,570 6,620 30,680 C54,740 6,790 30,850 C54,910 10,955 30,996";

const FlightPath = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });
  const offsetDistance = useTransform(smooth, (v) => `${v * 100}%`);

  return (
    <div className="flight-path" aria-hidden="true">
      <svg viewBox="0 0 60 1000" preserveAspectRatio="none" className="flight-path__svg">
        <path d={PATH_D} className="flight-path__track" />
        <motion.path
          d={PATH_D}
          className="flight-path__trail"
          style={{ pathLength: smooth }}
        />
      </svg>
      <motion.div
        className="flight-path__ship"
        style={{
          offsetPath: `path("${PATH_D}")`,
          offsetDistance,
          offsetRotate: "auto",
        }}
      >
        🚀
      </motion.div>
    </div>
  );
};

export default FlightPath;
