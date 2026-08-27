// Shared framer-motion vocabulary. No JSX, no React component, no data.
// Every scroll reveal in the app routes through reveal() / item() so that
// reduced-motion behaviour has exactly one implementation point.
// Iteration 02: exports and signatures are unchanged; only the variant values
// were retuned off the space aesthetic — every reveal is now opacity plus a
// small y offset, with no rotateX, blur() or scale (architecture §15.4).

export const viewportOnce = { once: true, amount: 0.2 };
export const viewportHeading = { once: true, amount: 0.6 };
export const viewportCard = { once: true, amount: 0.25 };
export const viewportConsole = { once: true, amount: 0.3 };

export const easeOut = [0.16, 1, 0.3, 1];

// Containers with <= 6 children.
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

// Containers with > 6 children.
export const staggerContainerTight = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.02, delayChildren: 0 } },
};

export const riseItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: easeOut } },
};

export const cardRise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: easeOut } },
};

export const headingRise = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export const consoleRise = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: easeOut } },
};

// When reduced, returns {} — no initial, no whileInView, no variants — so the
// element renders in its natural DOM state, immediately, at full opacity.
export const reveal = (reduced, variants, viewport = viewportOnce) =>
  reduced
    ? {}
    : { initial: "hidden", whileInView: "visible", viewport, variants };

// When reduced, returns undefined so no ancestor stagger container can drive
// the child.
export const item = (reduced, variants) => (reduced ? undefined : variants);
