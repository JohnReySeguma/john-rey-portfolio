# ADR-0010 — Two shared interaction primitives (`Lightbox`, `TabFilter`) and section controllers

- **Status:** Accepted · **Iteration:** 02 · **Date:** 2026-08-27 · **Deciders:** Ponta
- **Relates to:** PRD §I2.1, §I2.3 · plan T3–T8, T10 · ADR-0001 (extended, not superseded)

## Context
Every section must now carry an interaction. Written per section that is five bespoke
widgets, five keyboard/focus implementations, and five chances to ship an inaccessible
modal. No new npm package is permitted (PRD §I2.5 A2), so React state is the mechanism.

## Decision
1. **`Lightbox.jsx` — the only overlay in the app.** Props
   `{ open, title, images, index, onIndex, onClose, children }`. Contract: mounted only when
   `open`; `role="dialog" aria-modal="true"` labelled by `title`; visible close control;
   closes on `Esc` and on backdrop click; focus moves into the dialog on open and returns to
   the opener on close; `Tab`/`Shift+Tab` cycle inside the dialog; `document.body` scroll is
   locked while open and restored on close/unmount; prev/next controls render only when
   `images.length > 1`; `children` is an optional slot above the image, used only by the
   Facebook embed (ADR-0011). Entrance motion is skipped under `useReducedMotion()`.
2. **`TabFilter.jsx` — the only tab/filter affordance.** `role="tablist"` with roving
   `tabindex`, `ArrowLeft/ArrowRight/Home/End` handling and `aria-selected`. Purely
   presentational: the active value and the filtering live in the caller.
3. **Section controllers — a third component kind** alongside ADR-0001's *item* and *chrome*
   components. `SkillsBoard.jsx` and `AwardsWall.jsx` own one section's local UI state and
   compose a primitive with item components. They take their records as props from `App.jsx`
   and import no content module, so ADR-0001's data rule is intact.

## Consequences
- **+** One accessible-modal implementation to write, review and QA (T5 AC4, T10 AC2).
- **+** Projects and Experience need no primitive: both are `<button aria-expanded>` + panel.
- **−** `App.jsx` no longer sees skills/awards state; two extra hops when reading the page.
- **−** Focus trapping is hand-rolled (~20 lines) and must be verified in a real browser,
  not asserted from source.
