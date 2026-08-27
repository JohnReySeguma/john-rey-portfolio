# ADR-0005 — `content/sections.js` as the single source of section order, anchors and nav

- **Status:** Accepted
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §6.1, §6.2, D7 · plan T6, T7 · architecture.md §5, §10

## Context

The page's section order exists in **two** places today, and they can silently disagree:

- `App.jsx` — the JSX order of `<section id="…">` elements, which determines scroll order,
  tab order, and what the user sees.
- `Navbar.jsx` — a module-private `const SECTIONS = [{ id, label }, …]`, which determines
  the nav links **and** the list of elements the `IntersectionObserver` observes.

With 4 sections this duplication was survivable. Iteration 01 takes it to 7 and adds two
tickets that are exactly about these lists staying correct: T6 (all 7 nav entries work,
scroll-spy highlights exactly one) and T7 (document order is exactly the PRD order,
every anchor resolves). Heading copy (eyebrow + the two bracketed words) is currently a
third set of literals, inline in `App.jsx`, that PRD §6.1 also specifies per section.

A section is therefore described by four facts that must agree: its anchor `id`, its
position, its nav label, and its heading copy.

## Decision

Create `src/content/sections.js` as the single source of truth for all four:

```js
const sections = [
  { id: "about",        navLabel: "About",    eyebrow: null,             firstWord: null,       secondWord: null },
  { id: "projects",     navLabel: "Missions", eyebrow: "mission log",    firstWord: "My",       secondWord: "Projects" },
  { id: "skills",       navLabel: "Systems",  eyebrow: "cargo hold",     firstWord: "Skills",   secondWord: "&Tools" },
  { id: "experience",   navLabel: "Service",  eyebrow: "service record", firstWord: "Work",     secondWord: "Experience" },
  { id: "achievements", navLabel: "Medals",   eyebrow: "commendations",  firstWord: "Academic", secondWord: "Achievements" },
  { id: "education",    navLabel: "Academy",  eyebrow: "training log",   firstWord: "My",       secondWord: "Education" },
  { id: "contact",      navLabel: "Transmit", eyebrow: "ground control", firstWord: "Contact",  secondWord: "Me" },
];
export default sections;
```

Contract:

- **Array order is page order.** Position in this array is the authority for both nav
  order and scroll-spy tie-breaking (architecture.md §10).
- `eyebrow` carries **no** `// ` prefix — `Heading` adds it.
- `Heading` joins `firstWord` + `secondWord` with no separator, so
  `"Work" + "Experience"` renders `<WorkExperience/>` as plan T2 AC1 requires.
- The `about` row has `null` heading fields because the hero owns an `h1`, not a
  `Heading`. Consumers must tolerate `null`.
- `Navbar.jsx` imports the registry, deletes its private `SECTIONS` const, and derives
  both its `<li>` list and its observer targets from it.
- `App.jsx` imports the registry and looks up heading props by `id`; the JSX order of its
  `<section>` elements must match the array order. Both live in one file, so a mismatch
  is visible in a single screen of code.
- Nav labels remain the single-word themed set fixed by PRD D7. This registry is **not**
  a licence to rename them.

The registry lives in `src/content/` rather than `src/lib/` because `navLabel`, `eyebrow`,
`firstWord` and `secondWord` are user-visible copy specified by PRD §6.1 — that is
content by the definition in architecture.md §4.

## Consequences

**Positive**

- Adding, removing or reordering a section becomes one array edit plus one JSX move,
  instead of four coordinated edits across two files.
- Scroll-spy can be made deterministic (pick the first intersecting id **in registry
  order**), which is what makes T6 AC3's "only one entry highlighted at a time" a
  property of the design rather than an accident of callback iteration order.
- PRD §6.1's table maps one-to-one onto the array — an auditor can diff it.
- Every anchor `id` used by the nav is guaranteed to be an id the page actually declares,
  because both come from the same list (T7 AC2).

**Negative / accepted costs**

- `App.jsx` gains a lookup step (`byId("projects").eyebrow`) instead of inline literals,
  which is marginally less immediately readable at the call site. Mitigated by a
  one-line local helper.
- The registry cannot itself enforce that `App.jsx`'s JSX order matches the array order;
  that remains a review-time check. Adding a runtime assertion was considered and
  rejected as over-engineering for a 7-item list in a static page.
- `Navbar.jsx` now depends on a content module. Acceptable — it is a chrome component,
  and `Hero`/`ContactForm` already import `content/socials` (architecture.md §3.1).

**Neutral**

- Nothing changes for QA: the observable behaviour is the same nav with 3 more entries.

## Alternatives considered

1. **Leave `SECTIONS` in `Navbar.jsx` and just add three rows.** Rejected: it keeps a
   duplicate list that T6 and T7 both depend on, and it leaves heading copy as a third
   uncoordinated set of literals in `App.jsx`.
2. **Derive the nav at runtime from the DOM** (`document.querySelectorAll('section[id]')`
   plus a `data-nav-label` attribute). Rejected: it makes nav order depend on hydration
   timing, cannot be read before mount, and turns a static list into an effect — more
   moving parts and more ways to render an empty nav.
3. **Put the registry in `App.jsx` and pass it to `Navbar` as a prop.** Rejected: it
   makes `Navbar`'s contract heavier (an array-of-shape prop to PropTypes-validate) for
   no benefit, since the registry is a module constant with no per-render variation.
4. **Split into two registries** — one for nav, one for headings. Rejected: that is the
   duplication this ADR removes, just relocated.
