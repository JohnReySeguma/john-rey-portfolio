# Iteration 01 — Portfolio Uplift · Execution Task Breakdown

**Owner:** Ponta (Solution Architect)
**Audience:** Masky (Developer)
**Created:** 2026-08-27
**Last updated:** 2026-08-27 (amendment A1)
**Ticket source:** `docs/execution/iteration-01-portfolio-uplift/plan.md` (T1–T10)
**Requirement source:** `docs/execution/PRD.md` (all `§` references below are to that file)
**Design source:** `docs/execution/architecture.md` + `docs/execution/adr/ADR-0001…0007`

### Amendment log

**A1 — 2026-08-27 — PO adjudication of the §4 flags.** Nala decided the five flags this
document routed to her (PRD §9 **D10–D14**) and Nala's `plan.md` rewrote the affected
acceptance criteria. `architecture.md` and ADR-0002/0004/0006/0007 were amended in the
same pass. Tasks changed below:

| Task | Change | Cause |
|---|---|---|
| 6 (`T1-D1`) | `STATUS` telemetry value is `Full-Time` (capital `T`); the former "do not harmonise the casing" instruction is **deleted**; `classificationStatic` key added | PRD D10, D13 |
| 11 (`T3-D2`) | achievements grid: the 9th card now **spans both columns** in the 2-column range — the previously accepted orphan is **reversed** | PRD D14 · plan T3 AC10 |
| 13 (`T1-D2`) | `Hero.jsx` classification line becomes a mount-time branch on `useReducedMotion()`; new `.hero__role-static` CSS; new done criteria for plan T1 AC15/AC16/AC17 | PRD D13, D12 |
| 18 (`T10-D1`) | the "known non-conformance, flagged not fixed" typewriter carve-out is **deleted** — it is now implemented in task 13 and fully testable | PRD D13 |
| 9 (`T5-D2`) | done criteria re-pointed at rendered glyphs / screenshots, matching rewritten T5 AC2/AC3/AC4 | PRD D11 |
| 10 (`T2-D2`) | done criterion for the `Full-Time` badge now a side-by-side pixel comparison against the hero tile | PRD D10 · plan T2 AC3 |
| 21 (`V-D1`) | reduced-motion verification extended (10 s static-hero recording, typewriter absence, starfield frozen) | plan T8 AC6, T10 AC9 |
| §4 | flag table reconciled: **no flag is left open** | — |

**A2 — 2026-08-27 (second pass) — PO ruling on flag F15 (PRD §9 D15, §7.4).** The 🚀 emoji
in the fixed scroll-progress rail is a professionalism defect in its own right: it is drawn
by the *visitor's* OS emoji font, so its colour and shape belong to Windows/Apple/Android
rather than to this design. Nala held plan **T1 AC4 at its full page-wide reading** (now
rewritten as 4a–4d) rather than narrowing it, and rejected deleting the rail. Changes:

| Task | Change | Cause |
|---|---|---|
| **20 (`T1-D3`) — NEW** | Replace `FlightPath`'s emoji marker with an inline SVG on palette tokens; explicit `width`/`height` replaces `font-size` as the sizing mechanism | PRD D15 · plan T1 AC4 (4b, 4c) |
| §3 "Files touched" | `FlightPath.jsx` moved from **Untouched** to **Modified** | PRD D15 |
| §4 | F15 closed with the D15 decision; its "do not touch it unilaterally" instruction **deleted** | PRD D15 |
| 21 (`T8-D3`), 22 (`V-D1`) | renumbered from 20 and 21; dependency ranges widened | insertion of task 20 |

**A3 — 2026-08-27 (third pass) — remediation of two post-implementation findings.** Tasks
1–22 are implemented; `execution-log.md` records one hard failure and one disclosed
deviation that are mine to resolve. Both are **remediation tasks appended after `V-D1`**,
because verification is what surfaced them — nothing earlier is renumbered.

| Task | Change | Cause |
|---|---|---|
| **23 (`T7-D3`) — NEW** | `src/lib/useHashScroll.js` (new) + one call in `App.jsx`: fragment deep links do not scroll on a fresh load (T7 AC2 **FAIL**, plus the opening clause of T2/T3/T4 AC1) | `execution-log.md` **F-1** → **ADR-0008** |
| **24 (`T8-D4`) — NEW** | `App.css`: remove the dead `transform` from `.record:hover` **and** from `.record`'s `transition`. Masky's `whileHover={{ y: -4 }}` on the three record components is **ratified** — keep it | `execution-log.md` **D-2** → architecture **§8.1**, ADR-0004 amendment A3 |
| **25 (`V-D2`) — NEW** | Targeted re-verification of the criteria tasks 23–24 touch, plus a regression check | constitution: never hand on with unverified changes |
| §4 | F16, F17, F18 recorded and closed | — |

Everything not listed in A1, A2 or A3 is unchanged and still current. **There are no
superseded instructions left in this document** — where a ruling reversed my earlier
guidance, the earlier guidance was deleted, not annotated. Task 8b's CSS spec is the one
exception worth calling out explicitly: it is **corrected in place** by task 24, and task
8b now carries a pointer so nobody implements the dead rule from a fresh read.

---

## 0. How to use this document

Read §0.1–§0.6 before writing any code. Then execute tasks **in the numbered order of
§2**. Each task states its files, contracts, exact copy, and done criteria.

### 0.1 Non-negotiables (from `governance/constitution.md` and architecture §1.1)

1. **No new npm dependencies.** Everything is composable from React 18, framer-motion 10,
   `prop-types`, `typewriter-effect`, `react-icons`, and plain CSS.
2. **Every `public/` asset reference is written as** `` `${import.meta.env.BASE_URL}skills/${file}` ``
   — `BASE_URL` already ends in `/`; never add a leading slash after it (architecture §6).
3. **PropTypes on every component that takes props.** No exceptions.
4. `npm run lint` must pass at `--max-warnings 0`. `npm run build` must exit 0.
5. **No content that is not in PRD §5.** No invented dates, bullets, GPAs, locations,
   taglines. No emoji in any file under `src/content/`.
6. **Never report "done" from reading source.** Every done criterion in this document is
   written to be checked in a browser against `npm run dev`. Record real observed output
   in `docs/execution/iteration-01-portfolio-uplift/execution-log.md` (your file — this
   file, `task.md`, is mine; do not edit it).
7. If a task as written is impossible or contradicts a ticket, **stop and escalate**. Do
   not silently reshape it. §4 lists all 19 conflicts — 16 found during design, 3 found by
   measurement during implementation — and **every one is now closed**: decided by the PO
   (PRD §9 D10–**D15**), deferred by the PO (PRD §11 DF1–DF3), or resolved in the
   architecture (including **ADR-0008** and architecture **§8.1**). So there is nothing
   left in this document for you to adjudicate. Anything *new* is yours to route back, not
   to absorb — and F16/F17 are the proof that routing works: both were caught by
   measurement, escalated rather than patched, and came back as design.

### 0.2 Layering (architecture §3.1) — do not violate

```
src/content/*.js   pure data. no JSX, no React import, no logic beyond template strings
src/lib/motion.js  pure motion config. no JSX
src/components/*   presentational only. PropTypes-validated. no data imports*
src/App.jsx        page order, <section> shells, data -> component wiring
```

\* Exceptions, and the only ones: `Hero` imports `content/socials` **and** `content/hero`;
`ContactForm` imports `content/socials`; `Navbar` imports `content/sections`.
`content/hero.js` imports `content/projects`, `content/achievements`, `content/skills` to
derive counts — allowed here and nowhere else (ADR-0006 §3).

### 0.3 Component kinds (architecture §2.1, ADR-0001)

- **Item components** render exactly one record, take **flat scalar props**, own no
  section shell, import no data: `ProjectCard`, `Skill`, and the three new ones
  (`ExperienceEntry`, `AchievementCard`, `EducationCard`).
- **Chrome components** are singletons: `Navbar`, `Hero`, `Footer`, `ContactForm`,
  `Starfield`, `FlightPath`.
- `App.jsx` owns every `<section className="station">`, every `<Heading>`, and every list
  container. Do **not** create `<Experience />` / `<Achievements />` / `<Education />`
  section components — ADR-0001 rejected that explicitly.

### 0.4 CSS rules (architecture §7, ADR-0003)

- `src/App.css` stays the **only** stylesheet. No `src/styles/`, no CSS Modules, no
  per-component CSS.
- Block order **mirrors page order**; new blocks are inserted at their page position,
  never appended to the bottom. Target order is fixed in task **T8-D2**.
- Naming is BEM-ish lowercase: `block`, `block__element`, `block--modifier`.
- **No new custom properties, no new colour literals, no new font families.** Tints are
  `rgba()` of an existing token's channels, exactly as the file already does for
  `rgba(67, 232, 216, 0.1)`.
- **No fixed `px` widths on containers.** Use `max-width`, `minmax()`, `clamp()`.
- Media queries live **inside** the block they modify. The pre-existing global
  `@media (max-width: 480px)` mobile-spacing block stays where it is.
- Allowed breakpoints only: **480, 600, 640, 760, 900, 1024, 1100**. Do not invent others.

### 0.5 Date formatting

Date ranges are stored as separate `start` / `end` strings in the content module and
joined **in the component** with a literal **EN DASH `–` (U+2013) surrounded by single
spaces**. Copy the character `–` from this document; do not type a hyphen `-` and do not
use `&ndash;` or `&#8211;` in JSX text.

Renders: `08/2025 – Present`, `01/2025 – 05/2025`, `2021 – 2025`, `2014 – 2021`.

### 0.6 `null` means "absent"

`null` in a content record means the record genuinely has no value. The component must
render **no element at all** — no placeholder, no dash, no empty span. This is how PRD D8
("no invented years") is enforced: achievement A1 has `category: null`.

---

## 1. Task index and dependency graph

Execute top to bottom. `dep` = tasks that must be complete first.

| # | ID | Ticket | Title | dep |
|---|----|--------|-------|-----|
| 1 | **T5-D1** | T5 | `content/skills.js` → 26 `{ file, label }` records | — |
| 2 | **T2-D1** | T2 | `content/experience.js` (new) | — |
| 3 | **T3-D1** | T3 | `content/achievements.js` (new) | — |
| 4 | **T4-D1** | T4 | `content/education.js` (new) | — |
| 5 | **T7-D1** | T7 | `content/sections.js` (new) — the section registry | — |
| 6 | **T1-D1** | T1 | `content/hero.js` (new) — mission, telemetry, CTAs | 1, 3 |
| 7 | **T8-D1** | T8 | `src/lib/motion.js` (new) — shared motion vocabulary | — |
| 8 | **T8-D2** | T8 | `App.css` — table of contents + `record` primitive block | — |
| 9 | **T5-D2** | T5 | `Skill.jsx` breaking prop change + call site + `.module` CSS | 1, 7 |
| 10 | **T2-D2** | T2 | `ExperienceEntry.jsx` + `.service-log` CSS | 2, 7, 8 |
| 11 | **T3-D2** | T3 | `AchievementCard.jsx` + `.commendation-grid` CSS | 3, 7, 8 |
| 12 | **T4-D2** | T4 | `EducationCard.jsx` + `.academy-grid` CSS | 4, 7, 8 |
| 13 | **T1-D2** | T1 | `Hero.jsx` rewrite + `information.js` + hero CSS | 6, 7 |
| 14 | **T7-D2** | T7 | `App.jsx` — 7 sections in order + `MotionConfig` | 5, 9–13 |
| 15 | **T6-D1** | T6 | `Navbar.jsx` — registry-driven links + deterministic scroll-spy | 5, 14 |
| 16 | **T6-D2** | T6 | `App.css` — navbar 761–1100 px range + mobile menu height | 15 |
| 17 | **T9-D1** | T9 | Responsive sweep — heading wrap, long-string wrap, overflow | 14 |
| 18 | **T10-D1** | T10 | Reduced-motion sweep — `Heading`, `ProjectCard`, `ContactForm` | 7, 14 |
| 19 | **T10-D2** | T10 | Link/alt integrity — `rel`, `alt`, accessible names | 14 |
| 20 | **T1-D3** | T1 (AC4) | Scroll-rail marker: emoji → inline SVG on palette tokens | 14 |
| 21 | **T8-D3** | T8 | Final visual-consistency pass + CSS ToC reconciliation | 1–20 |
| 22 | **V-D1** | all | Integration & verification (lint / build / dev / browser) | 1–21 |
| — | | | *— remediation, added after verification (amendment A3) —* | |
| 23 | **T7-D3** | T7 (AC2) | `useHashScroll` — make fragment deep links scroll on a cold load | 14 |
| 24 | **T8-D4** | T8 (AC7) | Remove the dead `transform` from the `record` hover CSS | 10, 11, 12 |
| 25 | **V-D2** | all | Targeted re-verification of tasks 23–24 + regression check | 23, 24 |

**Why this order.** Content modules and the two shared primitives (`lib/motion.js`, the
`record` CSS block) come before every component that consumes them, so no component is
ever written against a contract that does not exist yet. `App.jsx` composition (14) comes
after all five item components exist, so the page is never left referencing a missing
module. `Navbar` (15) comes after composition because its scroll-spy observes elements
that must already be in the DOM to be verifiable in a browser. Cross-cutting sweeps
(17–20) come last because they touch files the earlier tasks rewrote.

Task 20 (`T1-D3`) is *implementation-independent* — `FlightPath.jsx` imports nothing this
iteration creates — but it is **verification-dependent** on task 14: plan T1 AC4's evidence
spec requires a scroll-through recording of the marker travelling the **full length** of the
track, and the track's length is the page's scroll length, which only reaches its final
value once all seven sections exist. It also sits before task 21 so the final
visual-consistency pass sees the marker in its finished form.

Tasks **23–25** are remediation added by amendment A3 *after* task 22's verification found
two defects. They are appended rather than folded into tasks 8/10/11/12/14 so that the
record shows the real sequence — specified, built, measured, corrected — and so nothing
already verified gets renumbered. Task 23 depends on task 14 (it needs the sections to
exist); task 24 depends on tasks 10–12 (the three record components); task 25 depends on
both and re-verifies only what they can have moved.

**Mid-task breakage rule.** Tasks 1–8 are additive-only and leave the app running. Task 9
and task 13 each contain a **breaking change** and must be completed as a single unit
(all call sites in the same task) — see the warnings in those tasks. Do not commit or
hand off between the halves of task 9 or task 13.

---

## 2. Tasks

---

### 1 · T5-D1 — `src/content/skills.js` becomes 26 `{ file, label }` records

**Ticket:** T5 · **Requirements:** PRD §5.4, §5.5, D5, D6, G6 · **Design:** ADR-0002,
architecture §4

**File:** `src/content/skills.js` — **modify** (full rewrite of the array).

**Change.** Replace the flat array of 18 filename strings with a default-exported array of
**26 objects**, shape:

`{ file: string, label: string }`

- `file` — the exact case-sensitive filename inside `public/skills/`, extension included.
- `label` — the display string from PRD §5.4/§5.5, **verbatim**, used both as the visible
  tile text and as the `alt` text.

**Do not** add `category`, `url`, `level` or any other field (ADR-0002 §3).

**Asset filenames verified on disk** (`public/skills/`, listed 2026-08-27):
`bootstrap.svg`, `c++.png`, `css.svg`, `django.svg`, `express.svg`, `flutter.png`,
`framer-motion.svg`, `git.svg`, `github.svg`, `html.svg`, `java.svg`, `js.svg`,
`laravel.png`, `linux.svg`, `mongodb.svg`, `mysql.png`, `nodejs.svg`, `php.png`,
`postgre.png`, `python.svg`, `react.svg`, `tailwind.svg`, `vite.png`, **`nextjs.png`**,
**`angular.png`**, **`capacitor.svg`**, **`docker.png`**, **`aws.svg`**,
**`firebase.png`**, **`gitlab.png`**, **`xampp.svg`**.

`nextjs.svg` **does not exist** (deleted). `express.svg`, `framer-motion.svg`,
`linux.svg`, `python.svg`, `vite.png` stay unused on disk — adding them would be content
PRD §5 does not authorise (architecture §6).

**The array, in this exact order** (ADR-0002 "Ordering decision": domain-grouped
frontend → mobile → languages & backend → data → cloud/infra → tooling; QA diffs this
table against the rendered grid):

| idx | `file` | `label` | group |
|----|--------|---------|-------|
| 0 | `react.svg` | `React` | frontend |
| 1 | `nextjs.png` | `Next.js` | frontend (new) |
| 2 | `angular.png` | `Angular` | frontend (new) |
| 3 | `js.svg` | `JavaScript` | frontend |
| 4 | `html.svg` | `HTML5` | frontend |
| 5 | `css.svg` | `CSS3` | frontend |
| 6 | `tailwind.svg` | `Tailwind CSS` | frontend |
| 7 | `bootstrap.svg` | `Bootstrap` | frontend |
| 8 | `flutter.png` | `Flutter` | mobile |
| 9 | `capacitor.svg` | `Capacitor` | mobile (new) |
| 10 | `java.svg` | `Java` | languages & backend |
| 11 | `c++.png` | `C++` | languages & backend |
| 12 | `php.png` | `PHP` | languages & backend |
| 13 | `nodejs.svg` | `Node.js` | languages & backend |
| 14 | `laravel.png` | `Laravel` | languages & backend |
| 15 | `django.svg` | `Django` | languages & backend |
| 16 | `mysql.png` | `MySQL` | data |
| 17 | `postgre.png` | `PostgreSQL` | data |
| 18 | `mongodb.svg` | `MongoDB` | data |
| 19 | `firebase.png` | `Firebase` | data (new) |
| 20 | `aws.svg` | `AWS` | cloud / infra (new) |
| 21 | `docker.png` | `Docker` | cloud / infra (new) |
| 22 | `xampp.svg` | `XAMPP` | cloud / infra (new) |
| 23 | `git.svg` | `Git` | tooling |
| 24 | `github.svg` | `GitHub` | tooling |
| 25 | `gitlab.png` | `GitLab` | tooling (new) |

26 records. All 18 pre-existing tiles retained (PRD §4: no deletions). All 8 new tiles
present.

**Done criteria** (verified after task 9 makes the grid render; if you run `npm run dev`
now, the Skills grid will still render the old way — that is expected and is fixed in
task 9):

- D1.1 `npm run lint` exits 0.
- D1.2 Recorded in the execution log: the 26 `label` values read back from the rendered
  page in task 9 match this table row-for-row, in this order.

---

### 2 · T2-D1 — `src/content/experience.js` (new)

**Ticket:** T2 · **Requirements:** PRD §5.1, §6.3 · **Design:** architecture §4

**File:** `src/content/experience.js` — **create**. Default-exports an array of 2 objects.

**Shape:** `{ id, company, title, type, start, end, current, highlights }`

| field | type | notes |
|---|---|---|
| `id` | string | stable lowercase slug, used as the React `key`. Never key by index. |
| `company` | string | rendered as `h3` |
| `title` | string | job title |
| `type` | string | employment type; rendered as a **badge**, never concatenated into `title` (PRD §5.1 note, T2 AC5) |
| `start` | string | |
| `end` | string | |
| `current` | boolean | drives the "ongoing" marker (T2 AC6) |
| `highlights` | `string[]` | one entry each here; rendered as a bullet list |

**Records, most recent first — exact values:**

**Record 1** (`id: "smartech"`)
- `company`: `Smartech Solutions Philippines Inc.`
- `title`: `Junior Software Developer`
- `type`: `Full-Time`
- `start`: `08/2025`
- `end`: `Present`
- `current`: `true`
- `highlights`: `["Develop and maintain mobile and web applications for various clients across different industries."]`

**Record 2** (`id: "leadsolutions"`)
- `company`: `LEADSolutions, Inc.`
- `title`: `Full Stack Developer`
- `type`: `Internship`
- `start`: `01/2025`
- `end`: `05/2025`
- `current`: `false`
- `highlights`: `["Developed an Accounting Online Approval System."]`

The word **"now"** must not appear anywhere (T2 AC3). `end` is `Present`, capital P.
**`Full-Time` casing (PRD D10):** capital `F`, hyphen, **capital `T`**. This is the same
term as the hero `STATUS` telemetry tile in task 6 and the two strings must be
character-identical — there is exactly one spelling of it site-wide. PRD §5.6 previously
carried a lowercase `Full-time`; D10 resolved that in favour of the capital `T`. **Do not
introduce a lowercase `Full-time` anywhere.** Verified by plan T2 AC3 as a side-by-side
pixel comparison, because `Ctrl+F` is case-insensitive and cannot catch a regression here.

**Done criteria** (verified after task 10 + 14 render the section):

- D2.1 `npm run lint` exits 0.
- D2.2 In the running app, browser Find for `now` (whole-word, case-insensitive) inside
  the `#experience` section returns zero matches; `Present` returns one.

---

### 3 · T3-D1 — `src/content/achievements.js` (new)

**Ticket:** T3 · **Requirements:** PRD §5.2, D3, D8, §6.3 · **Design:** architecture §4

**File:** `src/content/achievements.js` — **create**. Default-exports an array of
**9 objects**.

**Shape:** `{ id, award, category, event }` — `category` is `string | null`.

**Array index IS the display order** (PRD §5.2 is a contested ordering fixed by D3 — do
not re-sort, do not re-litigate). Exact values:

| idx | `id` | `award` | `category` | `event` |
|----|------|---------|------------|---------|
| 0 | `best-student-research` | `Best Student Research` | `null` | `18th Araw ng Parangal` |
| 1 | `psits-capstone-champion` | `Champion` | `Research Capstone Presentation` | `18th PSITS Regional Convention 2025` |
| 2 | `ceac-best-paper` | `Best Paper` | `Information and Computer Technologies Category` | `CEAC Research Forum 2025` |
| 3 | `psits-programming-3rd` | `3rd Place` | `Programming Competition` | `15th PSITS Regional Competition` |
| 4 | `ndmu-hackathon-2nd` | `2nd Place` | `Demo Pitching` | `NDMU Startup Hackathon 2024` |
| 5 | `hackforgov-6th` | `6th Place` | `HACKFORGOV` | `Capture-the-flag Competition 2023` |
| 6 | `national-robotics-2020` | `Champion` | `Mission Harvest Robotics Competition` | `National Robotics Competition 2020` |
| 7 | `kabataan-inyovator-2019` | `Champion` | `Mission Harvest Robotics Competition` | `Kabataan Inyovator 2019` |
| 8 | `robo-fest-2019` | `Champion` | `Line Tracing Competition` | `Robo Fest 2019` |

**Spelling is load-bearing** (T3 AC4). Copy exactly: `Kabataan Inyovator` (**not**
"Innovator"), `Araw ng Parangal`, `HACKFORGOV` (all caps), `Robo Fest` (two words),
`Capture-the-flag` (lowercase after the first hyphen).

**No years may be added** to idx 0 and idx 3 (PRD D8, T3 AC6). Superscripts stay inline:
`3rd Place`, `18th`, `15th` — no `<sup>`, no `rd`/`th` as separate text.

**Done criteria** (verified after tasks 11 + 14):

- D3.1 `npm run lint` exits 0.
- D3.2 In the running app, browser Find returns: `Kabataan Inyovator` → ≥ 1 match;
  `Kabataan Innovator` → 0 matches; `rd th` → 0; `3 - Programming` → 0; `15 PSITS` → 0
  (T3 AC4, AC5). Record the counts in the execution log.

---

### 4 · T4-D1 — `src/content/education.js` (new)

**Ticket:** T4 · **Requirements:** PRD §5.3, D4, §6.3 · **Design:** architecture §4

**File:** `src/content/education.js` — **create**. Default-exports an array of 2 objects.

**Shape:** `{ id, institution, program, start, end }`

| idx | `id` | `institution` | `program` | `start` | `end` |
|----|------|---------------|-----------|---------|-------|
| 0 | `ndmu` | `Notre Dame of Marbel University` | `Bachelor of Science in Information Technology` | `2021` | `2025` |
| 1 | `lnhs` | `Laguilayan National High School` | `Information and Communications Technology` | `2014` | `2021` |

`Bachelor of Science **in** Information Technology` — the preposition is PRD D4, keep it.
No GPA, honors, coursework, or location fields (T4 AC6).

**Done criteria** (verified after tasks 12 + 14):

- D4.1 `npm run lint` exits 0.
- D4.2 In the running app, the `#education` section contains exactly the four strings
  above and no other prose.

---

### 5 · T7-D1 — `src/content/sections.js` (new) — the section registry

**Ticket:** T7 (also T6) · **Requirements:** PRD §6.1, §6.2, D7 · **Design:** ADR-0005,
architecture §5

**File:** `src/content/sections.js` — **create**. Default-exports an array of 7 objects.

**Shape:** `{ id, navLabel, eyebrow, firstWord, secondWord }` — the last three are
`string | null`.

**Array order IS page order** and is the authority for nav order and scroll-spy
tie-breaking. Exact values:

| idx | `id` | `navLabel` | `eyebrow` | `firstWord` | `secondWord` |
|----|------|-----------|-----------|-------------|--------------|
| 0 | `about` | `About` | `null` | `null` | `null` |
| 1 | `projects` | `Missions` | `mission log` | `My` | `Projects` |
| 2 | `skills` | `Systems` | `cargo hold` | `Skills` | `&Tools` |
| 3 | `experience` | `Service` | `service record` | `Work` | `Experience` |
| 4 | `achievements` | `Medals` | `commendations` | `Academic` | `Achievements` |
| 5 | `education` | `Academy` | `training log` | `My` | `Education` |
| 6 | `contact` | `Transmit` | `ground control` | `Contact` | `Me` |

**Contract:**

- `eyebrow` carries **no** `// ` prefix. `Heading` already prepends `// ` itself
  (`App.css .station-heading__eyebrow` + `Heading.jsx` line 13). Adding it here would
  render `// // mission log`.
- `Heading` joins `firstWord` + `secondWord` with **no separator**, so
  `Work` + `Experience` renders `<WorkExperience/>` — exactly what T2 AC1 requires. Do
  **not** insert a space.
- The `about` row's `null`s exist because the hero owns an `h1`, not a `Heading`.
  `App.jsx` never renders `Heading` for `about`, so `Heading.propTypes` needs no change.
- **Nav labels are frozen by PRD D7.** This registry is not a licence to rename them.

**Done criteria:**

- D5.1 `npm run lint` exits 0.
- D5.2 After task 15, the nav in the running app shows exactly these 7 `navLabel` values
  in this left-to-right order at 1440 px (T6 AC1).

---

### 6 · T1-D1 — `src/content/hero.js` (new) — mission, telemetry, CTAs

**Ticket:** T1 · **Requirements:** PRD §5.6, G1, G2 · **Design:** ADR-0006,
architecture §11 · **dep:** tasks 1, 3

**File:** `src/content/hero.js` — **create**. Default-exports a **single object** (not an
array).

**Imports** (the only content→content dependency allowed in the codebase, ADR-0006 §3):
`./projects`, `./achievements`, `./skills`.

**Shape and exact values:**

| key | type | value |
|---|---|---|
| `boot` | string | `> uplink established` — one line only. No trailing period, no ellipsis. (PRD §5.6 item 1, D12) |
| `classificationStatic` | string | `Junior Software Developer · Robotics Enthusiast · Tech Innovator` — the reduced-motion replacement for the typewriter (PRD §5.6 item 4, D13). Separator is **MIDDLE DOT `·` U+00B7** with exactly one space either side. Copy the character from this document; do not use `&middot;`, `&#183;`, a bullet `•` (U+2022), or an interpunct typed as a period. |
| `mission` | string | `Junior Software Developer building mobile and web systems for real-world clients.` |
| `telemetry` | `{ label, value }[]` | 4 entries, table below |
| `ctas` | `{ label, href, variant }[]` | 2 entries, table below |
| `channelsLabel` | string | `comm channels` (PRD §5.6 item 8, D12) |
| `scrollCue` | string | `descend ↓` (PRD §5.6 item 9, D12) |

**`telemetry` — 3 of 4 values are DERIVED, not typed** (ADR-0006 §3; this is what makes
T1 AC8 structurally true instead of a manual recount):

| idx | `label` | `value` |
|----|---------|---------|
| 0 | `STATUS` | literal string `Full-Time @ Smartech Solutions PH` |
| 1 | `MISSIONS` | template: `` `${projects.length} projects shipped` `` |
| 2 | `COMMENDATIONS` | template: `` `${achievements.length} academic awards` `` |
| 3 | `SYSTEMS` | template: `` `${skills.length} tools & technologies` `` |

With the modules from tasks 1 and 3 these render `6 projects shipped`,
`9 academic awards`, `26 tools & technologies` — the exact strings T1 AC7 demands.
**Do not hardcode the numbers.**

**`Full-Time` casing — one spelling site-wide (PRD D10).** Capital `F`, hyphen, **capital
`T`**. This is the *same term* as the Experience badge in `content/experience.js` (task 2)
and the two must be character-identical. PRD §5.6 previously carried a lowercase
`Full-time` here, which put two spellings of one term on one page; D10 resolved it in
favour of the capital `T`. Plan T2 AC3 verifies this by reading the rendered pixels of the
badge and the hero tile side by side — `Ctrl+F` is case-insensitive and cannot catch a
regression here. **Do not introduce a lowercase `Full-time` anywhere.**

**`ctas`** (labels fixed by ADR-0006 §5 — deliberately plain, not themed):

| idx | `label` | `href` | `variant` |
|----|---------|--------|-----------|
| 0 | `View Projects` | `#projects` | `primary` |
| 1 | `Contact Me` | `#contact` | `ghost` |

**Hero word budget — binding (T1 AC6 caps countable hero copy at ≤ 40 words / ≤ 2
sentences).** Countable, per plan T1 AC6 as amended and PRD §5.6 "Word-budget interlock" =
every hero string **except** the nav, `hero__name`, `hero__designation`, the
**classification line (typewriter *or* its static replacement)**, and social-icon labels.
**The boot ticker IS counted** — plan T1 AC6 now says so explicitly. Allocation:

| element | source | words |
|---|---|---|
| boot ticker (1 line) | `hero.boot` | 2 |
| mission sentence | `hero.mission` | 11 |
| 4 telemetry labels | `hero.telemetry[].label` | 4 |
| 4 telemetry values | `hero.telemetry[].value` | 15 |
| 2 CTA labels | `hero.ctas[].label` | 4 |
| channels label | `hero.channelsLabel` | 2 |
| scroll cue | `hero.scrollCue` | 1 |
| **total** | | **39 / 40** — **1 sentence** |
| *(excluded)* | `hero.classificationStatic` | *not counted* |

**Re-verified under amendment A1.** The D10 casing change is `Full-time` → `Full-Time`,
which alters no word count, and `classificationStatic` is excluded by PRD §5.6 item 4 on
the same basis as the typewriter it replaces. The total therefore remains **39 words / 1
sentence**, matching PRD §5.6 and plan T1 AC6's stated design target exactly. **1 word of
headroom.**

Only `hero.mission` ends in a terminal `.`. Nothing else in this module may gain one
(note `classificationStatic` has no terminal period either), and no string may be
lengthened without re-doing this table.

No emoji in this file. `↓` is U+2193 (an arrow glyph, not an emoji) and `·` is U+00B7 (a
punctuation glyph); both are retained and neither is an emoji.

**Done criteria** (verified after task 13):

- D6.1 `npm run lint` exits 0.
- D6.2 In the running app the telemetry strip shows `6 projects shipped`,
  `9 academic awards`, `26 tools & technologies`, and the same page renders 6 project
  cards, 9 achievement entries and 26 skill tiles — counted on screen (T1 AC7, AC8).
  Record all six counts in the execution log.
- D6.3 The `STATUS` tile reads `Full-Time @ Smartech Solutions PH` with a capital `T`, and
  a screenshot of it placed beside a screenshot of the Experience badge shows two
  character-identical `Full-Time` strings (T1 AC7, T2 AC3, PRD D10).

---

### 7 · T8-D1 — `src/lib/motion.js` (new) — shared motion vocabulary

**Ticket:** T8 (serves T1, T2, T3, T4, T10) · **Requirements:** PRD §7.4 ·
**Design:** ADR-0004 §2, ADR-0007 Layer 2, architecture §9.1

**File:** `src/lib/motion.js` — **create**. New directory `src/lib/`.

**Hard rule:** this file contains **no JSX and no React component**. All exports start
with a lowercase letter, so `react-refresh/only-export-components` stays quiet under
`--max-warnings 0` (ADR-0004 §2).

**Exact export list** (this is the binding contract; it extends the illustrative list in
ADR-0004 §2 with the per-grid variants that ADR-0004 said would be "fixed in `task.md`"):

| export | kind | definition |
|---|---|---|
| `viewportOnce` | object | `{ once: true, amount: 0.2 }` |
| `viewportHeading` | object | `{ once: true, amount: 0.6 }` — preserves `Heading`'s current viewport |
| `viewportCard` | object | `{ once: true, amount: 0.25 }` — preserves `ProjectCard`'s current viewport |
| `viewportConsole` | object | `{ once: true, amount: 0.3 }` — preserves `ContactForm`'s current viewport |
| `easeOut` | array | `[0.16, 1, 0.3, 1]` — the codebase's only easing |
| `staggerContainer` | variants | `hidden: {}` / `visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } }` — for containers with **≤ 6** children |
| `staggerContainerTight` | variants | `hidden: {}` / `visible: { transition: { staggerChildren: 0.02, delayChildren: 0 } }` — for containers with **> 6** children |
| `riseItem` | variants | `hidden: { opacity: 0, y: 24 }` / `visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } }` |
| `cardRise` | variants | `hidden: { opacity: 0, y: 60, rotateX: -8 }` / `visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: easeOut } }` — preserves `ProjectCard`'s look |
| `headingRise` | variants | `hidden: { opacity: 0, scale: 0.85, filter: "blur(6px)" }` / `visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: easeOut } }` — preserves `Heading`'s look |
| `consoleRise` | variants | `hidden: { opacity: 0, scale: 0.92 }` / `visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } }` — preserves `ContactForm`'s look |
| `reveal` | function | `reveal(reduced, variants, viewport = viewportOnce)` |
| `item` | function | `item(reduced, variants)` |

**`reveal` contract** (ADR-0007 Layer 2 — the return shapes are the whole point):

- `reduced === true` → returns **`{}`**. Not a transform-free fade — literally no
  `initial`, no `whileInView`, no `variants`, no `viewport`. The element renders in its
  natural DOM state, immediately, at full opacity. This is the only shape that satisfies
  "immediately visible" in T1 AC13 / T8 AC6 / T10 AC9.
- `reduced === false` → returns
  `{ initial: "hidden", whileInView: "visible", viewport, variants }`.

**`item` contract:**

- `reduced === true` → returns **`undefined`** (child has no variants, so no ancestor
  stagger container can drive it).
- `reduced === false` → returns `variants` unchanged.

Call sites spread the result: `<motion.li {...reveal(reduced, riseItem)}>` or
`<motion.li variants={item(reduced, riseItem)}>`.

**Motion budget assignment** (T8 AC4: a new section's content must be fully readable
≤ 600 ms after entering the viewport; formula from ADR-0004 §3 is
`staggerChildren × (n − 1) + duration`):

| container | n | variants used | worst-case | verdict |
|---|---|---|---|---|
| `.service-log` (Experience) | 2 | `staggerContainer` + `riseItem` | 0.06 + 0.40 = **0.46 s** | within 600 ms |
| `.academy-grid` (Education) | 2 | `staggerContainer` + `riseItem` | 0.06 + 0.40 = **0.46 s** | within 600 ms |
| `.commendation-grid` (Achievements) | 9 | `staggerContainerTight` + `riseItem` | 0.16 + 0.40 = **0.56 s** | within 600 ms |
| `.module-grid` (Skills) | 26 | `staggerContainerTight` + `riseItem` | 0.50 + 0.40 = **0.90 s** | over the 600 ms guideline — Skills is **not** a "new section", so T8 AC4 does not bind it; this is still a large improvement on the current 2.40 s. Flagged, §4 F8. |
| `.mission-grid` (Projects) | 6 | per-card `reveal(reduced, cardRise, viewportCard)` — unchanged shape | 0.60 s per card, independent | unchanged behaviour |

**Done criteria:**

- D7.1 `npm run lint` exits 0 with `--max-warnings 0` and **no**
  `react-refresh/only-export-components` warning for `src/lib/motion.js`. Paste the real
  command output into the execution log.
- D7.2 `npm run build` exits 0.

---

### 8 · T8-D2 — `App.css`: table of contents + the `record` primitive block

**Ticket:** T8 · **Requirements:** PRD §7.4, §6.3 · **Design:** ADR-0003, ADR-0004 §1,
architecture §7, §8

**File:** `src/App.css` — **modify** (additive; no existing rule is deleted in this task).

**8a — Table of contents.** Add a comment block immediately after the `@import` line
listing every banner block in file order. The target order (architecture §7.1) is:

```
tokens
resets / globals / a11y
starfield
flight path
HUD navbar
hero
station / heading
record                       <-- NEW (this task)
mission cards (projects)
modules (skills)
service log (experience)     <-- NEW (task 10)
commendations (achievements) <-- NEW (task 11)
academy (education)          <-- NEW (task 12)
console (contact)
mobile spacing
footer
```

The existing file already matches this order for the blocks it has; you are inserting
four new blocks at their **page positions**, never at the bottom. Keep the existing
`/* ---------- name ---------- */` banner style.

**8b — The `record` primitive.** Insert a new
`/* ---------- record (shared credential primitive) ---------- */` block **between** the
existing `station / heading` block (ends at the `.station-heading__accent` rule) and the
existing `mission cards (projects)` block.

This class family owns **surface, spacing, type scale and hover** for every item in the
three new sections. Section modifiers own **accent colour and internal arrangement
only** — a modifier may **not** change background, border width, radius, blur, or the
hover reaction (ADR-0004 §1). Anything that needs to belongs in `.record`.

| class | responsibility / key declarations |
|---|---|
| `.record` | `position: relative`; `background: var(--panel)`; `border: 1px solid var(--panel-border)`; `border-radius: 16px`; `padding: 20px 22px`; `backdrop-filter: blur(8px)` + `-webkit-backdrop-filter`; `overflow-wrap: anywhere`; `transition: border-color .25s ease, box-shadow .25s ease` **← corrected by task 24: no `transform` in this list** |
| `.record:hover` | `border-color: var(--thruster)`; `box-shadow: 0 12px 40px rgba(67, 232, 216, 0.15)`. **No `transform` here — corrected by task 24.** The 4 px lift comes from `whileHover={{ y: -4 }}` in the item components (tasks 10–12), deliberately the same mechanism and character as `.mission-card:hover` + `ProjectCard`'s `whileHover`, which is what makes T8 AC7 true structurally |

> **If you are reading this task fresh, apply task 24's corrected values, not the
> originals.** The original spec put `transform: translateY(-4px)` in `.record:hover`; that
> can never render, because framer-motion writes an inline `transform` on every `motion.li`
> and inline beats the stylesheet. It was measured dead in the running app. See task 24 and
> architecture §8.1.
| `.record__meta` | `font-family: var(--font-mono)`; `font-size: 11px`; `text-transform: uppercase`; `letter-spacing: 1.5px`; `color: var(--text-dim)`; `margin-bottom: 10px` — date ranges only |
| `.record__title` | `font-family: var(--font-display)`; `font-size: 17px`; `line-height: 1.35`; `color: var(--starlight)`; `margin-bottom: 4px` — always the `h3` content |
| `.record__award` | `font-family: var(--font-display)`; `font-size: 20px`; `line-height: 1.3`; `color: var(--solar)`; `margin-bottom: 6px` — the achievement `h3`; larger **and** accent-coloured so T3 AC7 ("award is the visually dominant element") is satisfied on both axes |
| `.record__subtitle` | `font-family: var(--font-body)`; `font-size: 14px`; `color: var(--starlight)`; `margin-bottom: 6px` |
| `.record__badge` | `display: inline-flex`; `font-family: var(--font-mono)`; `font-size: 11px`; `letter-spacing: 1px`; `padding: 4px 10px`; `border-radius: 999px`; `background: rgba(124, 92, 255, 0.12)`; `border: 1px solid var(--panel-border)`; `color: var(--starlight)`; `white-space: nowrap` |
| `.record__note` | `font-size: 13px`; `line-height: 1.6`; `color: var(--text-dim)` |
| `.record__notes` | `display: grid`; `gap: 6px`; `margin-top: 10px` — the bullet-list container |
| `.record--service` | accent + arrangement only (task 10) |
| `.record--commendation` | accent + arrangement only (task 11) |
| `.record--academy` | accent + arrangement only (task 12) |

`.record__award` is an **additive extension** to the element list in architecture §8 /
ADR-0004 §1. Rationale: T3 AC7 needs the award to be typographically dominant, and putting
that in a `--commendation` modifier would break ADR-0004's "modifiers don't own the type
scale" rule. Keeping it as a primitive element is the consistent reading. Now also
recorded in architecture §8 and ADR-0004 §1 (§4 F6a, closed).

**Accent assignment** (existing tokens only — PRD §7.4, T8 AC1): Experience →
`--thruster`; Achievements → `--solar`; Education → `--nebula-2`.

**Done criteria:**

- D8.1 `npm run dev` — the page still renders exactly as before this task (this task adds
  unused rules only; no visual diff). Confirm by screenshot comparison at 1440 px.
- D8.2 DevTools Console shows zero new errors or warnings.
- D8.3 `npm run build` exits 0.

---

### 9 · T5-D2 — `Skill.jsx` breaking prop change + call site + `.module` CSS

**Ticket:** T5 · **Requirements:** PRD §5.4, §5.5, §7.2, G6 · **Design:** ADR-0002 ·
**dep:** tasks 1, 7

> ### ⚠ BREAKING CHANGE — complete all three parts in this one task
> `Skill`'s public props change from `{ skill: string }` to `{ file: string, label: string }`.
> There is **exactly one call site**: `src/App.jsx` line 66,
> `{skills.map((skill, index) => (<Skill key={index} skill={skill} />))}`.
> If you change the component without the call site (or vice-versa) the Skills section
> renders 26 broken images and floods the console with PropTypes warnings. Do not stop,
> commit, or hand off between 9a and 9b.

**9a — `src/components/Skill.jsx`** (modify)

- Delete the label-derivation line `const label = skill.replace(/\.(svg|png)$/, "");`
  entirely. The component performs **zero string manipulation** after this task.
- New props: `file` (string, required), `label` (string, required). PropTypes updated to
  match exactly.
- `<img src={`${import.meta.env.BASE_URL}skills/${file}`} alt={label} className="module__img" />`
- `<span className="module__label">{label}</span>`
- Replace the inline `variants={{ hidden: …, visible: … }}` object with
  `variants={item(reduced, riseItem)}` where `reduced = useReducedMotion()` (imported from
  `framer-motion`) and `item` / `riseItem` come from `../lib/motion`. Keep
  `whileHover={{ y: -6, scale: 1.06 }}`.
  - Accepted visual change: tiles now rise without the previous `scale: 0.85 → 1` pop, so
    all item-level reveals in the app share one variant (T8 consistency). Note it in the
    execution log.
- Root element stays `<motion.div className="module">`.
- **`nextjs.svg` must not appear anywhere in `src/` after this task** (T5 AC5,
  architecture §6). Grep for it.

**9b — `src/App.jsx`** (modify, call site only — full composition rewrite is task 14)

- `{skills.map((skill) => (<Skill key={skill.file} file={skill.file} label={skill.label} />))}`
- Key by `skill.file`, **not** by index (ADR-0002 §4). The `index` variable is no longer
  needed here — remove it or lint will flag it unused.

**9c — `src/App.css`, `modules (skills)` block** (modify)

- **Remove `text-transform: uppercase` from `.module__label`.** T5 AC2/AC3 require the
  *visible* labels to read exactly `Next.js`, `Node.js`, `PostgreSQL`, `Tailwind CSS`,
  `C++`, `HTML5`, `CSS3` — `text-transform: uppercase` would render `NEXT.JS`,
  `POSTGRESQL`. Keep `letter-spacing: 0.5px`, `font-size: 11px`, `font-family: var(--font-mono)`,
  `color: var(--text-dim)`. This is a user-visible change to the 18 existing tiles —
  approved by the PO as **PRD D11** and recorded in PRD §5.5 (§4 F3, closed). Plan T5
  AC4 names it as an expected visual diff, not a regression.
- `.module__label` also gets `text-align: center`; `line-height: 1.3`;
  `max-width: 100%`; `overflow-wrap: anywhere` so `Tailwind CSS` cannot spill the tile.
- `.module__img` becomes a fixed optical box so 26 logos of mixed aspect ratio look the
  same size (T5 AC7): `width: 42px`; `height: 42px`; `object-fit: contain`. Replace the
  existing `max-width: 42px; max-height: 42px`.
- `.module` keeps `width: 130px; height: 100px` (a 130 px tile cannot force overflow at
  375 px, so T9 AC6 is unaffected) but gains `padding: 8px` so the label has room.

**Done criteria** (all in a browser against `npm run dev`):

- D9.1 The Skills section renders **exactly 26** tiles, counted on screen (T5 AC1).
- D9.2 **Judged on rendered glyphs in a 1440 px screenshot, character for character
  including capitalisation** (T5 AC2, AC3 — *not* on DOM text, not on accessible names,
  and **not** with `Ctrl+F`, which is case-insensitive and cannot detect this): all 26
  painted labels match the `label` column of task 1's table.
- D9.3 **Mixed case is the requirement and is an approved visual diff to the 18 existing
  tiles** (T5 AC4, PRD D11). On that same screenshot: `Next.js`, `Node.js`, `PostgreSQL`,
  `Tailwind CSS`, `JavaScript`, `MySQL`, `MongoDB`, `GitHub`, `GitLab`, `React`,
  `Angular`, `Capacitor`, `Docker`, `Firebase`, `Laravel`, `Django`, `Flutter`,
  `Bootstrap`, `Git`, `Java` all appear in mixed case. Seeing `NEXT.JS`, `POSTGRESQL`,
  `NODE.JS` or `TAILWIND CSS` is a **fail**. The only legitimately all-caps tiles are the
  brand-capitalised ones: `AWS`, `XAMPP`, `PHP`, `HTML5`, `CSS3`, `C++`. Record this in
  the execution log as an **expected visual diff, not a regression**.
- D9.4 DevTools **Network** tab, hard refresh with "Disable cache" on: every request under
  `/skills/` returns **200**; there is **no request for `nextjs.svg`**; there are **zero
  404s**. Record the request count and status summary in the execution log (T5 AC5).
- D9.5 Every tile shows real artwork — no broken-image icon, no empty box (T5 AC2/AC3).
- D9.6 DevTools element inspection of all 8 new tiles plus `C++`, `PostgreSQL`, `Node.js`:
  each `<img>`'s `alt` equals its visible label (T5 AC6).
- D9.7 Screenshots at 1440 px and 375 px: all tiles share the same footprint, no logo
  overflows its tile, no logo is at a wildly different optical size than its neighbours;
  the grid wraps with no horizontal scrollbar and no clipped tile (T5 AC7, AC8).
- D9.8 DevTools Console: zero errors, zero React warnings (in particular no PropTypes
  warning from `Skill`).
- D9.9 `npm run lint` exits 0; `npm run build` exits 0.

---

### 10 · T2-D2 — `ExperienceEntry.jsx` + `.service-log` CSS

**Ticket:** T2 · **Requirements:** PRD §5.1, §6.3, §7.2, G3 · **Design:** ADR-0001,
ADR-0004, architecture §8 · **dep:** tasks 2, 7, 8

**10a — `src/components/ExperienceEntry.jsx`** (create)

Item component. Imports no data. Root element:
`<motion.li className="record record--service">`, plus the class
`record--service--current` when `current` is `true`.

**Props (flat scalars — no object props):**

| prop | type | required |
|---|---|---|
| `company` | `string` | yes |
| `title` | `string` | yes |
| `type` | `string` | yes |
| `start` | `string` | yes |
| `end` | `string` | yes |
| `current` | `bool` | no, default `false` |
| `highlights` | `arrayOf(string)` | no, default `[]` |

**Internal markup, in this DOM order** (DOM order == visual order; no `order`, no
`row-reverse`, no `tabindex` — architecture §9.3):

1. `<span className="record__meta">` containing `` `${start} – ${end}` `` — EN DASH, see
   §0.5. When `current` is true, wrap `end` in
   `<span className="record__meta-live">{end}</span>` so `Present` is accent-coloured.
2. `<h3 className="record__title">{company}</h3>` — **must be `h3`** (T2 AC7, T10 AC4).
3. `<p className="record__subtitle">{title}</p>`
4. `<span className="record__badge">{type}</span>` — its own element, never concatenated
   into the title string (T2 AC5).
5. `<ul className="record__notes">` with one `<li className="record__note">` per
   `highlights` entry.

**Motion:** `const reduced = useReducedMotion()` and `variants={item(reduced, riseItem)}`.
The component sets **no** `initial` / `whileInView` / `viewport` of its own — the parent
container in `App.jsx` drives the stagger (architecture §9.1 shape 2). Nesting a second
stagger container is not allowed.

**10b — `src/App.css`, new `/* ---------- service log (experience) ---------- */` block**

Insert **after** the `modules (skills)` block and **before** the `commendations` block.

| class | key declarations |
|---|---|
| `.service-log` | `display: grid`; `gap: 24px`; **no `max-width`, no `margin-inline: auto`** |
| `.record--service` | `padding-left: 42px` (room for the rail); accent is `--thruster` |
| `.record--service::before` | the rail: `content: ""`; `position: absolute`; `left: 18px`; `top: 26px`; `bottom: -24px` (spans the grid gap into the next entry); `width: 1px`; `background: rgba(67, 232, 216, 0.28)`; `aria-hidden` by construction (pseudo-element) |
| `.record--service:last-child::before` | `display: none` (the rail stops at the last node) |
| `.record--service::after` | the node dot: `content: ""`; `position: absolute`; `left: 14px`; `top: 22px`; `width: 9px`; `height: 9px`; `border-radius: 50%`; `background: var(--space-deep)`; `border: 1px solid var(--thruster)` |
| `.record--service--current::after` | `background: var(--thruster)`; `box-shadow: 0 0 10px var(--thruster)` — filled + glowing vs. hollow for past roles |
| `.record__meta-live` | `color: var(--thruster)` |

> **The `.service-log` container must not set `max-width` or auto side margins.** T2 AC9
> requires the section's left content edge to match Projects and Skills within ~4 px; the
> `<ul>` therefore spans the full `.station` content width, exactly like `.mission-grid`
> and `.module-grid`. The timeline rail lives **inside** the card's left padding, so the
> card's panel border sits on the same x as a project card's.

> **No pulsing/looping animation on the node.** PRD §6.3 suggested a pulse "e.g.", but
> ADR-0004 §3 budgets the three new sections at **zero** looping effects, and the existing
> `@media (prefers-reduced-motion: reduce)` block would flatten a CSS pulse to one
> iteration anyway. The static filled + glowing node plus the accent-coloured `Present`
> satisfies T2 AC6 ("the difference is visible in a screenshot comparison"). It is also
> the only variant compatible with plan T8 AC6, which now requires **zero** looping motion
> under reduced motion with no exceptions. See §4 F6 (closed).

Long-string handling: `.record` already carries `overflow-wrap: anywhere`, which is what
lets `Smartech Solutions Philippines Inc.` wrap at 375 px (T2 AC8, T9 AC3).

**Done criteria** (verified in a browser after task 14 wires the section in — do not
claim these until then):

- D10.1 `http://localhost:5173/#experience` scrolls to a visible section whose heading
  reads `<WorkExperience/>` with the eyebrow `// service record` (T2 AC1).
- D10.2 The section renders exactly **2** entries (T2 AC2).
- D10.3 Entry 1 shows, all visible with no hover/click: `Smartech Solutions Philippines Inc.`,
  `Junior Software Developer`, `Full-Time`, `08/2025 – Present`, and the bullet
  `Develop and maintain mobile and web applications for various clients across different industries.`
  (T2 AC3).
- D10.3b **One spelling of `Full-Time` site-wide** (T2 AC3, T1 AC7, PRD D10). Screenshot
  the rendered Experience badge and the rendered hero `STATUS` telemetry tile, place them
  side by side, and confirm the two strings are **character-identical** — capital `F`,
  hyphen, capital `T`. No lowercase `Full-time` appears anywhere on the page. Judged by
  reading the pixels: `Ctrl+F` is case-insensitive and will happily match both spellings.
- D10.4 Entry 2 shows: `LEADSolutions, Inc.`, `Full Stack Developer`, `Internship`,
  `01/2025 – 05/2025`, bullet `Developed an Accounting Online Approval System.` (T2 AC4).
- D10.5 The employment type renders as a visually distinct pill with its own background
  and border, not merged into the title line — screenshot (T2 AC5).
- D10.6 Screenshot comparison of the two entries shows entry 1 carrying an ongoing marker
  (filled glowing node + accent-coloured `Present`) that entry 2 does not (T2 AC6).
- D10.7 DevTools element inspection: both company names are `h3` elements (T2 AC7).
- D10.8 At 375 px: no horizontal scrollbar and `Smartech Solutions Philippines Inc.` wraps
  onto multiple lines rather than overflowing or clipping (T2 AC8).
- D10.9 At 1440 px, measured with DevTools: the left edge of an experience card is within
  4 px of the left edge of a project card and of the skills grid (T2 AC9). Record the
  three measured x-offsets.
- D10.10 Hovering an experience entry produces a lift + teal glow of the same character as
  hovering a project card (T8 AC7).
- D10.11 `npm run lint` exits 0.

---

### 11 · T3-D2 — `AchievementCard.jsx` + `.commendation-grid` CSS

**Ticket:** T3 · **Requirements:** PRD §5.2, §6.3, §7.2, G4 · **Design:** ADR-0001,
ADR-0004, architecture §8, §9.3 · **dep:** tasks 3, 7, 8

**11a — `src/components/AchievementCard.jsx`** (create)

Item component. Root: `<motion.li className="record record--commendation">`.

**Props:**

| prop | type | required |
|---|---|---|
| `award` | `string` | yes |
| `category` | `string` | **no** — may be `null`/absent |
| `event` | `string` | yes |

**Internal markup, in this DOM order:**

1. `<h3 className="record__award">{award}</h3>` — the award is both the visually dominant
   element (T3 AC7) and the semantic heading, so the grid is navigable by heading outline
   (architecture §9.3).
2. `<p className="record__subtitle">{category}</p>` — **rendered only when `category` is
   truthy.** When `null`, render nothing: no element, no placeholder, no dash (§0.6, PRD D8).
3. `<p className="record__note">{event}</p>`

Do **not** use `.record__meta` for `event`: `.record__meta` applies
`text-transform: uppercase`, and T3 AC3/AC4 require `Kabataan Inyovator`, `Araw ng Parangal`,
`Robo Fest` and `Capture-the-flag` to be visible in their authored casing.

All content is readable with no interaction — no accordion, no "show more", no
hover-to-reveal (T3 AC8).

**Motion:** `const reduced = useReducedMotion()`; `variants={item(reduced, riseItem)}`; no
own `initial`/`whileInView`/`viewport`.

**11b — `src/App.css`, new `/* ---------- commendations (achievements) ---------- */` block**

Insert **after** `service log` and **before** `academy`.

| class | key declarations |
|---|---|
| `.commendation-grid` | `display: grid`; `grid-template-columns: minmax(0, 1fr)`; `gap: 20px`; **no `max-width`, no auto side margins** |
| `.commendation-grid` `@media (min-width: 640px)` | `grid-template-columns: repeat(2, minmax(0, 1fr))` **plus the row-span rule below** |
| `.commendation-grid` `@media (min-width: 1024px)` | `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `.record--commendation` | `display: flex`; `flex-direction: column`; accent is `--solar`; a top accent hairline via `::before` (`content: ""`; `position: absolute`; `top: 0`; `left: 22px`; `right: 22px`; `height: 1px`; `background: rgba(255, 177, 94, 0.35)`) — accent + arrangement only, per ADR-0004 |

> **Use explicit column counts, not `repeat(auto-fit, minmax(…))`.** 9 items in a fixed
> 3-column grid at ≥ 1024 px is a clean 3 × 3 with no orphan row, which is what T3 AC10
> requires at 1280 px and 1440 px. An `auto-fit` track list would let the column count
> drift with the container and can produce a 4/4/1 layout.

**No orphaned 9th card in the 2-column range (PRD §6.3, D14 · plan T3 AC10).** 9 is odd,
so at 640–1023 px the 9th card would otherwise sit alone at half width in the final row.
Inside the `@media (min-width: 640px)` block — and **only** there — the last grid item
spans both columns:

```
@media (min-width: 640px) {
  .commendation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .commendation-grid > li:last-child { grid-column: 1 / -1; }
}
```

Scoping matters in two directions:

- It must be **inside** the 640 px block, not at base level, so the single-column range
  below 640 px is unaffected (`1 / -1` there is a no-op but the rule should not exist).
- The `@media (min-width: 1024px)` block that follows re-declares
  `grid-template-columns: repeat(3, …)` but **does not** reset `grid-column`, so the
  `li:last-child` rule would still apply at ≥ 1024 px and stretch the 9th card across all
  three columns — breaking the clean 3 × 3 that T3 AC10 requires. **You must reset it**
  in the 1024 px block:

```
@media (min-width: 1024px) {
  .commendation-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .commendation-grid > li:last-child { grid-column: auto; }
}
```

Use `> li:last-child` (a structural selector), not a class on the 9th record: the span is
a property of *being last in an even-column grid*, not of that particular award, and
`AchievementCard` must stay identical for all 9 entries. Adding a "last" modifier class
would also force `App.jsx` to know the array length, which is exactly the kind of leak
ADR-0001 keeps out of the composition layer.

`.record--commendation` uses `display: flex; flex-direction: column`, so a spanning card
simply becomes wider — its internal layout needs no special case.

**Done criteria** (browser, after task 14):

- D11.1 `http://localhost:5173/#achievements` scrolls to a visible section headed
  `<AcademicAchievements/>` with eyebrow `// commendations` (T3 AC1).
- D11.2 The section renders exactly **9** entries (T3 AC2).
- D11.3 Reading top-to-bottom and left-to-right within a row, the 9 entries appear in
  exactly the order and with exactly the text of task 3's table (T3 AC3). Record the
  read-back list in the execution log.
- D11.4 Browser Find: `Kabataan Inyovator` ≥ 1; `Kabataan Innovator` = 0;
  `Araw ng Parangal` ≥ 1; `HACKFORGOV` ≥ 1; `Robo Fest` ≥ 1; `Capture-the-flag` ≥ 1
  (T3 AC4).
- D11.5 Browser Find: `rd th` = 0; `3 - Programming` = 0; `15 PSITS` = 0 (T3 AC5).
- D11.6 Entries 1 (`Best Student Research`) and 4 (`3rd Place`) contain no `19xx`/`20xx`
  substring anywhere in the card (T3 AC6).
- D11.7 Screenshot: in every card the award phrase is both larger and accent-coloured
  relative to the event text in the same card (T3 AC7).
- D11.8 All 9 entries are fully readable with no interaction (T3 AC8).
- D11.9 At 375 px: no horizontal scrollbar; `Information and Computer Technologies Category`
  wraps rather than clipping or ellipsising (T3 AC9).
- D11.10 **No orphaned card at any checkpoint** (T3 AC10, PRD D14). Full-width screenshots
  at 768, 1024 and 1440 px, plus DevTools measurements:
  - At **1280 px and 1440 px**: 3 columns × 3 rows, every row full, no ragged row, and the
    9th card is the **same width** as the cards above it (the `grid-column: auto` reset is
    working).
  - At **768 px**: 2 columns, and the 9th card's rendered width equals the grid's content
    width within ~2 px — its right edge lines up with the right edge of the card above it.
    Record both measured widths.
  - At **1024 px**: 3 columns (the 640 px span rule must no longer apply). Record the 9th
    card's width and confirm it matches a single column.
  - At **375 px and 414 px**: single column, so the question does not arise.
  - A half-width card sitting alone in the last row at any checkpoint is a **fail**.
- D11.11 DevTools element inspection: entry 1's card contains **no** subtitle element at
  all (not an empty one), because its `category` is `null`.
- D11.12 Hovering an achievement card produces the same lift + teal glow as a project card
  (T8 AC7).
- D11.13 `npm run lint` exits 0.

---

### 12 · T4-D2 — `EducationCard.jsx` + `.academy-grid` CSS

**Ticket:** T4 · **Requirements:** PRD §5.3, §6.3, §7.2, G5 · **Design:** ADR-0001,
ADR-0004 · **dep:** tasks 4, 7, 8

**12a — `src/components/EducationCard.jsx`** (create)

Item component. Root: `<motion.li className="record record--academy">`.

**Props:** `institution` (string, required), `program` (string, required), `start`
(string, required), `end` (string, required).

**Internal markup, in this DOM order:**

1. `<span className="record__meta">` containing `` `${start} – ${end}` `` (EN DASH).
2. `<h3 className="record__title">{institution}</h3>` — **must be `h3`** (T4 AC7).
3. `<p className="record__subtitle">{program}</p>`

Nothing else. No GPA, honors, coursework, or location — none was supplied (T4 AC6).

**Motion:** `const reduced = useReducedMotion()`; `variants={item(reduced, riseItem)}`; no
own `initial`/`whileInView`/`viewport`.

**12b — `src/App.css`, new `/* ---------- academy (education) ---------- */` block**

Insert **after** `commendations` and **before** `console (contact)`.

| class | key declarations |
|---|---|
| `.academy-grid` | `display: grid`; `grid-template-columns: minmax(0, 1fr)`; `gap: 24px`; **no `max-width`, no auto side margins** |
| `.academy-grid` `@media (min-width: 760px)` | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `.record--academy` | accent is `--nebula-2`; a left accent hairline via `::before` (`content: ""`; `position: absolute`; `left: 0`; `top: 22px`; `bottom: 22px`; `width: 2px`; `border-radius: 2px`; `background: rgba(124, 92, 255, 0.45)`) plus `padding-left: 26px` — accent + arrangement only |

**Done criteria** (browser, after task 14):

- D12.1 `http://localhost:5173/#education` scrolls to a visible section headed
  `<MyEducation/>` with eyebrow `// training log` (T4 AC1).
- D12.2 The section renders exactly **2** entries (T4 AC2).
- D12.3 Entry 1 shows `Notre Dame of Marbel University`,
  `Bachelor of Science in Information Technology`, `2021 – 2025` (T4 AC3).
- D12.4 Entry 2 shows `Laguilayan National High School`,
  `Information and Communications Technology`, `2014 – 2021` (T4 AC4).
- D12.5 Scrolling top to bottom, Education appears **after** Achievements and **before**
  Contact, and nothing but Contact and the footer renders below it (T4 AC5, T7 AC4).
- D12.6 No GPA / honors / coursework text appears in the section (T4 AC6).
- D12.7 DevTools element inspection: both institution names are `h3` (T4 AC7).
- D12.8 At 375 px and 1440 px: no horizontal scrollbar, both entries fully readable, long
  institution names wrap rather than clip (T4 AC8).
- D12.9 Hovering an education card produces the same lift + teal glow as a project card
  (T8 AC7).
- D12.10 `npm run lint` exits 0.

---

### 13 · T1-D2 — `Hero.jsx` rewrite + `information.js` + hero CSS

**Ticket:** T1 · **Requirements:** PRD §5.6, G1, G2, §7.3 · **Design:** ADR-0006,
ADR-0007, architecture §11 · **dep:** tasks 6, 7

> ### ⚠ BREAKING CHANGE — complete all four parts in this one task
> `information.userData.description` is **deleted from the data module**, and `Hero`'s
> `description` prop and PropType are removed. `src/App.jsx` line 34 currently passes
> `description={information.userData.description}`. Deleting the field without updating
> both the component and the call site throws (`splitIntoLogEntries` runs
> `.split()` on `undefined`) and blanks the page. Do not stop, commit, or hand off between
> 13a and 13d.

**13a — `src/content/information.js`** (modify)

Delete the entire `description` key and its ~90-word emoji string. `userData` keeps
`firstName`, `lastName`, `title`, `img` unchanged. Deleting rather than merely
un-rendering is what makes T1 AC1–AC4 verifiable by a page-wide text search
(ADR-0006 §6).

Leave `img: "/me.png"` **exactly as it is.** Its leading slash produces a doubled slash
after `BASE_URL` which browsers normalise. This is a known defect, recorded as **PRD §11
DF2** and explicitly deferred out of iteration 01 — no T1–T10 criterion tests it, and
fixing it here would be unscoped. Architecture §6 says the same.

**13b — `src/components/Hero.jsx`** (rewrite)

**Props after this task:** `img` (string, required), `title` (string, required). The
`description` prop and PropType are **removed**.

**Imports:** `useEffect`, `useState` from `react`; `AnimatePresence`, `motion`,
`useReducedMotion` from `framer-motion`; `Typewriter` from `typewriter-effect`; `socials`
from `../content/socials`; `hero` from `../content/hero`; `reveal`/`item`/
`staggerContainer`/`riseItem` from `../lib/motion`.

**Delete entirely:** `useMemo` import, `splitIntoLogEntries`, `logEntries`,
`dossierContainer`, `dossierLine`, and all `hero__dossier*` markup including the
`crew file // personnel log` string and the `01/02/03…` markers. (Leaving `useMemo`
imported will fail lint at `--max-warnings 0`.)

**Boot sequence — non-blocking** (ADR-0006 §1, §2):

- `const BOOT_DURATION_MS = 900;` (named constant, down from 2100).
- State: `const [bootDone, setBootDone] = useState(false);` plus a `useEffect` with a
  `setTimeout(() => setBootDone(true), BOOT_DURATION_MS)` and a cleanup `clearTimeout`.
- Render the boot strip inside `<AnimatePresence>` only when
  `!reduced && !bootDone`. Under reduced motion it is **never mounted**, not merely
  shortened.
- The strip renders **one** line: `{hero.boot}` (`> uplink established`).
- `hero__content` is **never** opacity-gated. Delete the
  `animate={{ opacity: booted ? 1 : 0 }}` wrapper behaviour entirely. It mounts visible
  at `t = 0`.

**Structure of `#about.hero`, in this DOM order** (architecture §11):

| element | class | content |
|---|---|---|
| boot strip | `.hero__boot` | `{hero.boot}` — absolutely positioned in its own reserved band at the **top** of the hero; must never overlap the mission line, telemetry, or CTAs |
| content wrapper | `.hero__content` | a `motion.div` with `{...reveal(reduced, staggerContainer)}`; children carry `variants={item(reduced, riseItem)}` |
| avatar | `.hero__porthole` (+ inner `.hero__porthole-ring`) | `<img src={`${import.meta.env.BASE_URL}${img}`} alt="John Rey Seguma" />`. Porthole spring `{ scale: 0→1, rotate: -30→0 }` runs **from mount**, no longer keyed off `booted`; when `reduced`, pass `initial={false}` so it does not animate. Keep `whileHover={{ scale: 1.05 }}`. |
| kicker | `.hero__designation` | `{title}` — unchanged |
| name | `h1.hero__name` | `<span>&lt;</span>JohnRey<span className="hero__accent">Seguma/&gt;</span>` — unchanged, the page's only `h1` |
| classification | `.hero__role` | `CLASSIFICATION:` label + **exactly one of two mutually exclusive children, branched on `reduced`** — see "Classification line" below |
| mission | `p.hero__mission` | `{hero.mission}` |
| telemetry | `ul.telemetry` | one `li.telemetry__tile` per `hero.telemetry` entry, keyed by `label`, containing `span.telemetry__label` = `label` and `span.telemetry__value` = `value` |
| CTAs | `div.hero__actions` | one `<a className={`hero__cta hero__cta--${variant}`} href={href}>{label}</a>` per `hero.ctas` entry, keyed by `href` |
| socials | `.hero__channels` | `span.hero__channels-label` = `{hero.channelsLabel}` then the existing `.hero__channels-row` markup, unchanged behaviour (`target="_blank"`, `rel="noopener noreferrer"`) |
| scroll cue | `a.hero__scroll-cue` | `{hero.scrollCue}`, `href="#projects"`; keeps the looping `y: [0, 8, 0]` bounce, which the plan exempts from the motion budget. When `reduced`, omit the `animate`/`transition` props. |

**CTAs must be real `<a href="#…">` anchors**, never `<button>` + `scrollIntoView`, so
`Enter` works natively and the existing `html { scroll-behavior: smooth }` handles the
scroll (T1 AC9, architecture §9.3).

#### Classification line — a mount-time branch on reduced motion (PRD §5.6 item 4, D13)

**Where the branch lives:** inside `Hero.jsx`, in the JSX for `.hero__role`, keyed on the
**same** `const reduced = useReducedMotion()` already used for the boot strip, the
porthole spring and the scroll cue. No new hook call, no new state, no effect, and **no
change to any other component** — `Hero` is the only place the typewriter is mounted.

Render the `<span className="hero__role-label">CLASSIFICATION:</span>` unconditionally,
then exactly one of:

| `reduced` | renders | |
|---|---|---|
| `false` | `<Typewriter options={{ strings: ["Junior Software Developer", "Robotics Enthusiast", "Tech Innovator"], autoStart: true, loop: true }} />` | unchanged existing behaviour |
| `true` | `<span className="hero__role-static">{hero.classificationStatic}</span>` | the static string from task 6 |

The three typewriter phrases stay **inline in `Hero.jsx`** (they are the animated form of
the same payload and are excluded from the word budget); only the static string lives in
`content/hero.js`, because it is a single user-visible string subject to the §5.6 copy
list.

> ### ⚠ It must be a conditional render, not a CSS hide
> Do **not** implement this by mounting both and hiding one with `display: none`,
> `visibility: hidden`, `opacity: 0`, or a media query. `typewriter-effect` starts its own
> `setTimeout`/`setInterval` timers **on mount** and exposes no reduced-motion API, so a
> hidden instance keeps typing, keeps doing work, and keeps mutating the accessibility
> tree. Plan T8 AC6 and T10 AC9 are written as "nothing is animating", and a hidden-but-
> running typewriter fails both while looking handled. The **only** mechanism that works
> is not mounting it. See architecture §9.2.1 and ADR-0007 Layer 5.

Both directions are tested. Plan T1 AC15 fails the build if the static string appears
while motion is allowed, **and** fails it if anything is typing while motion is reduced.
So the two branches must be genuinely exclusive — not "static always present, typewriter
on top".

`useReducedMotion()` is reactive in framer-motion 10, so the branch re-renders if the
preference changes; QA's procedure is nevertheless "emulate, **then** hard refresh".

**13c — `src/App.jsx`** (modify, `<Hero>` call site only)

Remove the `description` prop. Pass only `img` and `title`.

**13d — `src/App.css`, `hero` block** (modify)

- **Delete** `.hero__dossier`, `.hero__dossier-heading`, `.hero__dossier-line`,
  `.hero__dossier-line:last-child`, `.hero__dossier-marker`. Nothing references them after
  13b.
- **`.hero__boot` is re-purposed** from a centred full takeover to a top ticker strip:
  replace `top: 50%; left: 50%; transform: translate(-50%, -50%)` with
  `top: 22px; left: 50%; transform: translateX(-50%)`. Keep `position: absolute`,
  `font-family: var(--font-mono)`, `font-size: 13px`, `color: var(--thruster)`. Add
  `pointer-events: none`. It must sit above the content in its own band and cover nothing.
- **`.hero__porthole-ring`:** remove `animation: spin 20s linear infinite;` from the base
  rule and add `.hero__porthole:hover .hero__porthole-ring { animation: spin 20s linear infinite; }`.
  Keep `@keyframes spin`. This retires the hero's second continuous loop so the section's
  only looping effect is the PRD-mandated typewriter (T8 AC5, architecture §9.1).
- **New `.hero__role-static`** (PRD D13): must match the typewriter's rendered appearance
  so the two branches are visually interchangeable — it inherits `.hero__role`'s
  `font-family: var(--font-mono)`, `font-size: clamp(1rem, 2.5vw, 1.3rem)` and
  `color: var(--thruster)`, so set only what it needs on top:
  `overflow-wrap: anywhere`; `text-align: center`; `line-height: 1.4`. `.hero__role`
  already has `flex-wrap: wrap` and `justify-content: center`, which is what lets the
  string wrap instead of clipping at 375 px (T1 AC15). Do **not** add
  `white-space: nowrap`.
- **New `.hero__mission`:** `font-size: clamp(0.95rem, 2.6vw, 1.05rem)`;
  `line-height: 1.6`; `color: var(--starlight)`; `max-width: 46ch`; `margin: 0 auto 26px`.
- **New `.telemetry`:** `display: grid`; `grid-template-columns: repeat(2, minmax(0, 1fr))`;
  `gap: 10px`; `width: 100%`; `margin-bottom: 28px`; `list-style: none`.
  Inside its own block, `@media (min-width: 760px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }`.
- **New `.telemetry__tile`:** `display: flex`; `flex-direction: column`; `gap: 4px`;
  `align-items: flex-start`; `text-align: left`; `padding: 10px 12px`;
  `background: var(--panel)`; `border: 1px solid var(--panel-border)`;
  `border-radius: 12px`; `min-width: 0`; `overflow-wrap: anywhere`.
- **New `.telemetry__label`:** `font-family: var(--font-mono)`; `font-size: 10px`;
  `letter-spacing: 2px`; `text-transform: uppercase`; `color: var(--solar)`.
- **New `.telemetry__value`:** `font-size: 13px`; `line-height: 1.4`;
  `color: var(--starlight)`.
- **New `.hero__actions`:** `display: flex`; `flex-wrap: wrap`; `gap: 12px`;
  `justify-content: center`; `margin-bottom: 30px`.
- **New `.hero__cta`:** `display: inline-flex`; `align-items: center`; `gap: 8px`;
  `padding: 12px 22px`; `border-radius: 999px`; `font-weight: 700`; `font-size: 14px`;
  `border: 1px solid transparent`; `transition: transform .2s ease, border-color .2s ease, background .2s ease`.
  `.hero__cta:hover { transform: translateY(-3px); }`
- **New `.hero__cta--primary`:** `background: var(--thruster)`; `color: var(--void)` —
  matches the existing `.console__cta` treatment.
- **New `.hero__cta--ghost`:** `background: transparent`; `color: var(--starlight)`;
  `border-color: var(--panel-border)`;
  `.hero__cta--ghost:hover { border-color: var(--thruster); }`
- Do **not** add `outline: none` to any of these (architecture §9.3 — the global
  `:focus-visible` ring must stay visible).

**Done criteria** (browser, `npm run dev`, hard refresh with cache disabled):

- D13.1 Browser Find on the whole page: `crew file` = 0 matches, `personnel log` = 0
  (T1 AC1).
- D13.2 No `01`/`02`/`03…` numbered markers prefix any hero line (T1 AC2).
- D13.3 Browser Find: `Hi, I’m Rey` = 0, `geeking out` = 0,
  `Let’s connect and create something awesome` = 0 (T1 AC3).
- D13.4 **Hero copy carries no emoji** (T1 AC4 part **4a**). Visual scan plus Find on the
  retired bio's emoji: none appears in the designation kicker, the name, the classification
  line, the mission statement, any telemetry label or value, either CTA label, the channels
  label, or the scroll cue. `↓` (U+2193) and `·` (U+00B7) are permitted text glyphs, not
  emoji (T1 AC4 part 4d). AC4 parts **4b/4c** cover the scroll rail, which is outside the
  `#about` subtree and is handled by **task 20**, not here.
- D13.5 The hero displays the exact sentence
  `Junior Software Developer building mobile and web systems for real-world clients.`
  (T1 AC5).
- D13.6 Counted from the rendered hero, excluding nav / `<JohnRey Seguma/>` / the
  designation kicker / the typewriter line / social-icon labels: total countable words
  ≤ 40 and sentences ≤ 2. Write the actual count into the execution log; the design
  target is 39 words / 1 sentence (T1 AC6).
- D13.7 Exactly 4 telemetry tiles render, with labels/values
  `STATUS` → `Full-Time @ Smartech Solutions PH`, `MISSIONS` → `6 projects shipped`,
  `COMMENDATIONS` → `9 academic awards`, `SYSTEMS` → `26 tools & technologies` (T1 AC7).
- D13.8 On the same page, count on screen: 6 project cards, 9 achievement entries, 26
  skill tiles (T1 AC8).
- D13.9 Two CTAs are visible. Clicking `View Projects` brings the Projects heading into
  view; clicking `Contact Me` brings the contact form into view. Both are reachable with
  `Tab`, show a visible focus ring, and activate with `Enter` (T1 AC9).
- D13.10 With animations enabled: the porthole avatar renders the photo (not a
  broken-image icon), the `<JohnRey Seguma/>` name renders, and the typewriter
  classification line is typing and **cycles through all three phrases** (T1 AC10).
- D13.11 All 4 social links are present and each opens its external URL in a new tab
  (T1 AC11).
- D13.12 **Boot timing:** with a DevTools Performance recording (or a screen recording) of
  a hard refresh, the mission statement and telemetry tiles are legible within
  **1.5 s**. Report the measured time. Do **not** cite `BOOT_DURATION_MS` — AC12 is
  explicitly measured, not read (T1 AC12).
- D13.13 With `prefers-reduced-motion: reduce` emulated (DevTools → Rendering) and a hard
  refresh, hero content is visible **immediately**: no boot strip appears at all, no
  fade-in, no delay (T1 AC13).
- D13.14 At 375 px the hero fits the viewport: no horizontal scrollbar, telemetry tiles
  stack 2 × 2, no tile's text is clipped (T1 AC14).
- D13.15 The hero's only continuous animations (motion enabled) are the typewriter and the
  scroll cue — the porthole ring is still on hover only (T8 AC5).
- D13.16 **Reduced-motion classification line** (T1 AC15, PRD D13). With
  `prefers-reduced-motion: reduce` emulated and a hard refresh:
  - after the `CLASSIFICATION:` label the line reads exactly
    `Junior Software Developer · Robotics Enthusiast · Tech Innovator` (middle dot U+00B7,
    one space either side);
  - the whole string is present at first paint, and over **10 seconds** of observation not
    one character is typed, deleted or re-typed and no caret blinks. **Evidence: a screen
    recording, or two screenshots ≥ 5 s apart showing identical text** — not a code
    citation;
  - browser Find locates `Robotics Enthusiast` **and** `Tech Innovator` at the same time,
    proving the loop is not merely paused mid-cycle;
  - at 375 px the line wraps onto multiple lines with no clipping and no horizontal
    scrollbar;
  - with emulation **off** and a hard refresh, the typewriter types one phrase at a time
    and cycles all three, and the static string does **not** appear anywhere.
- D13.17 **Shortened hero chrome copy** (T1 AC16, PRD D12). Browser Find on the whole page:
  `comm channels` → match; `open comm channels` → **zero**; `descend ↓` → match;
  `scroll to descend` → **zero**.
- D13.18 **Boot ticker** (T1 AC17, PRD D12). With animations enabled and a hard refresh:
  the boot sequence is a **single** line reading `> uplink established`, sitting in its own
  band that never covers the mission statement, the telemetry tiles or the CTAs at any
  point — **evidence: a screen recording of the first 2 s** — and it removes itself. Find
  for `establishing uplink`, `signal locked`, `decrypting crew manifest` and
  `welcome aboard` each returns **zero**. With reduced motion emulated the boot line is
  **never visible at all**.
- D13.19 DevTools Console: zero errors, zero React warnings — in both motion modes.
- D13.20 `npm run lint` exits 0; `npm run build` exits 0.

---

### 14 · T7-D2 — `App.jsx`: 7 sections in registry order + `MotionConfig`

**Ticket:** T7 · **Requirements:** PRD §6.1 · **Design:** ADR-0001, ADR-0005, ADR-0007
Layer 1, architecture §5 · **dep:** tasks 5, 9, 10, 11, 12, 13

**File:** `src/App.jsx` — **modify**.

**14a — Imports.** Add `MotionConfig` to the `framer-motion` import. Add
`ExperienceEntry`, `AchievementCard`, `EducationCard`. Add content imports `sections`,
`experience`, `achievements`, `education`. Add `staggerContainer`,
`staggerContainerTight`, `reveal` from `./lib/motion` and `useReducedMotion` from
`framer-motion`. **Delete** the module-local `gridContainer` const (replaced by the
imported variants, ADR-0004 §2).

**14b — Wrap the whole tree** in `<MotionConfig reducedMotion="user">` (ADR-0007
Layer 1 — the global net that also covers `whileHover` transforms). It replaces the
current bare `<>…</>` fragment as the outermost element.

**14c — Registry lookup helper.** One line, module scope:
`const byId = (id) => sections.find((s) => s.id === id);`
Use `byId("projects").eyebrow` etc. for every `Heading`. Do not re-inline the eyebrow or
heading-word literals — they now live only in `content/sections.js` (ADR-0005).

**14d — Section JSX order must match the registry array order exactly** (this is the
review-time guard ADR-0005 accepted in place of a runtime assertion):

| order | element | container | items |
|---|---|---|---|
| 1 | `<Hero img={…} title={…} />` (owns `id="about"`) | — | — |
| 2 | `<section id="projects" className="station">` | `div.mission-grid` | 6 × `ProjectCard` (unchanged) |
| 3 | `<section id="skills" className="station">` | `motion.div.module-grid` with `{...reveal(reduced, staggerContainerTight)}` | 26 × `Skill`, `key={skill.file}` |
| 4 | `<section id="experience" className="station">` | `motion.ul.service-log` with `{...reveal(reduced, staggerContainer)}` | 2 × `ExperienceEntry`, `key={e.id}` |
| 5 | `<section id="achievements" className="station">` | `motion.ul.commendation-grid` with `{...reveal(reduced, staggerContainerTight)}` | 9 × `AchievementCard`, `key={a.id}` |
| 6 | `<section id="education" className="station">` | `motion.ul.academy-grid` with `{...reveal(reduced, staggerContainer)}` | 2 × `EducationCard`, `key={ed.id}` |
| 7 | `<section id="contact" className="station">` | — | `<ContactForm />` |
| 8 | `<Footer />` | — | — |

Each new section renders `<Heading eyebrow={byId(id).eyebrow} firstWord={byId(id).firstWord} secondWord={byId(id).secondWord} />`
directly inside the `<section>`, above the list container — identical to Projects and
Skills.

**Prop wiring — spread nothing; pass flat scalars explicitly:**

- `ExperienceEntry`: `company`, `title`, `type`, `start`, `end`, `current`, `highlights`.
- `AchievementCard`: `award`, `category`, `event`.
- `EducationCard`: `institution`, `program`, `start`, `end`.

`Starfield`, `FlightPath` and `Navbar` stay where they are, before the hero.

**14e — Keys.** Every `.map()` in this file must key by a stable id
(`project.name`, `skill.file`, `e.id`, `a.id`, `ed.id`). No index keys in new code.

**Done criteria** (browser):

- D14.1 Scrolling top to bottom, sections appear in exactly this order:
  **Hero → Projects → Skills & Tools → Work Experience → Academic Achievements →
  Education → Contact → Footer** (T7 AC1).
- D14.2 On a fresh load, pasting each of `#about`, `#projects`, `#skills`, `#experience`,
  `#achievements`, `#education`, `#contact` into the address bar scrolls to the
  corresponding section. All 7 checked one by one (T7 AC2).
- D14.3 Pressing `Tab` repeatedly from the address bar reaches interactive elements in
  top-to-bottom visual order, never jumping backwards to an earlier section (T7 AC3).
- D14.4 Education is the final section before Contact; nothing but Contact and the footer
  is below it (T7 AC4).
- D14.5 Measured in DevTools: the vertical gap between Skills→Experience,
  Experience→Achievements and Achievements→Education each match the existing
  Projects→Skills gap within ~8 px. Record all four measurements (T7 AC5).
- D14.6 DevTools Console: zero errors, zero React warnings (in particular no missing-key
  and no PropTypes warnings).
- D14.7 `npm run lint` exits 0; `npm run build` exits 0.

---

### 15 · T6-D1 — `Navbar.jsx`: registry-driven links + deterministic scroll-spy

**Ticket:** T6 · **Requirements:** PRD §6.2, D7, G7 · **Design:** ADR-0005,
architecture §10 · **dep:** tasks 5, 14

**File:** `src/components/Navbar.jsx` — **modify**.

**15a — Delete the module-private `const SECTIONS`** (lines 4–9) and import
`sections` from `../content/sections` instead. Derive both the `<li>` list **and** the
observer targets from it. The rendered link text is `navLabel`; the href is `` `#${id}` ``.
Props (`firstName`, `lastName`) and their PropTypes are unchanged.

**15b — Deterministic scroll-spy** (architecture §10). Replace the current callback,
which sets `active` from whichever entry the loop happens to touch last:

1. Keep a `useRef(new Set())` of currently intersecting ids.
2. On each `IntersectionObserver` callback, add ids that are `isIntersecting` and delete
   ids that are not.
3. Then set `active` to the **first `sections` id present in that set**, iterating in
   registry order. If the set is empty, leave `active` unchanged.
4. Observe every registry id; skip ids whose element is missing (`if (el) observer.observe(el)`)
   rather than throwing.
5. Observer options stay `{ rootMargin: "-40% 0px -50% 0px", threshold: 0 }`.
6. Effect dependency array stays `[]` — `sections` is a module constant. Do not add it to
   the deps; do not disable an eslint rule to achieve this (none fires, because a
   module-scope import is not a reactive value).
7. `return () => observer.disconnect();` stays.

This is what makes "only one entry highlighted at a time" (T6 AC3) a property of the
design rather than an accident of callback iteration order.

**15c — Unchanged:** the hamburger `<button className="hud-nav__toggle">` with
`aria-label="Toggle navigation"` and `aria-expanded={open}`; the `onClick={() => setOpen(false)}`
on each link (so the mobile menu closes on selection, T6 AC5); the `.hud-nav__blip` span;
the `.hud-nav__status` `ONLINE` block.

**Done criteria** (browser):

- D15.1 At 1440 px the nav shows exactly **7** entries, left-to-right:
  `About`, `Missions`, `Systems`, `Service`, `Medals`, `Academy`, `Transmit` (T6 AC1).
- D15.2 Clicking each of the 7 in turn scrolls to its section and the target section's
  heading is in view. All 7 verified individually (T6 AC2).
- D15.3 Manually scrolling the whole page: the nav entry matching the section occupying
  the middle of the viewport is highlighted, and **only one** entry is highlighted at any
  time. Confirmed for all 7 sections (T6 AC3).
- D15.4 `Tab` reaches all 7 nav links in visual order, each shows a visible focus ring,
  and `Enter` on a focused link navigates to its section (T6 AC4).
- D15.5 DevTools Console: zero errors and zero React warnings while navigating through all
  7 entries (T6 AC7).

---

### 16 · T6-D2 — `App.css`: navbar 761–1100 px range + mobile menu height

**Ticket:** T6 · **Requirements:** PRD §6.2 · **Design:** architecture §2.2 W4/W6 ·
**dep:** task 15

**File:** `src/App.css`, `HUD navbar` block — **modify**.

Two known defects, both caused by going from 4 nav entries to 7:

**16a — W6: the mobile menu cannot fit 7 items.** `.hud-nav__menu.is-open` currently sets
`max-height: 300px`; 7 stacked links plus the `10px 20px 20px` list padding exceeds that
and the last entries are clipped. Change to `max-height: 70vh` and add
`overflow-y: auto` to `.hud-nav__menu.is-open`. Keep the `transition: max-height 0.3s ease`
on `.hud-nav__menu`.

**16b — W4: 7 entries overflow between 761 px and 1100 px**, where the desktop nav is
still active. Add a new `@media (max-width: 1100px)` block **inside** the HUD navbar
block (architecture §7.3: media queries live with their block). Note this range overlaps
the existing `@media (max-width: 760px)` block; the 760 px rules must come **after** the
1100 px rules in source order so the mobile treatment still wins below 760 px.

Within `@media (max-width: 1100px)`:

- `.hud-nav__status { display: none; }` — the `ONLINE` indicator is decorative chrome and
  carries no information available nowhere else, so hiding it in the tight range is safe
  (PRD §7.2, last clause of the contrast bullet).
- `.hud-nav { padding: 14px 18px; gap: 12px; }`
- `.hud-nav__menu ul { gap: 2px; }`
- `.hud-nav__menu a { padding: 7px 10px; font-size: 12px; gap: 0; }`
- `.hud-nav__blip { display: none; }` — purely decorative; the active state is still
  carried by `.hud-nav__menu a.is-active`'s background and colour, so scroll-spy remains
  visible (T6 AC3).

Do not introduce any breakpoint other than 1100 (architecture §7.3 allows 480, 600, 640,
760, 900, 1024, 1100).

**Done criteria** (browser):

- D16.1 At 768 px, 900 px and 1024 px: the nav does not overflow the viewport, produces no
  horizontal scrollbar, and nav items do not visually collide with the logo. Screenshot
  each (T6 AC6).
- D16.2 At 375 px the hamburger opens a menu listing **all 7** entries, all 7 are tappable
  and visible without clipping, and selecting one closes the menu and scrolls to that
  section (T6 AC5).
- D16.3 At 1440 px the nav is unchanged from task 15's verified state — `ONLINE` and the
  blips are still visible.
- D16.4 `document.documentElement.scrollWidth <= window.innerWidth` at 768, 900 and
  1024 px. Record both numbers per checkpoint (T9 AC2).

---

### 17 · T9-D1 — Responsive sweep 375 → 1440 px

**Ticket:** T9 · **Requirements:** PRD §7.1 · **Design:** architecture §7.3 ·
**dep:** task 14

**Files:** `src/components/Heading.jsx` (modify), `src/App.css` (modify).

**17a — `<AcademicAchievements/>` overflows at 375 px.** `Heading` joins `firstWord` and
`secondWord` with no separator, so `<AcademicAchievements/>` is a single unbreakable
20-character token. At 375 px, `.station-heading__title`'s current
`clamp(1.8rem, 4vw, 2.6rem)` resolves to 28.8 px, which pushes the token past the 339 px
of available content width. T9 AC3 forbids clipping and T9 AC4 forbids an unreadable
mid-word break, so neither `overflow-wrap: anywhere` alone nor the current font size
works. Fix both ends:

1. **`src/components/Heading.jsx`:** insert a `<wbr />` between `{firstWord}` and the
   `<span className="station-heading__accent">{secondWord}</span>`. `<wbr>` is a
   zero-width break *opportunity*: it changes nothing when the heading fits, and when it
   does not, the line breaks at the word boundary (`<Academic` / `Achievements/>`) — a
   readable break, not a mid-word one. No prop change, no PropTypes change, no contract
   change; `Heading`'s signature is untouched. (Architecture §3 listed `Heading.jsx` as
   unchanged — corrected by architecture amendment A1; §4 F7, closed.)
2. **`src/App.css` `.station-heading__title`:** change the font size to
   `clamp(1.35rem, 5.6vw, 2.6rem)` and add `overflow-wrap: anywhere` as a last-resort
   safety net. The `2.6rem` maximum is unchanged, so nothing above ~745 px viewport width
   looks different.

**17b — Long-string wrapping.** Confirm (and add where missing) that every container
holding one of the strings named in T9 AC3 can wrap: `.record` already has
`overflow-wrap: anywhere` from task 8; `.telemetry__tile` and `.module__label` got it in
tasks 13 and 9. Do not add `text-overflow: ellipsis` or `white-space: nowrap` anywhere new
— T9 AC3 forbids truncation.

**17c — No new fixed widths.** Audit your own additions from tasks 8–16: no container may
carry a fixed `px` width. The only fixed-width element in the app is `.module`
(130 × 100 px), which is pre-existing and far below 375 px, so it cannot force overflow.

**Done criteria** (browser, at each of 375 / 414 / 768 / 1024 / 1280 / 1440 px):

- D17.1 At each of the six checkpoints, scrolling the full page produces **no horizontal
  scrollbar** and no content requiring horizontal panning (T9 AC1).
- D17.2 At each checkpoint, run in the DevTools Console:
  `document.documentElement.scrollWidth` and `window.innerWidth`. Record **both numbers
  for all six checkpoints** in the execution log; `scrollWidth` must be `<= innerWidth`
  (T9 AC2).
- D17.3 At 375 px none of these is clipped, ellipsised, or overlapping another element:
  `Smartech Solutions Philippines Inc.`, `Information and Computer Technologies Category`,
  `Notre Dame of Marbel University`, `Laguilayan National High School`, and the
  `<AcademicAchievements/>` heading (T9 AC3).
- D17.4 At 375 px every section heading fits within the viewport; the
  `<AcademicAchievements/>` heading occupies at most 2 lines and breaks between `Academic`
  and `Achievements`, not mid-word (T9 AC4).
- D17.5 At 768 px and 1024 px the Achievements grid and the Skills grid are both
  multi-column, with no items overflowing their container and no single-column layout with
  huge gaps (T9 AC5).
- D17.6 Screenshots captured and attached for **all six** checkpoints (T9 AC7).

---

### 18 · T10-D1 — Reduced-motion sweep: `Heading`, `ProjectCard`, `ContactForm`

**Ticket:** T10 (also T8 AC6) · **Requirements:** PRD §7.2 last bullet, §7.3 ·
**Design:** ADR-0007 Layers 1–3, architecture §9.2 · **dep:** tasks 7, 14

**Why this task exists.** The existing `@media (prefers-reduced-motion: reduce)` block in
`App.css` neutralises CSS animations and transitions but has **no effect whatsoever** on
framer-motion, which writes animated values to inline styles from JS. `Heading`,
`ProjectCard` and `ContactForm` each own a framer-motion entrance reveal with hardcoded
`initial` / `whileInView` / `viewport` / `transition` props, so under
`prefers-reduced-motion: reduce` they still animate, and T8 AC6 / T10 AC9 fail.

Files: `src/components/Heading.jsx`, `src/components/ProjectCard.jsx`,
`src/components/ContactForm.jsx` — all **modify**.

For each of the three: call `const reduced = useReducedMotion();` (from `framer-motion`)
and replace the inline reveal props with a single spread of `reveal(...)` from
`../lib/motion`, using the variant and viewport that preserve the component's current
look (defined in task 7):

| component | replace with | preserves |
|---|---|---|
| `Heading` | `{...reveal(reduced, headingRise, viewportHeading)}` on the `motion.div.station-heading` | scale 0.85→1 + blur 6px→0, 0.6 s, `amount: 0.6` |
| `ProjectCard` | `{...reveal(reduced, cardRise, viewportCard)}` on the `motion.article.mission-card` | y 60→0 + rotateX -8→0, 0.6 s, `amount: 0.25`. Keep `whileHover={{ y: -8 }}` (Layer 1 handles it under reduced motion) |
| `ContactForm` | `{...reveal(reduced, consoleRise, viewportConsole)}` on the `motion.div.console` | scale 0.92→1, 0.6 s, `amount: 0.3` |

Delete the now-dead inline `initial`, `whileInView`, `viewport` and `transition` props from
all three. Do **not** touch the existing CSS `@media (prefers-reduced-motion: reduce)`
block — it stays as Layer 4 for the CSS loops (`pulse`, `spin`, `scan`) and all CSS
transitions.

`Skill`, `ExperienceEntry`, `AchievementCard`, `EducationCard` and `Hero` already route
through `item()` / `reveal()` from tasks 9–13. After this task, **every** framer-motion
reveal in `src/` goes through `src/lib/motion.js` — verify by grepping for `whileInView`
and confirming the only occurrences are inside `src/lib/motion.js`.

**The typewriter is handled in task 13, not here** (PRD D13). The earlier version of this
task recorded the looping typewriter as an accepted non-conformance and told you *not* to
render a static string; that instruction is **withdrawn** — Nala decided it, and the
conditional-render branch specified in task 13b is now required. There is no longer any
permitted reduced-motion exception anywhere on the page.

**`Starfield.jsx` needs no change and must not be modified.** It already reads
`window.matchMedia("(prefers-reduced-motion: reduce)").matches` at mount, pins its twinkle
factor to a constant and never schedules a `requestAnimationFrame` loop when the
preference is set (verified in source). Plan T8 AC6 depends on this and is why the QA
procedure is "emulate the preference, **then** hard refresh" — the read happens once at
mount, so toggling emulation without reloading leaves the field animating and is not a
`FlightPath.jsx`'s **motion** likewise needs no change in this task: it is scroll-linked
rather than timer-driven, and plan T8 AC6 explicitly names it as the one element permitted
to move under reduced motion. (Its *marker glyph* is a separate matter and is replaced in
task 20 per PRD D15 — do not conflate the two: nothing about its motion wiring changes.)

**Done criteria** (browser, `prefers-reduced-motion: reduce` emulated via DevTools →
Rendering → Emulate CSS media feature, then hard refresh):

- D18.1 With reduced motion emulated, scrolling the entire page top to bottom produces
  **no entrance animations** — every section's content is already at full opacity and
  final position when it enters the viewport (T8 AC6, T10 AC9).
- D18.2 With reduced motion emulated, **no looping motion runs anywhere on the page — no
  exceptions** (T8 AC6). Specifically: the classification line is the static string and
  nothing is typing; the boot line is never shown; the porthole ring is not spinning; the
  nav `ONLINE` indicator is not pulsing; the project-card scanline is not sweeping; the
  hero scroll cue is not bouncing; the starfield is frozen. **Evidence: a screen recording
  of ≥ 10 s resting on the hero in which nothing changes except the mouse cursor.** A
  still-running typewriter is a **fail**, not a known issue.
- D18.2b With reduced motion emulated, a scroll-through recording of the full page shows
  no element fading, sliding or scaling in. The **only** thing permitted to move is the
  decorative scroll-progress rail (`FlightPath`), which is driven by scroll position
  rather than a timer (T8 AC6).
- D18.3 With reduced motion emulated and a hard refresh, hero content — mission line and
  telemetry — is visible **immediately** and no boot strip appears (T1 AC13).
- D18.4 With reduced motion **off**, all five reveal styles still look as they did before
  this task: headings scale-and-unblur, project cards rise with a slight tilt, the contact
  console scales in, skill tiles and records rise. Screenshot or screen-record.
- D18.5 With reduced motion **off**, each new section's content is fully readable within
  **600 ms** of entering the viewport, measured on a screen recording at normal scroll
  speed (T8 AC4). Report the measured figure per new section.
- D18.6 `npm run lint` exits 0; `npm run build` exits 0.

---

### 19 · T10-D2 — Link, alt and accessible-name integrity

**Ticket:** T10 · **Requirements:** PRD §7.2 · **Design:** architecture §9.3 ·
**dep:** task 14

Files: `src/components/ProjectCard.jsx`, `src/components/Footer.jsx` — **modify**.
(`Hero.jsx`'s avatar `alt` and social links are already handled in task 13;
`ContactForm.jsx`'s socials already use `rel="noopener noreferrer"`.)

**19a — `rel` normalisation.** T10 AC10 asks literally for `rel` containing `noopener`.
Two call sites currently use `rel="noreferrer"` only (browsers treat that as implying
`noopener`, but the criterion is written literally):

- `ProjectCard.jsx` — the `source` link and the `preview` link. Change both to
  `rel="noopener noreferrer"`.
- `Footer.jsx` — the `https://github.com/thisisJohnny07` link. Change to
  `rel="noopener noreferrer"`.

**19b — Alt text audit.** Confirm in the running app:

- Every skill tile `<img>`'s `alt` equals its display label (task 9 delivered this).
- Every project card `<img>`'s `alt` equals the project name (already true —
  `alt={name}`).
- The hero avatar `<img>` has a non-empty `alt` (task 13 sets `alt="John Rey Seguma"`;
  this is assistive-technology text, not page copy, so it is not new PRD §5 content).
- Each social `<a>` has an accessible name (already true — the existing
  `aria-label={social.icon.replace(".svg", "")}` yields `github`, `linkedin`, `instagram`,
  `facebook`). Leave the existing mechanism alone; no AC requires changing it.

**19c — Do not add `outline: none` anywhere.** The global
`:focus-visible { outline: 2px solid var(--thruster); outline-offset: 3px }` is the only
focus mechanism and must reach every interactive element added in this iteration
(architecture §9.3).

**Done criteria** (browser, hard refresh with "Disable cache" on):

- D19.1 **Console clean:** hard refresh, scroll the full page, open and close the mobile
  menu — zero errors, zero React warnings. Paste the console state into the execution log
  (T10 AC1).
- D19.2 **Network clean:** every request under `/skills/`, `/projects/`, `/socials/` and
  the profile image returns **200**; zero 404s. Record the totals (T10 AC2).
- D19.3 **No broken images:** visual scan of the full page at 1440 px — every `<img>`
  renders real artwork (T10 AC3).
- D19.4 **Heading structure:** verified with a heading-outline tool or DevTools — exactly
  one `h1` (the hero name); Projects, Skills, Experience, Achievements, Education and
  Contact each have an `h2`; entry titles in Experience and Education are `h3`
  (T10 AC4). Paste the outline.
- D19.5 **Keyboard reachability:** starting from the address bar, `Tab` alone reaches, in
  visual order: all 7 nav links, the hamburger (at 375 px), both hero CTAs, every social
  link, every project `source`/`live` link, and every contact control. Nothing interactive
  is skipped; no keyboard trap (T10 AC5).
- D19.6 **Focus visibility:** screenshots of a focused nav link, a focused hero CTA, a
  focused project link and a focused contact control, each showing the teal focus ring
  (T10 AC6).
- D19.7 **Alt text:** DevTools/accessibility-tree spot check per 19b (T10 AC7).
- D19.8 **Contrast:** using the DevTools contrast checker, body/paragraph text in
  Experience, Achievements and Education each scores **≥ 4.5:1**, and mono
  label/eyebrow text scores **≥ 3:1**. Record the actual ratios per sample (T10 AC8).
- D19.9 **External links:** DevTools spot check of all 4 social links and at least 2
  project source links confirms `target="_blank"` together with a `rel` containing
  `noopener` (T10 AC10).

---

### 20 · T1-D3 — Scroll-rail marker: emoji → inline SVG on palette tokens

**Ticket:** T1, criterion **AC4** (parts 4b and 4c) · **Requirements:** PRD §7.4, **D15** ·
**Design:** architecture §3 (A2), §7.2, §7.3 · **dep:** task 14 (for verification)

**Why this exists.** `src/components/FlightPath.jsx` line 32 renders a literal 🚀 character
as the marker travelling the fixed scroll-progress rail. That glyph is drawn by the
**visitor's** OS emoji font, so its colours and shape belong to Windows/Apple/Android, not
to this design — it imports colours that are nowhere in the `:root` palette and renders in
a font that is not one of the three declared families, breaking both halves of PRD §7.4.
The existing `filter: drop-shadow(0 0 6px var(--nebula))` on it is already an attempt to
theme something un-themeable.

PRD **D15** rules: **keep the rail, keep the marker, keep the scroll-linked motion, replace
the glyph.** Narrowing T1 AC4 to hero copy was rejected; deleting the rocket was rejected
(a track with nothing travelling along it reads as a broken progress indicator).

> **Do not delete the rail, the track, the trail or the marker.** Plan T1 AC4 part **4c**
> makes removal an explicit **fail**. The fix is to change what the marker *is*, never to
> remove it.

Verified facts you can rely on: `.flight-path` is `aria-hidden="true"` and
`pointer-events: none`, is `position: fixed; right: 6px; width: 60px; z-index: 5`, is a
**sibling of** `#about` (not inside it), and is `display: none` at `max-width: 900px` — so
it exists only at **≥ 901 px**, where it paints over the right edge of whatever is beneath.

**Hero word budget is unaffected — still 39 / 40 words, 1 sentence.** The marker is not
hero copy: `FlightPath` is a sibling of `#about`, it is `aria-hidden` decorative chrome, and
after this task the marker is not text at all. It was never in the countable set defined by
plan T1 AC6 / PRD §5.6, so removing the glyph changes no count. Task 6's budget table stands
as written.

**20a — `src/components/FlightPath.jsx`** (modify)

Replace the emoji text node inside `<motion.div className="flight-path__ship">` with this
inline SVG. Everything else in the file — `useScroll`, `useSpring`, `useTransform`,
`PATH_D`, the two `<path>` elements in the track `<svg>`, and the `style` object carrying
`offsetPath` / `offsetDistance` / `offsetRotate` — is **unchanged**:

```jsx
<svg viewBox="0 0 18 18" className="flight-path__ship-svg" focusable="false">
  <path className="flight-path__ship-hull" d="M3 2 L16.5 9 L3 16 L6.5 9 Z" />
  <circle className="flight-path__ship-core" cx="4.6" cy="9" r="1.5" />
</svg>
```

Four things about this markup are deliberate:

1. **It has no `fill` attribute.** Colour is set from `App.css` in 20b. `var()` is not
   reliably supported inside SVG *presentation attributes*, and a hardcoded hex would put a
   colour literal in a component — both forbidden by architecture §7.3.
2. **It has no `aria-hidden`.** The `.flight-path` wrapper is already `aria-hidden="true"`,
   which covers the whole subtree; a second one is redundant. `focusable="false"` is kept as
   a defensive guard against the SVG becoming a tab stop in some engines.
3. **The hull points along +X (to the right).** `offsetRotate: "auto"` aligns the element's
   **+X axis** to the path tangent, so a right-pointing mark automatically noses in the
   direction of travel — which, since `PATH_D` winds downward, means it points *down* as it
   descends. **This is correct; do not "fix" the orientation.** The old emoji pointed
   up-and-right and was rotated by the same rule, which is why its heading always looked
   arbitrary.
4. **The shape is a notched delta** — `(3,2) → (16.5,9) → (3,16)` with the trailing edge
   notched back to `(6.5,9)` — with a small circular core floating in the notch reading as a
   thruster. Two elements, legible at 18 px, no detail that vanishes at that size.

**20b — `src/App.css`, the `flight path (scroll-driven rocket)` block** (modify)

Change `.flight-path__ship`:

- **Remove `font-size: 18px`.** It was the sizing mechanism only because the marker was a
  text glyph; with an SVG child it now does nothing.
- **Add `width: 18px; height: 18px;`** — preserves the previous optical size, so the
  marker's relationship to the 60 px-wide rail is unchanged.
- **Change the glow token:** `filter: drop-shadow(0 0 6px var(--nebula))` →
  `filter: drop-shadow(0 0 6px var(--thruster))`. Both are existing palette tokens, so this
  introduces no new colour (T8 AC1 still passes). The reason for the swap: the progress
  trail directly beneath the marker is already `stroke: var(--thruster)` with a teal
  drop-shadow, so a teal marker reads as the glowing head of its own trail instead of as a
  pink object sitting on a teal line. `--thruster` is also the semantically right token for
  a thruster.
- **Keep** `position: absolute; top: 0; left: 0; transform-origin: center;` exactly as they
  are. `transform-origin: center` is what makes the auto-rotation pivot about the mark's
  centre now that it has real dimensions.

Add three new rules to the same block (new **elements** on the existing `flight-path`
block — this is not a new block, so nothing changes in the ToC from task 8):

```css
.flight-path__ship-svg {
  display: block;
  width: 100%;
  height: 100%;
}
.flight-path__ship-hull {
  fill: var(--thruster);
}
.flight-path__ship-core {
  fill: var(--nebula-2);
}
```

`display: block` on the SVG removes the inline-layout baseline gap that would otherwise
leave the 18 × 18 box slightly taller than its contents.

Do **not** touch `.flight-path`, `.flight-path__svg`, `.flight-path__track`,
`.flight-path__trail`, or the `@media (max-width: 900px) { .flight-path { display: none } }`
rule. The 900 px hide is what makes plan T1 AC4 part 4b a ≥ 901 px-only check.

**Done criteria** (browser, `npm run dev`; AC4's evidence spec is explicit, so follow it):

- D20.1 At **1024, 1280 and 1440 px**: scrolling from the top of the page to the bottom, the
  marker travelling the dotted track is a **flat two-tone teal/violet vector mark**. No
  orange-and-white rocket appears. **Evidence: a 1440 px screenshot of the hero with the
  right-edge rail in frame, zoomed enough to identify the marker** (T1 AC4 4b).
- D20.2 The rail still works (T1 AC4 4c): the dotted track is present, the glowing progress
  trail still grows as you scroll, and the marker still tracks scroll position. **Evidence:
  a scroll-through recording showing the marker travelling the full length of the track**,
  reaching the top of the track at scroll position 0 and the bottom at full scroll.
- D20.3 The marker still **rotates along the track** as it travels (it noses in the
  direction of travel through the winding curves) — visible in the same recording.
- D20.4 Sampling the marker with the DevTools colour picker returns only existing palette
  values: `#43e8d8` (`--thruster`) for the hull and glow, `#7c5cff` (`--nebula-2`) for the
  core. No off-palette hue anywhere on it (T8 AC1).
- D20.5 At **375, 414 and 768 px** the rail is correctly absent entirely (the pre-existing
  900 px hide), so there is nothing to check there — confirm it is hidden, not merely
  off-screen.
- D20.6 **Zero emoji remain in the codebase.** Search `src/` for pictographic characters
  (e.g. ripgrep `rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]" src/`) and record
  the real output: it must return **no matches**. Together with task 13a deleting the emoji
  bio, this is what makes the page-wide form of T1 AC4 pass. Note `↓` (U+2193), `·`
  (U+00B7) and `–` (U+2013) are **not** emoji and must not be reported as violations
  (T1 AC4 4d).
- D20.7 With `prefers-reduced-motion: reduce` emulated, the rail still responds to scrolling
  — it is scroll-linked, not timer-driven, and plan T8 AC6 names it as the **only** element
  permitted to move under that setting. Nothing about it may animate on a timer.
- D20.8 DevTools Console: zero errors, zero React warnings.
- D20.9 `npm run lint` exits 0; `npm run build` exits 0.

---

### 21 · T8-D3 — Final visual-consistency pass + CSS ToC reconciliation

**Ticket:** T8 · **Requirements:** PRD §7.4, G2 · **Design:** ADR-0003, ADR-0004 ·
**dep:** tasks 1–20

**File:** `src/App.css` — **modify** (reconciliation only; no new features).

**21a** — Verify the block order in the file matches the ToC written in task 8a, and that
the ToC lists every banner block actually present. Fix whichever is wrong; the ToC is not
allowed to lie. Note task 20 added *elements* to the pre-existing `flight path` block, not a
new block, so the ToC needs no new entry for it.

**21b** — Confirm no rule introduced in tasks 8–20 uses a colour literal or font family
that is not one of the existing `:root` tokens. Every tint must be an `rgba()` of an
existing token's channels. Grep your diff for `#` hex literals and for `font-family:`
values that are not `var(--font-…)`. This includes the SVG fills added in task 20b, which
must be `var(--thruster)` / `var(--nebula-2)` in CSS and **not** `fill="…"` attributes in
the JSX.

**21c** — Confirm the continuous-motion budget (T8 AC5, ADR-0004 §3):

| section | looping effects (motion enabled) | verdict |
|---|---|---|
| Nav | `ONLINE` pulse | exempt by the plan |
| Hero | typewriter (PRD-mandated) + scroll cue (exempt) | 1 countable. Under reduced motion this drops to **0** — the typewriter is not mounted (PRD D13). |
| Projects | `.mission-card__scanline` — one effect *type* repeated per card | 1 countable. If QA rejects that reading, the agreed fallback is to run the scanline on `:hover` only (ADR-0004 / architecture §9.1) — implement the fallback only if QA raises it. |
| Skills | none | 0 |
| Experience / Achievements / Education | none (the ongoing node is static) | 0 |
| Contact | none | 0 |

**Done criteria** (browser):

- D21.1 Sampling with the DevTools colour picker, the Experience / Achievements /
  Education sections use only colours already present in Projects / Skills / Contact. No
  new hue. Record the sampled values (T8 AC1).
- D21.2 DevTools Computed → `font-family` across headings, body text and mono labels shows
  only the three existing families; the Network tab shows no font request beyond the
  existing Google Fonts request (T8 AC2). No element on the page renders in an OS emoji
  font (PRD §7.4, T1 AC4).
- D21.3 Side-by-side screenshot of all five `.station` headings (Projects, Skills,
  Experience, Achievements, Education) shows the same eyebrow + bracketed-title treatment:
  same font sizes, same accent-colouring pattern (T8 AC3).
- D21.4 No section contains more than one attention-grabbing continuous animation, per the
  table above (T8 AC5).
- D21.5 Hovering an Experience entry, an Achievement entry and an Education entry each
  produces the same lift + teal glow as hovering a project card — one behaviour, not three
  (T8 AC7).
- D21.6 Full-page screenshots at 375 px and 1440 px show no overlapping text, no element
  escaping its panel, no double borders, and no orphaned single-item row that looks
  accidental (T8 AC8). At 1440 px the right-edge scroll rail is in frame and its marker is
  the vector mark from task 20, not an emoji.

---

### 22 · V-D1 — Integration & verification

**Ticket:** all · **Requirements:** constitution "never skip verification / never report
completion without evidence" · **Design:** architecture §12 · **dep:** 1–21

There is **no test runner** in this project (no Jest, no Vitest, no Playwright) and no
ticket adds one. "Verified" for iteration 01 therefore means exactly the three things
below, and **no claim of "done" may cite source code alone.**

**22a — Run these commands and paste their real output** (exit code plus the last lines
of stdout/stderr) into `docs/execution/iteration-01-portfolio-uplift/execution-log.md`.
Do not paraphrase, do not summarise as "passing", do not fabricate. PowerShell, from the
repo root:

```
npm run lint
npm run build
npm run dev
```

- `npm run lint` must exit **0**. The script is
  `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`, so a single
  warning fails it. Likely offenders from this iteration: the unused `useMemo` import in
  `Hero.jsx`, the unused `index` in the `skills.map` call site, and any leftover unused
  variants const.
- `npm run build` must exit **0**.
- `npm run dev` serves the app (default `http://localhost:5173/`). All browser checks below
  run against this — the **real running app**, never against a stub or a static reading of
  the source.

**22b — Browser verification matrix.** Chromium-based browser, DevTools open with Console
and Network visible and "Disable cache" on.

1. **Hard refresh, then scroll the entire page.** Console: zero errors, zero React
   warnings. Network: zero 404s; every `/skills/`, `/projects/`, `/socials/` and profile
   image request returns 200; **no request for `nextjs.svg`**.
2. **Counts on screen:** 6 project cards, 9 achievement entries, 26 skill tiles, 2
   experience entries, 2 education entries, 7 nav links, 4 telemetry tiles.
3. **Six responsive checkpoints — 375, 414, 768, 1024, 1280, 1440 px.** At each: screenshot
   the full page, confirm no horizontal scrollbar, and record
   `document.documentElement.scrollWidth` and `window.innerWidth` from the Console.
4. **`prefers-reduced-motion: reduce` pass** (DevTools → Rendering → Emulate CSS media
   feature), **then hard refresh** — that order matters, because `Starfield` reads the
   preference once at mount. Full-page read-through end to end with no animation gating
   any content, no boot strip, no entrance animations, and **no looping motion anywhere —
   there are no permitted exceptions** (T8 AC6, T10 AC9). Evidence: (a) a screen recording
   of ≥ 10 s resting on the hero in which nothing changes except the mouse cursor, with
   the classification line showing the static string
   `Junior Software Developer · Robotics Enthusiast · Tech Innovator` and nothing typing;
   (b) a scroll-through recording in which nothing fades, slides or scales in and the only
   moving element is the scroll-progress rail. Then repeat with emulation **off** and
   confirm the typewriter is back and the static string is gone (T1 AC15).
5. **Keyboard pass:** `Tab` from the address bar through the whole page in visual order,
   confirming a visible focus ring on every stop and no trap.
6. **Boot-timing measurement:** DevTools Performance recording (or a screen recording) of
   a hard refresh; report the measured time until the mission line and telemetry tiles are
   legible. Must be **< 1.5 s**.
7. **Section-reveal timing:** screen recording at normal scroll speed; report per-section
   time from viewport entry to fully readable for Experience, Achievements and Education.
   Must be **≤ 600 ms** each.
8. **Emoji sweep (T1 AC4, all four parts).** (a) A 1440 px screenshot of the hero with the
   right-edge scroll rail in frame, zoomed enough to identify the marker — it must be the
   teal/violet vector mark, not a rocket emoji; (b) a scroll-through recording showing the
   marker travelling the full length of the track; (c) the real output of the pictographic
   grep over `src/` from D20.6, which must be empty; (d) confirm `↓`, `·` and `–` are
   present and are **not** reported as violations. Repeat the rail check at 1024 and
   1280 px, and confirm the rail is absent at 375/414/768 px.

**22c — Traceability.** In `execution-log.md`, record one line per **plan acceptance
criterion** — T1 AC1…**AC17** (note T1 gained AC15, AC16, AC17 in the plan's 2026-08-27
amendment), T2 AC1…AC9, T3 AC1…AC10, T4, T5, T6, T7, T8, T9, T10 AC1…AC10 — with the task
ID that implemented it, the evidence (screenshot filename / measured number / console
output / Find count / recording), and pass/fail. Any criterion you could not satisfy must
be logged as **failed with the observed behaviour** — not omitted, not softened, not
marked "N/A".

**Every flag this document routed to the PO has been decided** (PRD §9 D10–D14 and PRD
§11). There is no criterion left that is expected to fail by design. If one does fail,
that is a real finding: log it and raise it, do not absorb it.

**Done criteria:**

- D22.1 Real, pasted output for `npm run lint` (exit 0) and `npm run build` (exit 0).
- D22.2 All 8 browser checks in 22b executed, with screenshots and recorded numbers.
- D22.3 A complete AC-by-AC traceability table in `execution-log.md`.
- D22.4 Every §4 flag either confirmed as still open or updated with what you actually
  observed.

---

## 2b. Remediation tasks (amendment A3)

These three were added **after** task 22's verification found them. They are separate tasks
rather than edits to tasks 8/10/11/12/14 so that the sequence of "specified → built →
measured → corrected" stays legible in the record.

---

### 23 · T7-D3 — `useHashScroll`: make fragment deep links scroll on a cold load

**Ticket:** T7, criterion **AC2** (also the opening "navigating to `/#id` scrolls to a
visible section" clause of **T2 AC1, T3 AC1, T4 AC1**; task.md **D14.2**) ·
**Requirements:** PRD §6.1, §6.2 · **Design:** **ADR-0008**, architecture §3.1 (A3), §14 ·
**dep:** task 14

**Why this exists.** Masky measured (`execution-log.md` F-1) that loading
`http://localhost:5173/john-rey-portfolio/#experience` in a fresh tab leaves
`window.scrollY` at `0` — sampled every 500 ms for 6.6 s — while `location.hash` is correct
and the section's document top is `3139`. He proved it is not a harness artefact: a static
page scrolls to its fragment in the same browser (`scrollY 3608`), and
`getElementById(id).scrollIntoView()` after mount scrolls correctly (`scrollY 4625`). The
browser resolves the fragment while `#root` is still empty and never retries.

All seven anchors are affected, including the three that predate iteration 01, so this is a
latent defect being fixed — not a regression you introduced.

**23a — `src/lib/useHashScroll.js`** (create)

New module in `src/lib/`, whose charter is widened by ADR-0008 §1 to include behavioural
hooks. **No JSX in this file.** The single export is lowercase-initial, so
`react-refresh/only-export-components` stays quiet.

It imports `sections` from `../content/sections` and takes **no arguments** — the registry
is the allowlist of valid fragments (ADR-0005), and importing it avoids a dependency-array
hazard. Layering is legal: `content/` sits below `lib/`.

```js
import { useEffect } from "react";
import sections from "../content/sections";

// A client-rendered page loses native fragment navigation: the browser resolves
// location.hash while #root is still empty, finds nothing, and never retries.
// This restores it once, after mount. See ADR-0008.
const useHashScroll = () => {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !sections.some((section) => section.id === id)) return;

    const target = document.getElementById(id);
    if (!target) return;

    // "instant" is required: "auto" defers to html { scroll-behavior: smooth },
    // which would animate a page-load positioning operation.
    const jump = () => target.scrollIntoView({ behavior: "instant", block: "start" });

    let cancelled = false;
    let correction = 0;
    const cancel = () => {
      cancelled = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((type) =>
      window.addEventListener(type, cancel, { once: true, passive: true })
    );

    // Phase 1 - land immediately, after first layout.
    const initial = requestAnimationFrame(jump);

    // Phase 2 - webfonts can change every offset below the fold, so re-assert
    // once they have settled, unless the visitor has started interacting.
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      correction = requestAnimationFrame(() => {
        if (!cancelled) jump();
      });
    });

    return () => {
      cancelAnimationFrame(initial);
      cancelAnimationFrame(correction);
      events.forEach((type) => window.removeEventListener(type, cancel));
    };
  }, []);
};

export default useHashScroll;
```

**23b — `src/App.jsx`** (modify — two lines)

Add `import useHashScroll from "./lib/useHashScroll";` and call `useHashScroll();` inside
`App()`, next to the existing `const reduced = useReducedMotion();`. Nothing else in
`App.jsx` changes; it stays a composition file with no logic of its own.

**Constraints — each of these is a decision, not a preference (ADR-0008):**

1. **`behavior: "instant"`, never `"auto"` or `"smooth"`.** `App.css` sets
   `html { scroll-behavior: smooth }` globally, and `"auto"` defers to it — so `"auto"`
   would animate a multi-second scroll past the whole hero on first paint.
2. **No `useReducedMotion()` call and no reduced-motion branch.** The scroll is instant in
   *both* modes, which satisfies ADR-0007 by construction: nothing animates, so there is
   nothing to suppress. Native fragment navigation is instant, and a smooth scroll would be
   worse for everyone and would fight ADR-0006's time-to-legible goal. Explicitly passing
   `"instant"` *is* the reduced-motion handling — it stops the global CSS from animating it.
3. **Mount-only: `[]` deps, and no `hashchange`/`popstate` listener.** In-page nav clicks
   are handled natively and already work (Masky measured all 7 landing at `top: 0`); a
   `hashchange` listener would double-handle them and fight the native smooth scroll that
   makes them feel good.
4. **Do not touch `history.scrollRestoration`,** so hash-less reloads keep normal restore
   behaviour. When a fragment is present the hook runs after restoration and the fragment
   wins — correct precedence for an explicit instruction in the URL.
5. **Do not coordinate with, suppress, or pause the scroll-spy `IntersectionObserver`.** The
   programmatic scroll fires it exactly as a user scroll would, and architecture §10's
   "first intersecting id in registry order" rule then marks the target active — the desired
   outcome. Adding suppression would reintroduce the non-determinism ADR-0005 removed.
6. **Do not add a dependency.** `requestAnimationFrame`, `document.fonts` and
   `scrollIntoView` are all native.

**On the reveal animations and the landing offset** — the question of whether scrolling
before the sections have revealed lands in the wrong place. It does not, and this was
checked rather than assumed: `riseItem`, `cardRise`, `headingRise` and `consoleRise` animate
only `opacity`, `transform` (`y`/`scale`/`rotateX`) and `filter`. **None of those affect
layout** — a translated element still occupies its original box — so every section's
document offset is final at first paint whether or not its reveal has played. Images cannot
shift it either: every image sits in a fixed-size box (`.mission-card__viewport` is
`height: 170px`, `.module__img` is `42 × 42`, `.hero__porthole` is `150 × 150`). The one
real late-shift source is the **webfont swap**, and that is exactly what phase 2 exists
for — which is why it keys off `document.fonts.ready` and not off a timer or a poll.

**On `StrictMode`** — the effect runs twice in development. It is idempotent (the second
jump targets the same element and is a no-op) and the cleanup cancels both rAFs and removes
all four listeners, so this is safe. Do not add a "has run" ref to suppress it.

**Done criteria** (browser, `npm run dev`, a **fresh tab per check** with cache disabled —
a reload of an already-scrolled page is not the same test):

- D23.1 For **each of the 7 registry ids** — `#about`, `#projects`, `#skills`,
  `#experience`, `#achievements`, `#education`, `#contact` — pasting
  `http://localhost:5173/john-rey-portfolio/#<id>` into the address bar on a cold load
  scrolls to that section: the section's `getBoundingClientRect().top` is within ~4 px of 0
  (or the document is at maximum scroll, for a section shorter than the remaining viewport),
  and its heading is visible. Record the measured `window.scrollY` and the section `top` for
  all 7. `#about` legitimately stays at 0 (T7 AC2, and the opening clause of T2/T3/T4 AC1).
- D23.2 The scroll is **instant, not animated**: sample `window.scrollY` at ~50 ms intervals
  from navigation start; it must go from `0` to its final value between two consecutive
  samples, with **no** intermediate easing values. Record the trace.
- D23.3 With `prefers-reduced-motion: reduce` emulated, D23.1 and D23.2 give the **same**
  results — instant in both modes, no behavioural difference. Record one id's trace in each
  mode side by side.
- D23.4 Deep-linking does not break the hero: on `/#experience` the hero still renders
  correctly when scrolled back to (avatar, name, telemetry all present), and on a plain `/`
  load the boot ticker and the ≤ 1.5 s time-to-legible from D13.12/D13.18 are unchanged.
- D23.5 Scroll-spy agrees: after landing via `/#achievements`, exactly **one** nav entry is
  `.is-active` and it is `Medals`. Repeat for `#experience` → `Service` and `#education` →
  `Academy` (T6 AC3 still holds).
- D23.6 In-page nav clicks are **unchanged** — clicking all 7 nav entries still scrolls to
  the right section with the target heading in view, and still animates smoothly (the native
  behaviour, not the instant jump). Confirm the smooth animation is still present, i.e. the
  hook did not accidentally take over click navigation.
- D23.7 The user-interaction guard works: load `/#education`, and during the load scroll the
  wheel immediately; the page must **not** yank you back to Education afterwards. Describe
  what you observed.
- D23.8 An invalid fragment is inert: `/#not-a-section` and `/#` load at the top with no
  error and no scroll.
- D23.9 DevTools Console: zero errors, zero React warnings, on a fragment load and on a
  plain load, in both motion modes.
- D23.10 `npm run lint` exits 0 (`--max-warnings 0`, so confirm no
  `react-refresh/only-export-components` warning for the new file and no
  `react-hooks/exhaustive-deps` warning); `npm run build` exits 0.

---

### 24 · T8-D4 — Remove the dead `transform` from the `record` hover CSS

**Ticket:** T8, criterion **AC7** (task.md **D21.5**) · **Requirements:** PRD §7.4 ·
**Design:** architecture **§8.1**, ADR-0004 amendment A3 · **dep:** tasks 10, 11, 12

**Ruling on `execution-log.md` deviation D-2 — ACCEPTED.** Masky's diagnosis is correct and
his mechanism is ratified. `whileHover={{ y: -4 }}` on `ExperienceEntry`, `AchievementCard`
and `EducationCard` **stays exactly as he implemented it** — no change to those three files
in this task.

His measurement is the whole argument: framer-motion writes an inline `transform` on every
`motion.li` it drives, and once the reveal settles that value is `transform: none`. Inline
beats the stylesheet, so task 8b's `.record:hover { transform: translateY(-4px) }` could
never render — measured `top` 342 → 342, glow present, lift dead. `.mission-card` has always
worked the other way round (CSS glow, framer lift), and "deliberately the same reaction as
`.mission-card:hover`" was ADR-0004's stated intent, so his fix *restores* the ADR's intent.
My CSS spec was the thing that diverged from it.

**What still needs changing: the now-dead CSS must go.** Leaving it is not harmless.

**24 — `src/App.css`, the `record` block** (modify — two edits, no other file)

1. **Delete `transform: translateY(-4px);` from `.record:hover`.** It leaves
   `border-color: var(--thruster)` and `box-shadow: 0 12px 40px rgba(67, 232, 216, 0.15)`.
2. **Delete `transform 0.25s ease` from `.record`'s `transition` list**, leaving
   `transition: border-color 0.25s ease, box-shadow 0.25s ease;` — which is exactly what
   `.mission-card` declares.

Both deletions matter for real reasons, not tidiness:

- Edit 2 is a **correctness** fix, not cleanup. A CSS `transition` on `transform` tries to
  interpolate every inline transform framer-motion writes, so it fights the `whileHover`
  animation frame by frame. `.mission-card` transitions only `border-color` and
  `box-shadow`, and that is why its lift is crisp.
- Edit 1 matters **specifically under reduced motion.** With `reducedMotion="user"`,
  framer-motion writes no inline transform — so the CSS rule *does* apply there (Masky
  noted this in D-2). Keeping it would reintroduce a hover movement for exactly the users
  who asked for less motion, and would make records behave differently from `.mission-card`
  and `.module`, which both lose their lift in that mode. Removing it makes the hover
  "glow only, no movement" under reduced motion — consistent with the rest of the page and
  the honest reading of the preference.

**The rule this establishes** is now written down in architecture **§8.1** so nobody
rediscovers it by measurement: *on a framer-motion-driven element, transform-based hover
feedback belongs in `whileHover`; non-transform hover feedback belongs in CSS; and the
element's CSS must declare neither `transform` on `:hover` nor `transform` in its
`transition`.* This does not weaken ADR-0003 — that ADR decides where stylesheets live, not
that CSS owns every visual behaviour, and framer already owned the transform for
`ProjectCard` and `Skill` before this iteration.

**Scope of this task: `.record` only. Do not "fix" any other hover.** I audited every CSS
`:hover` transform in `App.css` against the real components, and `record` was the **only**
violation. The rest are already correct, for one of two reasons:

| Rule | Element | Why it is fine |
|---|---|---|
| `.hero__cta:hover { translateY(-3px) }` | plain `<a>` inside `motion.div.hero__actions` | framer writes the inline transform on the **parent** div, not on the anchor |
| `.hero__channel:hover { translateY(-4px) scale(1.08) }` | plain `<a>` inside a plain `div.hero__channels-row` | same — not a motion element |
| `.console__cta:hover`, `.console__channels-row a:hover` | plain `<a>` inside `motion.div.console` | same |
| `.mission-card:hover`, `.module:hover` | both **are** motion elements | already correct: their CSS hover sets `border-color`/`box-shadow` only, and the lift already comes from `whileHover` |
| `.hero__porthole` | `motion.div` | already uses `whileHover={{ scale: 1.05 }}` — the correct mechanism |

That audit is what makes the rule credible rather than speculative: exactly one element had
the bug, and it was the one added this iteration.

**Done criteria** (browser, real mouse hover — not a synthetic class toggle):

- D24.1 **Motion enabled:** hovering an Experience, an Achievement and an Education record
  each still produces the 4 px lift plus the teal border and glow. Record the measured
  element `top` before and after hover for all three (Masky's baseline was 342→338,
  357→353, 369→365) (T8 AC7, D21.5).
- D24.2 Computed `transition-property` on `.record` **no longer contains `transform`** — it
  lists `border-color` and `box-shadow` only, matching `.mission-card`. Read it from the
  live element, not from the source.
- D24.3 The hover lift is visibly crisp, with no double-animation or lag on repeated
  hover-in/hover-out. Describe what you observed.
- D24.4 **Reduced motion emulated, then hard reload:** hovering the same three records
  produces the border + glow and **no movement** — the measured element `top` is identical
  before and after hover. Confirm `.mission-card` behaves the same way in that mode, so the
  two are consistent (T8 AC7 in both modes).
- D24.5 No other hover on the page regressed: re-check a project card (8 px lift + glow) and
  a skill tile (6 px lift + 1.06 scale) with motion on.
- D24.6 `npm run lint` exits 0; `npm run build` exits 0.

---

### 25 · V-D2 — Targeted re-verification of the remediation

**Ticket:** all · **Requirements:** constitution ("never skip verification", "never report
completion without evidence") · **dep:** tasks 23, 24

Tasks 23 and 24 change scroll behaviour and a shared CSS primitive after the full
verification pass had already run, so the affected criteria must be re-observed rather than
assumed to still hold. This is deliberately **targeted, not a full re-run** of task 22 —
re-run only what these two changes can plausibly have moved.

**25a — Re-run and paste real output:** `npm run lint` (exit 0) and `npm run build`
(exit 0).

**25b — Re-verify these previously-passing criteria** (all in the live app; a new `src/lib/`
module that scrolls the page and a change to `.record`'s transition are the two blast
radii):

| Re-check | Why it could have moved |
|---|---|
| **T7 AC2** + T2/T3/T4 AC1 opening clause | the point of task 23 — was FAIL, must now PASS |
| **T7 AC3** (tab order top-to-bottom) | task 23 changes where the page is scrolled on load |
| **T6 AC2, AC3** (nav clicks, single active entry) | the hook and the observer both act on scroll |
| **T8 AC7** / D21.5 (hover parity) | the point of task 24 |
| **T8 AC6, T10 AC9** (reduced motion: nothing animates, nothing gates content) | task 23 adds a scroll on load; task 24 changes what happens on hover under reduced motion |
| **T1 AC12** (≤ 1.5 s to legible) | a mount-time effect runs during the same window |
| **T1 AC13** (hero visible immediately under reduced motion) | same |
| **T10 AC1** (console clean) | new module, new listeners |
| **T9 AC1, AC2** at 375 and 1440 px | a scroll-position change can expose an overflow that was previously off-screen |

**25c — Update `execution-log.md`:** flip **F-1** from FAIL to resolved, citing task 23 and
the D23.x evidence; record **D-2** as **ratified by the architect** with task 24's
completion and the D24.x evidence; and update the AC-by-AC traceability table so T7 AC2 and
the T2/T3/T4 AC1 opening clauses read PASS with their new evidence. Do not delete the
original failure record — the history is the point.

**Done criteria:**

- D25.1 Real, pasted `npm run lint` and `npm run build` output, both exit 0.
- D25.2 Every row of 25b's table re-observed, with the evidence recorded. Any row that now
  fails is a **new finding**: log it and escalate, do not absorb it.
- D25.3 `execution-log.md` updated per 25c, with F-1 resolved and D-2 marked ratified.
- D25.4 A one-line statement of whether **any** plan acceptance criterion T1–T10 is still
  failing, and if so which.

---

## 3. Files touched, at a glance

**Created (10):**

```
src/content/experience.js
src/content/achievements.js
src/content/education.js
src/content/sections.js
src/content/hero.js
src/lib/motion.js
src/lib/useHashScroll.js          task 23a  (ADR-0008)
src/components/ExperienceEntry.jsx
src/components/AchievementCard.jsx
src/components/EducationCard.jsx
```

**Modified (11):**

```
src/App.jsx           tasks 9b, 13c, 14, 23b
src/App.css           tasks 8, 9c, 13d, 16, 17, 20b, 21, 24
src/content/skills.js       task 1
src/content/information.js  task 13a  (description deleted)
src/components/Skill.jsx        task 9a  (BREAKING props)
src/components/Hero.jsx         task 13b (BREAKING props)
src/components/Navbar.jsx       task 15
src/components/Heading.jsx      tasks 17a, 18
src/components/ProjectCard.jsx  tasks 18, 19a
src/components/ContactForm.jsx  task 18
src/components/Footer.jsx       task 19a
src/components/FlightPath.jsx   task 20a (emoji marker -> inline SVG, PRD D15)
```

**Untouched:** `src/main.jsx`, `src/components/Starfield.jsx`, `src/content/projects.js`,
`src/content/socials.js`, `index.html`, `vite.config.js`, `package.json`, `.eslintrc.cjs`,
everything in `public/`.

**Do not touch:** `package.json` (no new dependencies — architecture §1.1), `governance/`,
`docs/execution/PRD.md`, `docs/execution/iteration-01-portfolio-uplift/plan.md`,
`docs/execution/architecture.md`, `docs/execution/adr/*`, and this file.

---

## 4. Flags — conflicts, ambiguities and deviations

These were **surfaced, not absorbed** (constitution: "route gaps to the owning role").

**Status after amendments A1–A3: every flag is closed.** The six routed to the PO (F2, F3,
F4, F5, F9, **F15**) are decided in PRD §9 **D10–D15**; F12 and F13 are recorded as deferred
defects in PRD §11 **DF1–DF3**; F14 is confirmed in PRD D2/D3; the four I owed myself (F1,
F6a, F7, F10) are written into `architecture.md` and the ADRs; and the three raised during
implementation (**F16, F17, F18**, below) are designed, ruled on and specified as tasks
23–25.

**Nothing here is left for Masky to decide.** Implement as specified in §2. If you hit a
*new* conflict, stop and escalate — do not resolve it in code.

| # | Flag | Disposition |
|---|---|---|
| **F1** | Architecture §11's hero word-budget table omitted the boot-ticker copy, which T1 AC6 counts. The old 37-word table plus the then-current 4-line boot (~13 words) would have landed near 50 and failed AC6. | **CLOSED — architecture amended (A1).** §11's table now carries the boot row and totals **39 / 40 words, 1 sentence**; ADR-0006 §4 updated to match. PRD §5.6's "Word-budget interlock" and plan T1 AC6 state the same 39/1 figure, so all three documents agree. Boot cut to one line (task 6). |
| **F2** | PRD casing inconsistency: §5.6 telemetry read `Full-time` (lowercase `t`) while §5.1's badge read `Full-Time`, putting two spellings of one term on one page. | **CLOSED — decided by Nala, PRD D10.** `Full-Time` (capital `T`) everywhere, including the hero `STATUS` tile. Task 6's table updated and its former "do not harmonise" instruction **deleted**. Verified by plan T2 AC3 as a side-by-side pixel comparison (`Ctrl+F` is case-insensitive and cannot catch it). Word count unaffected. |
| **F3** | `.module__label`'s `text-transform: uppercase` had to go for T5's "exact visible labels" to be literally true; side effect is the 18 existing tiles stop rendering in all-caps. | **CLOSED — approved by Nala, PRD D11.** Implemented in task 9c. Plan T5 AC2/AC3/AC4 rewritten to judge rendered glyphs from a screenshot, and to name this as an **expected visual diff, not a regression**. §5.5 records the rendered-casing rule. |
| **F4** | ADR-0006 trimmed `open comm channels` → `comm channels` and `scroll to descend ↓` → `descend ↓`, plus the 4-line boot → one line — copy PRD §5.6 had called "existing, unchanged". | **CLOSED — approved by Nala, PRD D12.** All three are now canonical PRD copy (§5.6 items 1, 8, 9), not architect deviations. Tested by new plan T1 AC16 and AC17. ADR-0006 updated. |
| **F5** | `typewriter-effect` has no reduced-motion API and loops indefinitely; PRD §5.6 mandated it, making **T8 AC6** ("no looping motion") and T10 AC9 unpassable. Was the one criterion I could not make pass. | **CLOSED — decided by Nala, PRD D13.** Under `prefers-reduced-motion: reduce` the typewriter is **not mounted at all**; the static string `Junior Software Developer · Robotics Enthusiast · Tech Innovator` renders instead. Everyone else still gets the typewriter. Implemented in task 13b, verified by new plan T1 AC15. T8 AC6 and T10 AC9 now have **no permitted exceptions**. ADR-0007 gains Layer 5; architecture §9.2.1 and §11.1 carry the rule. |
| **F6** | PRD §6.3 suggested a *pulsing* ongoing indicator, but ADR-0004 budgets the three new sections at zero looping effects, and the CSS reduced-motion block would flatten a pulse anyway. | **CLOSED — resolved in design.** Implemented as a static filled + glowing timeline node plus an accent-coloured `Present` (task 10b). T2 AC6 explicitly permits non-animated options, so no criterion is missed. Also the only variant compatible with T8 AC6's zero-motion requirement. |
| **F6a** | `.record__award` was an undocumented extension to the `record` primitive's element list. | **CLOSED — architecture amended (A1).** Added to architecture §8 and ADR-0004 §1, together with `.record__notes`, and with the rationale (keeping the type scale out of modifiers) recorded in both. |
| **F7** | `Heading.jsx` needs a `<wbr />` and a lower clamp minimum so `<AcademicAchievements/>` — one unbreakable 20-char token — can fit 375 px without violating T9 AC3 or AC4. Architecture §3 listed the file as unchanged. | **CLOSED — architecture amended (A1).** §3's file table now lists `Heading.jsx` as MODIFIED with the reason. Markup-only: props, PropTypes and render contract unchanged, and the `<wbr />` is inert wherever the heading already fits. Task 17a implements it. |
| **F8** | The Skills grid's entrance completes at ~0.90 s, over the 600 ms guideline (26 tiles × 0.02 s + 0.4 s). | **CLOSED — accepted, no criterion breached.** T8 AC4 binds only the three *new* sections, all of which land ≤ 0.56 s (task 7's budget table). Current behaviour is 2.40 s, so this is a 2.7× improvement. Fallback if QA reads AC4 as page-wide: a single container fade for `.module-grid` with no per-tile stagger. |
| **F9** | Achievements at 640–1023 px used 2 columns, leaving the 9th card alone at half width. I had accepted the orphan because T3 AC10 then constrained only 1440 px. | **CLOSED — decided by Nala, PRD D14: the orphan is rejected.** The 9th card now **spans both columns** in the 2-column range, with an explicit `grid-column: auto` reset at ≥ 1024 px so the 3 × 3 grid is unaffected. Task 11b rewritten with the exact CSS; plan T3 AC10 rewritten to measure it at 768, 1024, 1280 and 1440 px. |
| **F10** | Architecture §3's file table listed `ProjectCard`, `ContactForm` and `Heading` as unchanged, contradicting §9.2/§9.3 and ADR-0007 in the same document. | **CLOSED — architecture amended (A1).** All three (plus `Footer`) are now listed as MODIFIED with reasons. `Starfield` is confirmed unchanged **and already conformant** — verified in source: it reads the preference at mount and schedules no rAF loop. |
| **F11** | T1 AC12 ("legible within 1.5 s") is only checkable by measurement, never by reading `BOOT_DURATION_MS`. | **CLOSED — a verification instruction, not a defect.** Masky must produce a Performance or screen recording and report the real number (D13.12). A code citation is not evidence. |
| **F12** | `index.html`'s favicon `/me.png` is base-unaware and 404s on the gh-pages sub-path; `information.userData.img` carries a leading slash producing a doubled slash after `BASE_URL`. | **CLOSED — deferred by Nala as PRD §11 DF1 and DF2.** Explicitly **out of iteration-01 scope**; no T1–T10 criterion tests them and **Masky must not fix them opportunistically**. Both work in dev, so T10 AC2 still passes. A future ticket takes them together, verified against a *built* artifact. |
| **F13** | `jquery`, `react-owl-carousel`, `react-intersection-observer` are declared but imported nowhere. | **CLOSED — deferred by Nala as PRD §11 DF3.** Do not adopt them; do not remove them. Scroll-spy uses the native `IntersectionObserver`. |
| **F14** | PRD D2 (Experience below Projects/Skills) and D3 (robotics block reordered) were judgement calls derived from the user's phrasing. | **CLOSED — both confirmed by Nala with reasoning in PRD D2/D3.** No action for Masky. Recorded so a demo-time change of mind stays a one-line array edit (`content/sections.js` or `content/achievements.js`), not a redesign. |
| **F15** *(raised A1)* | `FlightPath.jsx` renders a 🚀 emoji as the marker on the fixed scroll-progress rail. It exists only at ≥ 901 px, where it paints over the right edge of the hero, and plan **T1 AC4** forbids emoji. I read AC4 as covering hero *copy* only and flagged the ambiguity rather than deciding it. | **CLOSED — decided by Nala, PRD D15, option (b).** AC4 is held at its **full page-wide reading** (rewritten as 4a–4d) and the code is fixed instead: the rail, the marker and the scroll-linked motion all stay, but the glyph becomes an inline SVG on existing palette tokens. Narrowing the criterion was rejected (F5 was resolved by fixing the product, so rewording here would apply two standards in one iteration); deleting the rocket was rejected (a track with no marker reads as broken). Implemented as **task 20 (`T1-D3`)**; PRD §7.4 gains a binding no-emoji-as-visual-element rule, mirrored in architecture §7.3. My earlier "do not remove it unilaterally" instruction is deleted — the swap is now required work, and D20.6 proves **zero** emoji remain in `src/`. |

### Post-implementation findings (amendment A3)

Raised by Masky during verification, in `execution-log.md`. These are **found by
measurement against the running app**, which is the point of the verification gate.

| # | Finding | Disposition |
|---|---|---|
| **F16** | **T7 AC2 FAILS: fragment deep links do not scroll on a cold load.** `/#experience` leaves `window.scrollY` at 0 (sampled 12× over 6.6 s) while `location.hash` is correct and the section's document top is 3139. Proven not to be a harness artefact by two controls. All 7 anchors affected, including the 3 that predate iteration 01 — the browser resolves the fragment while `#root` is empty and never retries. | **CLOSED — designed and specified.** New **ADR-0008**: `src/lib/useHashScroll.js`, a mount-time hook called once from `App.jsx`, with the registry as its allowlist, an **instant** scroll (never `"auto"` — the global `scroll-behavior: smooth` would animate it), no `hashchange` listener, no scroll-spy coordination, and a two-phase re-assert keyed to `document.fonts.ready` guarded by a user-interaction cancel. Implemented by **task 23**. Masky was right to route it rather than fix it. |
| **F17** | **`.record:hover { transform: translateY(-4px) }` never rendered.** framer-motion writes an inline `transform` on every `motion.li`; inline beats the stylesheet. Measured `top` 342 → 342 — glow worked, lift dead. Masky substituted `whileHover={{ y: -4 }}` (deviation D-2) and disclosed it for my ruling. | **CLOSED — his mechanism ACCEPTED and ratified; my CSS spec was wrong.** `.mission-card` has always worked this way, and matching it was ADR-0004's stated intent, so his fix restores the ADR rather than departing from it. I additionally require the dead CSS **removed** — both `transform: translateY(-4px)` from `.record:hover` and `transform` from `.record`'s `transition` (the latter fights framer's per-frame inline writes, and the former would sneak a hover movement back in for reduced-motion users). Rule written into architecture **§8.1** + ADR-0004 amendment A3. Implemented by **task 24**. |
| **F18** | **`npm run lint` was already red at `HEAD` (`1bc1725`)** with 2 `react/jsx-no-comment-textnodes` errors in `Footer.jsx` and `Heading.jsx` — a pre-existing repository defect no iteration-01 document mentions. Masky fixed it (deviation D-1) because the lint gate was otherwise unreachable, using braced string expressions with byte-identical rendered output. | **Architecturally ratified.** The change is render-identical (verified on the live page: eyebrows still read `// mission log`, footer still reads `— end of transmission // 2026 // built by Rey —`), it touches no contract, and without it the `--max-warnings 0` gate that almost every task's done criteria depend on could not pass. It is not scope creep: it is the minimum required to make the specified gate reachable. **Whether it also deserves its own retrospective ticket is Nala's call, not mine** — routing that, not deciding it. |

**No plan ticket is technically infeasible.** T1–T10 are all buildable inside React 18 +
Vite + plain CSS with no new dependency. Following PRD D13, no acceptance criterion is
expected to fail **by design**; and following ADR-0008 and task 24, the two criteria that
were failing **in fact** (T7 AC2 and the hover half of T8 AC7) are now specified fixes
rather than open failures.
