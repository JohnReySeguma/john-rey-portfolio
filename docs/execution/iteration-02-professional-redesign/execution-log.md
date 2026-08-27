# Iteration 02 — Execution Log (Masky)

## Pass 1 — tasks 01–14. (Tasks 15–30 were completed in pass 2 below; the
`INTERIM BLOCKS` region this pass left in `App.css` has since been deleted.)

No database in this project, so no DB/migration/seed scripts exist or were pending.

### Deleted
- `src/components/Starfield.jsx`, `src/components/FlightPath.jsx` (01)

### Rewritten
- `src/App.css` (02) — new `:root` on the §15.3 token set, block order = page order,
  breakpoints 480/640/768/1024/1280, Inter + Plus Jakarta Sans, one accent `#1d4ed8`.
- `src/content/sections.js` (03), `src/components/Heading.jsx` (03), `src/App.jsx` (01/03/10/13)
- `src/content/information.js` (04), `src/content/hero.js` (05), `src/components/Hero.jsx` (06)
- `src/content/projects.js` (07), `src/components/ProjectCard.jsx` (09)
- `src/content/skills.js` (11), `src/components/Skill.jsx` (14)

### Created
- `src/components/ProjectFeature.jsx` (08), `TabFilter.jsx` (12), `SkillsBoard.jsx` (13)

### Deviations (all deliberate, none silent)
1. **03** — the `achievements` registry entry already carries the PRD §I2.2 copy
   (Recognition / Competitions & Research / Tech Events & Awards), so task **19 is already
   satisfied at the registry level**.
2. **04** — `information.userData.img` `"/me.png"` → `"me.png"`. With `base: '/john-rey-portfolio/'`
   the leading slash produced `//me.png` (protocol-relative), breaking §6.
3. **06** — `Hero` props are `{ img, name }`, not `{ img, title }`. `userData.title` ("About Me")
   has no slot in ADR-0012's hero; `App.jsx` composes the name from firstName + lastName.
4. **09** — tier-2 cards render as a **compact horizontal row in a 2-column grid**, not a 3-up
   vertical grid. A 3-up vertical grid measured *taller* than the tier-1 rows, so T3 AC1 was
   false. Props dropped: `index`, `preview` (`preview` is `"#"` on all six).
5. **08** — the tier-1 row image is a teaser crop (`cover`); the panel holds the full uncropped
   screenshot. Contents of the panel are as specified (shot + full description + stack + repo).
6. **Outside the task list:** `public/skills/github.svg` and `public/socials/github.svg` had
   `fill="#ffffff"` and were invisible on the new light surface — changed to `#10131a`.

### Open questions (need Nala/Ponta)
- **T1 AC2 vs architecture §4.** The banned word "mission" is still on the page, from
  `achievements.js` → `category: "Mission Harvest Robotics Competition"` (2 records). That is the
  real name of the competition; deleting or renaming it would falsify a fact. **Not changed.**
- "transmission" in `ContactForm.jsx` and `Footer.jsx` also still trips AC2 — removed by tasks
  25/27 in the second pass.

### Verification (actual output)
- `npm run lint` → `LINT_EXIT=0` (eslint `--max-warnings 0`, no output).
- `npm run build` → `BUILD_EXIT=0`, `✓ 358 modules transformed`, `✓ built in 2.75s`,
  `dist/assets/index-Hijc3pR9.css 14.22 kB`, `dist/assets/index-K1Lhf8KF.js 270.94 kB`.
- `npm run dev` (`:5199`) and `npm run preview` (`:4201`) both driven in headless Edge over CDP,
  full-page scroll then interaction. Identical results in dev and in the production build:
  - console: `consoleErrors []`, `consoleWarnings []`, `runtimeExceptions []`, `httpFailures []`,
    `loadingFailed []`; 41 images, `brokenImages []`.
  - structure: `h1 ["John Rey Seguma"]` (exactly one), 6 `h2`, 6 `section[id]`, `canvas 0`,
    `skillChips 26`, `altsMatchLabels true`, `repoLinksNewTab 6`.
  - Work by mouse **and** by `Enter`: `aria-expanded` false→true→false→true, panel carries
    screenshot + 193-char description + 5 stack chips + repo link.
  - Skills by mouse (`Mobile` → 2 tiles), `ArrowRight` (`Languages & Backend` → 6 tiles),
    `Home` (`All` → 26 tiles); exactly 1 tab in the tab order.
  - Hero `Enter` on "View Work" scrolled to y=567 for `#projects` at 639 (scroll-margin 72).
  - T3 AC1 measured (w×h): 1024 `feature 913×347` vs `card 445×204`; 1280/1440
    `feature 1088×409` vs `card 532×206`. No horizontal overflow at 375/768/1024/1280/1440.

---

## Pass 2 — tasks 15–30 + gates G1–G4

No database in this project: no DB/migration/seed script exists or is pending.

### Created
- `src/components/Lightbox.jsx` (16) · `AwardsWall.jsx` (18) · `FacebookEmbed.jsx` (21)

### Rewritten
- `src/content/achievements.js` (15/20/22) — `images[]` per PRD §I2.4 + `video` on
  `kabataan-inyovator-2019` only. All 13 files in `public/awards/` are used, none missing.
- `src/components/AchievementCard.jsx` (17), `ExperienceEntry.jsx` (23), `EducationCard.jsx` (24),
  `ContactForm.jsx` (25), `Footer.jsx` (27), `Navbar.jsx` (26), `src/lib/motion.js` (28, values only)
- `src/App.css` — `INTERIM BLOCKS` region **deleted**; real `site-nav` (in page order, before
  `hero`) + `timeline` / `awards-wall` / `award-card` / `lightbox` / `fb-embed` / `edu-grid` /
  `edu-card` / `contact` / `contact-form` / `site-footer` blocks authored on the §15.3 tokens.
  1584 lines; breakpoints 640/768/1024 only; no raw hex outside `:root`.
- `src/App.jsx` — `AwardsWall` wired, list classes `service-log`→`timeline`, `academy-grid`→`edu-grid`.

### Task 22 — Facebook embed observation (done against the running app, `npm run dev`)
With `embed: true`, opening the Kabataan Inyovator record rendered the plugin iframe as a black
panel reading verbatim: **"Video Unavailable — This video may no longer exist, or you don't have
permission to view it. Learn more"** (HTTP 200 on `plugins/video.php`; screenshot taken). That is
the error frame T6 AC3 forbids, so per task 22 / ADR-0011 **`embed` is now `false`**. Re-observed:
the record shows the poster `awards/kabataan_inyovator.jpg` plus the visible
"Watch on Facebook" link (`target="_blank" rel="noopener noreferrer"`) — no iframe, no blank box.

### Deviations (all deliberate)
1. **17** — the award `<h3>` is not nested inside the card `<button>` (invalid HTML); the control
   is an overlay `<button>` covering the card. Whole card clickable, focus ring traces the card.
2. **17** — badge shows `N photos` / `Video` only; single-photo cards show no badge (less noise).
3. **18/16** — for the video record the poster **is** its only mapped image, so the stage below it
   would repeat the same photo. `AwardsWall` filters the poster out of `images`, and `Lightbox`
   renders the stage only when `images.length > 0`. T5 AC3 still holds: the mapped image is shown
   full width, by `FacebookEmbed`.
4. **16** — scroll lock is applied to `documentElement` **and** `body`; locking `body` alone did
   not stop the page scrolling (measured with a real wheel event).
5. **24** — `EducationCard` carries `tabIndex={0}` so the `:focus-within` reveal is keyboard
   reachable, per the §15.4 note (no jsx-a11y rule in the eslint config).
6. **27** — `Footer` asserts no external profile link (the old one pointed at a different GitHub
   account than `socials.js`); it shows the copyright line + a "Back to top" anchor.
7. **Outside the task list:** `.award-card__media img` is absolutely positioned — a portrait
   screenshot was stretching its card past the 4:3 frame.

### Open note (for Nala/Ponta, not blocking)
- `App.css` is 1584 lines, over ADR-0003's 1200-line split trigger, but task.md binds "one
  stylesheet". Left as one file; the split is a call for the architect.
- Part 1's open question stands: "Mission Harvest Robotics Competition" is a real competition name
  and is still on the page.

### Gates (actual output)
- **G1** `npm run lint` → `LINT_EXIT=0` (eslint `--max-warnings 0`, no output).
- **G2** `npm run build` → `BUILD_EXIT=0`, `✓ 361 modules transformed`, `✓ built in 3.26s`,
  `dist/assets/index-MhbuhYHG.css 23.70 kB`, `dist/assets/index-bUAI0doM.js 281.53 kB`.
- **G3** `npm run dev` (`127.0.0.1:5199`), headless Edge over CDP. All 7 sections render:
  `sectionIds [about, projects, skills, experience, achievements, education, contact]`,
  `h1 ["John Rey Seguma"]` (one), 6 `h2`, nav = About · Work · Skills · Experience · Recognition ·
  Education · Contact, 9 award cards, 2 timeline entries, 2 edu cards, `brokenImages []` of 50.
  Each section's interaction, mouse **and** keyboard:
  - Work — click `aria-expanded` false→true; `Enter` true→false.
  - Skills — click `Mobile` → 2 tiles; `ArrowRight` → `Languages & Backend` → 6 tiles; 1 tab stop.
  - Experience — click → expanded `true` + highlight text; `Space` → false; `Enter` → true.
  - Recognition — click opens `role=dialog aria-modal=true`, focus lands on close; next control
    stepped `araw_ng_parangal_2 (2/3) → _3 (3/3) → (1/3)`; real wheel event moved the page
    `4087 → 4087` (locked); `Esc` closes and focus returns to the opener; `Enter` on a card opens
    it (single-image record: 0 nav buttons); close control closes.
  - Education — `.edu-card__rule` `matrix(1,0,0,0,0,0)` → `matrix(1,0,0,1,0,0)` on focus,
    `:focus-within` matches.
  - Contact — empty submit → 3 `role="alert"` messages; `not-an-email` → visible message +
    `aria-describedby="contact-email-error"`; "message sent" string absent; `mailto:` channel live.
  - 375 px: hamburger opens all 7 entries in the viewport, closes on selection, scrolls to
    Recognition (`achievementsTop 72`) and highlights it.
- **G4** console clean in dev **and** in `npm run preview` of the production build
  (`127.0.0.1:4207`), on load, on full scroll and while opening/closing the lightbox — identical
  runs: `consoleErrors []`, `consoleWarnings []`, `runtimeExceptions []`, `httpFailures []`.
- **T10 AC1/AC2** at 375/414/768/1024/1280/1440: `horizontalScrollbar false`, `clipped 0`,
  `h1 1`, `h2 6`, every section has an `h2`, 14 Tab stops in visual order each with `outline 2px solid`.
- **T10 AC3** `prefers-reduced-motion: reduce` + hard refresh: every sampled element
  `opacity 1 transform none` at first paint, `document.getAnimations() 0`, no infinite-iteration
  animation anywhere; lightbox and highlights panel appear at `opacity 1 transform none` within
  ~100 ms and close instantly.

---

## Fix pass — OBS-01 / OBS-02

- **OBS-01** (`src/App.css` only): framer-motion's inline `transform` beat the stylesheet, so the lift now uses the independent **`translate`** property (`translate: 0 -4px`) on `.project-card:hover`, `.award-card:hover`, `.edu-card:hover`/`:focus-within`, `translate` added to each block's `transition`, plus a per-block `@media (prefers-reduced-motion: reduce) { translate: none }` guard.
- Tried and reverted: framer-motion `whileHover`/`whileFocus` — it lifted but `.award-card`/`.edu-card` stayed lifted after pointer-leave (`matrix(1,0,0,1,0,-4)` still set 2.5 s later). Components are untouched.
- **OBS-02** resized via Windows `System.Drawing` (no npm dep). Originals in `assets-original/`:
  `me.png` 7,861,327 → **337,929 B** (3601² → 512²) · `ResilientLink.png` 2,162,155 → 624,442 (→1600×774) · `hotel-system.png` 1,629,090 → `hotel-system.jpg` **211,951** (→1600×900 q85) · `approval-system.png` 1,056,156 → 292,762. Total 12,708,728 → 1,467,084 B (−88.5 %).
- `public/awards/` (13) checked — none multi-megabyte (largest 825,689 B); `FocusFlow.png` 672,287 and `parking-system.png` 745,039 also < 1 MB. All left untouched.
- **Deviation 1:** originals kept in `assets-original/`, not `public/me-original.png` — `public/` ships verbatim into `dist/`, which would re-add the 12 MB the fix removes.
- **Deviation 2:** `hotel-system` is photographic; a 1600 px PNG was *larger* (1,855,187 B), so it was re-encoded as JPEG and `src/content/projects.js` updated. **Candy:** `qa/smoke.postman_collection.json` hardcodes `projects/hotel-system.png` — refresh that one URL to `.jpg`.
- `npm run lint` → `LINT_EXIT=0`; `npm run build` → `BUILD_EXIT=0`, `✓ 361 modules transformed`, `✓ built in 2.75s`, `index-JthTAqHT.css 23.91 kB`, `index-pfDhfEo5.js 281.53 kB`.
- Real CDP mouse hover, dev `:5411` **and** preview `:4411`, identical: `translate none → 0px -4px → none`; `rect.top` award `264.98 → 260.98 → 264.98`, project `346.05 → 342.05 → 346.05`, edu `361.27 → 357.27 → 361.27` (−4 px, released on leave); shadow set only while hovered.
- Keyboard focus `.edu-card`: top `361.27 → 357.27`, rule `matrix(1,0,0,0,0,0) → matrix(1,0,0,1,0,0)`.
- `prefers-reduced-motion: reduce` (set before navigate), dev and preview: `translate none → none`, **lift 0 px** on all three and on focus; shadow/border and rule reveal still respond.
- 50 images, `broken []`; hero `me.png` natural 512×512 / rendered 256×256, DPR-2 screenshot sharp and undistorted; `hotel-system.jpg` 1600×900 renders. Feature panel `aria-expanded true`, lightbox opens `aria-modal=true` focus `lightbox__close`, `Esc` closes.
- Console dev + preview: `errors []`, `exceptions []`, `loadingFailed []`, `http4xx []`; preview `warnings []` (dev-only framer-motion reduced-motion notice under emulation).
