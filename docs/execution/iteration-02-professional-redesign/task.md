# Iteration 02 — Professional Redesign · Task Breakdown

**Owner:** Ponta · **Input:** `plan.md` T1–T10, `PRD.md` §I2.1–I2.5 · **Design:** `architecture.md` §15, ADR-0009…0012

Binding constraints: no new npm dependency · PropTypes on every prop-taking component · every
`public/` asset via `` `${import.meta.env.BASE_URL}…` `` · one stylesheet (`src/App.css`) · one
`h1` · `lib/motion.js` exports unchanged. Read `architecture.md` §15.4 before writing any toggle.

Do the tasks in order — 01–03 are foundational and 04+ assume the new tokens exist.

| # | Ticket | Scope (one line) | Files | Done when |
|---|---|---|---|---|
| 01 | T1 | Delete the space chrome: remove both components, their imports, and every `starfield`/`flight-path` CSS block. | DELETE `src/components/Starfield.jsx`, `src/components/FlightPath.jsx`; MODIFY `src/App.jsx` | No `<canvas>` and no scroll-rail element in the DOM at any width (T1 AC1). |
| 02 | T1 | Rewrite `App.css` from scratch on ADR-0009's `:root` token set (§15.3 table), block order mirroring page order, media queries inside their block, breakpoints 480/640/768/1024/1280 only. | REWRITE `src/App.css` | `:root` contains exactly the §15.3 tokens; no space block name and no raw hex outside `:root` survives (T1 AC4). |
| 03 | T1 | Reshape the registry to `{ id, navLabel, eyebrow, title }` with PRD §I2.2 copy; rewrite `Heading` to props `{ eyebrow, title }` rendering a plain `<h2>` (no `<`…`/>`); update every call site. | REWRITE `src/content/sections.js`, `src/components/Heading.jsx`; MODIFY `src/App.jsx` | Eyebrows/headings read exactly as PRD §I2.2 and no heading is bracket-wrapped (T1 AC3). |
| 04 | T1 | Purge space wording from remaining content/JSX: `information.userData.firstName/lastName` de-bracketed to `John Rey` / `Seguma`. | MODIFY `src/content/information.js`; sweep `src/**` | Case-insensitive search of rendered text finds none of the 10 banned words in T1 AC2. |
| 05 | T2 | Shrink `content/hero.js` to `{ role, intro, ctas }` — no imports of other content modules, no counts, intro ≤ 2 sentences. | REWRITE `src/content/hero.js` | `hero.js` has zero `import` statements and no digit in `intro` (T2 AC2). |
| 06 | T2 | Rewrite `Hero`: portrait, `<h1>John Rey Seguma</h1>`, role line, intro, 2 anchor CTAs, socials row. Delete boot timer, `Typewriter` import, telemetry, scroll cue, porthole ring. | REWRITE `src/components/Hero.jsx` | Hero renders the 6 elements, nothing types or loops, and both CTAs scroll by mouse and by `Enter` (T2 AC1/AC3/AC4). |
| 07 | T3 | Add `id` (slug) and `tier: 1\|2` to all 6 projects — tier 1 = ResilientLink, Smart Online Parking System, Hotel Management System; tier 2 = the rest. Keep every existing fact verbatim. | MODIFY `src/content/projects.js` | Exactly 3 records have `tier: 1`; every record has a unique `id`. |
| 08 | T3 | New `ProjectFeature`: alternating (odd/even) full-width feature row; `<button type="button" aria-expanded aria-controls>` toggles an `AnimatePresence` panel with the screenshot + full description + stack + GitHub link. | CREATE `src/components/ProjectFeature.jsx` | The panel opens/closes by click and by `Enter`/`Space`, and `aria-expanded` tracks it (T3 AC3). |
| 09 | T3 | Rewrite `ProjectCard` as the compact tier-2 card (thumbnail, name, one-line description, stack chips, repo link). | REWRITE `src/components/ProjectCard.jsx` | At ≥ 1024 px a tier-1 row is measurably wider and taller than a tier-2 card, and the 6 are not a uniform grid (T3 AC1/AC2). |
| 10 | T3 | Wire Work: `App.jsx` splits `projects` by `tier`, renders features then the tier-2 grid; verify all 6 images and all 6 repo links. | MODIFY `src/App.jsx` | All 6 images load with no 404 in Network and every repo link opens in a new tab with `rel="noopener noreferrer"` (T3 AC4). |
| 11 | T4 | Add `category` to all 26 skills and a named export `categories` (tab order): `Frontend` (8) · `Mobile` (2) · `Languages & Backend` (6) · `Data` (4) · `Cloud & DevOps` (3) · `Tooling` (3). Labels stay byte-identical. | MODIFY `src/content/skills.js` | Categories sum to 26 and no `label` string changed (T4 AC2). |
| 12 | T4 | New `TabFilter` primitive per ADR-0010: `role="tablist"`, roving `tabindex`, `aria-selected`, `ArrowLeft/Right/Home/End`; presentational only. | CREATE `src/components/TabFilter.jsx` | Arrow keys move the active tab and only the active tab is in the tab order. |
| 13 | T4 | New `SkillsBoard` controller: holds the active category (`All` + the 6), renders `TabFilter` + the filtered tile grid, records arrive as props. | CREATE `src/components/SkillsBoard.jsx`; MODIFY `src/App.jsx` | Selecting a tab changes which tiles are visible, by mouse and by keyboard; ≥ 4 named categories are visible (T4 AC1/AC4). |
| 14 | T4 | Rewrite `Skill` as a chip on the new tokens; props stay `{ file, label }`; `alt` equals `label`. | REWRITE `src/components/Skill.jsx` | Every icon loads and each `alt` matches its label exactly (T4 AC3). |
| 15 | T5 | Add `images: string[]` (PRD §I2.4 mapping, verbatim filenames) and `video: null` to all 9 achievement records; keep authored order and casing. | MODIFY `src/content/achievements.js` | All 9 have ≥ 1 image; every filename exists in `public/awards/`. |
| 16 | T5 | New `Lightbox` primitive per ADR-0010: `{ open, title, images, index, onIndex, onClose, children }`; `role="dialog" aria-modal="true"`, visible close, `Esc` + backdrop close, focus trap, focus return, body-scroll lock, prev/next only when `images.length > 1`. | CREATE `src/components/Lightbox.jsx` | Overlay closes by control and by `Esc`, focus returns to the opener, and the page behind does not scroll while open (T5 AC4). |
| 17 | T5 | Rewrite `AchievementCard` as a `<button>`-triggered thumbnail card (award as `h3`, category, event, image count when > 1). | REWRITE `src/components/AchievementCard.jsx` | Each of the 9 shows its mapped thumbnail (T5 AC2). |
| 18 | T5 | New `AwardsWall` controller: award grid + open-record and image-index state, composes `Lightbox`. | CREATE `src/components/AwardsWall.jsx`; MODIFY `src/App.jsx` | Clicking a record opens the overlay and multi-image records step through every mapped image (T5 AC3). |
| 19 | T5 | Nav/heading for the section: `Recognition` / `Competitions & Research` / `Tech Events & Awards`. | MODIFY `src/content/sections.js` | The word "Academic" appears nowhere in the section (T5 AC1). |
| 20 | T6 | Give `kabataan-inyovator-2019` a `video` object `{ url: "https://www.facebook.com/share/v/19N5bPPYJk/", poster: "kabataan_inyovator.jpg", label: "Watch on Facebook", embed: true }`. No other record gets one. | MODIFY `src/content/achievements.js` | Exactly one record has a non-null `video` (T6 AC4). |
| 21 | T6 | New `FacebookEmbed` per ADR-0011 / §15.5: poster always in the DOM, iframe only when `embed === true` with `encodeURIComponent`'d `href`, always-visible `target="_blank" rel="noopener noreferrer"` link. Render it into `Lightbox`'s `children` slot for that record only. | CREATE `src/components/FacebookEmbed.jsx`; MODIFY `src/components/AwardsWall.jsx` | The record shows a video area plus the visible Facebook link (T6 AC1/AC2). |
| 22 | T6 | **Observation step, not a code step:** open the record in `npm run dev`; if the iframe does not play the video, set `embed: false`. Record what was seen in `execution-log.md` either way. | MODIFY `src/content/achievements.js` (flag only) | The area shows a playing video *or* poster + link — never a blank box or an error frame (T6 AC3). |
| 23 | T7 | Rewrite `ExperienceEntry` as a timeline entry: company `h3`, title, `Full-Time`/`Internship` badge, `MM/YYYY – Present` range (en dash, not uppercased), ongoing marker, and `<button aria-expanded>` revealing the highlights list. | REWRITE `src/components/ExperienceEntry.jsx` | Both roles render all four fields, highlights toggle on click and `Enter`/`Space`, and no `PRESENT` in caps remains (T7 AC1/AC2/AC3). |
| 24 | T8 | Rewrite `EducationCard` on the new tokens (institution `h3`, program, date range) with a hover **and** `:focus-within` reveal; keep Education immediately above Contact in `App.jsx`. | REWRITE `src/components/EducationCard.jsx`; MODIFY `src/App.jsx` | 2 entries render and Education is the last content section before Contact (T8 AC1). |
| 25 | T8 | Rewrite `ContactForm`: real `name` / `email` / `message` fields with `<label>`s, submit-time + blur-after-submit validation, per-field `<p role="alert">` messages tied by `aria-describedby`; valid submit composes a `mailto:` and shows a neutral status — **no "message sent" string**. Keep the direct email/phone/location channels and socials. | REWRITE `src/components/ContactForm.jsx` | Empty submit shows a visible per-field message, a malformed email is rejected visibly, and at least one direct channel is clickable (T8 AC2/AC3). |
| 26 | T9 | Modify `Navbar`: `site-nav` classes, labels from the reshaped registry, drop the `ONLINE` pulse/HUD chrome, mobile menu sized for 7 entries and closing on selection; keep the §10 deterministic scroll-spy. | MODIFY `src/components/Navbar.jsx` | Nav reads About · Work · Skills · Experience · Recognition · Education · Contact; each entry scrolls and the in-view entry highlights; at 375 px all 7 appear and the menu closes on selection (T9 AC1/AC2/AC3). |
| 27 | T9 | Rewrite `Footer` with neutral copy — no space wording, no `//` chrome; `rel="noopener noreferrer"` on any external link. | REWRITE `src/components/Footer.jsx` | Footer contains no space wording and no `//` code chrome (T9 AC4). |
| 28 | T10 | Retune `lib/motion.js` variant *values* only (drop `rotateX`, `blur()`, `scale`; opacity + small `y`). Exports, signatures and reduced-motion semantics unchanged. | MODIFY `src/lib/motion.js` | Every existing import site still compiles untouched. |
| 29 | T10 | Reduced-motion pass: confirm `<MotionConfig reducedMotion="user">` still wraps the tree, every new panel/overlay `AnimatePresence` is bypassed when `useReducedMotion()` is true, and no looping animation exists anywhere. | MODIFY `src/App.jsx` + the components from 08/13/16/23 | With `prefers-reduced-motion: reduce` emulated and a hard refresh: nothing loops and all content is readable at first paint (T10 AC3). |
| 30 | T10 | Responsive + a11y sweep at 375 / 414 / 768 / 1024 / 1280 / 1440 px. | MODIFY `src/App.css` as needed | No horizontal scrollbar, no clipped text, exactly one `h1`, every section has an `h2`, all interactive elements `Tab`-reachable in visual order with a visible focus ring (T10 AC1/AC2). |

## Gates (run last, in this order — none may be skipped or reported without output)

| # | Gate | Pass condition |
|---|---|---|
| G1 | `npm run lint` | exit 0 at `--max-warnings 0` |
| G2 | `npm run build` | exit 0 |
| G3 | `npm run dev` — app runs and **every** section renders | About, Work, Skills, Experience, Recognition, Education, Contact all visible with real content; each section's interaction exercised once by mouse and once by keyboard |
| G4 | Console clean, dev **and** `npm run preview` of the production build | zero `error` entries and zero app-code warnings on load, on full scroll, and while opening/closing the lightbox (T10 AC4) |

Source-code inspection alone satisfies none of G1–G4 (architecture §12).

## Notes back to the plan

- **T8 / PRD §I2.3 — Education "interaction".** The 2 education records hold no data beyond
  institution, program and dates, so there is nothing to hide behind an expand. Task 24 gives it a
  hover + `:focus-within` reveal instead. Manufacturing copy to fill a panel would be fabrication
  (architecture §4); if the PO wants a real Education panel it needs new *facts* in the PRD first.
- **T6 AC3** is satisfiable only as ADR-0011 specifies — by a hand-set `embed` flag observed in the
  running app (task 22). Cross-origin iframes emit no failure signal, so a runtime
  "detect-and-fall-back" reading of AC3 is not implementable and must not be attempted.
- No other T1–T10 ticket is judged infeasible with this stack.
