# Iteration 03 — creative pass (execution log)

North star: 3 projects, big uncropped images, no "View details", no experience highlight toggle,
React Native in Mobile, real creativity per section. No planning docs this round.

## Files
- **Deleted** `src/components/ProjectCard.jsx`; **rewritten** `src/App.css` (whole sheet),
  `src/App.jsx`, components `Hero` `Heading` `ProjectFeature` `ExperienceEntry` `Skill`
  `SkillsBoard` `TabFilter` `AchievementCard` `EducationCard` `Footer`, content `skills.js`
  `projects.js` `hero.js`; **edited** `AwardsWall.jsx` (`featured` first record), `ContactForm.jsx`
  (lead statement). No new deps, PropTypes intact, `public/` assets via `BASE_URL`, no DB scripts.

## Creative change per section
- **About** — mesh backdrop (blurred accent fields + dot grid), pulse status pill, huge gradient-clipped name, rotated offset portrait frame + role tag, pill CTAs, stack ticker marquee.
- **Heads** — ghost numeral 01–06 (derived), eyebrow chip, bigger title, gradient rule.
- **Work** — 3 projects; large uncropped shot on a gradient plate with glow, body card floating over the plate's reserved padding (alternating side), giant parallaxed numeral, all copy always visible.
- **Skills** — dot-textured panel, gradient active tab + category counts, live tally, icon-plate tiles with a gradient corner notch on hover.
- **Experience** — gradient spine, monogram tile, ringed marker (pulses on the current role), highlights always visible in a gradient-barred panel.
- **Recognition** — asymmetric wall (first record 2×2), gradient veil, trophy mark, hover/focus cue.
- **Education / Contact / Footer** — staggered cards with ghost end-year and gradient plate; gradient lead statement, dot-textured form panel, gradient submit; footer gradient rule + monogram.

## Deviations
- **D1** `:root` gains `--accent-2/-3` + gradient tokens, extending ADR-0009's single-accent rule — explicitly requested; colour rule holds (tokens or rgba() of a token's channels).
- **D2** Parallax drives the decorative numeral, not the screenshot, so no transform ever touches a project image (protects the no-crop requirement).
- **D3** `projects.js` trimmed to the 3 shown records (`tier`/`preview` dropped).
- **D4** `TabFilter` gained an aria-hidden `counts` prop; skills keyed by `label` since `react.svg` is now shared by React and React Native (no react-native asset exists).

## Gates (actual output)
- `npm run lint` → `LINT_EXIT=0`. `npm run build` → `BUILD_EXIT=0`, `✓ 360 modules transformed`, `built in 2.31s`, `index-uh08yTkv.css 33.38 kB`, `index-rFrR9XmB.js 289.20 kB`.
- Headless Edge/CDP, dev `:5310` **and** preview `:4310`, identical: 3 `.project`, `h1` 1, `h2` 6, 7 sections, `viewDetails false`, `view highlights false`, only remaining `aria-expanded` is the nav toggle, React Native tile `alt="React Native"` → `skills/react.svg`.
- Ratio proof (content box): 1600×774=2.06718 vs 1036×501=2.06722 (Δ0.00004) · 1919×967=1.98449 vs 1036×522=1.98450 (Δ0.00001) · 1600×900=1.77778 vs 1036×583=1.77778 (Δ0); `contain`, no `aspect-ratio`, 72 % of a 1440 viewport, never overlapped by the body card.
- Mouse+keyboard: Mobile tab → Flutter/React Native/Capacitor "3 shown"; ArrowRight → Languages & Backend (6), ArrowLeft → Frontend (8); lightbox `aria-modal=true`, focus on close, `1/3`→`2/3`, Esc returns focus to the opener, Enter opens; empty submit → 3 `role=alert`, bad email described-by, no "message sent"; 375 px nav opens 7 links, closes on pick, lands on Recognition (`top 72`); 25 tab stops each `outline 2px solid`.
- Lift stays on `translate`: skill/award/edu card `none → 0px -4px → none`, edu focus rule `scaleY(0)→matrix(1,0,0,1,0,0)`; project shot unchanged on hover (1038×503.16, `transform none`).
- 375/768/1024/1440: `hScroll false`, clipped content 0. Images 48/48 loaded, `broken []`. Console dev+preview: `errors []`, `warnings []`, `exceptions []`, `httpFailures []`.
- `prefers-reduced-motion: reduce`: sampled elements `opacity 1 / transform none` at first paint, `getAnimations()` **0** (5 when motion allowed: 3 ticker + 2 pulse-ring), ticker `animation-name none`, parallax not applied, 0 broken images, console clean.
