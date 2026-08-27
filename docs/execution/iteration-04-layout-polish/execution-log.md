# Iteration 04 — layout polish (execution log)

North star: kill the hero stack ticker · "Seguma" covered by the text below · projects look
dirty → creative but organised · tech stack not responsive · education not aligned, Notre Dame
bigger · all headers too large. No planning docs this round.

## Fixes
- **F1 ticker removed** — ticker markup (`Hero.jsx`), `hero.ticker[]` (`content/hero.js`), `.hero__ticker*` + `@keyframes ticker` (`App.css`). Hero rebalanced: bottom padding `3rem` → `clamp(3.5rem,2.5rem+3vw,5.5rem)` + `.hero::after` gradient hairline so the section still closes on a boundary.
- **F2 surname clip** — cause: `background-clip:text` paints only inside the box and `.hero__name` had `line-height:.95`, cutting the "g" descender onto the intro. Now `line-height:1.14` + `padding-bottom:.14em` on `.hero__name-line--accent`.
- **F3 Work reorganised** — `ProjectFeature.jsx` rewritten: one card, fixed order (index badge + kicker + title → whole screenshot → description → hairline footer, stack left / repo right). Dropped alternating sides, the body card floating over the plate, the giant parallaxed numeral (and `useScroll/useTransform`). Still 3 projects, `object-fit:contain`, no `aspect-ratio`, no toggles.
- **F4 Skills responsive** — `.tab-filter` `flex-wrap:wrap` at every width (was `nowrap` + `overflow-x:auto` below 1024, hiding categories on phones); grid `minmax(min(100%,6.75rem),1fr)` → 8.5rem @640 → 9.5rem @1024; board padding 1rem → 1.5rem @640 → 2rem @768.
- **F5 Education aligned** — removed the `:nth-child(even){margin-top:2rem}` stagger (it shortened card 2's stretched box, so card 1 read "bigger"); added `align-content:start` + 2-line `min-height` on `.edu-card__institution` so both program lines sit level.
- **F6 heading scale** — `--step-2..6` reduced; new `--ghost-lg/--ghost-sm` for numerals. @1440/@375: h1 128→**72** / 55.6→**40**; h2 80→**44** / 42.95→**28**; section numeral 128→**52** / 55.6→**30.4**; project h3 44→**29.28** / 28.4→**21.83**; edu h3 27.52→**23.2** / 21.48→**18.68**; edu ghost 96→**56** / 58.25→**36**.
- Files: `App.css`, `components/Hero.jsx`, `components/ProjectFeature.jsx`, `content/hero.js`.

## Deviations
- **D1** F3 also removed the project parallax (iteration 03 D2) — the layered decoration was the main source of the "dirty" read; no image is transformed either way.
- **D2** F6 pulled `--step-2/-3` globally, so timeline company (27.52→23.2 @1440), award titles and the contact lead came down too — same "headers too large" complaint.
- No DB/migrations/seed scripts exist (static SPA), so none were pending for QA.

## Gates (actual output)
- `npm run lint` → **LINT_EXIT=0**; `npm run build` → **BUILD_EXIT=0**, `✓ 360 modules transformed`, `built in 2.56s`, `index-LuTp2H1J.css 33.06 kB`, `index-xny1GZc2.js 282.04 kB`.
- Headless Edge/CDP, dev `:5410` **and** preview `:4410`, identical at 375/414/768/1024/1280/1440: 3 `.project`, `h1` 1, `h2` 6, 7 sections, `viewDetails false`, `view highlights false`, only `aria-expanded` is the nav toggle, React Native → `skills/react.svg`, Facebook link present.
- **Ticker gone**: `.hero__ticker` present:false, 0 ticker elements; `getAnimations()` holds only the 2 `pulse-ring:Infinity` rings — no marquee.
- **Surname ink** (canvas `actualBoundingBoxDescent` vs box): ink inside the painted box by 2.89/3.23/4.30/4.83/5.89/5.62 px and clear of `.hero__intro` by 26.89/27.23/28.30/28.83/29.89/29.62 px across the six widths (before: `line-height 52.82px` < `font-size 55.6px`).
- **Projects** content-box vs natural ratio: 1600×774 2.06718 vs 2.06722 · 1919×967 1.98449 vs 1.98453 · 1600×900 1.77778 vs 1.77778 @1440 (986 px, 69.3 % of viewport); same at every width; `contain`, `aspect-ratio auto`; head/body/media share left edge 201.5.
- **Skills**: `wrap`, `tabScroll 0`, 0 clipped tabs, 0 clipped labels; cols 2×135 @375, 2×154.5 @414, 4×138.75 @768, 5×159.8 @1024, 6×160.3 @1280/1440.
- **Education**: font size `18.675px` @375 … `23.2px` @1440 on both cards; @768+ identical `cardTop`, `cardH` (268.92/246.77/250.67), `instOffset`, `progOffset`.
- Mouse+keyboard: Mobile tab → Flutter/React Native/Capacitor "3 shown"; ArrowRight → Languages & Backend (6), ArrowLeft → Frontend (8), Home → All (27); lightbox `role=dialog aria-modal=true`, focus on close, `1 / 3`→`2 / 3`, Esc restores focus to `.award-card__open`, Enter reopens; empty submit → 3 `role=alert`, no send; bad email → `aria-invalid=true` + `contact-email-error`; 375 nav opens 7 links, closes on pick, `#achievements` lands `top 72` with images loaded (204 mid-load — pre-existing lazy-load shift); 30 tab stops all `2px solid` (only `BODY` none).
- All six widths: `hScroll false`, 48/48 images loaded, `broken 0`. Console dev+preview: `errors [] warnings [] exceptions [] httpFailures []`.
- `prefers-reduced-motion: reduce` (dev + preview, 375 & 1440): `getAnimations()` **0**; `.project/.skill-chip/.edu-card/.timeline__entry/.award-card/.hero__name` all `opacity 1 / transform none` at first paint; 0 broken images; console clean.

## Orchestrator follow-up — lazy-load anchor shift
- Cause: `.project__shot` had no intrinsic size, so lazy images reserved 0 height and
  anchors below Work landed short until they loaded.
- Fix: `imgWidth`/`imgHeight` added to the 3 records in `src/content/projects.js`, threaded
  through `ProjectFeature` as `width`/`height` attributes (PropTypes updated). CSS keeps
  `width:100%; height:auto; object-fit:contain`, so nothing is cropped or letterboxed.
- Verified (preview build, headless Edge/CDP, 1440x900): clicking `#achievements` with only
  11 of 48 images loaded lands at `top 72` (was 204). Rendered vs natural ratio unchanged:
  2.06722/2.06718, 1.98453/1.98449, 1.77778/1.77778. `broken []`, `errs []`, `hscroll false`,
  1 h1 / 6 h2 / 3 projects.
- Gates: `npm run lint` exit 0 (--max-warnings 0); `npm run build` exit 0, built in 2.41s.
