import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { easeOut } from "../lib/motion";

// The only overlay in the app (ADR-0010). Mounted only while `open`.
// Contract: role="dialog" aria-modal, visible close control, Esc + backdrop
// close, focus moves in on open and returns to the opener on close, Tab cycles
// inside, body scroll locked, prev/next only when there is more than one image.
// `children` is an optional slot above the image (used only by FacebookEmbed).
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Lightbox = ({ open, title, images, index, onIndex, onClose, children }) => {
  const reduced = useReducedMotion();
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const many = images.length > 1;

  const step = useCallback(
    (delta) => {
      if (!many) return;
      onIndex((index + delta + images.length) % images.length);
    },
    [many, onIndex, index, images.length]
  );

  // Body-scroll lock + focus return. Both are tied to the same effect so they
  // can never get out of sync with the open state.
  useEffect(() => {
    if (!open) return undefined;

    openerRef.current = document.activeElement;
    // html is the scrolling element, so locking body alone does not stop the
    // page behind the overlay from scrolling — both are locked.
    const previousRoot = document.documentElement.style.overflow;
    const previousBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
      const opener = openerRef.current;
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  // Move focus into the dialog once it is in the DOM.
  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (!node) return;
    const target = node.querySelector("[data-lightbox-initial]") || node;
    target.focus();
  }, [open]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowRight" && many) {
      event.preventDefault();
      step(1);
      return;
    }

    if (event.key === "ArrowLeft" && many) {
      event.preventDefault();
      step(-1);
      return;
    }

    if (event.key !== "Tab") return;

    const node = dialogRef.current;
    if (!node) return;
    const stops = Array.from(node.querySelectorAll(FOCUSABLE));
    if (stops.length === 0) return;

    const first = stops[0];
    const last = stops[stops.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const backdropMotion = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18, ease: easeOut },
      };

  const dialogMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
        transition: { duration: 0.24, ease: easeOut },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          onClick={onClose}
          {...backdropMotion}
        >
          <motion.div
            className="lightbox__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            ref={dialogRef}
            onKeyDown={onKeyDown}
            onClick={(event) => event.stopPropagation()}
            {...dialogMotion}
          >
            <div className="lightbox__bar">
              <p className="lightbox__title">{title}</p>
              <button
                type="button"
                className="lightbox__close"
                onClick={onClose}
                data-lightbox-initial
                aria-label="Close"
              >
                <IoClose aria-hidden="true" />
              </button>
            </div>

            {children}

            {images.length > 0 && (
              <div className="lightbox__stage">
                {many && (
                  <button
                    type="button"
                    className="lightbox__nav lightbox__nav--prev"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                  >
                    <IoChevronBack aria-hidden="true" />
                  </button>
                )}

                <img
                  className="lightbox__image"
                  src={images[index]}
                  alt={`${title} — photo ${index + 1} of ${images.length}`}
                />

                {many && (
                  <button
                    type="button"
                    className="lightbox__nav lightbox__nav--next"
                    onClick={() => step(1)}
                    aria-label="Next image"
                  >
                    <IoChevronForward aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {many && (
              <p className="lightbox__count">
                {index + 1} / {images.length}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Lightbox.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  onIndex: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Lightbox;
