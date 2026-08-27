# Iteration 01 — Portfolio Uplift · Ticket Plan

**Owner:** Nala (Product Owner)
**Iteration folder:** `docs/execution/iteration-01-portfolio-uplift/`
**Requirements source:** `docs/execution/PRD.md` (section references below are to that doc)
**Created:** 2026-08-27
**Last updated:** 2026-08-27

### Amendment log

**2026-08-27 — adjudication of architect flags** (`task.md` §4). The architect raised 14
flags during design; the ones routed to the PO are now decided in PRD §9 D10–D14 and PRD
§11, and the affected criteria below are rewritten so no two criteria can contradict each
other. Changed criteria:

| Flag | Decision (PRD) | Criteria rewritten |
|---|---|---|
| F2 — `Full-time` vs `Full-Time` | D10 — `Full-Time` (capital `T`) everywhere | T1 AC7, T2 AC3 |
| F3 — skill labels lose `text-transform: uppercase` | D11 — accepted; labels render in authored mixed case | T5 AC2, AC3, AC4 |
| F4 — two hero chrome strings shortened | D12 — approved, now canonical copy | T1 AC6, **new AC16, AC17** |
| F5 — typewriter loops under reduced motion | D13 — static replacement string under reduced motion only | **new T1 AC15**, T8 AC6, T10 AC9 |
| F9 — orphaned 9th achievement card at tablet widths | D14 — 9th card spans the row | T3 AC10 |
| F12 — favicon / avatar path defects | Recorded as PRD §11 DF1–DF2 | **none — deferred, not iteration 01** |
| F14 — D2 / D3 were judgement calls | Both confirmed with reasoning in PRD §9 | none |

No ticket was added, removed or rescoped; iteration-01 scope is unchanged.

**2026-08-27 (second pass) — flag F15**, raised by the architect while amending `task.md`
against D10–D14.

| Flag | Decision (PRD) | Criteria rewritten |
|---|---|---|
| F15 — 🚀 emoji in the fixed scroll-progress rail overlays the hero at ≥ 901px, vs T1 AC4 "no emoji anywhere in the hero" | **D15** — criterion held at its page-wide reading; the rail and its marker are kept, but the emoji glyph is replaced with an on-palette inline-SVG / CSS-drawn mark. Option (a) "narrow the criterion to hero copy" was rejected; option (c) "delete the rocket" was rejected. | **T1 AC4 rewritten** into 4a–4d with explicit widths, a fail condition, a *don't-delete-the-rail* guard, and the list of non-ASCII glyphs that are not emoji |

Scope impact: one glyph in one pre-existing component (`FlightPath.jsx`) plus a small CSS
adjustment. No new ticket, no new dependency, no new colour or font. **The architect owes a
`task.md` step for this swap** — it is deliberately not a T1 hero task, and Masky must not
perform it unilaterally nor "resolve" it by removing the rail.

**2026-08-27 (third pass) — post-implementation disclosures**, raised by the developer in
`execution-log.md` §5 after verifying against the running app. All three are criterion-wording
rulings; **none requires a code change**, and no criterion was weakened to accommodate an
implementation.

| Disclosure | Ruling (PRD) | Criteria rewritten |
|---|---|---|
| X-1 — hero copy counts 39 words by the PRD's rule, 41 by naive whitespace splitting | **D16** — the voiced-as-a-word rule is binding; `@`/`&` count, `>`/`↓` do not. Cap stays 40, no copy cut, **AC6 is a PASS at 39**. Deliberately the stricter of the two passing readings (discarding all symbol tokens would have given 37). | **T1 AC6 rewritten** with the tokenising rule, every symbol token's disposition enumerated, and the expected per-line tally so QA reproduces 39 deterministically |
| X-2 — dates paint `08/2025 – PRESENT` because `.record__meta` is uppercased | **D17** — keep it; this is mono instrument chrome, not a name. D11's rendered-case rule governs **names** (where miscasing is a factual error), not common words in metadata lines. Ruling otherwise would also force the caps off all six pre-existing section eyebrows for one word's gain. | **T2 AC3's date clause rewritten**; the boundary is also stated once in "Two reading rules" above, which covers the eyebrow clauses of T2/T3/T4 AC1 and T4 AC3/AC4 |
| X-3 — framer-motion logs a reduced-motion notice in dev builds | **D18** — passes as written (neither an error nor a React warning), but AC1 is rewritten to an explicit closed allow-list, **plus** a new production-preview console check so "dev-build only" is observed rather than asserted. Criterion ends up stronger. | **T10 AC1 rewritten** |

**2026-08-27 (fourth pass) — traceability for the pre-existing lint repair.**

| Finding | Ruling (PRD) | Plan change |
|---|---|---|
| `task.md` F18 / execution-log D-1 — `npm run lint` was already red at `HEAD`; the developer repaired two `react/jsx-no-comment-textnodes` errors in `Heading.jsx` and `Footer.jsx` so the `--max-warnings 0` gate that nearly every done criterion cites was reachable at all. Architect ratified it and routed the traceability question to the PO. | **D19** — option (b): a real retrospective ticket, not a PRD footnote. A deferred-defects note was the wrong shelf for shipped code, and the constitution's traceability rule is better satisfied than argued around. The missing *requirement* was a PO gap, now closed as PRD **§7.5**. | **New ticket T11** (P0, marked RETROSPECTIVE), 6 acceptance criteria covering the green gate, proof the defect pre-existed, and render-regression checks on the eyebrow and footer `//` separators. **Ponta owes no task step — the code already exists.** |

Deliberately **not** touched: T7 AC2 and the "navigating to `/#…` scrolls" clauses of T2/T3/T4
AC1. That is a genuine functional failure routed to the architect, and it is not to be
resolved by rewording the criterion. Also recorded: PRD **§11.1 FP1**, the pre-existing lint
failure at `HEAD` that the developer repaired in passing.

## How QA verifies this iteration

Candy verifies **against the real running app** (`npm run dev`, default `http://localhost:5173/`)
in a browser — not by reading source. Every acceptance criterion below is written to be
checkable by looking at the rendered page, resizing the window / using device emulation,
tabbing with the keyboard, or reading the browser DevTools Console and Network tabs.

Recommended QA environment:
- Chromium-based browser with DevTools open (Console + Network, "Disable cache" on).
- Responsive-mode checkpoints: **375, 414, 768, 1024, 1280, 1440** px wide.
- A pass over the page with `prefers-reduced-motion: reduce` forced on (DevTools →
  Rendering → Emulate CSS media feature `prefers-reduced-motion`).

There is no API surface in this iteration, so no Postman collection is required; the
verification artifact is browser-observed behavior plus screenshots at each checkpoint. The
one exception is **T11**, whose first three criteria are verified from real `npm run lint` /
`npm run build` / `git show` output rather than from the browser; its render-regression
criteria (AC4–AC6) are browser checks like everything else.

### Two reading rules that apply to every criterion below

Read these before scoring anything — they resolve two ambiguities that would otherwise let
QA and the implementer reach different verdicts on the same page (PRD §7.4, D17; §5.6, D16).

1. **Letter-case: load-bearing for names, presentational for mono chrome.**
   - Where a criterion quotes a **name** — a technology/brand label, company, institution,
     program, award, award category or event — the painted glyphs must match the quoted string
     exactly, capitalisation included. `NODE.JS` instead of `Node.js` is a fail (T5 AC4).
   - Where a criterion quotes **mono instrument chrome** — a section eyebrow, a telemetry
     label, the `record` date-meta line, the `ONLINE` indicator — the quoted string is the
     **authored** text and CSS uppercases it on screen by design. So a criterion that says the
     eyebrow reads `// service record` is satisfied by the page painting `// SERVICE RECORD`,
     and `08/2025 – Present` is satisfied by `08/2025 – PRESENT`. These are **passes**. Verify
     such strings from DOM text, not from the glyphs.
2. **Word counting** (T1 AC6 only): a punctuation-only token is a word only if a reader voices
   it. `@` and `&` count; `>` and `↓` do not. The full rule and the expected per-line tally are
   written into AC6 itself.

## Ticket summary

| ID | Title | Priority |
|----|-------|----------|
| T1 | Condense the hero into a scannable mission dossier | P0 |
| T2 | Add the Work Experience section | P0 |
| T3 | Add the Academic Achievements section | P0 |
| T4 | Add the Education section as the last content section | P0 |
| T5 | Add 8 tech-stack tiles and professional display labels for all skills | P0 |
| T6 | Extend navigation to all seven sections | P1 |
| T7 | Enforce the final page section order | P1 |
| T8 | Professional-but-creative visual consistency pass | P1 |
| T9 | Responsive behavior 375px → 1440px with no horizontal overflow | P1 |
| T10 | Accessibility and asset-integrity pass | P1 |
| T11 | Restore the `npm run lint` gate (**RETROSPECTIVE** — code already shipped) | P0 |

---

## T1 — Condense the hero into a scannable mission dossier
**Priority:** P0 · **Requirements:** PRD §5.6, §3 G1/G2, §7.3, §7.4 (AC4 only, per D15)

### Description
The hero currently renders a ~90-word emoji bio under the label "crew file // personnel
log", split into numbered log entries `01…05`. The user's explicit complaint is that
nobody reads it. Replace it with a glance-readable dossier: one short mission statement
plus a four-tile telemetry strip of hard numbers, two calls to action, and the existing
socials. Keep the space theme (porthole avatar, HUD framing, typewriter classification) —
this is a condensation, not a de-theming. Also shorten the boot animation, which
currently withholds all hero content for 2.1 s.

Canonical copy is fixed in PRD §5.6 and must be used verbatim. PRD §5.6 was amended after
the architect's review: the boot sequence becomes a single non-blocking line, two pieces of
hero chrome copy are shortened, and the classification line has a defined reduced-motion
form (PRD D12, D13). AC15–AC17 below cover those.

### Acceptance Criteria
1. Loading `/` and looking at the hero, the strings **"crew file"** and **"personnel log"** appear nowhere on the page (verify with browser Find, Ctrl+F).
2. The numbered log-entry markers (`01`, `02`, `03`, … prefixing bio lines) are gone from the hero.
3. The old bio text is gone: searching the page for `"Hi, I’m Rey"`, `"geeking out"`, and `"Let’s connect and create something awesome"` returns zero matches.
4. **No emoji is rendered anywhere on the page — in copy or as decorative chrome** (PRD §7.4, D15). "Emoji" here means a pictographic character drawn by the operating system's emoji font — 🚀 👋 💻 ⚙️ ✨ 🎉 and the like, including any character followed by U+FE0F. Check all four parts:
   - **4a — Hero copy.** No emoji appears in the designation kicker, the name, the classification line, the mission statement, any telemetry label or value, either CTA label, the channels label, or the scroll cue.
   - **4b — The scroll-progress rail.** This is the fixed decorative rail on the **right edge** of the viewport; it is displayed only at widths **≥ 901px**, so check it at **1024, 1280 and 1440px** (at 375/414/768px it is correctly hidden and there is nothing to check). Scroll from the top of the page to the bottom and look at the marker travelling along the dotted track: it must be a flat vector mark drawn in the site's existing palette (the teal/violet token family), looking the same on any machine. **A multicoloured orange-and-white rocket emoji is a fail.**
   - **4c — The rail must still work.** The dotted track, the glowing progress trail that grows as you scroll, and the marker moving along it are all still present, and the marker still tracks scroll position from top to bottom. Removing the rail, or leaving the track with no marker on it, is **also a fail** — the fix for 4b is to change what the marker *is*, never to delete it.
   - **4d — These are NOT emoji and must not be reported as violations:** `↓` (U+2193, hero scroll cue), `·` (U+00B7, the reduced-motion classification separator in AC15), `–` (U+2013 EN DASH, every date range). They are ordinary text glyphs in the page's own fonts.
   - Evidence: a 1440px screenshot of the hero with the right-edge rail in frame, zoomed enough to identify the marker, plus a scroll-through recording showing the marker travelling the full length of the track.
   - Traceability note: 4b/4c cover `FlightPath`, which sits **outside** the `#about` hero subtree and is pre-existing chrome, so it is not "hero work" — it is a separate task step that the architect owes (PRD D15). It is verified here because AC4 is the page's single emoji criterion.
5. The hero displays the exact sentence: `Junior Software Developer building mobile and web systems for real-world clients.`
6. **Hero word budget: ≤ 40 words and ≤ 2 sentences** (PRD §5.6 "Binding counting rule", D16). Expected result is **39 words / 1 sentence**. Count it like this and no other way:
   - **What is counted:** the boot-ticker line, the mission sentence, all 4 telemetry labels, all 4 telemetry values, both CTA labels, the channels label, the scroll cue.
   - **What is excluded:** the nav bar, the name heading `<JohnRey Seguma/>`, the designation kicker, the classification line (the typewriter, or under reduced motion its static replacement from AC15), and social-icon labels.
   - **Tokenising:** split each counted string on whitespace. A token containing a letter or digit is one word (`uplink`, `Full-Time`, `26`, `PH` — hyphenated and dotted forms are **one** word, not two). A punctuation-or-symbol-only token counts **only if a reader voices it as a word**. In the approved copy that means exactly this, and there are no other cases: **`@` counts** (voiced "at"), **`&` counts** (voiced "and"), **`>` does not** (prompt sigil), **`↓` does not** (direction arrow — AC4d already classes it as a glyph, not content).
   - **Expected tally, which QA should reproduce line by line:** boot `> uplink established` = 2 · mission = 11 · labels `STATUS`/`MISSIONS`/`COMMENDATIONS`/`SYSTEMS` = 4 · values `Full-Time @ Smartech Solutions PH` (5) + `6 projects shipped` (3) + `9 academic awards` (3) + `26 tools & technologies` (4) = 15 · CTAs `View Projects`/`Contact Me` = 4 · channels label `comm channels` = 2 · cue `descend ↓` = 1 → **39**.
   - **Sentences:** a sentence ends in `.`, `!` or `?`. Only the mission sentence does, so the count is **1**.
   - A naive `split(/\s+/)` gives 41 by counting `>` and `↓`. That is **not** this criterion; 41 is not a fail.
7. A telemetry strip renders exactly 4 tiles with these labels and values:
   - `STATUS` → `Full-Time @ Smartech Solutions PH` (capital `T` in `Full-Time` — the same spelling as the Experience badge in T2 AC3; PRD D10)
   - `MISSIONS` → `6 projects shipped`
   - `COMMENDATIONS` → `9 academic awards`
   - `SYSTEMS` → `26 tools & technologies`
8. The three numbers in AC7 match reality on the same page: the Projects section renders exactly **6** project cards, the Achievements section renders exactly **9** entries, and the Skills section renders exactly **26** tiles.
9. Two CTA controls are visible in the hero. Clicking the first scrolls the page to the Projects section (the Projects heading becomes visible); clicking the second scrolls to the Contact section (the contact form becomes visible). Both are activatable with `Enter` when focused via `Tab`.
10. With animations enabled, the porthole avatar image, the `<JohnRey Seguma/>` name, and the typewriter classification line (cycling all three phrases) are all still present and rendering (avatar shows the photo, not a broken-image icon). Under `prefers-reduced-motion: reduce` the classification line is replaced per AC15 — that is the only permitted difference.
11. The row of social channel links is still present, and each still opens its external URL in a new tab.
12. **Boot timing:** from page load (hard refresh, cache disabled) the mission statement and telemetry tiles are legible on screen within **1.5 seconds**. Measure with DevTools Performance recording or a screen recording — not by inspecting a constant.
13. With `prefers-reduced-motion: reduce` emulated and a hard refresh, hero content is visible **immediately** (no boot-sequence gate, no fade-in delay).
14. At 375px width the hero fits within the viewport: no horizontal scrollbar, the telemetry tiles stack/wrap rather than clipping, and no tile's text is cut off.
15. **Reduced-motion classification line** (PRD §5.6 item 4, D13). With `prefers-reduced-motion: reduce` emulated and a hard refresh:
    - The classification line reads, after the `CLASSIFICATION:` label, exactly:
      `Junior Software Developer · Robotics Enthusiast · Tech Innovator`
      (separator is a middle dot `·`, U+00B7, with one space either side).
    - The whole string is present at first paint. Watching it for **10 seconds**, not a single character is typed, deleted or re-typed, and no cursor/caret blinks — the line is completely static. Evidence: a screen recording or two screenshots ≥ 5 s apart showing identical text.
    - The strings `Robotics Enthusiast` and `Tech Innovator` are both findable on the page at the same time (browser Find), proving the loop is not merely paused mid-cycle.
    - At 375px the line wraps onto multiple lines rather than clipping or causing a horizontal scrollbar.
    - With the emulation turned **off** and a hard refresh, the typewriter behaves as before: it types one phrase at a time and cycles through all three. The static string must **not** appear in this mode.
16. **Shortened hero chrome copy** (PRD D12). Browser Find on the whole page: `comm channels` returns a match and `open comm channels` returns **zero**; `descend ↓` returns a match and `scroll to descend` returns **zero**.
17. **Boot ticker** (PRD §5.6 item 1, D12). With animations enabled and a hard refresh: the boot sequence renders as a **single** line reading `> uplink established`, positioned in its own band that never covers the mission statement, the telemetry tiles or the CTAs at any point (evidence: screen recording of the first 2 s), and it removes itself. The old 4-line sequence is gone — Find for `establishing uplink`, `signal locked`, `decrypting crew manifest` and `welcome aboard` each returns zero matches. With `prefers-reduced-motion: reduce` emulated, the boot line is **never visible at all**.

---

## T2 — Add the Work Experience section
**Priority:** P0 · **Requirements:** PRD §5.1, §6.1, §6.3

### Description
Add a new `#experience` section presenting the two roles as a vertical timeline, most
recent first, styled with the existing `.station` / `Heading` shell so it reads as part
of the same system as Projects and Skills.

### Acceptance Criteria
1. Navigating to `http://localhost:5173/#experience` scrolls to a visible section whose heading reads **"WorkExperience"** with the eyebrow **"// service record"**.
2. The section renders exactly **2** entries.
3. The first (topmost) entry shows, all visible without hovering or clicking:
   - Company: `Smartech Solutions Philippines Inc.`
   - Title: `Junior Software Developer`
   - Employment type: `Full-Time` — capital `F`, hyphen, **capital `T`**; identical to the spelling in the hero telemetry `STATUS` tile (T1 AC7). The page must show only one spelling of this term site-wide: read the rendered Experience badge and the rendered hero `STATUS` tile side by side (screenshot both) and confirm the two strings are character-identical, with no lowercase-`t` `Full-time` anywhere (PRD D10). Note browser Ctrl+F is case-insensitive, so this one is verified by reading the pixels, not by Find.
   - Dates: the authored text is `08/2025 – Present` with an EN DASH `–` (the word "now" must not appear anywhere in the section). **The date meta line is intentionally uppercased by CSS, so what you see painted on screen is `08/2025 – PRESENT` — that is correct and is a PASS** (PRD §7.4, D17). This line is mono instrument chrome, like the section eyebrows and the telemetry labels; it is the one place on the page where rendered case is *not* load-bearing. Verify the authored casing in the DOM text if you want to confirm it (DevTools element inspection), not by reading the glyphs. Contrast with T5 AC4, where painted case **is** load-bearing because those strings are brand names.
   - Bullet: `Develop and maintain mobile and web applications for various clients across different industries.`
4. The second entry shows:
   - Company: `LEADSolutions, Inc.`
   - Title: `Full Stack Developer`
   - Employment type: `Internship`
   - Dates: `01/2025 – 05/2025`
   - Bullet: `Developed an Accounting Online Approval System.`
5. The employment type is rendered as its own visually distinct element (badge/chip/pill with its own background or border), not run together into the job-title string.
6. The current role (entry 1) carries a visible "ongoing" indicator that entry 2 does not have (e.g. a pulse dot, accent-colored rail, or "Present" highlighted in an accent color). The difference is visible in a screenshot comparison of the two entries.
7. Company names render as `h3`-level headings (verify via DevTools element inspection of the rendered DOM, or an accessibility-tree/heading-outline extension).
8. At 375px the section shows no horizontal scrollbar; `Smartech Solutions Philippines Inc.` wraps onto multiple lines rather than overflowing or being clipped.
9. At 1440px the section is horizontally aligned with the Projects and Skills sections above it (same left content edge, within ~4px).

---

## T3 — Add the Academic Achievements section
**Priority:** P0 · **Requirements:** PRD §5.2, §6.1, §6.3

### Description
Add a new `#achievements` section listing all 9 awards in the fixed major→minor order
from PRD §5.2. Each item leads with the award itself, since that is the credibility
signal a recruiter scans for. This content is award-dense — the layout must stay
scannable, not become a wall of text.

### Acceptance Criteria
1. Navigating to `http://localhost:5173/#achievements` scrolls to a visible section whose heading reads **"AcademicAchievements"** with the eyebrow **"// commendations"**.
2. The section renders exactly **9** entries.
3. Reading top-to-bottom (and left-to-right within a row, if gridded), the entries appear in exactly this order, with exactly this text:
   1. `Best Student Research` — `18th Araw ng Parangal`
   2. `Champion` — `Research Capstone Presentation` — `18th PSITS Regional Convention 2025`
   3. `Best Paper` — `Information and Computer Technologies Category` — `CEAC Research Forum 2025`
   4. `3rd Place` — `Programming Competition` — `15th PSITS Regional Competition`
   5. `2nd Place` — `Demo Pitching` — `NDMU Startup Hackathon 2024`
   6. `6th Place` — `HACKFORGOV` — `Capture-the-flag Competition 2023`
   7. `Champion` — `Mission Harvest Robotics Competition` — `National Robotics Competition 2020`
   8. `Champion` — `Mission Harvest Robotics Competition` — `Kabataan Inyovator 2019`
   9. `Champion` — `Line Tracing Competition` — `Robo Fest 2019`
4. Spelling checks (browser Find, exact match): the page contains `Kabataan Inyovator` and does **not** contain `Kabataan Innovator`; contains `Araw ng Parangal`; contains `HACKFORGOV`; contains `Robo Fest`; contains `Capture-the-flag`.
5. OCR artifacts are absent: searching the page for the standalone strings `rd th`, `3 - Programming`, and `15 PSITS` returns zero matches.
6. Entries 1 and 4 display **no year** (no `19xx`/`20xx` appears within those two entries).
7. The award phrase (`Champion`, `Best Paper`, `3rd Place`, …) is the visually dominant element of each entry — larger font-size and/or accent color compared to the event text in the same entry. Verifiable by screenshot.
8. All 9 entries are readable without any interaction (no accordion, no "show more", no hover-to-reveal).
9. At 375px: no horizontal scrollbar, and `Information and Computer Technologies Category` wraps rather than being clipped or ellipsised.
10. **No orphaned card at any checkpoint** (PRD §6.3, D14). The grid must never leave the 9th card sitting alone at partial width:
    - At **1280px and 1440px**: 3 columns × 3 rows, every row full, no ragged row.
    - At **768px and 1024px**: whatever the column count, the final row is visually full-width — if the grid is 2 columns there, the 9th card **spans both columns** so its right edge lines up with the right edge of the card above it (verify with DevTools: the 9th card's rendered width equals the grid's content width, within ~2px).
    - At **375px and 414px**: single column, so the question does not arise.
    - Evidence: full-width screenshots at 768, 1024 and 1440px. A half-width card alone in the last row is a **fail**.

---

## T4 — Add the Education section as the last content section
**Priority:** P0 · **Requirements:** PRD §5.3, §6.1, §6.3, §3 G5

### Description
Add a new `#education` section with the two institutions, most recent first. Per the
user's explicit direction, it must be the last content section — after Projects, Skills,
Experience and Achievements — with only Contact and the footer below it.

### Acceptance Criteria
1. Navigating to `http://localhost:5173/#education` scrolls to a visible section whose heading reads **"MyEducation"** with the eyebrow **"// training log"**.
2. The section renders exactly **2** entries.
3. The first entry shows: `Notre Dame of Marbel University` / `Bachelor of Science in Information Technology` / `2021 – 2025`.
4. The second entry shows: `Laguilayan National High School` / `Information and Communications Technology` / `2014 – 2021`.
5. Scrolling the page from top to bottom, the Education section appears **after** the Achievements section and **before** the Contact section. No content section other than Contact and the footer appears below it.
6. No GPA, honors, or coursework text appears in the section.
7. Institution names render as `h3`-level headings.
8. At 375px and 1440px: no horizontal scrollbar; both entries fully readable; long institution names wrap rather than clip.

---

## T5 — Add 8 tech-stack tiles and professional display labels for all skills
**Priority:** P0 · **Requirements:** PRD §5.4, §5.5, §3 G6

### Description
Add the 8 new technologies the user supplied assets for, and give every skill tile —
existing and new — an explicit, correctly-cased display label instead of the current
filename-derived string ("js", "postgre", "nodejs", "c++"). Note `nextjs.svg` was deleted
and replaced by `nextjs.png`; nothing may still request the old path.

### Acceptance Criteria
1. The Skills section renders exactly **26** tiles.
2. All 8 new tiles are present, each showing a rendered logo image (not a broken-image icon, not a blank box). Reading the label text **as it is painted on screen**, character for character including capitalisation, the 8 labels are exactly: `Next.js`, `Angular`, `Capacitor`, `Docker`, `AWS`, `Firebase`, `GitLab`, `XAMPP`.
3. All 18 pre-existing tiles are still present, each showing a rendered logo image, and their painted labels read exactly: `React`, `Laravel`, `Django`, `Node.js`, `Flutter`, `JavaScript`, `HTML5`, `CSS3`, `Bootstrap`, `Git`, `GitHub`, `MongoDB`, `MySQL`, `PostgreSQL`, `Tailwind CSS`, `Java`, `C++`, `PHP`.
4. **Rendered case is part of AC2/AC3 and is a deliberate, approved change to the existing tiles** (PRD §5.5, D11). The tiles no longer render in all-caps. Concretely, on a 1440px screenshot of the Skills section:
   - `Next.js`, `Node.js`, `PostgreSQL`, `Tailwind CSS`, `JavaScript`, `MySQL`, `MongoDB`, `GitHub`, `GitLab`, `React`, `Angular`, `Capacitor`, `Docker`, `Firebase`, `Laravel`, `Django`, `Flutter`, `Bootstrap`, `Git`, `Java` all appear in mixed case. Seeing `NEXT.JS`, `POSTGRESQL`, `NODE.JS` or `TAILWIND CSS` on screen is a **fail**.
   - The only tiles that legitimately appear fully capitalised are the ones whose brand form is capitalised: `AWS`, `XAMPP`, `PHP`, `HTML5`, `CSS3`, `C++`.
   - QA note: this criterion is judged on rendered glyphs (screenshot), not on DOM text or accessible names, and not with browser Ctrl+F (which is case-insensitive). It is the one criterion in T5 that intentionally changes how pre-existing UI looks — record it as an expected visual diff, not a regression.
5. In the DevTools **Network** tab after a hard refresh, every request under `/skills/` returns **200**. Specifically there is **no request for `nextjs.svg`** and **no 404** for any skill asset.
6. Every skill tile image has an `alt` attribute equal to its display label (spot-check all 8 new tiles plus `C++`, `PostgreSQL`, `Node.js` via DevTools element inspection or an accessibility-tree view).
7. All 26 tiles are visually consistent: same tile footprint, and no logo overflows its tile or renders at a wildly different optical size than its neighbours (verify by screenshot at 1440px and at 375px).
8. At 375px the tile grid wraps with no horizontal scrollbar and no clipped tile.

---

## T6 — Extend navigation to all seven sections
**Priority:** P1 · **Requirements:** PRD §6.2, §3 G7

### Description
The nav currently has 4 entries. Add entries for Experience, Achievements and Education,
keeping the single-word themed labels, and make sure scroll-spy and the mobile menu still
work with 7 items.

### Acceptance Criteria
1. At 1440px the nav shows exactly **7** entries, left-to-right in this order with this text: `About`, `Missions`, `Systems`, `Service`, `Medals`, `Academy`, `Transmit`.
2. Clicking each entry scrolls to the matching section: About→hero, Missions→Projects, Systems→Skills, Service→Work Experience, Medals→Academic Achievements, Academy→Education, Transmit→Contact. Verified one by one, each time confirming the target section's heading is in view.
3. Scroll-spy: manually scrolling through the whole page, the nav entry matching the section currently occupying the middle of the viewport is visually highlighted (distinct color/blip state), and only one entry is highlighted at a time. Confirmed for all 7 sections.
4. `Tab` reaches all 7 nav links in visual order, each shows a visible focus ring, and pressing `Enter` on a focused link navigates to its section.
5. At 375px the hamburger button opens a menu listing all 7 entries; each is tappable; selecting one closes the menu and scrolls to that section.
6. At 768px, 900px and 1024px the nav does not overflow the viewport, does not produce a horizontal scrollbar, and nav items do not visually collide with the logo or the `ONLINE` status indicator.
7. No console errors or React warnings appear while navigating through all 7 entries.

---

## T7 — Enforce the final page section order
**Priority:** P1 · **Requirements:** PRD §6.1

### Description
Wire the three new sections into the page in the order fixed by the PRD, so that the
document flow (and therefore scroll order and tab order) matches the intended narrative:
who → what he shipped → what he builds with → where he works → what he won → where he
studied → how to reach him.

### Acceptance Criteria
1. Scrolling from top to bottom, sections appear in exactly this order: **Hero → Projects → Skills & Tools → Work Experience → Academic Achievements → Education → Contact → Footer.**
2. Section anchors resolve correctly: `#about`, `#projects`, `#skills`, `#experience`, `#achievements`, `#education`, `#contact` each scroll to the corresponding section when pasted into the address bar on a fresh load.
3. Pressing `Tab` repeatedly from the top of the page reaches interactive elements in that same top-to-bottom order (no focus jumping backwards to an earlier section).
4. Education is the final section before Contact — nothing other than Contact and the footer renders below it.
5. Vertical spacing between consecutive sections is visually uniform: the gap between Skills→Experience, Experience→Achievements, and Achievements→Education matches the existing Projects→Skills gap (within ~8px, measurable with DevTools).

---

## T8 — Professional-but-creative visual consistency pass
**Priority:** P1 · **Requirements:** PRD §7.4, §3 G2

### Description
With three new sections added, the page must still read as one designed system rather
than four bolted-on blocks. Align the new sections to the existing token set and motion
language, and make sure the "creative" side of the brief is present without costing
readability.

### Acceptance Criteria
1. Sampling colors with the DevTools color picker, the new Experience / Achievements / Education sections use only colors already present in the existing Projects / Skills / Contact sections (the `:root` palette). No new hue is introduced.
2. Only the three existing font families appear on the page (checked via DevTools Computed → `font-family` across headings, body text and mono labels). No fourth font is loaded (verify in the Network tab that no additional font request appears beyond the existing Google Fonts request).
3. All four `.station` section headings (Projects, Skills, Experience, Achievements, Education) use the same eyebrow + bracketed-title treatment — same font sizes, same accent coloring pattern — verifiable by screenshot side-by-side.
4. Each new section has a scroll-triggered entrance animation, and in each case the content is fully readable within **600 ms** of the section entering the viewport (measured on a screen recording at normal scroll speed).
5. No section contains more than one attention-grabbing continuous animation (infinite loops, pulses, marquees). The existing nav `ONLINE` pulse and hero scroll cue do not count against section budgets.
6. With `prefers-reduced-motion: reduce` emulated and a hard refresh, scrolling the entire page produces **no entrance animations and no looping motion anywhere**; all content is immediately visible. This is now fully testable and there are no permitted exceptions (PRD §7.2, D13). Specifically:
   - The hero classification line is the **static** string `Junior Software Developer · Robotics Enthusiast · Tech Innovator` — nothing is being typed (see T1 AC15). A still-running typewriter is a **fail**, not a known issue.
   - The hero boot line is never shown at all.
   - The porthole ring is not spinning, the `ONLINE` nav indicator is not pulsing, the project-card scanline is not sweeping, and the hero scroll cue is not bouncing.
   - The background starfield is frozen (it already reads the preference at mount, which is why the "emulate, **then hard refresh**" order matters — toggling emulation without reloading leaves it running and is not a valid test).
   - Evidence: a screen recording of at least 10 seconds resting on the hero, in which nothing changes except the mouse cursor; plus a scroll-through recording in which no element fades, slides or scales in. The only thing permitted to move during the scroll-through is the decorative scroll-progress rail, which is driven directly by the scroll position rather than by a timer.
7. Hover states exist and are consistent: hovering an Experience entry, an Achievement entry and an Education entry each produces a visible state change of the same character as the existing project-card and skill-tile hovers (e.g. lift/glow), not three different behaviors.
8. Full-page screenshots at 375px and 1440px show no visual defects: no overlapping text, no element escaping its panel, no double borders, no orphaned single-item row that looks accidental.

---

## T9 — Responsive behavior 375px → 1440px with no horizontal overflow
**Priority:** P1 · **Requirements:** PRD §7.1

### Description
Verify and fix layout across the supported viewport range. This ticket is a hard gate:
the site is judged on a phone as often as on a laptop.

### Acceptance Criteria
1. At each of **375, 414, 768, 1024, 1280, 1440** px width, scrolling the full page top to bottom produces **no horizontal scrollbar** and no content requiring horizontal panning.
2. At each checkpoint, `document.documentElement.scrollWidth` is **≤** `window.innerWidth` (run in the DevTools Console; record the two numbers per checkpoint as evidence).
3. At 375px, none of these strings is clipped, truncated with an ellipsis, or overlapping another element: `Smartech Solutions Philippines Inc.`, `Information and Computer Technologies Category`, `Notre Dame of Marbel University`, `Laguilayan National High School`, `AcademicAchievements` (section heading).
4. At 375px every section heading fits within the viewport width without wrapping mid-word into an unreadable break.
5. At 768px and 1024px the Achievements grid and the Skills grid both reflow sensibly (multi-column, no single-column-with-huge-gaps and no items overflowing their container).
6. No element has a fixed pixel width that forces overflow at 375px (observable as a horizontally scrolling page; if AC1 passes at all checkpoints this is satisfied).
7. Screenshots captured at all six checkpoints and attached as verification evidence.

---

## T10 — Accessibility and asset-integrity pass
**Priority:** P1 · **Requirements:** PRD §7.2, §7.3

### Description
Baseline accessibility and "nothing is broken" checks across the whole page, including
the three new sections.

### Acceptance Criteria
1. **Console clean** (PRD §7.3, D18). Hard refresh, then scroll the full page and open/close the mobile menu. Repeat the whole pass twice — once with motion enabled, once with `prefers-reduced-motion: reduce` emulated. In both passes:
   - **Zero** entries at `error` level.
   - **Zero** warnings originating from this application's own code — React warnings, PropTypes warnings, missing-`key` warnings, unhandled promise rejections.
   - The following dev-environment notices are **permitted** and must not be reported as failures. This list is closed; anything appearing that is not on it is a failure:
     - `[vite] connecting...` and `[vite] connected.` (dev-server HMR)
     - the React DevTools `info` line
     - framer-motion's `warning  You have Reduced Motion enabled on your device. Animations may not appear as expected.` — reduced-motion pass only. This notice is emitted *because* `MotionConfig reducedMotion="user"` is correctly in place (the mechanism that makes T8 AC6 and AC9 pass), and it comes from framer-motion, not React.
   - **Production check, so the "dev-build only" claim is observed rather than assumed:** run `npm run build` then `npm run preview`, load the preview URL with reduced motion emulated, and confirm the framer-motion notice is **absent** and the console is completely clean. Record the console contents for the preview build as evidence.
2. **Network clean:** hard refresh with cache disabled — every request under `/skills/`, `/projects/`, `/socials/` and the profile image returns 200. Zero 404s.
3. **No broken images:** visually scanning the full page at 1440px, every `<img>` renders actual artwork — no broken-image placeholders, no empty boxes.
4. **Heading structure:** exactly one `h1` on the page (the hero name). Each of Projects, Skills, Experience, Achievements, Education, Contact has an `h2`. Entry titles within Experience and Education are `h3`. Verified with a heading-outline tool or DevTools inspection.
5. **Keyboard reachability:** starting from the address bar, `Tab` alone reaches — in visual order — all 7 nav links, the hamburger (at 375px), both hero CTAs, every social link, every project `source`/`live` link, and every contact-form field and submit control. Nothing interactive is skipped and no keyboard trap occurs.
6. **Focus visibility:** every element in AC5 shows a clearly visible focus ring while focused (screenshot at least the nav links, a hero CTA, a project link, and a form field as evidence).
7. **Alt text:** every skill tile image has non-empty `alt` matching its display label; every project card image has non-empty `alt` matching the project name; the hero avatar has non-empty `alt`; social icons have an accessible name.
8. **Contrast:** using the DevTools contrast checker, body/paragraph text in each of the three new sections scores **≥ 4.5:1** against its background, and mono label/eyebrow text scores **≥ 3:1**.
9. **Reduced motion:** with `prefers-reduced-motion: reduce` emulated and a hard refresh, the page is fully readable end-to-end with no animation gating any content, and no element is still animating on a timer once the page has settled. The hero classification line shows the static string `Junior Software Developer · Robotics Enthusiast · Tech Innovator` and is not typing (PRD §7.2, D13 — see T1 AC15 and T8 AC6 for the full check). A typewriter still running under this setting is a **fail**.
10. **External links:** every link that opens a new tab uses `target="_blank"` together with `rel` containing `noopener` (spot-check all social links and at least two project source links via DevTools).

---

## T11 — Restore the `npm run lint` gate (RETROSPECTIVE)
**Priority:** P0 (blocking — every other ticket's sign-off depends on it) · **Requirements:** PRD §7.5, §9 D19

> ### ⚠ This ticket was written *after* the code it describes. Read this first.
> `npm run lint` was **already failing at `HEAD` (`1bc1725`)**, before iteration 01 began, with
> two pre-existing `react/jsx-no-comment-textnodes` errors. The developer hit this while
> executing T1–T10, repaired it in order to make the specified gate reachable, and disclosed it
> (`execution-log.md` D-1). The architect ratified it (`task.md` F18) and routed the
> traceability question to the PO, who ruled it deserves a real ticket rather than a footnote
> (PRD **D19**).
>
> So: **the code already exists and is already verified.** This ticket exists to give those
> changed lines a requirement to trace to, and to attach a regression criterion to a change
> that touched two components rendering on every page view. **Ponta owes no `task.md` step**,
> and Masky has no new implementation work here — only the evidence in AC1–AC5, most of which
> he has already recorded. Nothing about this ticket back-dates authorisation; it records what
> happened, in the order it happened.

### Description
Two JSX text nodes contained a literal `//`, which ESLint reports as an error under the
project's `--max-warnings 0` configuration. They were rewritten as braced string expressions
with byte-identical rendered output:

- `src/components/Heading.jsx` — the section eyebrow: `// {eyebrow}` → `{"// "}{eyebrow}`
- `src/components/Footer.jsx` — the footer line: `— end of transmission // {year} // built by` → `— end of transmission {"//"} {year} {"//"} built by`

The visible `//` separators are the point of both strings — they are the page's themed
"comment" motif. A fix that removed or altered them would be a regression, not a repair.

### Acceptance Criteria
1. **The gate is green.** `npm run lint` exits **0** on the full tree, with real pasted output. No file is exempted, the lint scope is not narrowed, and **no `eslint-disable` directive** was added anywhere (verify: grep the tree for `eslint-disable` and confirm zero occurrences introduced by this iteration).
2. **`npm run build` exits 0**, with real pasted output.
3. **The defect was pre-existing, not introduced by this iteration.** Run ESLint against pristine copies of both files extracted from the previous commit (`git show HEAD:src/components/Heading.jsx`, `git show HEAD:src/components/Footer.jsx`) and confirm it reproduces exactly **2** `react/jsx-no-comment-textnodes` errors. This is what distinguishes a repair from cleaning up after oneself, and the auditor needs it on the record.
4. **Render regression — the eyebrow.** On the running app, every section eyebrow still displays its `//` prefix: the six eyebrows read `// mission log`, `// cargo hold`, `// service record`, `// commendations`, `// training log`, `// ground control` as authored text — painted in caps per the reading rule above (`// MISSION LOG`, …). A missing, doubled (`// // mission log`) or mis-spaced prefix is a fail.
5. **Render regression — the footer.** The footer still reads `— end of transmission // <current year> // built by Rey —`, with both `//` separators present and single-spaced, and `Rey` still a working link to the GitHub profile opening in a new tab with `rel` containing `noopener`. The year is generated at runtime (`new Date().getFullYear()`), so QA should expect the actual current year rather than a fixed string.
6. **No behavioural change.** `Heading`'s props and PropTypes are unchanged (`firstWord`, `secondWord`, optional `eyebrow`), and `Footer` still takes no props. The console shows no new warnings from either component.

---

## Out of scope for this iteration

Restated from PRD §4 so nobody quietly absorbs it: no backend or form submission
handling, no CMS, no framework/TypeScript migration, no routing, no new dependencies, no
downloadable résumé, no analytics, no new project entries, no rewrite of existing project
descriptions, no light/dark toggle, no i18n.
