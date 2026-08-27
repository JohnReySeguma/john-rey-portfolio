# ADR-0001 — Item-level presentational components per section, not a generic data-driven section renderer

- **Status:** Accepted
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §6.1, §6.3 · plan T2, T3, T4, T7, T8 · architecture.md §2.1, §3

## Context

Iteration 01 adds three new content sections — Work Experience, Academic Achievements,
Education — on top of the two existing data-driven sections (Projects, Skills).

The codebase already has a consistent composition rule: `App.jsx` owns every
`<section className="station">` shell, renders `<Heading>`, renders a grid container, and
maps a content array onto an **item component** that renders exactly one record
(`ProjectCard`, `Skill`). Item components take flat scalar props and import no data.

Two credible ways to add the new sections:

- **(A)** Follow the existing rule: three new item components
  (`ExperienceEntry`, `AchievementCard`, `EducationCard`), section shells stay in `App.jsx`.
- **(B)** Introduce one generic `<DataSection>` that takes a registry entry plus a records
  array plus a field-mapping config and renders any of the five sections.

(B) is tempting because five sections now share the same outer shell. But the *inner*
anatomies are genuinely different, and PRD §6.3 makes those differences requirements:

- Experience is a **vertical timeline** with an ordering-significant rail, an
  employment-type badge, an "ongoing" state on the first entry only, and a bullet list.
- Achievements is a **9-cell grid** whose award phrase must be the visually dominant
  element and whose middle field is optional (`category` is `null` for A1).
- Education is a **2-cell grid** of three flat fields.
- Projects has an image viewport, a scanline, a tag, a stack chip list and two links.
- Skills is a fixed-footprint tile with an image and a label.

## Decision

Adopt **(A)**. Each new section gets a dedicated item-level presentational component:

| File | Renders | Root element |
|---|---|---|
| `src/components/ExperienceEntry.jsx` | one employment record | `<motion.li className="record record--service">` |
| `src/components/AchievementCard.jsx` | one award | `<motion.li className="record record--commendation">` |
| `src/components/EducationCard.jsx` | one credential | `<motion.li className="record record--academy">` |

`App.jsx` keeps ownership of the `<section>` shell, `<Heading>`, and the list container,
exactly as it does for Projects and Skills. No generic section renderer is introduced.

Cross-section coherence — the actual goal behind the "one system" requirement (T8 AC3,
AC7) — is achieved at the **CSS and motion layer** instead, via the shared `record`
primitive and shared framer-motion variants (ADR-0004), not via a shared React component.

Section shells are `<ul>`/`<li>` for the three new sections because all three are
semantically lists (a timeline, an award list, a credential list). Projects/Skills keep
their existing `div` containers; no ticket authorises changing them.

## Consequences

**Positive**

- Zero deviation from an already-established convention, so a reader of `ProjectCard`
  can read `ExperienceEntry` with no new concepts.
- Each component's PropTypes describe exactly one real record shape, so a typo in a
  content module surfaces as a dev-console PropTypes warning instead of a silent blank.
- Layout differences that PRD §6.3 mandates are expressed directly in markup rather than
  in a config dialect that would have to be invented, documented and learned.
- `App.jsx` remains the one file where "what is on this page, in what order" is legible —
  which is what T7 is about.

**Negative / accepted costs**

- Three new files instead of one, and ~30 lines of near-duplicate motion props across
  them. Mitigated by `src/lib/motion.js` (ADR-0004).
- `App.jsx` grows from ~80 to roughly ~150 lines. Accepted: it is still a flat, scannable
  composition file with no logic. If it exceeds ~250 lines in a later iteration,
  extracting section components becomes worth revisiting — that would need a new ADR.

**Neutral**

- Nothing here forecloses (B) later. Because item components are pure and shells are
  uniform, a generic shell could be introduced in a future iteration without touching
  the item components.

## Alternatives considered

1. **Generic `<DataSection config={…} />`.** Rejected: the config object would need
   branches for timeline vs. grid, optional fields, badge rendering and the
   ongoing-state marker — reproducing the three components' logic inside a
   less-typeable, less-lintable, PropTypes-hostile data structure. It optimises for
   duplication that is mostly in the *shell* (already shared) rather than the *item*
   (genuinely different).
2. **Section-level components** (`<Experience />`, `<Achievements />`, `<Education />`)
   that own their own shell and import their own content module. Rejected: it splits
   "what is on the page and in what order" across four files, which directly works
   against T7, and it breaks the existing item-component convention for no gain.
3. **A single `Timeline` component reused by Experience and Education.** Rejected:
   Education is not chronologically narrative in the same way (2 flat cards, PRD §6.3
   explicitly describes cards, not a timeline), and forcing a shared component would
   push Education toward a visual it was not specified to have.
