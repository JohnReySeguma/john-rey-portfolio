# ADR-0004 — Introduce a shared `record` CSS primitive and a shared `src/lib/motion.js`

- **Status:** Accepted · amended 2026-08-27 (amendment A1)
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §6.3, §7.4 · plan T8 (AC3, AC4, AC5, AC7), T2, T3, T4 ·
  architecture.md §8, §9

> **Amendment A1 (2026-08-27).** The class list in §1 below was incomplete: it omitted
> `.record__award` and `.record__notes`, both of which the design requires. Added below
> and in architecture.md §8. No decision is reversed; this ADR is not superseded.
>
> **Amendment A3 (2026-08-27).** `.record:hover { transform: translateY(-4px) }` as
> specified in §1 **could never render** and was measured dead in the running app
> (`execution-log.md` D-2: element `top` 342 → 342 on hover). framer-motion writes an
> inline `transform` on every `motion.li`, and inline beats the stylesheet. The lift moves
> to `whileHover={{ y: -4 }}` in the three item components, and `transform` is removed both
> from `.record:hover` and from `.record`'s `transition` list. This **restores** this ADR's
> stated intent — "deliberately the same reaction as `.mission-card:hover`", which is itself
> CSS glow + framer lift — rather than reversing it. The general rule is recorded in
> architecture.md **§8.1**. This ADR is not superseded.

## Context

The brief's hardest requirement is qualitative: *professional but creative*. Plan T8
operationalises it — the page must read as one designed system after three sections are
added (AC3: identical heading treatment; AC7: hover states of "the same character" across
Experience, Achievement and Education entries; AC4/AC5: a shared, budgeted motion
language).

The existing system already gives us one shared piece: `Heading` + `.station`, which
covers AC3 for free as long as new sections use them. Nothing covers AC7 or AC4/AC5.

Left to three independently-written components, the three new sections would each invent
their own surface, padding scale, hover reaction and entrance timing. That is precisely
the "four bolted-on blocks" failure T8 is written to catch, and it is not a failure any
single acceptance criterion would have caught early — it only shows up in the
side-by-side screenshot at the end.

Constraint: ADR-0001 already decided **not** to introduce a shared React wrapper
component for the sections. So the sharing must happen somewhere else.

## Decision

Share at the **CSS layer** and the **motion-config layer**, not the component layer.

### 1. A `record` CSS primitive

A single class family in `App.css`, placed immediately after the `station / heading`
block, that owns *surface, spacing, type scale and hover* for every credential-like item
in the three new sections:

```
.record            panel background, 1px --panel-border, 16px radius, backdrop blur,
                   transition on border-color / box-shadow ONLY            [A3]
.record:hover      border-color: var(--thruster); teal glow                [A3]
                   the 4px lift comes from whileHover in the component, NOT from CSS
                   — deliberately the same reaction as .mission-card:hover
.record__meta      mono 11–12px uppercase, --text-dim            (date ranges)
.record__title     --font-display 17px, --starlight              (h3 content)
.record__award     --font-display 20px, --solar                  (achievement h3)   [A1]
.record__subtitle  --font-body 14px                              (role / program)
.record__badge     pill, mono 11px, tinted background + border   (Full-Time / Internship)
.record__note      13px / 1.6, --text-dim                        (bullets, event)
.record__notes     grid container, gap 6px                       (bullet list)      [A1]
.record--service | .record--commendation | .record--academy
                   accent colour and internal arrangement ONLY
```

Rule: a modifier may not change the surface (background, border width, radius, blur,
hover reaction) **and may not change the type scale**. Anything that needs to belongs in
`.record`.

**[A3] Where hover lives.** Non-transform hover feedback (`border-color`, `box-shadow`)
belongs to `.record` in `App.css`. Transform-based hover feedback (the lift) belongs to
`whileHover` in the component, because framer-motion's inline `transform` beats any
stylesheet rule on a `motion.*` element. `App.css` must therefore not declare `transform`
in `.record:hover`, and must not list `transform` in `.record`'s `transition` — a CSS
transition on `transform` interpolates against framer's per-frame inline writes and fights
the `whileHover` animation. See architecture.md §8.1 for the general rule and for the
reduced-motion consequence (under `reducedMotion="user"` the lift is dropped and only the
glow remains — matching `.mission-card`, and correct for a user who asked for less motion).

**Why `.record__award` is a primitive element and not a modifier override [A1].** Plan
T3 AC7 requires the award phrase to be the visually dominant element of an achievement
card — larger font size **and/or** accent colour. Writing that as
`.record--commendation .record__title { font-size: 20px; color: var(--solar) }` would put
the type scale under a modifier, contradicting the rule above. A second title-level
element keeps the rule intact while giving the achievements grid the emphasis the
acceptance criterion demands. It is used exactly once, by `AchievementCard`.

**Why the event uses `.record__note` and not `.record__meta` [A1].** `.record__meta`
uppercases its content, and plan T3 AC3/AC4 require `Kabataan Inyovator`,
`Araw ng Parangal`, `Robo Fest` and `Capture-the-flag` to render in their authored casing.
`.record__meta` is therefore reserved for date ranges, which have no casing to preserve.

Accent assignment, drawn only from existing tokens (PRD §7.4 / T8 AC1):

| Section | Accent | Why |
|---|---|---|
| Experience | `--thruster` | already the "live/online" colour (`hud-nav__pulse`), matching the ongoing-role marker |
| Achievements | `--solar` | already the eyebrow/award-ish amber |
| Education | `--nebula-2` | the remaining palette accent |

### 2. A shared motion module `src/lib/motion.js`

A new, tiny, JSX-free module exporting the entire entrance vocabulary:

```js
export const viewportOnce = { once: true, amount: 0.2 };
export const staggerContainer = …;   // hidden/visible with staggerChildren
export const riseItem = …;           // opacity 0 + y 24 → opacity 1 + y 0
export const reveal = (reduced, variants) => …;  // motion props object, or {} when reduced
export const item   = (reduced, variants) => …;  // variants, or undefined when reduced
```

Every scroll reveal added or modified in this iteration goes through `reveal()`/`item()`.
The existing `gridContainer` const in `App.jsx` is replaced by the imported
`staggerContainer`.

New directory `src/lib/` is created for cross-cutting, non-content, non-component
modules. It must never contain JSX (this also keeps the
`react-refresh/only-export-components` rule quiet under `--max-warnings 0`).

### 3. Explicit motion budgets

- Reveal easing is always `[0.16, 1, 0.3, 1]` (already the codebase's easing).
- A section's content must be fully readable ≤ 600 ms after entering the viewport
  (T8 AC4). Concretely: item duration ≤ 0.45 s, and `staggerChildren × (n - 1) +
  duration ≤ 0.6 s`. For the 9-item Achievements grid and the 26-item Skills grid this
  means the per-item stagger must be small enough (≤ 0.02 s for 9 items at 0.45 s) or the
  grid reveals as a single container fade. Per-section values are fixed in `task.md`.
- At most one looping/attention-grabbing effect per section (T8 AC5); nav `ONLINE` pulse
  and hero scroll cue are exempt by the plan. The three new sections get **zero** looping
  effects — their one "creative" beat is the entrance reveal plus the timeline's active
  node.

## Consequences

**Positive**

- T8 AC7 ("hover of the same character") becomes structurally true rather than a thing
  three components each remember to do.
- Motion timing is auditable in one file against one budget, instead of being scattered
  across six components as magic numbers.
- Reduced-motion handling has exactly one implementation point (ADR-0007 builds on
  `reveal`/`item`), so a component cannot forget it.
- Visual differentiation between the sections is reduced to a single accent token per
  section — cheap to change if the user dislikes the mapping.

**Negative / accepted costs**

- One more indirection: a developer reading `ExperienceEntry.jsx` must open two other
  files (`App.css` `record` block, `src/lib/motion.js`) to see the whole picture.
  Accepted; that is the price of coherence, and both are small and documented here.
- The "modifier may not change the surface" rule is a convention, not a mechanism.
  Nothing enforces it but review.
- A new top-level `src/lib/` directory is a new structural concept in a small codebase.
  Kept deliberately minimal — one file in iteration 01.

**Neutral**

- Projects and Skills keep their existing bespoke blocks (`.mission-card`, `.module`) and
  are **not** retrofitted onto `record`. No ticket authorises rewriting them, and the
  hover parity requirement is satisfied by `record`'s hover deliberately copying
  `.mission-card`'s.

## Alternatives considered

1. **A shared `<Record>` React wrapper component** that the three item components render
   inside. Rejected: it re-opens ADR-0001, and a wrapper that must support a timeline
   rail, a badge, an optional middle field and three heading arrangements ends up either
   `children`-only (in which case it adds nothing a class cannot) or config-driven (in
   which case it is the generic renderer ADR-0001 rejected).
2. **Copy the `.mission-card` block three times with new names.** Rejected: three
   independently-drifting copies is the exact failure mode T8 AC7 describes, and it
   triples the surface for a later theme change.
3. **Retrofit Projects and Skills onto `record` too.** Rejected as unscoped: it would
   change the appearance of sections the PRD explicitly puts out of scope for rewriting
   (PRD §4), and risks regressions in T5/T9 for no acceptance criterion's benefit.
4. **Keep motion variants inline per component** (current practice). Rejected: it makes
   the ≤ 600 ms budget unverifiable without reading six files, and it would require the
   reduced-motion branch to be duplicated six times.
5. **Put the shared variants in `src/content/motion.js`.** Rejected: `content/` is
   defined by architecture.md §4 as user-visible copy/data. Motion config is neither.
