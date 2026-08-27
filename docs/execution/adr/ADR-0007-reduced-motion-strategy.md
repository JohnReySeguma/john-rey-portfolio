# ADR-0007 — Reduced motion handled in JS via `MotionConfig` + `useReducedMotion`, not CSS alone

- **Status:** Accepted · amended 2026-08-27 (amendment A1)
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect) · **D13 decided by Nala (PO)**
- **Relates to:** PRD §7.2, §5.6 item 4, **D13** · plan T1 AC13, **T1 AC15**, T8 AC6,
  T10 AC9 · architecture.md §9.2, §9.2.1, §11.1

> **Amendment A1 (2026-08-27).** The "Known gap" this ADR recorded — `typewriter-effect`
> looping under `prefers-reduced-motion: reduce`, making plan T8 AC6 unpassable — was
> routed to the PO as flag F5 and has been **decided: PRD D13**. Under reduced motion the
> typewriter is **not mounted at all** and a static string renders in its place. Layer 3
> below and the former "Known gap" section are updated accordingly. **This ADR now has no
> open non-conformance.** No decision is reversed; the ADR is not superseded.

## Context

`App.css` already contains:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

This neutralises CSS `@keyframes` and CSS `transition`s — the porthole ring spin, the
`ONLINE` pulse, the card scanline, the mobile menu `max-height` transition. It has **no
effect whatsoever** on framer-motion, which writes animated values to inline styles from
JavaScript on every frame; there is no CSS animation or transition for the media query to
neutralise.

Everything the plan actually cares about under reduced motion is framer-motion driven:

- T1 AC13 — hero content visible immediately, no boot gate, no fade-in delay.
- T8 AC6 — scrolling the whole page produces no entrance animations and no looping
  motion; all content immediately visible.
- T10 AC9 — the page is readable end-to-end with no animation gating any content.

framer-motion 10 already ships both mechanisms needed, so this costs no dependency:
`<MotionConfig reducedMotion="user">` and the `useReducedMotion()` hook.

Important nuance: `MotionConfig reducedMotion="user"` deliberately **keeps opacity
animations** (it only drops transform/layout values), on the reasoning that fades are
vestibular-safe. That is a defensible default in general, but a 0.4–0.6 s fade still
*delays reading*, and T8 AC6 / T10 AC9 are worded as "immediately visible" and "no
entrance animations". So `MotionConfig` alone is not sufficient.

## Decision

A five-layer strategy. All five ship in iteration 01. (Layers 1–4 as originally decided;
Layer 5 added by amendment A1 to carry PRD D13.)

**Layer 1 — global safety net.** `App.jsx` wraps the whole tree in
`<MotionConfig reducedMotion="user">`. This catches any framer-motion transform we forget
about, including `whileHover` lifts on cards, tiles and records.

**Layer 2 — reveals produce *no* animation, not a fade.** Any component that owns a
scroll reveal calls framer-motion's `useReducedMotion()` and routes its motion props
through the shared helpers from `src/lib/motion.js` (ADR-0004):

```js
reveal(reduced, variants)
//  reduced === true  ->  {}   (no initial, no whileInView, no variants: element renders
//                              in its natural DOM state, immediately, at full opacity)
//  reduced === false ->  { initial: "hidden", whileInView: "visible",
//                          viewport: viewportOnce, variants }

item(reduced, variants)
//  reduced === true  ->  undefined     (child has no variants, so an ancestor cannot
//                                       drive it)
//  reduced === false ->  variants
```

Returning `{}` rather than a transform-free fade is the whole point: it is the only shape
that literally satisfies "immediately visible".

**Layer 3 — component-specific skips.** Where an effect is not a plain reveal, the
component branches explicitly on `useReducedMotion()`:

| Component | Reduced-motion behaviour |
|---|---|
| `Hero` | boot ticker is **never mounted**; the classification **typewriter is never mounted** and `hero.classificationStatic` renders instead **[A1, PRD D13]**; porthole spring uses `initial={false}`; scroll-cue bounce loop is not applied |
| `ProjectCard` / `Skill` / the three `record` components | no entrance animation (via `reveal`/`item`) |
| `Heading` / `ContactForm` | no entrance animation (via `reveal`) |
| `FlightPath` | scroll-linked, not time-based — it responds to user scrolling, so it stays; it is `aria-hidden` decorative chrome and not an entrance animation. Plan T8 AC6 names it as the **only** element permitted to move under reduced motion. |
| `Starfield` | **already conformant — no change required.** Verified in source: it reads `window.matchMedia("(prefers-reduced-motion: reduce)").matches` at mount, pins the twinkle factor to a constant and never schedules a `requestAnimationFrame` loop. Because the read happens once at mount, QA must emulate the preference **then hard refresh** — plan T8 AC6 says so explicitly. |
| `typewriter-effect` | **[A1] Resolved by PRD D13** — conditionally not rendered; static substitute string. See §9.2.1 in architecture.md for the general rule this establishes. |

**Layer 4 (retained) — the existing CSS media block stays**, unchanged, to cover the
CSS-driven loops (`pulse`, `spin`, `scan`) and all CSS transitions.

`useReducedMotion()` is reactive in framer-motion 10 — it re-renders when the OS/DevTools
preference changes — so QA can toggle the emulation without a reload, though the plan's
procedure (emulate, then hard refresh) is what the ACs are written against.

## Consequences

**Positive**

- T1 AC13, T8 AC6 and T10 AC9 become achievable at all; with the CSS-only approach they
  were not.
- Exactly one place (`src/lib/motion.js`) decides what "reduced" means, so a new section
  added later inherits correct behaviour by using the shared helpers.
- `whileHover` transforms — which no CSS media query could have reached — are covered by
  Layer 1 for free.

**Negative / accepted costs**

- Every component with a reveal must call a hook and thread `reduced` through. That is
  boilerplate, and a component that forgets it silently animates. Mitigated by the
  convention being documented in architecture.md §9 and by the explicit sweep in
  `task.md` task 18 (**T10-D1**).
- Two mechanisms (`MotionConfig` and the helpers) address overlapping concerns, which can
  look redundant. Kept deliberately: `MotionConfig` is the net, the helpers are the
  contract.
- `reveal()` returning `{}` means that under reduced motion the element also loses
  `viewport`/`whileInView` entirely — so if a future feature depends on `onViewportEnter`
  for non-visual reasons, it must not be built on `reveal()`.

**Layer 5 [A1] — third-party timer-driven components are conditionally unmounted.**

`typewriter-effect` loops indefinitely, exposes no reduced-motion option, and starts its
own timers on mount. Neither `MotionConfig`, nor the CSS media block, nor any styling can
reach it — hiding it with `display: none` would leave its timers and its
accessibility-tree churn running and still fail "nothing is animating". The only
mechanism that works is **not mounting it**.

This was originally recorded here as an unresolved non-conformance with plan T8 AC6 and
routed to the PO as `task.md` flag F5, because the fix required changing behaviour PRD
§5.6 mandated. **The PO decided it: PRD D13.**

| `useReducedMotion()` | `hero__role` renders |
|---|---|
| `false` | `<Typewriter>` cycling the three phrases, looping — unchanged |
| `true` | `<span className="hero__role-static">Junior Software Developer · Robotics Enthusiast · Tech Innovator</span>` |

Separator is MIDDLE DOT U+00B7 with one space either side. The two branches are mutually
exclusive, and plan T1 AC15 tests both directions: the static string must not appear when
motion is allowed, and nothing may be typing when motion is reduced.

The substitute carries **all three** phrases, so a reduced-motion visitor receives the
same information as everyone else — the typewriter's entire payload is those three
strings shown serially. This generalises to a rule, recorded in architecture.md §9.2.1:

> A third-party component that animates on a timer and cannot be configured to stop must
> be conditionally rendered on `useReducedMotion()`, never hidden with CSS; and where it
> carries information, the reduced-motion branch must render an information-equivalent
> static substitute rather than nothing.

**There is no longer any known reduced-motion gap in this iteration.** Plan T8 AC6 and
T10 AC9 are fully passable, with no permitted exceptions.

## Alternatives considered

1. **CSS-only** (rely on the existing media block). Rejected: it provably cannot affect
   framer-motion's inline-style animations, so T1 AC13 / T8 AC6 / T10 AC9 would fail
   while looking like they were handled.
2. **`<MotionConfig reducedMotion="user">` alone.** Rejected: it preserves opacity
   animations by design, so entrance fades — and therefore reading delays — remain, and
   it does nothing about the hero boot timer, which is `setTimeout` logic, not motion.
3. **`<MotionConfig reducedMotion="always">`** behind a manual toggle. Rejected: a UI
   toggle is new product scope (PRD §4 forbids new features such as a theme toggle, and
   this is the same class of thing), and `"always"` would disable motion for everyone.
4. **Hand-rolled `matchMedia('(prefers-reduced-motion: reduce)')` hook in `src/lib/`.**
   Rejected: framer-motion 10 already exports `useReducedMotion()` with subscription and
   SSR-safe defaults. Writing our own would be duplicated, less tested code for zero
   dependency saving.
5. **Gate reveals with a CSS class toggled on `<html>`.** Rejected: it moves a rendering
   concern into imperative DOM manipulation and still would not stop framer-motion from
   writing inline styles.
