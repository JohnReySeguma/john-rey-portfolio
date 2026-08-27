# Architecture — John Rey Seguma Portfolio

**Owner:** Ponta (Solution Architect)
**Status:** Living document — established at iteration 01
**Created:** 2026-08-27 (iteration 01)
**Last updated:** 2026-08-27 (iteration 01 — amendment A1, see below)

### Amendment log

| # | Date | Change | Cause |
|---|---|---|---|
| A1 | 2026-08-27 | §3 file table corrected (`Heading`/`ProjectCard`/`ContactForm` are modified, not unchanged); §4 `content/hero.js` shape completed; §8 gains `.record__award`; §11 word-budget table gains the boot-ticker row and the classification-line exclusion; §11 + §9.1 + §9.2 gain the reduced-motion classification branch; §13 statuses annotated. | Self-audit flags F1, F6a, F7, F10 raised in `iteration-01-portfolio-uplift/task.md` §4, plus PO adjudication **PRD §9 D10–D14** (`plan.md` amendment log 2026-08-27). |
| A2 | 2026-08-27 | §3 file table: `FlightPath.jsx` becomes MODIFIED (emoji marker → inline SVG). §7.2 records the new `flight-path__ship-*` elements. §7.3 gains a binding "no emoji as a visual element" rule. | PO adjudication **PRD §9 D15** (`plan.md` amendment log, second pass), resolving self-audit flag F15. |
| A3 | 2026-08-27 | §3 gains `src/lib/useHashScroll.js`; §3.1 widens the `src/lib/` charter to include behavioural hooks; **new §14** records the fragment-deep-link behaviour; §8 + §9.4 gain the binding rule that hover transforms on motion-driven elements live in the component, not in CSS; §13 indexes **ADR-0008**. | Post-implementation findings in `iteration-01-portfolio-uplift/execution-log.md` — failure **F-1** (fragment deep links do not scroll) and deviation **D-2** (`.record:hover` transform never rendered). Resolved by **ADR-0008** and an ADR-0004 amendment. |

| A4 | 2026-08-27 | **New §15** records the iteration-02 professional redesign: component inventory, iteration-02 content shapes, CSS strategy. §13 indexes ADR-0009…0012; ADR-0006 is marked superseded. §7.3's token/colour/font restriction and §11's hero design are retired (ADR-0009, ADR-0012); §11 is retained as history. | Iteration-02 PRD "Professional Redesign" §I2.1–I2.5 and `iteration-02-professional-redesign/plan.md` T1–T10. |
| A5 | 2026-08-27 | §15.3 gains the named token contract and the block-name map; **new §15.4** (per-section interaction mechanism + iteration-02 reduced-motion story) and **new §15.5** (Facebook embed shape). No ADR changes. | Completing §15 so `iteration-02-professional-redesign/task.md` can be written without the developer inferring mechanism. |

> This is the baseline. Nothing existed before it. Later iterations **extend** these
> sections; a contradiction requires a new ADR that supersedes the old one.

---

## 1. System context

A single-page, fully static personal portfolio. No backend, no API, no database, no
router, no auth. Built with Vite and deployed as pre-rendered static assets to GitHub
Pages under the sub-path `/john-rey-portfolio/`.

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 18.2 | `src/main.jsx` → `<App />` in `#root`, `React.StrictMode` |
| Build | Vite 5, `base: '/john-rey-portfolio/'` | `vite.config.js` |
| Deploy | `gh-pages -d dist` | `npm run deploy` (predeploy = build) |
| Styling | Plain CSS, one file (`src/App.css`) | `:root` design tokens, BEM-ish naming |
| Motion | framer-motion 10 | plus CSS `@keyframes` for looping ambience |
| Icons | react-icons 4 | used in `ProjectCard`, `ContactForm` only |
| Text FX | typewriter-effect 2 | hero classification line only |
| Lint | ESLint 8 flat-less config, `--max-warnings 0` | `.eslintrc.cjs` |

**Dormant dependencies** present in `package.json` but not imported anywhere in `src/`:
`jquery`, `react-owl-carousel`, `react-intersection-observer`. They are **not** to be
adopted; scroll-spy uses the native `IntersectionObserver`. Removing them is out of scope
for iteration 01 (no ticket covers it) — flagged here so a future iteration can clean up.

### 1.1 Hard invariants

1. **No new npm dependencies.** Anything needed must be composable from React,
   framer-motion, and CSS.
2. **Every runtime asset path is prefixed with `import.meta.env.BASE_URL`.** See §6.
3. **PropTypes on every component that takes props.** No exceptions.
4. `npm run lint` passes at `--max-warnings 0`, and `npm run build` succeeds.
5. Static only. No fetch, no environment secrets, no analytics.

---

## 2. Current architecture (as-is, before iteration 01)

```
src/
  main.jsx              React root
  App.jsx               page composition: owns every <section>, maps content -> item components
  App.css               738 lines, the entire stylesheet
  components/
    Starfield.jsx       fixed canvas background (decorative)
    FlightPath.jsx      fixed scroll-progress rocket rail (decorative, aria-hidden)
    Navbar.jsx          sticky HUD nav + IntersectionObserver scroll-spy + mobile menu
    Hero.jsx            boot sequence + porthole + name + typewriter + dossier + socials
    Heading.jsx         shared section heading primitive (eyebrow + <First Second/>)
    ProjectCard.jsx     one project (item-level)
    Skill.jsx           one skill tile (item-level)
    ContactForm.jsx     contact console (static contact details, no form submission)
    Footer.jsx          static footer
  content/
    information.js      { userData: { firstName, lastName, title, img, description } }
    projects.js         array of 6 project records
    skills.js           flat array of 18 asset filename strings
    socials.js          array of 4 { icon, url }
public/
  skills/ projects/ socials/ me.png
```

### 2.1 The composition rule that already exists

`App.jsx` owns the page skeleton. For each section it renders:

```
<section id="…" className="station">
  <Heading eyebrow="…" firstWord="…" secondWord="…" />
  <div className="…-grid">{ data.map(item => <ItemComponent … />) }</div>
</section>
```

Components under `components/` are therefore of two kinds:

- **Item components** (`ProjectCard`, `Skill`) — render exactly one record, take flat
  scalar props, own no data import, own no section shell.
- **Chrome components** (`Navbar`, `Hero`, `Footer`, `ContactForm`, `Starfield`,
  `FlightPath`) — singletons that may import their own content module directly
  (`Hero` and `ContactForm` both import `content/socials`).

This distinction is the load-bearing convention of the codebase and iteration 01 extends
it rather than replacing it. See **ADR-0001**.

### 2.2 Known weaknesses the as-is design carries into iteration 01

| # | Weakness | Ticket that touches it |
|---|---|---|
| W1 | Hero gates *all* content behind a 2100 ms boot timer (`opacity: 0` until `booted`) | T1 |
| W2 | Skill labels are derived from filenames (`js`, `postgre`, `c++`) | T5 |
| W3 | Nav section list is a module-private const in `Navbar.jsx`, duplicating the page order that lives in `App.jsx` | T6, T7 |
| W4 | Nav is only responsive at one breakpoint (760 px); 7 entries will overflow between 761–1050 px | T6 |
| W5 | `prefers-reduced-motion` is handled only by a blanket CSS override, which does **not** affect framer-motion JS-driven animations | T1, T8, T10 |
| W6 | `.hud-nav__menu.is-open { max-height: 300px }` cannot fit 7 stacked items | T6 |
| W7 | Bio copy is a ~90-word emoji paragraph split by a regex on emoji boundaries | T1 |

---

## 3. Target architecture (after iteration 01)

```
src/
  main.jsx                      unchanged
  App.jsx                       MODIFIED — 7 sections, order driven by content/sections.js
  App.css                       MODIFIED — banner-sectioned, ~1150 lines, new blocks
  lib/
    motion.js                   NEW — shared framer-motion variants + reduced-motion helper
    useHashScroll.js            NEW — resolves a fragment deep link after mount (ADR-0008)
  components/
    Navbar.jsx                  MODIFIED — reads content/sections.js, deterministic spy
    Hero.jsx                    MODIFIED — non-blocking boot, mission line, telemetry, CTAs
    Skill.jsx                   MODIFIED — { file, label } props (breaking, see ADR-0002)
    ExperienceEntry.jsx         NEW — item component
    AchievementCard.jsx         NEW — item component
    EducationCard.jsx           NEW — item component
    Heading.jsx                 MODIFIED — reveal via lib/motion; <wbr/> between the two words
    ProjectCard.jsx             MODIFIED — reveal via lib/motion; rel="noopener noreferrer"
    ContactForm.jsx             MODIFIED — reveal via lib/motion
    Footer.jsx                  MODIFIED — rel="noopener noreferrer"
    Starfield.jsx               unchanged — already reads prefers-reduced-motion at mount
    FlightPath.jsx              MODIFIED — 🚀 emoji marker → inline SVG on palette tokens
                                (PRD D15); motion behaviour unchanged (scroll-linked)
  content/
    sections.js                 NEW — the section/anchor/nav registry (single source of order)
    hero.js                     NEW — boot line, classification strings, mission, telemetry, CTAs
    experience.js               NEW — 2 employment records
    achievements.js             NEW — 9 award records, in final display order
    education.js                NEW — 2 education records
    skills.js                   MODIFIED — 26 { file, label } records (was 18 strings)
    information.js              MODIFIED — `description` field retired
    projects.js  socials.js     unchanged
```

**Amendment A1 note (was flags F7/F10).** The first version of this table listed
`Heading.jsx`, `ProjectCard.jsx` and `ContactForm.jsx` as unchanged, which contradicted
§9.2/§9.3 and ADR-0007 in the same document. All three own a framer-motion entrance
reveal with hardcoded `initial`/`whileInView` props, and framer-motion is unreachable by
the CSS `prefers-reduced-motion` media query, so all three **must** be routed through
`src/lib/motion.js` for plan T8 AC6 / T10 AC9 to pass. `ProjectCard` and `Footer`
additionally need `rel="noopener noreferrer"` (T10 AC10, §9.3), and `Heading` needs a
`<wbr />` between `firstWord` and `secondWord` so `<AcademicAchievements/>` — a single
unbreakable 20-character token — can break at the word boundary at 375 px instead of
clipping (T9 AC3/AC4). The `<wbr />` is markup-only: `Heading`'s props, PropTypes and
render contract are unchanged, and it is inert at every width where the heading already
fits.

**Amendment A2 note (was flag F15).** `FlightPath.jsx` was previously listed here as
genuinely unchanged. It is not: its scroll-progress marker is a literal 🚀 character, drawn
by the *visitor's* OS emoji font, so its colour and shape are outside this project's
control. PRD **D15** rules that the rail, the marker and the scroll-linked motion all stay
but the glyph becomes an inline SVG using existing palette tokens. Only the marker's
rendering changes — `offsetPath` / `offsetDistance` / `offsetRotate` and the
`useScroll`/`useSpring` wiring are untouched, so §9.2's reduced-motion treatment of
`FlightPath` (it stays; it is scroll-linked, not timer-driven) is unaffected.

`Starfield.jsx` is confirmed unchanged **and already conformant**: it reads
`window.matchMedia("(prefers-reduced-motion: reduce)").matches` at mount, pins twinkle to
a constant and never schedules a `requestAnimationFrame` loop when the preference is set.
Plan T8 AC6 depends on this, which is why its procedure is "emulate, **then** hard
refresh" — the preference is read once at mount, so toggling emulation without reloading
leaves the field animating and is not a valid test.

### 3.1 Layering

```
content/*            pure data, no JSX, no React import
   ↓ imported by
lib/*                cross-cutting config and behavioural hooks, no JSX
   ↓ used by
components/*         presentational only, PropTypes-validated, no data fetching
   ↓ composed by
App.jsx              page order, section shells, data → component wiring
```

**`src/lib/` charter (widened by amendment A3, ADR-0008 §1).** `src/lib/` holds
cross-cutting modules that are neither content nor presentation: shared configuration
(`motion.js`) **and behavioural hooks** (`useHashScroll.js`). It still **never contains
JSX** — which also keeps `react-refresh/only-export-components` quiet under
`--max-warnings 0`. A `lib/` module may import from `content/` (it sits above it in the
layering); it may never import from `components/`.

Rules:
- A component never reaches into another component's CSS block.
- Item components never import from `content/` (their data arrives as props). The only
  exceptions are the pre-existing chrome components `Hero` and `ContactForm`, which
  import `content/socials` — and `Hero`, which will also import `content/hero`.
- `content/hero.js` is allowed to import `content/projects`, `content/achievements` and
  `content/skills` in order to *derive* telemetry counts. This is deliberate: it makes
  the "6 / 9 / 26" numbers structurally impossible to drift from what renders. See
  **ADR-0006**.

---

## 4. Content-as-data convention

**Every repeated, user-visible record lives in a `src/content/*.js` module as a plain
array of plain objects, default-exported. Components receive that data as props and
contain no literal content strings other than themed chrome (labels like
`CLASSIFICATION:`, `LOG #01`).**

Why new sections get content modules rather than inline JSX:

1. **Traceability.** PRD §5 is the single source of truth for copy. A one-to-one mapping
   between a PRD table row and an object literal makes an audit a diff, not a reading
   exercise. Copy buried in JSX cannot be diffed against the PRD mechanically.
2. **Fabrication control.** The constitution forbids inventing facts. Content modules
   concentrate every factual claim into four small files that a reviewer can check in one
   pass.
3. **Derived integrity.** Counts used elsewhere on the page (hero telemetry) can be
   computed with `.length` instead of being retyped, so they cannot lie (PRD §5.6).
4. **Consistency.** `projects.js` and `socials.js` already work this way. A second style
   would make the codebase read like two codebases.
5. **Ordering is data, not markup.** PRD §5.2 fixes a contested order (D3). Array index
   *is* that order, and reordering is a data edit with zero layout risk.

**Record shapes (iteration 01):**

```js
// content/experience.js
{ id, company, title, type, start, end, current: boolean, highlights: string[] }

// content/achievements.js
{ id, award, category: string | null, event }

// content/education.js
{ id, institution, program, start, end }

// content/skills.js
{ file, label }

// content/sections.js
{ id, navLabel, eyebrow: string | null, firstWord: string | null, secondWord: string | null }

// content/hero.js  (single object, not an array)
{
  boot,                  // the one-line non-blocking ticker         (PRD §5.6 item 1, D12)
  classificationStatic,  // reduced-motion replacement for the typewriter (PRD §5.6 item 4, D13)
  mission,
  telemetry: [{ label, value }],
  ctas: [{ label, href, variant }],
  channelsLabel,         // shortened socials label                  (PRD §5.6 item 8, D12)
  scrollCue,             // shortened scroll cue                     (PRD §5.6 item 9, D12)
}
```

Every user-visible hero string lives in this one object — including the themed chrome —
because plan T1 AC6 imposes a hard word budget on the hero and PRD §5.6 is the closed list
of permitted hero copy. Keeping all of it in one module makes the budget auditable in one
place (§11) instead of scattered across `Hero.jsx` literals. The typewriter's three
cycling phrases stay inline in `Hero.jsx` as component chrome, since they are the
animated form of `classificationStatic` and both are excluded from the budget.

Conventions inside content modules:
- `id` is a stable lowercase slug, used as the React `key`. **Do not key by array index**
  in new code (existing `Skill` usage is corrected by T5).
- Date ranges are stored as separate `start`/`end` strings and joined for display with a
  literal **EN DASH `–` (U+2013) surrounded by single spaces** — `08/2025 – Present`.
  The joining lives in the component, not in the data.
- `null` means "this record genuinely has no value" (e.g. achievements A1/A4 have no
  category/year). Components must render nothing rather than a placeholder — PRD D8
  forbids inventing years.
- No emoji in any content module going forward (PRD G1).

---

## 5. Section / anchor / nav registry

`src/content/sections.js` is the **single source of truth** for page order, anchor ids,
nav labels, and heading copy. It replaces the duplicated `SECTIONS` const currently
private to `Navbar.jsx` (W3).

| Order | `id` | navLabel | eyebrow | Heading renders | Component |
|---|---|---|---|---|---|
| 1 | `about` | About | — | `<JohnRey Seguma/>` (h1, in Hero) | `Hero` |
| 2 | `projects` | Missions | `mission log` | `<MyProjects/>` | `ProjectCard` × 6 |
| 3 | `skills` | Systems | `cargo hold` | `<Skills&Tools/>` | `Skill` × 26 |
| 4 | `experience` | Service | `service record` | `<WorkExperience/>` | `ExperienceEntry` × 2 |
| 5 | `achievements` | Medals | `commendations` | `<AcademicAchievements/>` | `AchievementCard` × 9 |
| 6 | `education` | Academy | `training log` | `<MyEducation/>` | `EducationCard` × 2 |
| 7 | `contact` | Transmit | `ground control` | `<ContactMe/>` | `ContactForm` |

Contract:
- `Heading` prepends `// ` to `eyebrow` itself — registry values carry **no** `//`.
- `Heading` renders `<` + `firstWord` + `secondWord` + `/>` with **no space between the
  words** (existing behaviour). `firstWord: "Work"`, `secondWord: "Experience"` therefore
  renders `<WorkExperience/>`, which is what plan T2 AC1 requires.
- The hero row has `eyebrow: null` and no heading words; consumers must tolerate `null`.
- `Navbar` derives its links from the registry in array order.
- `App.jsx` reads heading props from the registry by `id`; the *visual* order is the JSX
  order in `App.jsx` and **must** match the registry array order. There is one automated
  guard available and it is cheap: `App.jsx` maps over an explicit ordered list of
  `id`s. Keeping both in one file makes drift visible in review.

See **ADR-0005**.

---

## 6. Asset-path convention (gh-pages correctness)

The site is served from `https://<user>.github.io/john-rey-portfolio/`. Vite's `base` is
`/john-rey-portfolio/`, and `import.meta.env.BASE_URL` resolves to that string in
production and to `/` in dev.

**Rule: every reference to a file under `public/` is written as**

```jsx
src={`${import.meta.env.BASE_URL}skills/${file}`}
```

- `BASE_URL` already ends with `/`. Never add a leading `/` to the path that follows, or
  the base is bypassed and the asset 404s in production.
- Existing code has an inconsistency to be aware of, not to "fix" blindly:
  `information.userData.img` is `"/me.png"` (leading slash) and `projects[].img` is
  `"projects/…"` (no leading slash). Both are interpolated after `BASE_URL`, producing
  `/john-rey-portfolio//me.png` for the avatar — which browsers normalise, so it works.
  Iteration 01 does not change this; no ticket covers it. Do not introduce new
  leading-slash paths.
- Never use a bare `/skills/x.png`, never `new URL(...)`, never `import` an image from
  `public/`. `public/` files are copied verbatim and must be referenced through
  `BASE_URL`.
- `public/skills/nextjs.svg` was deleted. After T5, **no** string `nextjs.svg` may exist
  anywhere in `src/`.
- `public/skills/` contains five assets no ticket references (`express.svg`,
  `framer-motion.svg`, `linux.svg`, `python.svg`, `vite.png`). They stay on disk unused;
  adding them would be content the PRD does not authorise.

---

## 7. CSS organisation

**Decision: one stylesheet, `src/App.css`, stays the only stylesheet in iteration 01.**
Rationale and rejected alternatives are in **ADR-0003**.

### 7.1 Required structure

`App.css` gets a table-of-contents comment at the top and keeps its existing banner style
(`/* ---------- name ---------- */`) for every block. Block order is fixed and matches
page order so the file reads like the page:

```
@import (fonts)
tokens (:root)
resets / globals / a11y (:focus-visible, prefers-reduced-motion)
starfield
flight path
HUD navbar
hero
station / heading
record            <-- shared primitive (new)
mission cards (projects)
modules (skills)
service log (experience)         <-- new
commendations (achievements)     <-- new
academy (education)              <-- new
console (contact)
mobile spacing overrides
footer
```

### 7.2 Naming

BEM-ish, one hyphenated block name, `__element`, `--modifier`, all lowercase, themed to
match the existing vocabulary (`station`, `mission-card`, `module`, `console`,
`hud-nav`). New blocks introduced in iteration 01:

| Block | Purpose |
|---|---|
| `record` | shared credential-card primitive (see §8) |
| `service-log` | Experience timeline container + rail |
| `commendation-grid` | Achievements grid container |
| `academy-grid` | Education grid container |
| `telemetry` | hero stat strip |
| `hero__cta` (element) | hero call-to-action buttons |
| `hero__role-static` (element) | reduced-motion classification string (PRD D13, §11.1) |

New **elements on the pre-existing `flight-path` block** (no new block; PRD D15, A2):
`flight-path__ship-svg` (sizing/box), `flight-path__ship-hull` and
`flight-path__ship-core` (the two fills). All colour lives in these CSS rules as
`var(--thruster)` / `var(--nebula-2)`, never as attributes on the SVG — see §7.3.

### 7.3 Rules

- **No new custom properties beyond the existing `:root` set, and no new colour or font
  values** (PRD §7.4, T8 AC1/AC2). Tints of an existing colour must be expressed as an
  `rgba()` of that colour's channels, exactly as the file already does for
  `rgba(67, 232, 216, 0.1)`.
- **No emoji as a visual element, anywhere** (PRD §7.4, D15 · plan T1 AC4). An emoji glyph
  is rendered by the operating system's emoji font, so its colours and shape are outside
  this project's control and differ per platform — which breaks *both* of the rules above
  at once: it imports colours that are not in the palette, in a font that is not one of
  the three declared families. Decorative marks are **inline SVG or CSS-drawn shapes**
  using existing tokens. Corollary: an inline SVG's colours are set from `App.css`
  (`fill: var(--token)` on a `block__element` class), **never** as a `fill="…"`
  presentation attribute on the markup — `var()` is not reliably supported in presentation
  attributes, and hardcoding a hex there would put a colour literal in a component.
  Permitted non-ASCII *text* glyphs, which are not emoji: `↓` (U+2193), `·` (U+00B7),
  `–` (U+2013).
- No fixed `px` widths on containers. Use `max-width`, `minmax()`, `clamp()`. Every
  long-string container gets `overflow-wrap: anywhere` or `word-break: break-word`
  (PRD §7.1, T9 AC3).
- Media queries live **inside** the block they modify, not in a global breakpoint dump at
  the bottom — except for the pre-existing `@media (max-width: 480px)` mobile-spacing
  block, which stays where it is.
- Breakpoints in use: `480`, `600`, `640`, `760`, `900`, `1024`, `1100`. Do not invent
  more.
- **Split trigger (for a future iteration, not now):** when `App.css` exceeds ~1200
  lines, or when a second page/route is introduced, split into `src/styles/*.css`
  imported from `App.css` and record it as a new ADR superseding ADR-0003.

---

## 8. Shared visual primitive: `record`

The main lever on "professional but creative" is that the three new sections must read as
one system, not three bolted-on blocks (T8 AC3, AC7). They therefore share a **CSS-level**
primitive rather than a React wrapper component — the three item components each render
their own semantic markup but compose the same class family.

```
.record                  panel bg, 1px panel border, 16px radius, backdrop blur,
                         border-color + box-shadow + transform transition
.record:hover            border-color: var(--thruster); lift; teal glow
                         (identical character to .mission-card:hover)
.record__meta            mono, 11–12px, uppercase, letter-spacing, --text-dim   (dates)
.record__title           font-display, 17px, --starlight                        (h3 content)
.record__award           font-display, 20px, --solar                            (achievement h3)
.record__subtitle        font-body, 14px                                        (role / program)
.record__badge           pill, mono 11px, tinted bg + border                    (Full-Time / Internship)
.record__note            13px, line-height 1.6, --text-dim                      (bullets, event)
.record__notes           grid container for .record__note items                 (bullet list)
.record--service / --commendation / --academy   section-specific accents only
```

The primitive owns *surface, spacing, typography scale and hover*. Modifiers own *accent
colour and internal arrangement only*. Anything a modifier needs that changes the surface
belongs in `.record` instead.

### 8.1 Hover transforms on motion-driven elements live in the component (amendment A3)

**Binding rule, applies to every `motion.*` element in the codebase:**

> An element rendered as a framer-motion component with `variants` or an `animate` prop
> carries an **inline `transform`** written by framer-motion on every frame — and, once its
> reveal settles, permanently as `transform: none`. Inline styles beat the stylesheet, so a
> `transform` declared in a `:hover` rule for that element **can never render**.
> Therefore:
>
> - **Transform-based hover feedback** (lift, scale, rotate) is expressed in the component
>   with `whileHover` / `whileTap`.
> - **Non-transform hover feedback** (`border-color`, `box-shadow`, `background`, `color`)
>   stays in `App.css`, where the cascade is uncontested.
> - The element's CSS block must **not** declare `transform` in a `:hover` rule, and must
>   **not** list `transform` in its `transition` shorthand — a CSS transition on
>   `transform` interpolates against framer-motion's per-frame inline writes and fights the
>   `whileHover` animation.

Applied to `record`: `.record:hover` declares `border-color` and `box-shadow` only, and
`.record`'s `transition` lists `border-color` and `box-shadow` only. The 4 px lift comes
from `whileHover={{ y: -4 }}` on each of the three item components. This is now
**structurally identical to `.mission-card`**, which has always worked this way
(`.mission-card:hover` sets border + glow; `ProjectCard` carries
`whileHover={{ y: -8 }}`) — and matching `.mission-card` was ADR-0004's stated intent all
along, so this rule brings the implementation *into* line with the ADR rather than away
from it.

This does not weaken ADR-0003. ADR-0003 decides **where stylesheets live** (one
`App.css`); it never claimed CSS owns every visual behaviour, and framer-motion already
owned the transform for `ProjectCard` and `Skill` before iteration 01. The single
stylesheet remains the single stylesheet.

**Reduced-motion consequence, and why it is correct.** With the CSS transform gone,
`MotionConfig reducedMotion="user"` (ADR-0007 Layer 1) drops the `whileHover` lift, so a
reduced-motion visitor gets the border + glow and **no** movement. That is the intended
behaviour, it is exactly what `.mission-card` and `.module` already do in that mode, and it
keeps plan T8 AC7's "hover of the same character" true in *both* modes. Leaving
`transform: translateY(-4px)` in the CSS would have quietly reintroduced a movement for
precisely the users who asked for less of it — the CSS rule applies under reduced motion
because framer writes no inline transform then.

*Discovered by measurement, not review:* the original CSS-only specification produced the
glow with no movement at all (measured element `top` 342 → 342). Recorded here so the next
person does not rediscover it the same way.

**Audit (A3): `record` was the only violation in the codebase.** Every other CSS `:hover`
transform sits on a plain element, not a motion one — `.hero__cta` and `.hero__channel` are
plain `<a>`s whose *parents* are the motion elements; `.console__cta` and
`.console__channels-row a` likewise. And the two hoverable elements that *are*
motion-driven, `.mission-card` and `.module`, were already correct: CSS sets
`border-color`/`box-shadow`, `whileHover` owns the lift. So this rule is a codification of
what the codebase already did everywhere except the one block added in iteration 01 — not a
new convention imposed on it.

**Amendment A1 note (was flag F6a).** `.record__award` is a second title-level element
alongside `.record__title`, not a modifier override. Plan T3 AC7 requires the award phrase
to be the visually dominant element of an achievement card — larger **and/or**
accent-coloured — and this design satisfies both axes. Expressing that as
`.record--commendation .record__title { font-size: 20px; color: var(--solar) }` would have
put the type scale under a modifier's control, which the rule directly above forbids.
Keeping it as its own primitive element preserves "modifiers never touch the type scale"
while still giving the achievements grid the emphasis it needs. `.record__notes` is
likewise a container element of the primitive, not a modifier concern.

`.record__note` carries the achievement **event** as well as experience bullets. The event
deliberately does **not** use `.record__meta`, because `.record__meta` applies
`text-transform: uppercase` and plan T3 AC3/AC4 require `Kabataan Inyovator`,
`Araw ng Parangal`, `Robo Fest` and `Capture-the-flag` to render in their authored casing.

Accent assignment (keeps sections distinguishable without new hues):

| Section | Accent token |
|---|---|
| Experience | `--thruster` (teal) — matches "active/ongoing" semantics already used by `hud-nav__pulse` |
| Achievements | `--solar` (amber) — award/medal semantics |
| Education | `--nebula-2` (violet) |

See **ADR-0004**.

---

## 9. Motion and accessibility conventions

### 9.1 Scroll-reveal pattern (the only entrance pattern)

Every scroll-triggered reveal uses framer-motion `whileInView` with
`viewport={{ once: true, amount: … }}` and an easing of `[0.16, 1, 0.3, 1]`. Two shapes
exist and nothing else:

1. **Single element** — `initial` / `whileInView` object literals (as `Heading`,
   `ProjectCard`, `ContactForm` already do).
2. **Staggered container** — parent `motion` element holds `variants={staggerContainer}`
   with `initial="hidden" whileInView="visible"`; children hold `variants={riseItem}` and
   **no** `initial`/`whileInView`/`viewport` of their own (as the Skills grid already
   does). Nesting two stagger containers is not allowed.

Shared variants live in `src/lib/motion.js`:

```js
viewportOnce      // { once: true, amount: 0.2 }
staggerContainer  // { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
riseItem          // hidden: { opacity: 0, y: 24 } → visible: { opacity: 1, y: 0 }
reveal(reduced, variants)   // returns the motion props object, or {} when reduced
item(reduced, variants)     // returns `variants` or undefined when reduced
```

**Budget (PRD §7.4, T8 AC4):** total time from a section entering the viewport to its
content being fully readable must be ≤ 600 ms. With `staggerChildren: 0.08` and a 0.45 s
item duration, a 9-item grid finishes its last item at `8 × 0.08 + 0.45 = 1.09 s` — over
budget. Therefore **grids with more than 6 items stagger by row, not by item**: use
`staggerChildren: 0.06` and cap the effective delay with `delayChildren: 0` and a
`when: "beforeChildren"`-free container, or simply reveal large grids as a single
container fade. The concrete per-section values are specified in `task.md`.

**Continuous-motion budget (T8 AC5):** at most one attention-grabbing *looping* effect per
section. Exempt: nav `ONLINE` pulse, hero scroll cue. Current state violates this in the
hero (typewriter loop **and** the infinite `spin` on `.hero__porthole-ring`); the
typewriter is required by PRD §5.6 for motion-tolerant users, so the ring's infinite spin
is retired in favour of a hover-only rotation. The Projects section's
`.mission-card__scanline` is treated as **one effect type** repeated per card, not six
effects; if QA rejects that reading, the agreed fallback is to run the scanline on
`:hover` only.

Under `prefers-reduced-motion: reduce` the hero's looping count drops to **zero**: the
typewriter is not mounted at all and is replaced by a static string (PRD D13, §9.2 Layer 3
below), and the scroll-cue bounce is not applied. Plan T8 AC6 is therefore satisfiable
with no permitted exceptions.

### 9.2 Reduced motion

CSS alone is insufficient: the existing `@media (prefers-reduced-motion: reduce)` block
neutralises CSS animations/transitions but has **no effect** on framer-motion, which
animates via inline styles from JS (W5).

Two-layer strategy:

1. **`<MotionConfig reducedMotion="user">`** wraps the app tree in `App.jsx`. This makes
   framer-motion drop transform/layout animation values globally for users who ask for
   reduced motion — including `whileHover` lifts.
2. **`useReducedMotion()`** (exported by framer-motion 10 — no new dependency) is called
   in any component that owns a reveal, and the result is passed through
   `reveal()` / `item()` from `src/lib/motion.js`. When reduced, those helpers return
   props that produce **no animation at all**, not merely a transform-free fade —
   because plan T1 AC13 and T8 AC6 require content to be *immediately* visible, and an
   opacity fade is still a delay.
3. The hero boot sequence is skipped entirely (not shortened) under reduced motion.
4. **The hero classification typewriter is not mounted at all** under reduced motion; a
   static string renders in its place (PRD §5.6 item 4, D13). See §11.

### 9.2.1 Third-party looping components (PRD D13)

`typewriter-effect` exposes no reduced-motion API and starts its own timers on mount, so
neither `MotionConfig`, nor the CSS media block, nor any styling can stop it. The only
mechanism that works is **not mounting it**. The rule this establishes, and which applies
to any future third-party animated component:

> A third-party component that animates on a timer and cannot be configured to stop must
> be **conditionally rendered** on `useReducedMotion()`, never hidden with CSS. Hiding it
> (`display: none`, `visibility: hidden`, zero opacity) leaves its timers, its work and
> its accessibility-tree churn running, and still fails "nothing is animating".

Where the component carries information, the reduced-motion branch must render an
**information-equivalent static substitute** — not an empty space. For the classification
line the typewriter's entire payload is three phrases shown serially, so the substitute
shows all three simultaneously, which loses nothing and is faster to scan (PRD D13).

### 9.3 Accessibility conventions

- Exactly one `h1`: `.hero__name`. Every section heading is the `h2` inside `Heading`.
  Every record title (`company`, `institution`) is an `h3`. Achievement award text is
  rendered as an `h3` too, so the achievements grid is navigable by heading — the award
  is both the visually dominant element (T3 AC7) and the semantic title.
- DOM order == visual order. No `order`, no `row-reverse`, no positive `tabindex`
  anywhere. This is what makes T7 AC3 and T10 AC5 pass for free.
- Focus is handled globally by the existing `:focus-visible { outline: 2px solid
  var(--thruster); outline-offset: 3px }`. New interactive elements must not set
  `outline: none`.
- Hero CTAs are `<a href="#projects">` / `<a href="#contact">` — real anchors, so `Enter`
  works and `scroll-behavior: smooth` on `html` handles the scroll. Do not use `<button>`
  + `scrollIntoView`.
- Every `<img>` has a meaningful `alt`. Skill tiles use the display label, not the
  filename (T5 AC6).
- Decorative-only elements (`Starfield`, `FlightPath`, timeline rail, node dots) are
  `aria-hidden="true"` and not focusable.
- Every `target="_blank"` carries `rel` containing `noopener` (T10 AC10). Note
  `ProjectCard` currently uses `rel="noreferrer"` — which browsers treat as implying
  `noopener`, but T10 AC10 asks for `noopener` literally, so it is normalised to
  `rel="noopener noreferrer"`.

---

## 10. Scroll-spy design

`Navbar` keeps a native `IntersectionObserver` (no `react-intersection-observer` — see
§1) with `rootMargin: "-40% 0px -50% 0px"`, so only a thin horizontal band in the middle
of the viewport counts as "current".

Current implementation sets `active` from whichever entry the callback iterates last,
which is non-deterministic when two sections straddle the band (more likely with 7
sections than 4). Target implementation:

1. Maintain a `Set` of currently intersecting ids in a `useRef`.
2. On each callback, add/remove ids, then set `active` to the **first id in registry
   order** present in the set. If the set is empty, leave `active` unchanged.
3. Observe every registry id; skip ids whose element is missing rather than throwing.
4. Effect dependency array stays `[]`; the registry is a module constant.

This guarantees T6 AC3 ("only one entry highlighted at a time") deterministically.

---

## 11. Hero architecture (target)

Structure, top to bottom, inside `#about.hero`:

```
hero__boot        mono ticker strip, ONE line, absolutely positioned in its own reserved
                  band, NON-BLOCKING, auto-dismissed; never mounted when reduced
hero__content     always rendered, never opacity-gated
  hero__porthole      avatar + ring (ring rotates on hover only)
  hero__designation   kicker (information.userData.title)
  h1.hero__name       <JohnRey Seguma/>
  hero__role          CLASSIFICATION: + EITHER Typewriter (3 strings, loop)
                                      OR     span.hero__role-static   <- reduced motion
  p.hero__mission     the single 11-word mission sentence
  ul.telemetry        4 × telemetry__tile { label, value }
  div.hero__actions   2 × a.hero__cta  (→ #projects, → #contact)
  hero__channels      socials row (label shortened to "comm channels")
  a.hero__scroll-cue  looping bounce (exempt from the motion budget; not applied when reduced)
```

### 11.1 The classification line is a mount-time branch (PRD D13)

`hero__role` renders the label `CLASSIFICATION:` followed by **exactly one** of two
mutually exclusive children, chosen by `useReducedMotion()`:

| `reduced` | renders | notes |
|---|---|---|
| `false` | `<Typewriter options={{ strings: [3 phrases], autoStart: true, loop: true }} />` | unchanged existing behaviour |
| `true` | `<span className="hero__role-static">{hero.classificationStatic}</span>` | one static string carrying all three phrases, separated by `·` (U+00B7) |

This is a **conditional render, not a CSS toggle** — see §9.2.1 for why. The two branches
are mutually exclusive: plan T1 AC15 explicitly fails the build if the static string
appears while motion is allowed, and fails it if anything is typing while motion is
reduced.

`.hero__role-static` must wrap rather than clip at 375 px (T1 AC15); it inherits the
existing `.hero__role`'s `flex-wrap: wrap` and needs `overflow-wrap: anywhere`.

The boot overlay no longer gates content: hero content mounts visible at `t = 0` and
performs a short staggered rise, while the boot strip plays over the top of the hero and
removes itself. Worst-case time to legible mission + telemetry is therefore bounded by
the content stagger (~0.6 s), not by the boot timer. See **ADR-0006**.

**Hero word budget** (plan T1 AC6 caps countable hero body copy at 40 words / 2
sentences). Countable, per PRD §5.6 "Word-budget interlock" = every hero string **except**
the nav, `hero__name`, `hero__designation`, the classification line (typewriter *or* its
static replacement), and social-icon labels. **The boot ticker is counted.** The design is
allocated as:

| Element | Source | Words |
|---|---|---|
| boot ticker (1 line, `> uplink established`) | `hero.boot` | 2 |
| mission sentence | `hero.mission` | 11 |
| 4 telemetry labels | `hero.telemetry[].label` | 4 |
| 4 telemetry values | `hero.telemetry[].value` | 15 |
| 2 CTA labels | `hero.ctas[].label` | 4 |
| channels label (`comm channels`) | `hero.channelsLabel` | 2 |
| scroll cue (`descend ↓`) | `hero.scrollCue` | 1 |
| **Total** | | **39 / 40** — 1 word of headroom, **1 sentence** |

Only `hero.mission` ends in a terminal `.`; nothing else in `content/hero.js` may gain
one. `hero.classificationStatic` is excluded from the count by PRD §5.6 item 4, on the
same basis as the typewriter it replaces — a reduced-motion visitor must not be penalised
for the accommodation.

**Amendment A1 note (was flag F1).** The first version of this table omitted the boot
ticker and totalled 37. That was wrong: T1 AC6's exclusion list never covered the boot
copy, and the then-current 4-line boot sequence (~13 words) would have pushed the real
total to ~50 and failed AC6 outright. Cutting the ticker to one two-word line is what
brings the design to 39. PRD §5.6 and plan T1 AC6 now state the same 39/1 figure, so the
three documents agree.

Any future hero copy change must re-check this table.

---

## 12. Verification surface for this architecture

There is no test runner in this project (no Jest/Vitest, no Playwright) and no ticket
adds one, so "verified" for iteration 01 means, per the constitution's evidence rule:

1. `npm run lint` → exit 0 with `--max-warnings 0`.
2. `npm run build` → exit 0.
3. `npm run dev` → the real running app, checked in a browser against the plan's
   acceptance criteria at the six responsive checkpoints, with DevTools Console and
   Network open, and with `prefers-reduced-motion: reduce` emulated.

No claim of "done" may cite source code alone.

---

## 13. Decision log index

| ADR | Title | Status |
|---|---|---|
| [ADR-0001](adr/ADR-0001-item-level-section-components.md) | Item-level presentational components per section, not a generic data-driven section renderer | Accepted |
| [ADR-0002](adr/ADR-0002-skill-record-content-model.md) | Skills become `{ file, label }` records; `Skill` props change (breaking) | Accepted |
| [ADR-0003](adr/ADR-0003-single-stylesheet.md) | Keep a single `App.css` with an enforced block structure | Accepted |
| [ADR-0004](adr/ADR-0004-record-visual-primitive.md) | Introduce a shared `record` CSS primitive and `src/lib/motion.js` | Accepted · **amended A1** (adds `.record__award`, `.record__notes`) |
| [ADR-0005](adr/ADR-0005-section-registry.md) | `content/sections.js` as the single source of section order, anchors and nav | Accepted |
| [ADR-0006](adr/ADR-0006-non-blocking-hero-boot.md) | Hero boot sequence becomes non-blocking; telemetry counts derived from data | **Superseded by ADR-0012** (iteration 02) |
| [ADR-0007](adr/ADR-0007-reduced-motion-strategy.md) | Reduced motion handled in JS via `MotionConfig` + `useReducedMotion`, not CSS alone | Accepted · **amended A1** (typewriter gap closed by PRD D13; no open non-conformance remains) |
| [ADR-0008](adr/ADR-0008-mount-time-hash-scroll.md) | Fragment deep links are resolved by a mount-time hook (`src/lib/useHashScroll.js`), not by the browser | Accepted (A3) |
| [ADR-0009](adr/ADR-0009-professional-design-system.md) | Replace the space theme with a light token-based design system; rewrite `App.css` | Accepted (iteration 02) |
| [ADR-0010](adr/ADR-0010-shared-interaction-primitives.md) | Shared `Lightbox` + `TabFilter` primitives and section-controller components | Accepted (iteration 02) |
| [ADR-0011](adr/ADR-0011-facebook-video-embed-fallback.md) | Facebook video plugin iframe behind an evidence-gated flag, with a mandatory fallback | Accepted (iteration 02) |
| [ADR-0012](adr/ADR-0012-plain-professional-hero.md) | The hero is a plain professional intro — supersedes ADR-0006 | Accepted (iteration 02) |

**ADR-0004 is additionally amended by A3** to move the `record` hover lift from CSS to
`whileHover` — see §8.1. That amendment corrects an implementation detail that could not
work as originally written; it does not reverse ADR-0004's decision (share at the CSS and
motion-config layer), and in fact restores its stated intent of matching
`.mission-card:hover` exactly.

No ADR is superseded by amendments A1–A3. Each amendment either completes a list that was
incomplete (ADR-0004 / A1), records a PO decision that resolved a gap the ADR had
explicitly routed to the PO rather than decided (ADR-0006, ADR-0007 / A1), or corrects a
mechanism that measurement proved could not work (ADR-0004 / A3). ADR-0008 is a genuinely
new decision and is therefore a new ADR rather than an amendment.

---

## 14. Fragment deep links (amendment A3)

A client-rendered SPA loses native fragment navigation: the browser resolves
`/#experience` while `#root` is still empty, finds nothing, and never retries. Measured
behaviour before the fix — `window.scrollY` stays `0` for 6.6 s while
`location.hash === "#experience"` and the section's document top is `3139`. All seven
anchors were affected, including the three that predate iteration 01.

`src/lib/useHashScroll.js` restores it. Called once from `App.jsx`; full rationale and the
rejected alternatives are in **ADR-0008**. The contract in brief:

| Concern | Behaviour |
|---|---|
| Valid targets | only ids present in `content/sections.js` (ADR-0005 registry as allowlist) |
| When | once on mount, `[]` deps — **not** on `hashchange`/`popstate`; native in-page nav clicks already work and must not be double-handled |
| How | `scrollIntoView({ behavior: "instant", block: "start" })` — **`"instant"`, never `"auto"`**, because `html { scroll-behavior: smooth }` would otherwise animate it |
| Reduced motion | instant in **both** modes, so there is no branch and no `useReducedMotion()` call. Native fragment navigation is instant; a smooth scroll from the top would animate past the whole hero and fight §11's time-to-legible goal |
| Late layout shift | phase 1 jumps after one `requestAnimationFrame`; phase 2 re-jumps after `document.fonts.ready` + one `rAF`, **cancelled** if the user has already produced `wheel`/`touchstart`/`keydown`/`pointerdown` |
| Reveal animations | **not** a hazard — every reveal variant animates only `opacity`, `transform` and `filter`, none of which affect layout, so section offsets are final at first paint (see ADR-0008 §4) |
| Scroll-spy | not coordinated with, suppressed or synchronised — the programmatic scroll fires the observer normally and §10's deterministic rule marks the target active, which is the desired outcome |
| Hero boot | unaffected: `.hero__boot` is `position: absolute` (out of flow) and `hero__content` is never opacity-gated, so nothing in the boot sequence changes document height (ADR-0006) |

The registry now governs **five** things that must agree: page order, nav labels, heading
copy, scroll-spy targets, and valid deep-link fragments — all from one array.

---

## 15. Iteration 02 — professional redesign (target)

Extends §§1–14. Where this contradicts iteration 01 the contradiction is carried by an ADR:
**ADR-0009** (design system), **ADR-0010** (interaction primitives), **ADR-0011** (FB embed),
**ADR-0012** (hero, supersedes ADR-0006). Still binding and unchanged: §1.1 invariants (no
new npm deps, `BASE_URL` asset paths, PropTypes everywhere, lint/build gates), §3.1 layering,
§4 content-as-data, §5 registry, §6 asset paths, §9 motion/a11y (incl. §8.1 hover rule),
§10 scroll-spy, §12 verification surface, §14 hash scroll.

### 15.1 Component inventory

| File | Iteration-02 disposition |
|---|---|
| `Starfield.jsx` | **DELETED** — file, `.starfield-canvas` CSS, `App.jsx` import |
| `FlightPath.jsx` | **DELETED** — file, `flight-path*` CSS, `App.jsx` import |
| `Hero.jsx` | REWRITTEN — portrait, h1, role, ≤2-sentence intro, 2 CTAs, socials (ADR-0012) |
| `Heading.jsx` | REWRITTEN — props `{ eyebrow, title }`; plain `<h2>`, no `<…/>` chrome |
| `ProjectCard.jsx` | REWRITTEN — tier-2 compact card only |
| `ProjectFeature.jsx` | **NEW** — tier-1 alternating feature row + expandable detail panel |
| `Skill.jsx` | REWRITTEN — same `{ file, label }` props, chip styling |
| `SkillsBoard.jsx` | **NEW** — section controller: `TabFilter` + filtered tile grid |
| `TabFilter.jsx` | **NEW** — shared tablist primitive (ADR-0010) |
| `AchievementCard.jsx` | REWRITTEN — thumbnail card, is the lightbox opener |
| `AwardsWall.jsx` | **NEW** — section controller: award grid + lightbox state |
| `Lightbox.jsx` | **NEW** — the only overlay primitive (ADR-0010) |
| `FacebookEmbed.jsx` | **NEW** — poster + gated iframe + fallback link (ADR-0011) |
| `ExperienceEntry.jsx` | REWRITTEN — timeline entry with expand/collapse highlights |
| `EducationCard.jsx` | REWRITTEN — restyled onto the new tokens |
| `Navbar.jsx` | MODIFIED — `site-nav` classes, no `ONLINE` status, 7-entry mobile menu |
| `ContactForm.jsx` | REWRITTEN — real fields + client-side inline validation, no backend |
| `Footer.jsx` | REWRITTEN — neutral copy |
| `App.jsx` | MODIFIED — space chrome gone, projects split by tier, controllers wired |
| `lib/motion.js`, `lib/useHashScroll.js` | KEPT — contracts unchanged |

`typewriter-effect` is no longer imported anywhere in `src/`; the package stays in
`package.json` as a dormant dependency (§1), removal deferred with PRD DF3.

### 15.2 Content-module shapes (iteration 02)

```js
sections.js     { id, navLabel, eyebrow: string|null, title: string|null }   // PRD §I2.2
skills.js       { file, label, category }  + named export `categories: string[]` (tab order)
projects.js     { id, tier: 1|2, name, description, stack, sourceCode, img, preview }
achievements.js { id, award, category, event, images: string[],
                  video: null | { url, poster, label, embed: boolean } }     // PRD §I2.4
hero.js         { role, intro, ctas: [{ label, href, variant }] }            // no counts
information.js  { userData: { firstName, lastName, title, img } }            // name de-bracketed
```

§4's rules hold (`id` is the React key, `null` means "genuinely no value", no emoji, no
invented facts). One rule drops: `content/hero.js` no longer imports other content modules,
because ADR-0012 removes the derived counts §3.1 allowed it to compute.

### 15.3 CSS strategy

`src/App.css` stays the **only** stylesheet (ADR-0003 upheld) but is **rewritten from
scratch, not patched**: every space-theme block is deleted and `:root` is replaced by
ADR-0009's token set. Block order still mirrors page order and each block still owns its
media queries (§7.1). Expected size ≈ 900–1100 lines — below ADR-0003's 1200-line split
trigger, which stays armed for a future iteration.

**Token contract (the closed `:root` set — ADR-0009).** Nothing in a component or block may
introduce a raw colour, font family, radius or shadow outside this list; tints are `rgba()`
of a token's channels.

| Group | Tokens |
|---|---|
| Surface | `--bg` `--surface` `--surface-2` `--border` |
| Ink | `--ink` `--ink-2` `--ink-3` |
| Accent (one only) | `--accent` `--accent-soft` `--accent-ink` |
| Type | `--font-sans` `--font-display`; scale `--step--1` … `--step-5` (all `clamp()`) |
| Space (4 px base) | `--s-1` … `--s-8` |
| Radius / elevation | `--r-sm` `--r-md` `--r-lg` · `--shadow-1` `--shadow-2` |
| Motion | `--ease` (`cubic-bezier(.16,1,.3,1)`) `--dur-1` `--dur-2` |

Breakpoints: `480 / 640 / 768 / 1024 / 1280` only.

**Block-name map (space vocabulary → iteration-02 vocabulary).** Old names are deleted, not
aliased.

| Old | New |
|---|---|
| `starfield` · `flight-path` | *(gone)* |
| `hud-nav` | `site-nav` |
| `station` · `heading` | `section` · `section-head` |
| `mission-card` · `mission-grid` | `project-feature` (tier 1) · `project-card` / `project-grid` (tier 2) |
| `module` · `module-grid` | `skill-chip` · `skill-grid` (+ `skills-board`, `tab-filter`) |
| `record` · `service-log` | `timeline` / `timeline__entry` |
| `record--commendation` · `commendation-grid` | `award-card` · `awards-wall` (+ `lightbox`, `fb-embed`) |
| `record--academy` · `academy-grid` | `edu-card` · `edu-grid` |
| `console` | `contact` / `contact-form` |
| `telemetry` · `hero__boot` · `hero__role-static` · `hero__scroll-cue` | *(gone — ADR-0012)* |

### 15.4 Interaction model and reduced motion

**Mechanism, uniformly: React `useState` in a controller/item component + framer-motion
`AnimatePresence` for the panel/overlay transition.** No new dependency, no CSS-only
`:checked` hacks, no `<details>` (its native marker and open-state animation are not
stylable to the token system consistently across browsers).

| Section | Affordance | Control | State owner | Plan AC |
|---|---|---|---|---|
| Hero | none (CTAs are plain anchors) | — | — | T2 AC4 |
| Work | tier-1 feature expands a detail panel (full screenshot + full description + stack) | `<button aria-expanded aria-controls>` inside the feature | `ProjectFeature` (one per card) | T3 AC3 |
| Skills | category tabs filter the tile grid | `TabFilter` (`role="tablist"`, roving tabindex) | `SkillsBoard` | T4 AC4 |
| Experience | entry expands its highlights list | `<button aria-expanded aria-controls>` | `ExperienceEntry` | T7 AC2 |
| Recognition | card opens a photo lightbox with prev/next | `<button>` wrapping the card | `AwardsWall` (open id + image index) | T5 AC3/AC4 |
| Education | card raises + reveals its accent rule on hover **and** `:focus-within` | native | none (CSS only) | T8 AC1 |
| Contact | inline per-field validation on submit and on blur-after-submit | `<form onSubmit>` | `ContactForm` | T8 AC2 |

Rules that make these safe:

- A `<button>` toggle is a real `<button type="button">`; `Enter`/`Space` come for free. No
  `div` + `onClick`, no `tabIndex={0}` handlers.
- Panels are **collapsed at mount**, so document height at first paint is final and §14's
  hash-scroll phases still land correctly.
- Education has no hidden data to expose, so its affordance is presentational only. Inventing
  content to give it a panel would violate §4's fabrication rule; PRD §I2.3 is satisfied by a
  keyboard-reachable reveal (`:focus-within`), not by fake copy.
- Contact has no backend (§1). A **valid** submit must not claim delivery: it composes a
  `mailto:` URL from the field values, navigates to it, and shows a neutral status line. No
  "message sent" string may exist anywhere.
- `Lightbox` and `TabFilter` are the *only* implementations of their affordance (ADR-0010);
  a second modal or a second tablist is a design defect, not a variation.

**Reduced motion (iteration 02).** ADR-0007's two layers are unchanged and still the only
mechanism: `<MotionConfig reducedMotion="user">` in `App.jsx` plus `useReducedMotion()` fed
into `reveal()` / `item()` from `src/lib/motion.js`. Iteration-02 additions:

- `src/lib/motion.js` keeps its **exports and function signatures exactly**; only variant
  *values* are retuned off the space aesthetic (drop `rotateX`, `blur()` and `scale` — every
  reveal becomes opacity + small `y`). Consumers need no change.
- Every `AnimatePresence` transition (project panel, highlights panel, tab-filtered grid,
  lightbox) is wrapped so that when `reduced` is true the panel/overlay appears and
  disappears with **no** animation — the state change is instantaneous, content is legible
  immediately. Do not substitute a "short" duration.
- The looping-animation budget (§9.1) goes to **zero for the whole page**: `Starfield`,
  `FlightPath`, the typewriter, the porthole spin, the scroll cue and the card scanline are
  all deleted. T10 AC3 is therefore structural rather than something to tune.
- Under reduced motion the layout must be identical, not merely static — nothing may depend
  on an animation having run to become visible or positioned.

### 15.5 Facebook video embed (ADR-0011)

Rendered **only** inside the Kabataan Inyovator lightbox, by `FacebookEmbed.jsx`, from the
record's `video` object. Three parts, in DOM order:

1. `<img>` poster — `${import.meta.env.BASE_URL}awards/kabataan_inyovator.jpg`, **always
   present** (§6 asset rule applies; do not hardcode `/awards/…`).
2. `<iframe>` — mounted only when `video.embed === true`:
   `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false&width=560`
   with `title`, `loading="lazy"`, `allowFullScreen`, `frameBorder="0"`, `scrolling="no"`.
   The `href` **must** be percent-encoded; an unencoded URL is silently rejected by the
   plugin.
3. `<a>` **"Watch on Facebook"** → `video.url`, `target="_blank" rel="noopener noreferrer"`.
   Not conditional on anything — it is the fallback *and* the primary path (PRD §I2.5 A1).

`video.embed` is set from observation in the running app, never assumed, and the observation
is recorded in `execution-log.md`. A cross-origin iframe emits no usable failure signal, so
there is deliberately **no** runtime detection and no `onError` handler — the poster and the
link carry the failure case. No other achievement record has a `video` key, which is what
makes T6 AC4 structural.
