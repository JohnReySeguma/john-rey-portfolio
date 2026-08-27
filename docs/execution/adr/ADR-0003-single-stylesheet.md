# ADR-0003 — Keep a single `App.css` with an enforced block structure

- **Status:** Accepted
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §4 (no new dependencies), §7.4 · plan T8, T9 · architecture.md §7

## Context

All styling lives in `src/App.css` — 738 lines, imported once from `App.jsx`. It uses
`:root` custom-property tokens, a BEM-ish naming scheme (`block__element`), and
`/* ---------- name ---------- */` banner comments to separate blocks.

Iteration 01 adds four new style surfaces (the `record` primitive, the Experience
timeline, the Achievements grid, the Education grid) plus substantial hero and navbar
changes — an estimated +350 to +420 lines, taking the file to roughly 1100–1150 lines.

Options weighed: keep one file; split into `src/styles/*.css` imported from `App.css`;
adopt CSS Modules (natively supported by Vite, so genuinely zero-dependency); adopt a
utility framework or CSS-in-JS.

Constraints in force: PRD §4 forbids Tailwind, any CSS-in-JS runtime, and any new
dependency. PRD §7.4 requires the existing `:root` tokens and the existing `.station`
rhythm. Plan T8 AC1/AC2 are verified by *sampling the rendered page*, not by reading
source, so the split question is invisible to QA and is purely a maintainability call.

## Decision

**`src/App.css` remains the only stylesheet in iteration 01.** No `src/styles/`
directory, no CSS Modules, no per-component `.css` files.

To keep a ~1150-line file navigable, three rules become binding:

1. **A table-of-contents comment block at the top of the file**, listing every banner
   block in file order, added as part of `task.md` task 8 (**T8-D2**) and reconciled in
   task 20 (**T8-D3**).
2. **Block order mirrors page order** (tokens → globals → background chrome → navbar →
   hero → station/heading → `record` primitive → projects → skills → experience →
   achievements → education → contact → mobile overrides → footer). New blocks are
   inserted in their page position, never appended to the bottom.
3. **Media queries live inside the block they modify**, so a block is one contiguous,
   self-contained region. The single pre-existing global
   `@media (max-width: 480px)` mobile-spacing block is grandfathered in place.

**Split trigger (recorded now, executed later):** when `App.css` exceeds ~1200 lines, or
when a second route/page is introduced, split into `src/styles/*.css` files imported at
the top of `App.css`. Doing so requires a new ADR superseding this one.

## Consequences

**Positive**

- Zero migration risk in an iteration that is already changing markup in six components.
  No class renames, no import rewiring, no chance of a rule silently losing its target.
- The cascade stays explicit and in one readable order — relevant because several new
  rules (e.g. `record` modifiers, the 480 px overrides) depend on source order.
- One file is the entire style surface for review and audit, which suits a
  screenshot-and-DevTools verification model.
- Honours the "no new dependencies, no new conventions" spirit of PRD §4 literally.

**Negative / accepted costs**

- ~1150 lines is objectively large; finding a rule depends on the ToC and banner
  discipline holding. Accepted, with the explicit split trigger above as the escape
  hatch.
- No build-time scope isolation: a careless generic selector can leak across sections.
  Mitigated by the strict `block__element` naming rule (architecture.md §7.2) and by the
  rule that no component may style another component's block.
- Merge conflicts concentrate in one file. Effectively a non-issue for a single-developer
  repository.

**Neutral**

- Nothing here blocks a later split; because naming is already namespaced per block, the
  split is a mechanical cut-and-paste when the trigger fires.

## Alternatives considered

1. **Split into `src/styles/{tokens,navbar,hero,station,record,projects,skills,
   experience,achievements,education,contact,footer}.css` now.** Genuinely attractive for
   long-term navigability and free of dependency cost. Rejected **for this iteration**
   because a full split means moving 738 existing lines while simultaneously rewriting
   the hero and navbar — a large diff with real regression risk and no acceptance
   criterion rewarding it. A *partial* split (new sections in new files, old styles left
   in `App.css`) was also rejected: two conventions coexisting is worse than either one
   alone, and it makes cascade order dependent on import order that is easy to get wrong.
2. **CSS Modules** (`Section.module.css`). Available with zero dependencies in Vite.
   Rejected: it requires renaming classes to camelCase-ish local names and threading a
   `styles` object through every component, which conflicts with the existing global BEM
   vocabulary that half the codebase already uses, and would leave the project
   permanently half-modular. Global tokens and the shared `record`/`station` primitives
   would have to live in a `:global` escape hatch anyway.
3. **Tailwind / a UI library.** Explicitly forbidden by PRD §4.
4. **CSS-in-JS (styled-components / emotion).** Explicitly forbidden by PRD §4, and adds
   a runtime cost against PRD §7.3.
