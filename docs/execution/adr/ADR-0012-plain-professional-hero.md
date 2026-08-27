# ADR-0012 — The hero is a plain professional intro (supersedes ADR-0006)

- **Status:** Accepted · **Supersedes:** ADR-0006 · **Iteration:** 02 · **Deciders:** Ponta
- **Relates to:** PRD §I2.1, §I2.3 · plan T2 · architecture.md §11 (now historical), §15.1

## Context
ADR-0006 designed a non-blocking boot ticker, a looping typewriter classification line and a
4-tile telemetry strip whose counts were derived from the content modules — all machinery
built to satisfy PRD §5.6 and G1's 40-word hero budget. The user has now rejected exactly
that device: *"I don't want the bragging of achievements. I just want a simple intro."*

## Decision
The hero renders only: portrait, `<h1>John Rey Seguma</h1>`, a role line, an intro of **≤ 2
sentences containing no counts**, two real anchor CTAs (`View Work` → `#projects`,
`Contact` → `#contact`), and the socials row.

Removed: the boot ticker and its timer, the typewriter (and the `typewriter-effect` import),
the telemetry strip, the scroll cue, the porthole ring. `content/hero.js` shrinks to
`{ role, intro, ctas }` and imports no other content module.

## Consequences
- **+** Time-to-legible is first paint in both motion modes; ADR-0006's timing machinery and
  architecture §11's word-budget table become moot (§11 is retained as a historical record).
- **+** PRD D12/D13/D16 (boot copy, reduced-motion typewriter substitute, word-count rule)
  lose their rendering surface. The reduced-motion **mechanism** — ADR-0007's `MotionConfig`
  + `useReducedMotion` + `lib/motion.js` — is untouched and still binding.
- **−** The `<h1>` is undecorated; "creative" must now come from layout and interaction,
  which is where T3/T4/T5 put it.
- **−** The derived-count safeguard is gone — but so are the numbers it protected, and no
  iteration-02 criterion asserts a count on screen.
