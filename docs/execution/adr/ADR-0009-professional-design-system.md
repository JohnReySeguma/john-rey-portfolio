# ADR-0009 — Replace the space theme with a light token-based design system; rewrite `App.css`

- **Status:** Accepted · **Iteration:** 02 · **Date:** 2026-08-27 · **Deciders:** Ponta
- **Relates to:** PRD §I2.1, §I2.3 · plan T1, T10 · architecture.md §15.3 · ADR-0003 (upheld)

## Context
The user rejected the space theme outright. It is not a skin: it lives in the token *names
and values* (`--void`, `--nebula`, `--thruster`), in the block vocabulary (`starfield`,
`hud-nav`, `mission-card`, `console`) and in per-block glow/scanline effects across ~1000
lines. Options: repoint token values and keep the blocks, or delete and re-author.

## Decision
**Rewrite `src/App.css` wholesale against a new `:root` token set.** Still one stylesheet —
ADR-0003 is upheld, not superseded. Token contract:

- surfaces `--bg` (white), `--surface`, `--surface-2`, `--border`
- ink `--ink` (body, ≥ 4.5:1), `--ink-2`, `--ink-3` (meta)
- exactly **one** accent: `--accent`, `--accent-soft`, `--accent-ink` (PRD §I2.3)
- `--r-sm/--r-md/--r-lg`, `--shadow-1/--shadow-2`
- 4px spacing scale `--s-1 … --s-8`; fluid type scale `--step--1 … --step-5` via `clamp()`
- two families only — `--font-sans` (UI/body) and `--font-display` (headings) — pulled by the
  existing Google Fonts `@import`. No mono family, no npm dependency.

Architecture §7.3's "no new custom properties, no new colour or font values" rule is retired
here. Every other §7.3 rule survives: no emoji, no fixed `px` container widths, media queries
inside their block, and a closed breakpoint list (now 480 / 640 / 768 / 1024 / 1280).

## Consequences
- **+** The theme is ~30 declarations; a palette change is a token edit, not a sweep.
- **+** Blocks die with their components, so no dead space-theme CSS is left behind.
- **−** Every component's classes change in one iteration: nothing is incrementally
  shippable and QA must re-verify all six responsive checkpoints. Accepted — the north star
  is a full redesign, and a re-skin would leave `mission-card`/`console` vocabulary on a page
  that no longer has missions.
- **−** Light-first only; no dark-mode toggle (out of scope, PRD §4 still holds).
