# Iteration 02 — Professional Redesign · Ticket Plan

Requirements: `docs/execution/PRD.md` → "Iteration 02". Award mapping: PRD §I2.4 (binding).
All ACs are observable in a running browser. Gates: `npm run lint` and `npm run build` exit 0.

| id | title | priority |
|----|-------|----------|
| T1 | De-space the shell + new design system | P0 |
| T2 | Hero: professional intro | P0 |
| T3 | Projects: tiered major/secondary layout | P0 |
| T4 | Skills: categorized groups | P0 |
| T5 | Tech Events & Awards section + photo lightbox | P0 |
| T6 | Kabataan Inyovator Facebook video + fallback link | P1 |
| T7 | Experience section redesign | P1 |
| T8 | Education + Contact redesign | P1 |
| T9 | Navbar + Footer relabel/restyle | P0 |
| T10 | Responsive, a11y, reduced-motion, console, gates | P0 |

---

**T1 — De-space the shell + new design system**
Scope: remove space chrome; replace `:root` tokens/type scale; retitle all sections per PRD §I2.2.
- AC1: No `<canvas>` starfield and no flight-path/scroll-rail element exists in the DOM at any width.
- AC2: Page text contains none of: "mission", "cargo hold", "commendation", "telemetry", "uplink",
  "transmit", "ground control", "training log", "service record", "descend" (case-insensitive).
- AC3: Section eyebrows/headings read exactly as PRD §I2.2; no heading is wrapped in `<`…`/>`.
- AC4: No emoji glyph anywhere on the page; background is a solid/neutral surface, not a starfield.

**T2 — Hero: professional intro**
Scope: replace hero dossier with name + role + short intro + CTAs + socials + portrait.
- AC1: Hero shows the single `h1` "John Rey Seguma" (no angle brackets/slashes).
- AC2: Hero body copy is ≤ 2 sentences and contains no numeric counts of projects, awards or tools.
- AC3: No stat/telemetry tile row and no looping typewriter in the hero.
- AC4: "View Work" and "Contact" are real anchors; activating each by mouse and by `Enter`
  scrolls to `#projects` / `#contact`.

**T3 — Projects: tiered major/secondary layout**
Scope: `tier` field on projects; 3 majors get a large feature treatment, other 3 a compact one.
- AC1: ResilientLink, Smart Online Parking System and Hotel Management System each render in a
  card measurably wider/taller than the other three at ≥ 1024px.
- AC2: The 6 cards are not a uniform equal-size 6-box grid at ≥ 1024px.
- AC3: Each major card exposes an interaction (hover/click reveal or expand) that shows the
  project screenshot and full description; the info is reachable via keyboard too.
- AC4: All 6 project images load (no broken image, no 404 in Network) and every GitHub link opens
  the repo in a new tab.

**T4 — Skills: categorized groups**
Scope: add `category` to each skill; render grouped.
- AC1: Skills render under ≥ 4 visible named category headings (e.g. Frontend, Mobile, Backend &
  Languages, Data, Cloud & DevOps, Tooling).
- AC2: Counting all tiles across all groups yields 26; every label matches PRD §5.4/§5.5 casing.
- AC3: Every skill icon loads and its `alt` equals its label.
- AC4: The section has one interaction (category filter/tab or group expand) that changes which
  tiles are visible and is operable by keyboard.

**T5 — Tech Events & Awards section + photo lightbox**
Scope: rename section, attach mapped photos, add lightbox.
- AC1: Section nav label is "Recognition" and heading "Tech Events & Awards"; the word "Academic"
  appears nowhere in the section.
- AC2: All 9 records render, each showing a thumbnail from `public/awards/` matching PRD §I2.4.
- AC3: Clicking a record opens an overlay showing the full-size mapped image(s); records with two
  or three images allow stepping through all of them.
- AC4: The overlay closes via a visible close control and via `Esc`; focus returns to the opener;
  background page does not scroll while open.

**T6 — Kabataan Inyovator Facebook video + fallback link**
Scope: embed the FB video on the `kabataan-inyovator-2019` record only.
- AC1: Opening the Kabataan Inyovator record shows a video area plus a visible link labelled with
  the video (e.g. "Watch on Facebook") pointing to `https://www.facebook.com/share/v/19N5bPPYJk/`.
- AC2: That link opens in a new tab (`target="_blank" rel="noopener noreferrer"`).
- AC3: If the iframe fails to render the video (see PRD §I2.5 A1), the area shows the poster image
  `kabataan_inyovator.jpg` + the link — never a blank box or an error frame.
- AC4: No other achievement record renders a video embed.

**T7 — Experience section redesign**
Scope: professional timeline, same facts as PRD §5.1.
- AC1: Both roles render with company, title, employment-type badge (`Full-Time` / `Internship`)
  and date range; the current role is marked as ongoing.
- AC2: Highlights are hidden behind an expand/collapse or hover-reveal that toggles on click and
  on `Enter`/`Space`.
- AC3: No mono "record"/HUD styling remains; date meta is not rendered as `PRESENT` in caps.

**T8 — Education + Contact redesign**
Scope: restyle both; Education stays directly above Contact.
- AC1: Education renders 2 entries (institution, program, date range) and is the last content
  section before Contact.
- AC2: Contact form shows inline validation: submitting empty shows a visible per-field message,
  and a malformed email is rejected with a visible message.
- AC3: Contact shows at least one direct channel (email/social) that is clickable.

**T9 — Navbar + Footer relabel/restyle**
Scope: 7 nav entries with the new labels; footer de-spaced.
- AC1: Nav reads About · Work · Skills · Experience · Recognition · Education · Contact, in that order.
- AC2: Clicking each entry scrolls to its section; the entry for the section in view is highlighted.
- AC3: At 375px the hamburger opens a menu with all 7 entries and closes on selection.
- AC4: Footer contains no space wording and no `//` code chrome.

**T10 — Responsive, a11y, reduced-motion, console, gates**
Scope: cross-cutting verification pass.
- AC1: No horizontal scrollbar and no clipped text at 375, 414, 768, 1024, 1280, 1440px.
- AC2: Exactly one `h1`; each section has an `h2`; all interactive elements are `Tab`-reachable in
  visual order with a visible focus ring.
- AC3: With `prefers-reduced-motion: reduce`, no looping/continuous animation runs and all content
  is readable at first paint.
- AC4: Console shows zero `error` entries and zero warnings from app code on load, on full scroll,
  and while opening/closing the lightbox — in dev and in `npm run preview` of a production build.
