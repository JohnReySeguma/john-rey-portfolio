import { useEffect } from "react";
import sections from "../content/sections";

// A client-rendered page loses native fragment navigation: the browser resolves
// location.hash while #root is still empty, finds nothing, and never retries.
// This restores it once, after mount. See ADR-0008.
const useHashScroll = () => {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !sections.some((section) => section.id === id)) return;

    const target = document.getElementById(id);
    if (!target) return;

    // "instant" is required: "auto" defers to html { scroll-behavior: smooth },
    // which would animate a page-load positioning operation.
    const jump = () => target.scrollIntoView({ behavior: "instant", block: "start" });

    let cancelled = false;
    let correction = 0;
    const cancel = () => {
      cancelled = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((type) =>
      window.addEventListener(type, cancel, { once: true, passive: true })
    );

    // Phase 1 - land immediately, after first layout.
    const initial = requestAnimationFrame(jump);

    // Phase 2 - webfonts can change every offset below the fold, so re-assert
    // once they have settled, unless the visitor has started interacting.
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      correction = requestAnimationFrame(() => {
        if (!cancelled) jump();
      });
    });

    return () => {
      cancelAnimationFrame(initial);
      cancelAnimationFrame(correction);
      events.forEach((type) => window.removeEventListener(type, cancel));
    };
  }, []);
};

export default useHashScroll;
