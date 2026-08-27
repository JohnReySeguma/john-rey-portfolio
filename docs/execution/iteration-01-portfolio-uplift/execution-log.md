# Iteration 01 — Portfolio Uplift · Execution Log

**Owner:** Masky (Developer)
**Iteration folder:** `docs/execution/iteration-01-portfolio-uplift/`
**Task source:** `task.md` (tasks 1–22, `T5-D1` … `V-D1`)
**Ticket source:** `plan.md` (T1–T10)
**Date:** 2026-08-27
**Status:** ACT phase complete. **2 acceptance criteria FAIL** (T7 AC2 and its per-section
restatements), **1 criterion passes only under the PRD's own word-counting rule** (T1 AC6),
**3 disclosures** that need a PO/architect ruling. Everything else passes with recorded
evidence. Nothing has been softened or omitted.

---

## 0. How this iteration was verified

There is no test runner in this repository and no ticket adds one, so per `task.md` §22 and
`architecture.md` §12 "verified" means: `npm run lint` exit 0, `npm run build` exit 0, and
browser checks against the **real running app** (`npm run dev`).

**Browser used:** Google Chrome 151.0.7922.175 (`HeadlessChrome/151.0.0.0`), driven over the
Chrome DevTools Protocol from a dependency-free Node 24 script (`WebSocket` + `fetch` are
built in — **no npm dependency was added to the project** for this; the driver lives in the
session scratchpad, not in the repo). Everything reported below was read out of that live
page: real computed styles, real bounding boxes, real `document.documentElement.scrollWidth`,
real `Runtime.consoleAPICalled` / `Network.responseReceived` events, real screenshots, and
real painted pixels (screenshots were re-injected into the page and sampled through a canvas
to measure contrast against the actually-composited background).

**Honest limitation — no video files.** `task.md` asks for "screen recordings" in several
places (D13.12, D13.16, D18.2, D20.2, T1 AC17). I cannot produce a video file in this
environment. I substituted **timestamped multi-sample polling** — the page state was read
every 40–1000 ms over the relevant window and every sample is recorded below — plus
screenshots. For "nothing is animating for 10 s" this is stronger evidence than a video (11
samples over 10.1 s with identical values, rather than a human watching); for "the marker
travels the full track" it is 5 sampled scroll positions with the measured
`offset-distance` at each, plus 3 rail screenshots. Where a criterion's *only* specified
evidence was a recording, I say so explicitly in the traceability table.

**Screenshot/evidence artifacts** (session-temporary scratchpad, absolute paths):
`C:\Users\User\AppData\Local\Temp\claude\c--dev-Portfolio-john-rey-portfolio\74dcc64e-f876-4ba4-a880-597649dd2141\scratchpad\shots\`
containing `full-{375,414,768,1024,1280,1440}.png`, `hero-1440.png`, `hero-375.png`,
`skills-1440.png`, `skills-375.png`, `experience-1440.png`, `achievements-1440.png`,
`education-1440.png`, `marker-1440-mid.png`, `rail-1440-{top,mid,bottom}.png`,
`telemetry-status-tile.png`, `experience-badge.png`, `mobile-menu-375.png`, `nav-900.png`,
`reduced-hero-t0.png`, `hover-{projectCard,experience,achievement,education,skillTile}.png`.
Raw measurement JSON: `v1.json` … `v10.json` in the same folder. These are in a temp
directory, not the repo — QA re-verifies against the running app anyway.

### Database scripts — genuine absence, not a skipped step

**This project has no database, no ORM, no migrations, no seed data and no backend.**
`architecture.md` §1: "No backend, no API, no database, no router, no auth." There is
therefore **no DDL/DML script, migration or seed script to execute** for this iteration, and
none is pending. The only runtime setup QA needs is `npm install` (already present) and
`npm run dev`. I started the dev server and exercised the real page myself before writing
this log — the app boots and renders (evidence throughout §3).

---

## 1. Real command output (verbatim)

Both commands were run from the repo root, `C:\dev\Portfolio\john-rey-portfolio`, after the
final code change. ANSI colour escapes stripped; nothing else altered.

### `npm run lint`

```
> react-portfolio@0.0.0 lint
> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0

EXIT CODE: 0
```

### `npm run build`

```
> react-portfolio@0.0.0 build
> vite build

vite v5.0.5 building for production...
transforming...
✓ 358 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.53 kB │ gzip:   0.32 kB
dist/assets/index-23rkosAN.css   15.41 kB │ gzip:   3.69 kB
dist/assets/index-fMn0AGWL.js   309.11 kB │ gzip: 102.00 kB
✓ built in 2.76s
EXIT CODE: 0
```

### `npm run dev`

```
> react-portfolio@0.0.0 dev
> vite


  VITE v5.0.5  ready in 226 ms

  ➜  Local:   http://localhost:5173/john-rey-portfolio/
  ➜  Network: use --host to expose
```

All browser evidence below was collected against `http://localhost:5173/john-rey-portfolio/`
with `Network.setCacheDisabled: true` (the CDP equivalent of DevTools "Disable cache") and a
fresh navigation per check.

**Pre-existing lint failure discovered and fixed — see deviation D-1 in §4.** `npm run lint`
was **already red at `HEAD`** (commit `1bc1725`) before I touched anything, with 2 errors.

---

## 2. What I implemented, per task ID

### 1 · T5-D1 — `src/content/skills.js` → 26 `{ file, label }` records
Full rewrite. 26 objects in the exact order of task.md's table (frontend → mobile →
languages & backend → data → cloud/infra → tooling). No `category`/`url`/`level` field.
Matched task.md exactly. **D1.1** lint 0. **D1.2** the 26 rendered labels read back from the
page in render order: `React, Next.js, Angular, JavaScript, HTML5, CSS3, Tailwind CSS,
Bootstrap, Flutter, Capacitor, Java, C++, PHP, Node.js, Laravel, Django, MySQL, PostgreSQL,
MongoDB, Firebase, AWS, Docker, XAMPP, Git, GitHub, GitLab` — row-for-row identical to the
table. Evidence: `shots/skills-1440.png`, `v10.json.skillPairs`.

### 2 · T2-D1 — `src/content/experience.js` (new)
Created. 2 records, `{ id, company, title, type, start, end, current, highlights }`, exact
values, `Full-Time` with capital `T`, `end: "Present"`. Matched task.md exactly.
**D2.1** lint 0. **D2.2** in the running app the `#experience` subtree contains `Present`
(DOM text, 1 occurrence) and **0** occurrences of the word `now` (whole-word,
case-insensitive). Note: `.record__meta` applies `text-transform: uppercase`, so the *painted*
glyphs read `08/2025 – PRESENT` — see disclosure **X-2** in §5.

### 3 · T3-D1 — `src/content/achievements.js` (new)
Created. 9 records in fixed display order, `category: null` on idx 0. Spellings copied
character-for-character. Matched task.md exactly. **D3.1** lint 0. **D3.2** measured on the
rendered page: `Kabataan Inyovator` = 1, `Kabataan Innovator` = 0, `rd th` = 0,
`3 - Programming` = 0, `15 PSITS` = 0, `Araw ng Parangal` = 1, `HACKFORGOV` = 1,
`Robo Fest` = 1, `Capture-the-flag` = 1.

### 4 · T4-D1 — `src/content/education.js` (new)
Created. 2 records, preposition "in" kept, no GPA/honors/coursework/location fields.
Matched task.md exactly. **D4.1** lint 0. **D4.2** the `#education` section's full rendered
text is exactly: `// TRAINING LOG` / `<MyEducation/>` / `2021 – 2025` /
`Notre Dame of Marbel University` / `Bachelor of Science in Information Technology` /
`2014 – 2021` / `Laguilayan National High School` /
`Information and Communications Technology` — no other prose. `GPA` = 0 matches,
`honors|honours|cum laude` = 0 matches page-wide.

### 5 · T7-D1 — `src/content/sections.js` (new)
Created. 7 records in page order, no `// ` prefix on eyebrows, `null`s on the `about` row.
Matched task.md exactly. **D5.1** lint 0. **D5.2** nav at 1440 px renders exactly
`About | Missions | Systems | Service | Medals | Academy | Transmit`, left to right.

### 6 · T1-D1 — `src/content/hero.js` (new)
Created. Single default-exported object. Imports `./projects`, `./achievements`, `./skills`
and derives 3 of 4 telemetry values from `.length` (numbers are **not** hardcoded).
`classificationStatic` uses MIDDLE DOT U+00B7 with one space either side; `scrollCue` uses
U+2193. Both are literal characters in the file, not escapes or HTML entities — verified by
reading the codepoints back out of the file (`0xB7`, `0x2193`). Matched task.md exactly.
**D6.1** lint 0. **D6.2** rendered telemetry: `6 projects shipped`, `9 academic awards`,
`26 tools & technologies`; counted on the same page: **6** `.mission-card`, **9**
`.record--commendation`, **26** `.module`. All six numbers agree.
**D6.3** `STATUS` renders `Full-Time @ Smartech Solutions PH`;
`shots/telemetry-status-tile.png` and `shots/experience-badge.png` are the two rendered
strings side by side — both `Full-Time`, capital `F`, hyphen, capital `T`. Page-wide
case-sensitive count: `Full-Time` = 2, `Full-time` = **0**.

### 7 · T8-D1 — `src/lib/motion.js` (new)
Created `src/lib/` with one JSX-free module exporting all 13 names in the task's contract
table (`viewportOnce`, `viewportHeading`, `viewportCard`, `viewportConsole`, `easeOut`,
`staggerContainer`, `staggerContainerTight`, `riseItem`, `cardRise`, `headingRise`,
`consoleRise`, `reveal`, `item`). `reveal(reduced=true)` returns `{}`;
`item(reduced=true)` returns `undefined`. Matched task.md exactly.
**D7.1** lint exits 0 with `--max-warnings 0` and no `react-refresh/only-export-components`
warning (all exports are lowercase-initial). **D7.2** build exits 0.

### 8 · T8-D2 — `App.css` table of contents + `record` primitive
Added the ToC comment block immediately after the `@import` line, and inserted the
`/* ---------- record (shared credential primitive) ---------- */` block between
`station / heading` and `mission cards (projects)`. All 10 element classes plus `.record`
and `.record:hover` exactly as specified (including `.record__award` and `.record__notes`).
No existing rule deleted in this task.
**D8.1/D8.2** this task is additive-only; the page rendered unchanged and the console stayed
clean. **D8.3** build exits 0.

### 9 · T5-D2 — `Skill.jsx` breaking prop change + call site + `.module` CSS  ⚠ done as one unit
- **9a** `Skill.jsx`: props are now `file` + `label` (PropTypes updated); the
  `skill.replace(/\.(svg|png)$/, "")` derivation is deleted — the component does zero string
  manipulation; inline variants replaced with `variants={item(reduced, riseItem)}`;
  `whileHover={{ y: -6, scale: 1.06 }}` kept.
- **9b** `App.jsx` call site: `key={skill.file} file={skill.file} label={skill.label}`, the
  `index` binding removed.
- **9c** `.module__label` lost `text-transform: uppercase` and gained `text-align: center`,
  `line-height: 1.3`, `max-width: 100%`, `overflow-wrap: anywhere`; `.module__img` is now a
  fixed `42 × 42` `object-fit: contain` box; `.module` gained `padding: 8px`.
- **Accepted visual change (as instructed):** tiles now rise without the previous
  `scale: 0.85 → 1` pop, so every item-level reveal in the app shares one variant.
- `nextjs.svg` does not appear anywhere in `src/` (grep: 0 hits).

**Done criteria:** D9.1 26 tiles counted on screen. D9.2/D9.3 judged on rendered glyphs in
`shots/skills-1440.png`: all 26 painted labels match the table; `Next.js`, `Node.js`,
`PostgreSQL`, `Tailwind CSS`, `JavaScript`, `MySQL`, `MongoDB`, `GitHub`, `GitLab`, `React`,
`Angular`, `Capacitor`, `Docker`, `Firebase`, `Laravel`, `Django`, `Flutter`, `Bootstrap`,
`Git`, `Java` all appear in mixed case; only `AWS`, `XAMPP`, `PHP`, `HTML5`, `CSS3`, `C++`
are all-caps (brand form). Computed `text-transform` on `.module__label` is `none`.
**Recorded as an expected visual diff to the 18 pre-existing tiles, not a regression**
(PRD D11). D9.4 hard reload, cache disabled: **26** requests under `/skills/`, all HTTP
**200**; **0** requests for `nextjs.svg`; **0** 404s page-wide (83 responses total).
D9.5 zero broken images (`img.complete && naturalWidth === 0` → 0 of 41 images).
D9.6 all 26 `alt` values equal their visible label (`label === alt` true for all 26,
including the 8 new tiles, `C++`, `PostgreSQL`, `Node.js`). D9.7 every tile footprint is
`130 × 100`, every logo box is `42 × 42`, 0 logos overflow their tile; at 375 px the grid
wraps to 13 rows with no horizontal scrollbar (`scrollWidth` 360 ≤ `innerWidth` 375).
D9.8 console: zero errors, zero React warnings, no PropTypes warning. D9.9 lint 0, build 0.

### 10 · T2-D2 — `ExperienceEntry.jsx` + `.service-log` CSS
Created the item component: root `motion.li.record.record--service` (+
`record--service--current` when `current`), DOM order meta → `h3` company → `p` title →
`span` badge → `ul.record__notes`. The meta joins `start`/`end` with a literal EN DASH
U+2013 (codepoint verified in the file) and wraps `end` in `.record__meta-live` when
`current`. No own `initial`/`whileInView`. CSS block inserted after `modules (skills)`:
`.service-log` grid with **no** `max-width` and no auto margins, the `::before` rail, the
`::after` node dot, the `--current` filled+glowing variant, `.record__meta-live`.
**Deviation D-2 (§4):** `whileHover={{ y: -4 }}` added to the component.
**Done criteria:** D10.1 `#experience` heading `<WorkExperience/>`, eyebrow `// service record`.
D10.2 exactly 2 entries. D10.3 entry 1 shows `Smartech Solutions Philippines Inc.` (h3),
`Junior Software Developer`, badge `Full-Time`, meta `08/2025 – Present`, bullet
`Develop and maintain mobile and web applications for various clients across different industries.`
D10.3b `shots/telemetry-status-tile.png` + `shots/experience-badge.png`: two
character-identical `Full-Time` strings; no lowercase `Full-time` anywhere (0 matches).
D10.4 entry 2 shows `LEADSolutions, Inc.`, `Full Stack Developer`, `Internship`,
`01/2025 – 05/2025`, `Developed an Accounting Online Approval System.`
D10.5 the badge is a pill with its own background `rgba(124,92,255,0.12)` and 1px border, on
its own line — `shots/experience-1440.png`. D10.6 same screenshot: entry 1 has a filled
glowing teal node + teal `PRESENT`; entry 2 has a hollow node + dim dates. D10.7 both company
names are `H3`. D10.8 at 375 px no horizontal scrollbar (360 ≤ 375) and
`Smartech Solutions Philippines Inc.` wraps (0 elements with `scrollWidth > clientWidth`).
D10.9 measured left content edges at 1440 px: `.mission-grid` **136.5**, `.mission-card`
**136.5**, `.module-grid` **136.5**, experience card **136.5**, achievement card **136.5**,
education card **136.5** → **0.0 px** spread (limit ~4 px). D10.10 hover parity: see task 21.
D10.11 lint 0.

### 11 · T3-D2 — `AchievementCard.jsx` + `.commendation-grid` CSS
Created: root `motion.li.record.record--commendation`, `h3.record__award` → conditional
`p.record__subtitle` (rendered **only** when `category` is truthy) → `p.record__note` for the
event (deliberately not `.record__meta`). CSS: single column base; `@media (min-width: 640px)`
2 columns **plus** `> li:last-child { grid-column: 1 / -1 }`; `@media (min-width: 1024px)`
3 columns **plus** the `grid-column: auto` reset. **Deviation D-2** applies.
**Done criteria:** D11.1 heading `<AcademicAchievements/>`, eyebrow `// commendations`.
D11.2 exactly 9. D11.3 read-back in rendered order (award | category | event):
1 `Best Student Research` | *(no element)* | `18th Araw ng Parangal`;
2 `Champion` | `Research Capstone Presentation` | `18th PSITS Regional Convention 2025`;
3 `Best Paper` | `Information and Computer Technologies Category` | `CEAC Research Forum 2025`;
4 `3rd Place` | `Programming Competition` | `15th PSITS Regional Competition`;
5 `2nd Place` | `Demo Pitching` | `NDMU Startup Hackathon 2024`;
6 `6th Place` | `HACKFORGOV` | `Capture-the-flag Competition 2023`;
7 `Champion` | `Mission Harvest Robotics Competition` | `National Robotics Competition 2020`;
8 `Champion` | `Mission Harvest Robotics Competition` | `Kabataan Inyovator 2019`;
9 `Champion` | `Line Tracing Competition` | `Robo Fest 2019`. All 9 awards are `H3`.
D11.4/D11.5 counts as in task 3 above. D11.6 regex `(19|20)\d\d` over card 1 and card 4
returns `null` (no year). D11.7 measured: award `20px` `rgb(255,177,94)` vs event `13px`
`rgb(154,154,194)` — larger **and** accent-coloured. D11.8 no accordion/hover-to-reveal;
all text present in the DOM at full opacity. D11.9 at 375 px no horizontal scrollbar and
`Information and Computer Technologies Category` wraps (no clipped element, 0 elements using
`text-overflow: ellipsis`). D11.10 grid geometry by checkpoint (measured row widths):
375 → 9 rows × 1 card (324 px); 414 → 9 × 1 (363); **768 → rows [343,343] ×4 then [705]**,
grid content width **705**, 9th card width **705**, 9th card right edge **729** = grid right
edge **729** (0 px difference — the card spans both columns); **1024 → 3 × 3**, 9th card
**307** = one column; **1280 → 3 × 3**, 9th card **371**; **1440 → 3 × 3**, 9th card **371**
(same as the cards above it). No half-width orphan at any checkpoint.
D11.11 card 1 contains **no** `.record__subtitle` element at all (`hasSubtitleEl: false`).
D11.12 hover parity: see task 21. D11.13 lint 0.

### 12 · T4-D2 — `EducationCard.jsx` + `.academy-grid` CSS
Created: root `motion.li.record.record--academy`, meta (EN DASH) → `h3.record__title` →
`p.record__subtitle`. Nothing else. CSS: single column, `@media (min-width: 760px)` 2
columns, left accent hairline `rgba(124,92,255,0.45)` + `padding-left: 26px`.
**Deviation D-2** applies.
**Done criteria:** D12.1 heading `<MyEducation/>`, eyebrow `// training log`. D12.2 exactly 2.
D12.3/D12.4 the four strings render as authored with `2021 – 2025` / `2014 – 2021`.
D12.5 DOM order is `about → projects → skills → experience → achievements → education →
contact`, and the only things below `#education` are `#contact` and `footer.deep-footer`.
D12.6 no GPA/honors/coursework text. D12.7 both institutions are `H3`. D12.8 375 px and
1440 px: no horizontal scrollbar, nothing clipped. D12.9 hover parity: task 21. D12.10 lint 0.

### 13 · T1-D2 — `Hero.jsx` rewrite + `information.js` + hero CSS  ⚠ done as one unit
- **13a** `information.js`: the entire `description` key (the ~90-word emoji bio) deleted.
  `img: "/me.png"` left untouched (PRD §11 DF2, deferred).
- **13b** `Hero.jsx` rewritten. Props are now `img` + `title` only. Deleted: `useMemo`,
  `splitIntoLogEntries`, `logEntries`, `bootLines`/`bootContainer`/`bootLine`,
  `dossierContainer`, `dossierLine` and all `hero__dossier*` markup (so the strings
  `crew file // personnel log` and the `01/02/03` markers no longer exist in the codebase).
  `BOOT_DURATION_MS = 900`; boot strip inside `<AnimatePresence>` gated on
  `!reduced && !bootDone`, rendering the single line `{hero.boot}`. `hero__content` is a
  `motion.div` with `{...reveal(reduced, staggerContainer)}` and is **never** opacity-gated.
  The classification line is a **mount-time conditional render** on `useReducedMotion()`:
  `<Typewriter>` with the three inline phrases when motion is allowed, else
  `<span className="hero__role-static">{hero.classificationStatic}</span>` — never both, and
  no CSS hiding anywhere. Telemetry `ul.telemetry` keyed by `label`; CTAs are real
  `<a href="#…">` anchors keyed by `href`; socials keep `target="_blank"` +
  `rel="noopener noreferrer"`; scroll cue keeps the bounce with motion on and omits
  `animate`/`transition` when reduced. Avatar `alt="John Rey Seguma"`.
- **13c** `App.jsx`: `<Hero img={…} title={…} />`, `description` prop removed.
- **13d** `App.css` hero block: dossier rules deleted; `.hero__boot` re-pointed to
  `top: 22px; transform: translateX(-50%)` + `pointer-events: none`; the infinite
  `animation: spin` moved off `.hero__porthole-ring` onto
  `.hero__porthole:hover .hero__porthole-ring`; new `.hero__role-static`, `.hero__mission`,
  `.telemetry`, `.telemetry__tile`, `.telemetry__label`, `.telemetry__value`,
  `.hero__actions`, `.hero__cta`, `.hero__cta--primary`, `.hero__cta--ghost` exactly as
  specified. No `outline: none` anywhere.
- **Implementation note (not a design change):** the porthole and the scroll cue carry their
  own `initial`/`animate` (the spring and the bounce, as the task's element table
  specifies) rather than also carrying `variants={item(...)}` — framer-motion ignores
  variant propagation for a child that defines its own `animate` object, so combining both
  would have left one of the two silently dead. Every other `hero__content` child carries
  `variants={item(reduced, riseItem)}`.

**Done criteria** (1440 px, hard reload, cache disabled):
D13.1 `crew file` = 0, `personnel log` = 0. D13.2 no `01`/`02`/`03` markers exist.
D13.3 `Hi, I’m Rey` = 0, `geeking out` = 0, `Let’s connect and create something awesome` = 0.
D13.4 no emoji in any hero string; ripgrep over `src/` for
`[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]` returns **no matches**, and an independent
Node scan for `\p{Extended_Pictographic}|\uFE0F` over every file in `src/` returns **0**
matches. `↓` U+2193 and `·` U+00B7 are present and are not reported as violations.
D13.5 the hero renders exactly
`Junior Software Developer building mobile and web systems for real-world clients.`
D13.6 word count — see disclosure **X-1** in §5 (39 by the PRD's counting rule, 41 by naive
whitespace tokenisation; 1 sentence either way).
D13.7 4 tiles: `STATUS → Full-Time @ Smartech Solutions PH`, `MISSIONS → 6 projects shipped`,
`COMMENDATIONS → 9 academic awards`, `SYSTEMS → 26 tools & technologies`.
D13.8 counted on the same page: 6 / 9 / 26.
D13.9 both CTAs visible; clicking `View Projects` lands at `scrollY 964` with the Projects
`h2` at viewport `top: 134` (visible); clicking `Contact Me` lands at `scrollY 5094` with the
contact console visible. Focusing `View Projects` shows outline `2px solid rgb(67,232,216)`
and pressing **Enter** navigates (`location.hash` becomes `#projects`, `scrollY 964`,
heading visible).
D13.10 motion on: avatar renders real artwork (0 broken images), `<JohnReySeguma/>` renders as
the page's only `h1`, and the typewriter was sampled every 250 ms for 22.5 s — all three
phrases were observed complete (`Junior Software Developer`, `Robotics Enthusiast`,
`Tech Innovator`) across 42 distinct intermediate frames, i.e. it types and cycles.
D13.11 4 social links, each `target="_blank"` + `rel="noopener noreferrer"`.
D13.12 **measured** boot timing: mission + all 4 telemetry tiles first satisfied
"opacity > 0.99, visible, in viewport" at **923 ms** after navigation start (in-page
`performance.now()`); the preceding sample at 855 ms already had opacity 0.987. Well inside
1.5 s. Sample trace: 597 ms op 0 → 672 ms 0.60 → 728 ms 0.84 → 790 ms 0.95 → 855 ms 0.987 →
**923 ms 0.998 (legible)** → 1039 ms 1.0. (`BOOT_DURATION_MS` was not cited as evidence.)
D13.13 reduced motion emulated **then** reloaded: from the earliest sample (399 ms) the
mission is `opacity: 1`, `transform: none`, **inline style attribute `null`** (i.e. framer
wrote nothing at all), and `.hero__boot` was never present in any of 24 samples over 1.5 s.
D13.14 375 px: `scrollWidth` 360 ≤ `innerWidth` 375, telemetry `grid-template-columns`
resolves to **2** columns (2 × 2 stack), 0 clipped elements — `shots/hero-375.png`.
D13.15 motion on, the hero's only looping effects are the typewriter and the scroll cue;
`.hero__porthole-ring` computed `animation-name` is `none` at rest (hover-only).
D13.16 reduced motion: the line reads
`CLASSIFICATION:` + `Junior Software Developer · Robotics Enthusiast · Tech Innovator`
(U+00B7 separators). Sampled 11 times over **10.1 s**: exactly **one** distinct value for
both the whole `.hero__role` text and `.hero__role-static` — not one character typed,
deleted or re-typed, and `.Typewriter` was never in the DOM (so there is no caret).
`Robotics Enthusiast` and `Tech Innovator` are both findable simultaneously. At 375 px the
line wraps onto 2 lines with no clipping and no horizontal scrollbar. With emulation off and
a reload: `.hero__role-static` absent, `.Typewriter` present and typing.
D13.17 `comm channels` present / `open comm channels` **0**; `descend ↓` present /
`scroll to descend` **0**.
D13.18 motion on: the boot band contained the single line `> uplink established` (one
distinct text value across all samples, rendered height 15 px = one line); across every
sample its rect **never intersected** the mission rect, the telemetry rect or the CTA rect
(3 × false); present from 597–1477 ms and gone by 1539 ms (it removes itself).
`establishing uplink`, `signal locked`, `decrypting crew manifest`, `welcome aboard` = 0 each.
With reduced motion it is never mounted.
D13.19 console in both motion modes: zero errors, zero React warnings (one framer-motion
dev-mode informational warning appears in reduced-motion mode only — disclosure **X-3**).
D13.20 lint 0, build 0.

### 14 · T7-D2 — `App.jsx`: 7 sections in registry order + `MotionConfig`
Rewrote the composition. `MotionConfig reducedMotion="user"` is now the outermost element
(replacing the bare fragment). Module-local `gridContainer` deleted. `byId` helper added and
every `Heading` reads `eyebrow`/`firstWord`/`secondWord` from the registry — no heading
literals remain in `App.jsx`. Section JSX order matches the registry array order exactly.
Containers: `div.mission-grid` (unchanged), `motion.div.module-grid` +
`staggerContainerTight`, `motion.ul.service-log` + `staggerContainer`,
`motion.ul.commendation-grid` + `staggerContainerTight`, `motion.ul.academy-grid` +
`staggerContainer`. All props passed as flat scalars; every key is a stable id
(`project.name`, `skill.file`, `role.id`, `achievement.id`, `entry.id`).
**Done criteria:** D14.1 DOM/scroll order verified:
`about → projects → skills → experience → achievements → education → contact` + footer.
D14.2 **FAILS — see F-1 in §5.** D14.3 tab order verified in visual order (see T7 AC3 row).
D14.4 Education is the last content section before Contact.
D14.5 measured at 1440 px: every `.station` has identical `padding: 110px/110px`, and the
gap from a section's last content element to the next section's heading is
**220 px / 220 px / 220 px / 220 px / 220 px** for Projects→Skills, Skills→Experience,
Experience→Achievements, Achievements→Education, Education→Contact → **0 px** variance
(limit ~8 px). D14.6 console clean (no missing-key, no PropTypes warnings). D14.7 lint 0,
build 0.

### 15 · T6-D1 — `Navbar.jsx` registry-driven links + deterministic scroll-spy
Deleted the module-private `SECTIONS`; imports `sections`. Links and observer targets both
derive from the registry (`navLabel` text, `#${id}` href). Scroll-spy rewritten to the
specified algorithm: a `useRef(new Set())` of intersecting ids, add/delete per entry, then
`active` = the **first registry id present in the set**; if the set is empty `active` is left
unchanged. Observer options unchanged, missing elements skipped, `[]` deps, `disconnect()`
on cleanup, no eslint-disable. Hamburger, `aria-label`, `aria-expanded`,
`onClick={() => setOpen(false)}`, blip and `ONLINE` block untouched.
**Done criteria:** D15.1 7 entries in registry order at 1440 px. D15.2 clicking each of the 7
in turn: every one scrolled so the target section's `top` was exactly `0` in the viewport with
its heading visible, and the matching nav entry became active. D15.3 with each section
centred in the viewport, `.is-active` count was **1** in all 7 cases and the active href
always matched the section occupying the viewport middle (`document.elementFromPoint` at the
centre). D15.4 `Tab` reaches all 7 in visual order, each with a `2px solid rgb(67,232,216)`
outline; `Enter` navigates. D15.5 console clean throughout.

### 16 · T6-D2 — `App.css` navbar 761–1100 px range + mobile menu height
`.hud-nav__menu.is-open` → `max-height: 70vh` + `overflow-y: auto` (transition kept on
`.hud-nav__menu`). New `@media (max-width: 1100px)` block inserted **before** the existing
760 px block (so the mobile rules still win below 760 px) hiding `.hud-nav__status` and
`.hud-nav__blip` and tightening padding/gaps/font-size exactly as specified. No breakpoint
other than 1100 introduced.
**Done criteria:** D16.1 measured at 768 / 900 / 1024 px: no horizontal scrollbar, menu right
edge inside the viewport, and no logo/menu collision (at 900 px: logo right 211, menu left
404 → no overlap; `ONLINE` and blips `display: none`; link font-size 12 px) —
`shots/nav-900.png`, `shots/full-768.png`, `shots/full-1024.png`.
D16.2 at 375 px the hamburger opens a menu with **all 7** entries
(`About…Transmit`), computed `max-height: 560px` (70vh of 800) with `overflow-y: auto`,
list height 238 px, and every link's rect fully inside the menu box (no clipping);
selecting `Academy` closed the menu (`is-open` removed, `max-height` back to `0px`) and
scrolled to Education (`top: 0`, visible) — `shots/mobile-menu-375.png`.
D16.3 at 1440 px `ONLINE` and the blips are still visible.
D16.4 `scrollWidth` ≤ `innerWidth`: 768 → **753 ≤ 768**; 900 → **885 ≤ 900**;
1024 → **1009 ≤ 1024**.

### 17 · T9-D1 — Responsive sweep
- **17a** `Heading.jsx`: `<wbr />` inserted between `{firstWord}` and the accent span (props,
  PropTypes and render contract unchanged). `.station-heading__title` font-size changed to
  `clamp(1.35rem, 5.6vw, 2.6rem)` and gained `overflow-wrap: anywhere`; the `2.6rem` maximum
  is unchanged.
- **17b** Confirmed wrap capability: `.record` (`overflow-wrap: anywhere` from task 8),
  `.telemetry__tile` (task 13), `.module__label` (task 9). No `text-overflow: ellipsis` and
  no new `white-space: nowrap` was added (the only `nowrap` inside a record is the specified
  `.record__badge`).
- **17c** Audited my own additions: no fixed `px` width on any container I added. The only
  fixed-width element remains the pre-existing `.module` (130 × 100).

**Done criteria:** D17.1/D17.2 measured in the live page at all six checkpoints
(`document.documentElement.scrollWidth` / `window.innerWidth`):

| width | scrollWidth | innerWidth | ≤ ? |
|---|---|---|---|
| 375 | **360** | 375 | yes |
| 414 | **399** | 414 | yes |
| 768 | **753** | 768 | yes |
| 1024 | **1009** | 1024 | yes |
| 1280 | **1265** | 1280 | yes |
| 1440 | **1425** | 1440 | yes |

(The 15 px difference at each stop is the classic scrollbar gutter.) At every checkpoint the
count of elements extending past the viewport edge was **0**, and the count of
`.record__title/.record__subtitle/.record__note/.module__label/.station-heading__title`
elements with `scrollWidth > clientWidth` (i.e. clipped) was **0**.
D17.3 at 375 px none of `Smartech Solutions Philippines Inc.`,
`Information and Computer Technologies Category`, `Notre Dame of Marbel University`,
`Laguilayan National High School` or the `<AcademicAchievements/>` heading is clipped,
ellipsised or overlapping (0 ellipsis users on the page).
D17.4 at 375 px the achievements heading renders at **21.6 px** on **2 lines**, and the
measured line boxes prove the break is at the word boundary the `<wbr />` provides:
`<` + `Academic` sit on line 1 (`top: 132`), `Achievements` + `/>` on line 2 (`top: 158`),
and the accent span has exactly **1** client rect (so `Achievements` itself is not split
mid-word).
D17.5 at 768 px the achievements grid is 2 columns and the skills grid is 7 rows of tiles;
at 1024 px 3 columns / 5 rows. No overflow, no single-column-with-huge-gaps.
D17.6 full-page screenshots captured for all six checkpoints (`shots/full-*.png`).

### 18 · T10-D1 — Reduced-motion sweep (`Heading`, `ProjectCard`, `ContactForm`)
All three now call `useReducedMotion()` and spread a single `reveal(...)`:
`Heading` → `reveal(reduced, headingRise, viewportHeading)`;
`ProjectCard` → `reveal(reduced, cardRise, viewportCard)` (keeps `whileHover={{ y: -8 }}`);
`ContactForm` → `reveal(reduced, consoleRise, viewportConsole)`. The inline
`initial`/`whileInView`/`viewport`/`transition` props are deleted from all three. The CSS
`@media (prefers-reduced-motion: reduce)` block was **not** touched. `Starfield.jsx` was
**not** modified. Grep for `whileInView` across `src/` returns hits **only** in
`src/lib/motion.js` (lines 54 and 59) — every framer-motion reveal in the app now routes
through the shared helpers.
**Done criteria** (reduced motion emulated, **then** hard reload):
D18.1 scrolling the entire page in 400 px steps, the count of
`.record/.module/.mission-card/.station-heading/.console` elements below full opacity or with
a non-identity transform was **0 at every step** — no entrance animation anywhere.
Before any scrolling at all, every below-fold group is already final:
`#experience .record--service` (2), `#achievements .record--commendation` (9),
`#education .record--academy` (2), `.module` (26), `.mission-card` (6), `.station-heading` (6),
`.console` (1) — each with `opacity: ["1"]`, `transform: ["none"]` and inline style
attribute `[null]`.
D18.2 10.1 s resting on the hero, 11 samples: `.hero__role` text — 1 distinct value;
scroll cue transform — 1 distinct value (`none`, inline `null`); porthole ring —
`animation-name: none`; nav `ONLINE` pulse — `animation-name: pulse` but
`animation-iteration-count: 1`, `animation-duration: 1e-06s` (flattened by the CSS media
block, i.e. not looping); project-card scanline — same, and its `top` stayed `168px` in every
sample; starfield canvas pixel hash — **1 distinct value (617899602)** across all 11 samples,
i.e. the field is frozen; typewriter never mounted. Nothing was animating.
D18.2b the scroll-through above found no element fading, sliding or scaling; the only thing
that changed was the scroll-linked rail (`offset-distance` progressed
0% → 2.99% → 8.32% → … → 73.93% → 100%).
D18.3 hero content visible immediately, no boot strip (D13.13).
D18.4 motion off (i.e. normal): headings still scale-and-unblur (`headingRise`), project
cards still rise with tilt (`cardRise`), the console still scales in (`consoleRise`), skill
tiles and records rise (`riseItem`) — confirmed from live opacity/transform traces during
scroll-in and the reveal-timing traces below.
D18.5 measured section reveal, from the instant scroll that brings the section into view to
**all** items at full opacity (opacity traces at ~50 ms resolution):
**Experience 411 ms** (2 items), **Achievements 555 ms** (9 items), **Education 400 ms**
(2 items) — all within the 600 ms budget.
D18.6 lint 0, build 0.

### 19 · T10-D2 — Link, alt and accessible-name integrity
`ProjectCard.jsx`: both `rel="noreferrer"` → `rel="noopener noreferrer"` (source + preview).
`Footer.jsx`: the GitHub link → `rel="noopener noreferrer"`. No `outline: none` added
anywhere.
**Done criteria:** D19.1 hard reload + full-page scroll + mobile menu open/close: console
shows only `[vite] connecting…`, `[vite] connected.` (debug) and React DevTools `info` —
**zero errors, zero React warnings**. D19.2 **83 responses, 0 non-2xx/3xx, 0 404s**:
`/skills/` 26 × 200, `/projects/` 6 × 200, `/socials/` 4 × 200, `me.png` 2 × 200, Google
Fonts 1 + 3 × 200. D19.3 zero broken images (0 of 41). D19.4 heading outline (rendered, in
document order): `H1 <JohnReySeguma/>` (the only `h1`) → `H2 <MyProjects/>` + 6 project `h3`
→ `H2 <Skills&Tools/>` → `H2 <WorkExperience/>` + 2 company `h3` →
`H2 <AcademicAchievements/>` + 9 award `h3` → `H2 <MyEducation/>` + 2 institution `h3` →
`H2 <ContactMe/>` + 1 console `h3`. D19.5 keyboard: at 1440 px `Tab` reaches logo → 7 nav
links → 2 hero CTAs → 4 hero socials → scroll cue → 6 project source links → contact mailto →
4 contact socials → footer link, in visual order with no backward jump and no trap; at 375 px:
logo → **hamburger** (`BUTTON[Toggle navigation]`) → 7 nav links → 2 CTAs → socials.
D19.6 every focused stop reported computed outline `2px solid rgb(67, 232, 216)` (33 stops
sampled at 1440 px, 12 at 375 px). D19.7 alt audit: 26/26 skill `alt` == label; 6/6 project
`alt` == project name; hero avatar `alt="John Rey Seguma"`; social links have
`aria-label` (`github`, `linkedin`, `instagram`, `facebook`). D19.8 contrast — see the T10
AC8 row. D19.9 all 15 `target="_blank"` links carry `rel="noopener noreferrer"`.

### 20 · T1-D3 — Scroll-rail marker: emoji → inline SVG on palette tokens
`FlightPath.jsx`: the 🚀 text node inside `motion.div.flight-path__ship` replaced with the
exact SVG from the task (`viewBox="0 0 18 18"`, `focusable="false"`, one
`.flight-path__ship-hull` path `M3 2 L16.5 9 L3 16 L6.5 9 Z`, one `.flight-path__ship-core`
circle at `4.6,9 r1.5`) — no `fill` attributes, no `aria-hidden` (the wrapper already has it).
`useScroll`/`useSpring`/`useTransform`, `PATH_D`, the two track paths and the
`offsetPath`/`offsetDistance`/`offsetRotate` style object are untouched. The stale word
"rocket" in the file's own header comment was updated to "marker" (comment only).
`App.css`: `.flight-path__ship` lost `font-size: 18px`, gained `width/height: 18px`, and its
glow token changed `--nebula` → `--thruster`; `position/top/left/transform-origin` kept. Added
`.flight-path__ship-svg` (display block, 100%/100%), `.flight-path__ship-hull`
(`fill: var(--thruster)`), `.flight-path__ship-core` (`fill: var(--nebula-2)`).
`.flight-path`, `__svg`, `__track`, `__trail` and the 900 px hide were not touched.
**Done criteria:** D20.1 at 1024 / 1280 / 1440 px the rail's computed `display` is `block`
and the marker is a flat two-tone teal/violet vector mark — `shots/marker-1440-mid.png` (12×
zoom, hero rail in frame) and `shots/rail-1440-{top,mid,bottom}.png`. No rocket emoji
anywhere. D20.2 the rail works: dotted track present, the glowing trail grows with scroll
(`stroke-dasharray` 0 → 0.25 → 0.5 → 0.75 → 1 of `pathLength`), and the marker travels the
**full** track — measured `offset-distance` **0% at scrollY 0** → 25% at 1288 → 50% at 2576 →
75% at 3864 → **100% at scrollY 5152 (max)**, with its y position inside the 900 px rail
moving −8 → 241 → 489 → 738 → 984 px. (Evidence is sampled positions + 3 screenshots, not a
video — see §0.) D20.3 `offset-rotate` computes to `auto 0deg`, so the mark noses along the
tangent; visible in `shots/marker-1440-mid.png`, where the hull points down-and-left through
a descending curve (at scroll 0 it points right/level). D20.4 measured fills:
hull `rgb(67, 232, 216)` = `#43e8d8` (`--thruster`), core `rgb(124, 92, 255)` = `#7c5cff`
(`--nebula-2`), glow `drop-shadow(rgb(67,232,216) 0 0 6px)`. No off-palette hue.
D20.5 at 375 / 414 / 768 px `.flight-path` computes `display: none` — hidden, not merely
off-screen. D20.6 **real grep output:**

```
$ rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]" src/
No matches found

$ node (Unicode property scan) -- \p{Extended_Pictographic} or U+FE0F, every file under src/
Extended_Pictographic / VS16 matches in src/: 0
↓ U+2193 present in: src\content\hero.js
· U+00B7 present in: src\content\hero.js
– U+2013 present in: src\components\EducationCard.jsx, src\components\ExperienceEntry.jsx
```

Zero emoji remain; the three permitted text glyphs are present and are not violations.
D20.7 with reduced motion emulated the rail still responds to scrolling (`offset-distance`
progressed through 12 distinct values during the scroll-through) and nothing about it is
timer-driven. D20.8 console clean. D20.9 lint 0, build 0.

### 21 · T8-D3 — Final visual-consistency pass + CSS ToC reconciliation
- **21a** Reconciled. The banner order in `App.css` now reads: `tokens` →
  `resets / globals / a11y` → `starfield` → `flight path` → `HUD navbar` → `hero` →
  `station / heading` → `record` → `mission cards (projects)` → `modules (skills)` →
  `service log (experience)` → `commendations (achievements)` → `academy (education)` →
  `console (contact)` → `mobile spacing` → `footer`, which matches the ToC exactly. **One
  discrepancy found and fixed:** the ToC listed a `resets / globals / a11y` block but the
  file had no banner for it, so the ToC would have been lying; I added the missing banner
  comment (comment-only change, no rules moved). No new ToC entry was needed for task 20,
  which added elements to the existing `flight path` block.
- **21b** Audited. The only `#` hex literals in `App.css` are the 8 in `:root` plus the
  pre-existing `.starfield-canvas` gradient (`#0d0f2b`, `#05040f`, both tokens' own values).
  Every declaration I added uses `var(--token)` or an `rgba()` of an existing token's
  channels (`rgba(67,232,216,0.15|0.28)`, `rgba(124,92,255,0.12|0.45)`,
  `rgba(255,177,94,0.35)`). Zero `font-family` declarations that are not `var(--font-…)`.
  The task-20 SVG carries no `fill` attribute; both fills live in `App.css` as
  `var(--thruster)` / `var(--nebula-2)`.
- **21c** Continuous-motion budget confirmed as tabled: Nav 1 (exempt), Hero 1 countable
  (typewriter) + exempt cue, Projects 1 effect type (scanline), Skills 0, the three new
  sections 0, Contact 0. Under reduced motion the hero drops to **0**.

**Done criteria:** D21.1 sampled computed colours in the three new sections are exclusively
`rgb(245,243,255)`, `rgb(154,154,194)`, `rgb(67,232,216)`, `rgb(255,177,94)`,
`rgba(18,20,48,0.55)`, `rgba(124,92,255,0.25)`, `rgba(124,92,255,0.12)` — all palette
values, all also present in Projects/Skills/Contact. No new hue.
D21.2 all six `.station-heading` blocks compute to the same three families and no fourth
family is loaded: exactly **1** font request page-wide (the pre-existing Google Fonts
`css2?family=Unbounded…Space+Grotesk…Share+Tech+Mono` stylesheet). Note the pre-existing
textless hamburger `<button>` and its 3 empty `<span>` bars compute to UA-default `Arial`;
they render no glyphs, so no text on the page is drawn in a fourth family. No element renders
in an OS emoji font (nothing on the page is an emoji).
D21.3 measured across Projects / Skills / Experience / Achievements / Education (and
Contact): title `Unbounded 41.6px rgb(245,243,255)`, accent `Unbounded 41.6px
rgb(255,110,168)`, eyebrow `Share Tech Mono 12px rgb(255,177,94) letter-spacing 3px
uppercase`, heading `margin-bottom: 60px` — **identical in all six**.
D21.4 confirmed per 21c.
D21.5 hovering an Experience, Achievement and Education record each produces
`border-color: rgb(67,232,216)`, `box-shadow: rgba(67,232,216,0.15) 0 12px 40px` and
`transform: matrix(1,0,0,1,0,-4)` (a 4 px lift; measured card `top` moved 342→338, 357→353,
369→365) — one behaviour, the same character as the project card
(`rgb(67,232,216)` border, same glow, 8 px lift) and the skill tile (6 px lift + 1.06 scale).
Reaching this required **deviation D-2** (§4) — as originally specified the lift was dead.
D21.6 full-page screenshots at 375 px and 1440 px (`shots/full-375.png`,
`shots/full-1440.png`) show no overlapping text, nothing escaping its panel, no double
borders and no accidental orphan row; at 1440 px the right-edge rail is in frame carrying the
vector mark.

### 22 · V-D1 — Integration & verification
All of 22a (real command output, §1), 22b (the 8 browser checks, §2/§3) and 22c (the
traceability table, §3) are done. Deviations are in §4; failures, disclosures and open
questions in §5.

---

## 3. AC-by-AC traceability

Legend: **PASS** = observed in the running app with the evidence shown. **FAIL** = observed
not to hold; observed behaviour recorded. **PASS (evidence substituted)** = criterion holds,
but the evidence is timestamped sampling + screenshots instead of a video file (see §0).

### T1 — Hero (AC1–AC17)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T1 AC1 | 13a/13b | Page text search: `crew file` **0**, `personnel log` **0** | PASS |
| T1 AC2 | 13b | `hero__dossier*` markup and the `01/02/03` markers no longer exist; no numbered markers render | PASS |
| T1 AC3 | 13a | `Hi, I’m Rey` **0**, `geeking out` **0**, `Let’s connect and create something awesome` **0** | PASS |
| T1 AC4a | 13b | No emoji in designation, name, classification, mission, any telemetry label/value, either CTA, channels label or cue (visual scan of `shots/hero-1440.png` + Unicode scan) | PASS |
| T1 AC4b | 20 | `shots/marker-1440-mid.png` (12× zoom, rail in frame at 1440 px) + rail `display: block` at 1024/1280/1440: flat teal hull `#43e8d8` + violet core `#7c5cff`. No orange-and-white rocket | PASS |
| T1 AC4c | 20 | Dotted track present; trail `stroke-dasharray` grows 0→0.25→0.5→0.75→1; marker `offset-distance` 0%→100% across the full scroll range; rail not removed | PASS (evidence substituted) |
| T1 AC4d | 13b/20 | `↓` U+2193, `·` U+00B7, `–` U+2013 all present and not reported as violations; pictographic grep empty | PASS |
| T1 AC5 | 13b | Rendered: `Junior Software Developer building mobile and web systems for real-world clients.` | PASS |
| T1 AC6 | 6/13b | Countable hero copy measured from the rendered page = **39 words / 1 sentence** using the PRD §5.6 counting rule; **41 tokens** if the `>` prompt glyph and the `↓` arrow glyph are each counted as words. Per-part breakdown in §5 X-1 | PASS under the PRD's rule — **needs PO confirmation** (X-1) |
| T1 AC7 | 6/13b | 4 tiles: `STATUS→Full-Time @ Smartech Solutions PH`, `MISSIONS→6 projects shipped`, `COMMENDATIONS→9 academic awards`, `SYSTEMS→26 tools & technologies`; `Full-Time` capital T, `Full-time` 0 matches | PASS |
| T1 AC8 | 6/14 | Counted on the same page: **6** project cards, **9** achievement entries, **26** skill tiles | PASS |
| T1 AC9 | 13b | Both CTAs are `<a>`; click → Projects heading visible at `scrollY 964`; click → contact console visible at `scrollY 5094`; `Tab` focus shows `2px solid rgb(67,232,216)`; `Enter` navigates (`hash` → `#projects`) | PASS |
| T1 AC10 | 13b | Avatar renders (0 broken images); `h1` renders; typewriter sampled 90× over 22.5 s — all three phrases seen complete, 42 distinct frames | PASS |
| T1 AC11 | 13b | 4 social `<a>`, each `target="_blank"` + `rel="noopener noreferrer"`, real external URLs | PASS |
| T1 AC12 | 13b | Measured from navigation start: mission + 4 telemetry tiles fully legible at **923 ms** (< 1500 ms). Full sample trace in task 13 D13.12. Measured, not read from the constant | PASS |
| T1 AC13 | 13b/18 | Reduced motion emulated then reloaded: earliest sample (399 ms) already `opacity 1`, `transform none`, inline style `null`; boot strip never present in 24 samples | PASS |
| T1 AC14 | 13d/17 | 375 px: `scrollWidth 360 ≤ innerWidth 375`; telemetry resolves to 2 columns (2×2); 0 clipped elements; `shots/hero-375.png` | PASS |
| T1 AC15 | 13b | Reduced motion: exact string `Junior Software Developer · Robotics Enthusiast · Tech Innovator` (U+00B7); 11 samples over **10.1 s** → 1 distinct value, `.Typewriter` never in DOM, no caret; both `Robotics Enthusiast` and `Tech Innovator` findable together; wraps on 2 lines at 375 px with no scrollbar; with emulation off the typewriter is back and the static string is absent (`staticPresent: false`, `typewriterPresent: true`) | PASS (evidence substituted) |
| T1 AC16 | 6/13b | `comm channels` present, `open comm channels` **0**; `descend ↓` present, `scroll to descend` **0** | PASS |
| T1 AC17 | 13b/13d | Single line `> uplink established` (1 distinct value, 15 px tall); rect never intersects mission/telemetry/CTAs (3× false across all samples); present 597–1477 ms, absent from 1539 ms; `establishing uplink`/`signal locked`/`decrypting crew manifest`/`welcome aboard` **0** each; never mounted under reduced motion | PASS (evidence substituted) |

### T2 — Work Experience (AC1–AC9)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T2 AC1 | 5/10/14 | Section `#experience` heading `<WorkExperience/>`, eyebrow `// service record`. **Reaching it by pasting the URL fragment on a fresh load does not scroll — see F-1**; the section itself is present, visible and reachable by nav click/scroll | PASS for content; the "navigating to `/#experience` scrolls" clause FAILS via F-1 |
| T2 AC2 | 10/14 | Exactly **2** `.record--service` | PASS |
| T2 AC3 | 2/10 | All five strings visible with no interaction; `Full-Time` badge vs hero `STATUS` tile screenshots are character-identical; `Full-time` 0 matches; the word `now` 0 matches in `#experience`. **Disclosure X-2: the date renders as `08/2025 – PRESENT` (CSS uppercase); the DOM text is `08/2025 – Present`** | PASS with disclosure X-2 |
| T2 AC4 | 2/10 | `LEADSolutions, Inc.` / `Full Stack Developer` / `Internship` / `01/2025 – 05/2025` / `Developed an Accounting Online Approval System.` | PASS |
| T2 AC5 | 10 | Badge is a separate `<span class="record__badge">` pill: own background `rgba(124,92,255,0.12)`, own 1 px border, `border-radius: 999px`, on its own line — `shots/experience-1440.png` | PASS |
| T2 AC6 | 10 | Entry 1: filled glowing node (`background: var(--thruster)`, `box-shadow 0 0 10px`) + accent-teal `PRESENT`. Entry 2: hollow node, dim dates. Visible in `shots/experience-1440.png` | PASS |
| T2 AC7 | 10 | Both company names are `H3` (DOM inspection) | PASS |
| T2 AC8 | 10/17 | 375 px: no horizontal scrollbar (360 ≤ 375); `Smartech Solutions Philippines Inc.` wraps, 0 clipped elements; `shots/experience-entry1-375.png` | PASS |
| T2 AC9 | 10 | Measured left edges at 1440 px: project card 136.5, skills grid 136.5, experience card **136.5** → 0.0 px difference | PASS |

### T3 — Academic Achievements (AC1–AC10)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T3 AC1 | 5/11/14 | Heading `<AcademicAchievements/>`, eyebrow `// commendations`; fragment-on-fresh-load caveat = F-1 | PASS for content; fragment clause FAILS via F-1 |
| T3 AC2 | 11/14 | Exactly **9** cards | PASS |
| T3 AC3 | 3/11 | Full read-back in task 11 D11.3 matches the plan's list 1–9 in rendered order (3 columns × 3 rows, left-to-right) | PASS |
| T3 AC4 | 3 | `Kabataan Inyovator` 1, `Kabataan Innovator` **0**, `Araw ng Parangal` 1, `HACKFORGOV` 1, `Robo Fest` 1, `Capture-the-flag` 1 | PASS |
| T3 AC5 | 3 | `rd th` **0**, `3 - Programming` **0**, `15 PSITS` **0** | PASS |
| T3 AC6 | 3 | `(19|20)\d\d` over card 1 and card 4 → `null` (no year) | PASS |
| T3 AC7 | 8/11 | Award `20px` `rgb(255,177,94)` vs event `13px` `rgb(154,154,194)` in the same card — larger and accent-coloured; `shots/achievements-1440.png` | PASS |
| T3 AC8 | 11 | No accordion/show-more/hover-reveal; all 9 cards' text at full opacity without interaction | PASS |
| T3 AC9 | 11/17 | 375 px: no horizontal scrollbar; `Information and Computer Technologies Category` wraps; 0 ellipsised elements | PASS |
| T3 AC10 | 11 | 768 px: 2 columns, 9th card width **705** = grid content width **705**, right edges both **729** (0 px). 1024 px: 3 columns, 9th card **307** = one column. 1280/1440 px: 3 × 3, 9th card **371** = same as the cards above. 375/414: single column. No half-width orphan anywhere | PASS |

### T4 — Education (AC1–AC8)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T4 AC1 | 5/12/14 | Heading `<MyEducation/>`, eyebrow `// training log`; fragment-on-fresh-load caveat = F-1 | PASS for content; fragment clause FAILS via F-1 |
| T4 AC2 | 12/14 | Exactly **2** cards | PASS |
| T4 AC3 | 4/12 | `Notre Dame of Marbel University` / `Bachelor of Science in Information Technology` / `2021 – 2025` | PASS |
| T4 AC4 | 4/12 | `Laguilayan National High School` / `Information and Communications Technology` / `2014 – 2021` | PASS |
| T4 AC5 | 14 | DOM/scroll order: … achievements → **education** → contact → footer; nothing else below | PASS |
| T4 AC6 | 4/12 | Section text is exactly the four strings; `GPA` 0, `honors|honours|cum laude` 0 | PASS |
| T4 AC7 | 12 | Both institutions are `H3` | PASS |
| T4 AC8 | 12/17 | 375 px and 1440 px: no horizontal scrollbar, both entries fully readable, 0 clipped elements | PASS |

### T5 — Tech stack (AC1–AC8)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T5 AC1 | 1/9 | Exactly **26** `.module` tiles counted on screen | PASS |
| T5 AC2 | 1/9 | `shots/skills-1440.png`: the 8 new labels paint as `Next.js`, `Angular`, `Capacitor`, `Docker`, `AWS`, `Firebase`, `GitLab`, `XAMPP`, each with a real logo | PASS |
| T5 AC3 | 1/9 | Same screenshot: the 18 pre-existing labels paint as `React, Laravel, Django, Node.js, Flutter, JavaScript, HTML5, CSS3, Bootstrap, Git, GitHub, MongoDB, MySQL, PostgreSQL, Tailwind CSS, Java, C++, PHP`, each with a real logo | PASS |
| T5 AC4 | 9c | `.module__label` computed `text-transform: none`; all 20 named labels paint mixed-case; only `AWS, XAMPP, PHP, HTML5, CSS3, C++` are all-caps. **Recorded as an expected visual diff, not a regression** (PRD D11) | PASS |
| T5 AC5 | 1/9 | Hard reload, cache disabled: 26 `/skills/` requests, all **200**; `nextjs.svg` requests **0**; 404s **0** | PASS |
| T5 AC6 | 9a | `label === alt` for all 26 (spot-checked incl. all 8 new, `C++`, `PostgreSQL`, `Node.js`) | PASS |
| T5 AC7 | 9c | Every tile `130×100`; every logo box `42×42` with `object-fit: contain`; 0 logos overflow their tile — `shots/skills-1440.png`, `shots/skills-375.png` | PASS |
| T5 AC8 | 9c/17 | 375 px: grid wraps to 13 rows, `scrollWidth 360 ≤ 375`, 0 clipped tiles | PASS |

### T6 — Navigation (AC1–AC7)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T6 AC1 | 5/15 | 1440 px, left→right: `About, Missions, Systems, Service, Medals, Academy, Transmit` (7) | PASS |
| T6 AC2 | 15 | Each of the 7 clicked in turn: target section `top: 0` in the viewport, heading visible, correct `is-active`. (Clicking works; only *fresh-load fragment pasting* fails — F-1) | PASS |
| T6 AC3 | 15 | With each section centred: `.is-active` count **1** in all 7 cases, and the active href always equals the section at the viewport centre | PASS |
| T6 AC4 | 15 | `Tab` reaches all 7 in visual order with `2px solid rgb(67,232,216)`; `Enter` navigates | PASS |
| T6 AC5 | 15/16 | 375 px: hamburger opens a menu with all 7 entries, `max-height: 560px` + `overflow-y: auto`, every link rect inside the menu box (no clipping); selecting `Academy` closes it and scrolls to Education — `shots/mobile-menu-375.png` | PASS |
| T6 AC6 | 16 | 768/900/1024: `scrollWidth` 753/885/1009 ≤ 768/900/1024; no logo-menu overlap (900: logo right 211 < menu left 404); `ONLINE` and blips hidden in the tight range — `shots/nav-900.png` | PASS |
| T6 AC7 | 15 | Navigating all 7 entries: zero console errors, zero React warnings | PASS |

### T7 — Section order (AC1–AC5)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T7 AC1 | 14 | Scroll order: Hero → Projects → Skills&Tools → WorkExperience → AcademicAchievements → Education → Contact → Footer | PASS |
| T7 AC2 | 14 | **FAIL.** On a fresh load with the fragment in the URL, the page does **not** scroll. Measured for all 7: `location.hash` is set correctly but `window.scrollY` stays **0** for ≥ 4 s (sampled 12× over 6.6 s for `#experience`), e.g. `#experience` sits at document top **3139** and `#education` at **4625** while `scrollY = 0`. Only `#about` "passes" because it is already at the top. Control test in the same browser: a static HTML page with the target present at parse time **does** scroll to its fragment (`scrollY 3608`), and in the app `getElementById(id).scrollIntoView()` after mount scrolls correctly (`scrollY 4625`, `top 0`) — so the target simply does not exist when Chrome processes the fragment. Pre-existing SPA behaviour: `#projects`, `#skills` and `#contact` (all pre-existing sections) fail identically, so this is not a regression from this iteration. **No task.md step covers it — escalated as F-1** | **FAIL** |
| T7 AC3 | 14 | `Tab` from the top: logo → 7 nav → 2 hero CTAs → 4 hero socials → cue → 6 project links → contact mailto → 4 contact socials → footer, monotonically increasing document Y, no backward jump | PASS |
| T7 AC4 | 14 | Education is the last content section; only Contact + footer below | PASS |
| T7 AC5 | 14 | Measured content gaps: Projects→Skills **220 px**, Skills→Experience **220**, Experience→Achievements **220**, Achievements→Education **220** (Education→Contact 220); all `.station` padding `110px/110px` → 0 px variance vs the ~8 px allowance | PASS |

### T8 — Visual consistency (AC1–AC8)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T8 AC1 | 8/10/11/12/20/21 | Sampled computed colours in the new sections are exclusively palette values (list in D21.1); the rail marker samples `#43e8d8` / `#7c5cff`. No new hue | PASS |
| T8 AC2 | 21 | All headings/body/mono compute to `Unbounded` / `Space Grotesk` / `Share Tech Mono`; exactly **1** font request page-wide (the pre-existing Google Fonts stylesheet). The only `Arial` computation is the pre-existing textless hamburger button + its 3 empty bars, which render no glyphs | PASS |
| T8 AC3 | 8/14/17 | All six `.station-heading` blocks measure identical eyebrow/title/accent/bracket styling and `margin-bottom: 60px` (values in D21.3) | PASS |
| T8 AC4 | 7/10/11/12 | Measured from scroll-in to all items at full opacity: Experience **411 ms**, Achievements **555 ms**, Education **400 ms** (≤ 600 ms) | PASS |
| T8 AC5 | 13d/21 | Nav 1 (exempt), Hero 1 countable + exempt cue (porthole ring `animation-name: none` at rest), Projects 1 effect type, Skills/Experience/Achievements/Education/Contact 0 | PASS |
| T8 AC6 | 7/13b/18 | Reduced motion, reloaded: 0 elements below full opacity or transformed at any scroll step; static classification string, nothing typing (10.1 s, 1 distinct value); boot never shown; ring not spinning; `ONLINE` pulse and card scanline flattened to `iteration-count: 1`, `duration: 1e-06s`; cue transform `none`; starfield pixel hash constant across 10.1 s; only the scroll-linked rail moves | PASS (evidence substituted) |
| T8 AC7 | 8/10/11/12/21 | Hovering Experience / Achievement / Education each gives `border-color rgb(67,232,216)` + `box-shadow rgba(67,232,216,0.15) 0 12px 40px` + a 4 px lift — one behaviour, same character as the project card (8 px lift) and skill tile (6 px + scale). **Required deviation D-2**; as originally specified the lift did not render at all | PASS after D-2 |
| T8 AC8 | 21 | `shots/full-375.png` and `shots/full-1440.png`: no overlapping text, nothing escaping a panel, no double borders, no accidental orphan row (the 9th achievement card spans the row at 768) | PASS |

### T9 — Responsive (AC1–AC7)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T9 AC1 | 17 | All six checkpoints: `scrollWidth ≤ innerWidth` and 0 elements past the viewport edge, scrolled top to bottom | PASS |
| T9 AC2 | 17 | 375: 360/375 · 414: 399/414 · 768: 753/768 · 1024: 1009/1024 · 1280: 1265/1280 · 1440: 1425/1440 | PASS |
| T9 AC3 | 17 | 375 px: 0 elements with `scrollWidth > clientWidth` among record titles/subtitles/notes/skill labels/headings; 0 elements using `text-overflow: ellipsis`; all four named strings and the achievements heading wrap | PASS |
| T9 AC4 | 17a | 375 px: achievements heading 21.6 px on 2 lines; measured line boxes put `<Academic` on line 1 (top 132) and `Achievements/>` on line 2 (top 158) — a word-boundary break via `<wbr />`, and `Achievements` itself occupies a single client rect (not split mid-word) | PASS |
| T9 AC5 | 11/17 | 768: achievements 2 columns, skills 7 rows; 1024: achievements 3 columns, skills 5 rows; no overflow, no single-column-with-gaps | PASS |
| T9 AC6 | 17c | No container I added has a fixed px width; AC1 passes at all checkpoints | PASS |
| T9 AC7 | 17 | `shots/full-375.png`, `full-414`, `full-768`, `full-1024`, `full-1280`, `full-1440` | PASS |

### T10 — Accessibility & asset integrity (AC1–AC10)

| AC | Task | Evidence | Result |
|---|---|---|---|
| T10 AC1 | 14/19 | Hard reload + full scroll + mobile menu open/close: console = `[vite] connecting…`, `[vite] connected.` (debug), React DevTools `info`. **Zero errors, zero React warnings.** In reduced-motion mode one additional framer-motion dev-mode `warning` appears — disclosure X-3 | PASS with disclosure X-3 |
| T10 AC2 | 19 | 83 responses, **0** non-2xx/3xx, **0** 404s: `/skills/` 26×200, `/projects/` 6×200, `/socials/` 4×200, `me.png` 2×200 | PASS |
| T10 AC3 | 19 | 0 of 41 `<img>` broken (`complete && naturalWidth === 0`) at 1440 px | PASS |
| T10 AC4 | 14/19 | Exactly **1** `h1` (hero name); `h2` on Projects, Skills, Experience, Achievements, Education, Contact; `h3` for company names, institution names, achievement awards, project titles. Full outline in D19.4 | PASS |
| T10 AC5 | 19 | 1440 px: 33 tab stops in visual order covering nav, hero CTAs, socials, cue, project links, contact mailto, contact socials, footer. 375 px: logo → **hamburger** → 7 nav → CTAs → socials. No skipped interactive element, no trap. Note: the contact section contains **0** form fields (5 links only) — no form exists in this build (PRD §4 excludes form handling), so "every contact-form field and submit control" has no target beyond those links | PASS |
| T10 AC6 | 19c | Every focused stop reported computed `outline: 2px solid rgb(67, 232, 216)` (33 stops at 1440, 12 at 375), including nav links, hero CTAs, project links and the contact mailto CTA | PASS |
| T10 AC7 | 9a/13b/19b | 26/26 skill `alt` == label; 6/6 project `alt` == name; hero avatar `alt="John Rey Seguma"`; 4 social links have `aria-label` | PASS |
| T10 AC8 | 8/19 | Contrast measured against the **actually painted** background (screenshot pixels sampled through a canvas). Body text: Experience bullet **7.07:1**, Experience job title **17.32:1**, Achievements category **17.28:1**, Achievements event **7.07:1**, Education program **17.40:1** (all ≥ 4.5). Mono/label text: Experience date **7.00:1**, Education date **7.07:1**, eyebrow **11.18:1**, badge **17.32:1**, telemetry label **10.56:1**, skill tile label **7.02:1** (all ≥ 3). Award (display) 10.63:1, telemetry value 17.28:1 | PASS |
| T10 AC9 | 7/13b/18 | Reduced motion, reloaded: page fully readable end-to-end, no animation gating any content, nothing animating on a timer after settle; classification line is the static string and is not typing (11 samples / 10.1 s, 1 distinct value; `.Typewriter` absent) | PASS (evidence substituted) |
| T10 AC10 | 19a | All **15** `target="_blank"` links carry `rel="noopener noreferrer"` (4 hero socials, 6 project sources, 4 contact socials, 1 footer) | PASS |

**Totals:** 100 criteria checked. **97 PASS** (12 of them with sampled-evidence substitution
for a video), **1 FAIL** (T7 AC2, which also caveats the fragment clause of T2 AC1 / T3 AC1 /
T4 AC1), **1 PASS-under-the-PRD's-own-rule** (T1 AC6), **3 disclosures** (X-1, X-2, X-3).

---

## 4. Deviations from `task.md`

### D-1 — Fixed 2 pre-existing `react/jsx-no-comment-textnodes` lint errors (out of task scope)

**What.** `Footer.jsx` line 5 and `Heading.jsx` line 13 both contained a literal `//` in a JSX
text node, which ESLint's `react/jsx-no-comment-textnodes` rule reports as an **error**.

**Why it matters.** `npm run lint` was **already failing at `HEAD` (`1bc1725`)** — I verified
this by running ESLint against pristine copies extracted with
`git show HEAD:src/components/Footer.jsx` / `Heading.jsx`, which reproduce exactly the same
2 errors at the same positions. `task.md` §0.1.4 and nearly every task's done criteria
require `npm run lint` to exit 0, which was unreachable without touching these two lines.

**What I changed.** The two text nodes became braced string expressions with **byte-identical
rendered output**: `// {eyebrow}` → `{"// "}{eyebrow}`, and
`— end of transmission // {year} // built by` → `— end of transmission {"//"} {year} {"//"} built by`.
Verified on the live page: eyebrows still render `// mission log`, `// service record`, etc.,
and the footer still reads `— end of transmission // 2026 // built by Rey —`.

**Status.** Disclosed, not absorbed: this is a **pre-existing repository defect** that the
iteration-01 documents do not mention. If Ponta or Nala would rather it were reverted and
tracked as its own ticket, it is a two-line revert — but then the lint gate stays red.

### D-2 — Added `whileHover={{ y: -4 }}` to the three record components

**What task.md said.** Task 8b specifies the hover lift purely in CSS:
`.record:hover { border-color: var(--thruster); transform: translateY(-4px); box-shadow: … }`,
and D21.5 requires "the same lift + teal glow as hovering a project card".

**What actually happened.** framer-motion writes an **inline** `transform` on every
`motion.li` it drives, and once the reveal settles that inline value is `transform: none`.
Inline styles beat the stylesheet, so `.record:hover`'s `translateY(-4px)` never rendered.
Measured before the fix, with a real mouse hover over each record:
`hovered: true`, `border-color: rgb(67,232,216)`, `box-shadow: rgba(67,232,216,0.15) 0 12px 40px`,
`transform: none`, and the card's `top` **did not move** (342 → 342). The glow worked; the
lift was dead. The project card lifts because its lift comes from framer-motion
(`whileHover={{ y: -8 }}`), not from CSS — `.mission-card:hover` has no transform either.

**What I changed.** One prop per component (`ExperienceEntry`, `AchievementCard`,
`EducationCard`): `whileHover={{ y: -4 }}`. The CSS rule from task 8b was left exactly as
specified. After the change, real-mouse hover gives
`transform: matrix(1,0,0,1,0,-4)` and the cards move (342→338, 357→353, 369→365) with the same
border/glow as before.

**Why I judged this in-scope rather than an escalation.** It uses the mechanism the codebase
already uses for both of its other hoverable items, it keeps the *specified visual outcome*
(4 px lift) unchanged, ADR-0004 §1's stated intent is "deliberately the same reaction as
`.mission-card:hover`" — which is itself CSS glow + framer lift — and `MotionConfig
reducedMotion="user"` (ADR-0007 Layer 1) already neutralises `whileHover` transforms for
reduced-motion users, so nothing about T8 AC6 / T10 AC9 changes. **Flagging it anyway**: if
Ponta prefers the lift to stay CSS-only, the alternative is to drop `y` from `riseItem` for
records (so framer never owns their transform) — that is an architecture-level choice, not
mine.

**Note for Ponta:** under reduced motion the records have no inline transform, so
`.record:hover`'s CSS `translateY(-4px)` *does* apply there (instantly — the CSS media block
flattens the transition). That is a user-initiated hover, not an entrance or looping
animation, so it breaches no criterion; recorded for completeness.

### D-3 — Added the missing `resets / globals / a11y` banner comment in `App.css`

Task 8a's ToC lists a `resets / globals / a11y` block, but the file had no banner comment for
those rules, so task 21a's "the ToC is not allowed to lie" forced a choice. I added the
one-line banner (comment only; no rule moved, added or deleted) rather than deleting the ToC
entry, because `architecture.md` §7.1's required structure names that block explicitly.

### D-4 — `FlightPath.jsx` header comment wording

Task 20a says everything except the marker node is unchanged. The file's own header comment
said "The rocket's position along the trail IS the scroll progress bar"; I changed the word
"rocket" to "marker" so the comment does not describe a glyph that no longer exists. Comment
only, zero behavioural effect. Mentioned for completeness.

Everything else in tasks 1–22 was implemented exactly as `task.md` specifies.

---

## 5. Failures, disclosures and open questions

### F-1 — **FAIL, needs a decision: fragment deep links do not scroll on a fresh load**
**Criterion:** plan **T7 AC2** (and the "Navigating to `http://localhost:5173/#experience`
scrolls to a visible section…" opening clause of T2 AC1, T3 AC1, T4 AC1); task.md **D14.2**.

**Observed behaviour.** Loading `http://localhost:5173/john-rey-portfolio/#<id>` in a fresh
tab leaves the page at the top. `location.hash` is correct, the section exists, but
`window.scrollY` stays `0` — sampled every 500 ms for 6.6 s for `#experience` (document top
3139) and 4 s for each of the other six. `#about` is the only one that appears to work,
because it is already at scroll 0.

**Cause, established by controls rather than assumed.** In the *same* browser and the *same*
harness, a plain static HTML page with the target present at parse time scrolls correctly
(`scrollY 3608`), and calling `document.getElementById(id).scrollIntoView()` in the app after
mount also scrolls correctly (`scrollY 4625`, section `top 0`). So the DOM, the ids and the
anchors are all fine: the browser processes the fragment before React has rendered the
sections, and never retries.

**Not a regression.** The three pre-existing sections (`#projects`, `#skills`, `#contact`)
fail identically, so this behaviour predates iteration 01; it simply became a graded criterion
this iteration.

**Why I did not fix it.** The fix is a new mount-time effect (e.g. in `App.jsx` or `Navbar.jsx`:
on mount, if `location.hash` matches a registry id, `scrollIntoView` that element after
paint) plus a decision about scroll-restoration interaction and whether smooth or instant.
No task.md step authorises it, it touches the composition layer and the section registry's
contract, and `task.md` §0.1.7 tells me to route new conflicts rather than resolve them in
code. **Routing to Ponta** (design) / **Nala** (whether AC2 stays as written).

### X-1 — Disclosure: hero word count is 39 or 41 depending on the tokenisation rule
**Criterion:** plan **T1 AC6** (≤ 40 words, ≤ 2 sentences; design target 39/1).

Counted from the rendered hero, excluding nav, `hero__name`, the designation kicker, the
classification line and social-icon labels:

| part | rendered text | naive whitespace tokens |
|---|---|---|
| boot ticker | `> uplink established` | 3 (`>`, `uplink`, `established`) |
| mission | `Junior Software Developer building mobile and web systems for real-world clients.` | 11 |
| 4 telemetry labels | `STATUS`, `MISSIONS`, `COMMENDATIONS`, `SYSTEMS` | 4 |
| 4 telemetry values | `Full-Time @ Smartech Solutions PH` (5), `6 projects shipped` (3), `9 academic awards` (3), `26 tools & technologies` (4) | 15 |
| 2 CTA labels | `View Projects`, `Contact Me` | 4 |
| channels label | `comm channels` | 2 |
| scroll cue | `descend ↓` | 2 (`descend`, `↓`) |
| **total** | | **41** |

**Sentences: 1** (only the mission ends in a terminal `.`).

PRD §5.6 / architecture §11 / ADR-0006 §4 all count the boot ticker as **2** words and the
scroll cue as **1**, i.e. they treat the `>` prompt character and the `↓` arrow as glyphs
rather than words — which is also how PRD §7.4 and T1 AC4d treat `↓`. Under that rule the
total is exactly the documented **39 / 40**, with 1 word of headroom. Under a naive
`split(/\s+/)` it is 41, which would be over the cap. **No copy was invented or lengthened**
— the strings are verbatim PRD §5.6. Flagging so QA and the PO apply one rule consistently
rather than discovering the ambiguity at sign-off. If Nala wants the naive count to be the
binding one, dropping the standalone `↓` or the `>` prefix from `content/hero.js` brings it to
40/39 — a one-string edit, but it is her copy decision, not mine.

### X-2 — Disclosure: date ranges paint in uppercase (`08/2025 – PRESENT`)
**Criterion:** plan **T2 AC3** ("Dates: `08/2025 – Present`"), **T4 AC3/AC4**.

The DOM text is exactly `08/2025 – Present` / `2021 – 2025` / `2014 – 2021` with EN DASH
U+2013, as authored. But `.record__meta` carries `text-transform: uppercase` — explicitly
prescribed by task 8b, and explicitly relied upon by task 11a (which tells me *not* to use
`.record__meta` for achievement text precisely because it uppercases). So the painted glyphs
read `08/2025 – PRESENT`. Given that PRD **D11** made *rendered* casing load-bearing for skill
labels, QA could reasonably read T2 AC3 the same way. I implemented what `task.md` specifies
and am flagging the reading rather than silently changing the prescribed CSS. If the PO wants
`Present` in mixed case on screen, the fix is to drop `text-transform: uppercase` from
`.record__meta` (it would also affect the education dates) — one declaration, but it is a
design/copy call.

### X-3 — Disclosure: one framer-motion dev warning in the console under reduced motion
**Criterion:** plan **T10 AC1** ("zero errors and zero React warnings").

With `prefers-reduced-motion: reduce` emulated, the console additionally shows:

```
warning  You have Reduced Motion enabled on your device. Animations may not appear as expected.
```

It is emitted by **framer-motion** (a consequence of `MotionConfig reducedMotion="user"`,
which ADR-0007 Layer 1 requires), not by React, and it is a development-build message —
framer-motion strips its warnings from production bundles, so it will not appear in the
`npm run build` output. Zero errors and zero *React* warnings in both motion modes, and zero
of anything beyond the vite/DevTools notices with motion enabled. Recorded because T10 AC1 is
worded absolutely.

### Note — pre-existing deferred defects were left alone, as instructed
`index.html`'s `/me.png` favicon (PRD §11 **DF1**), `information.userData.img`'s leading slash
(**DF2**) and the dormant `jquery` / `react-owl-carousel` / `react-intersection-observer`
dependencies (**DF3**) are all untouched. `package.json` is unmodified and **no npm dependency
was added** (`git status` shows no change to `package.json` or `package-lock.json`).

---

## 6. Files changed

**Created (9)**
```
src/content/experience.js      src/content/achievements.js   src/content/education.js
src/content/sections.js        src/content/hero.js           src/lib/motion.js
src/components/ExperienceEntry.jsx  src/components/AchievementCard.jsx
src/components/EducationCard.jsx
```

**Modified (12)**
```
src/App.jsx                     tasks 9b, 13c, 14
src/App.css                     tasks 8, 9c, 13d, 16, 17b, 20b, 21 (+ D-3)
src/content/skills.js           task 1
src/content/information.js      task 13a (description deleted)
src/components/Skill.jsx        task 9a  (breaking props)
src/components/Hero.jsx         task 13b (breaking props)
src/components/Navbar.jsx       task 15
src/components/Heading.jsx      tasks 17a, 18 (+ D-1)
src/components/ProjectCard.jsx  tasks 18, 19a
src/components/ContactForm.jsx  task 18
src/components/Footer.jsx       task 19a (+ D-1)
src/components/FlightPath.jsx   task 20a (+ D-4)
```

**Untouched, as required:** `src/main.jsx`, `src/components/Starfield.jsx`,
`src/content/projects.js`, `src/content/socials.js`, `index.html`, `vite.config.js`,
`package.json`, `package-lock.json`, `.eslintrc.cjs`, everything in `public/`, everything in
`governance/`, and `PRD.md` / `architecture.md` / `plan.md` / `task.md` / the ADRs.

---

## 7. Handover state

- `npm run lint` → **exit 0**. `npm run build` → **exit 0**. Both re-run after the final
  change (§1).
- The app was started with `npm run dev` and exercised in a real browser by me; it boots,
  renders all seven sections, and the console is clean. QA can start it and verify
  immediately.
- **No database, no migrations, no seed scripts exist in this project**, so there are no
  scripts pending execution — a genuine absence, not a skipped step.
- Background processes I started for verification (vite dev server, headless Chrome, a
  throwaway static-file server on port 5199 used only for the F-1 control test) are stopped.
- **Blocking-ish items for the next role:** F-1 is a real acceptance-criterion failure that
  needs Ponta (design) and Nala (criterion wording). X-1, X-2 and X-3 need a one-line ruling
  each. D-1 and D-2 are disclosed deviations that Ponta may accept or reverse.
