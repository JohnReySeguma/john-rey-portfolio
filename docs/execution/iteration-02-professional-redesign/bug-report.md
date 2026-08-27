# Iteration 02 — Professional Redesign · QA Report (Candy)

**Verdict: PASS.** 0 of 38 acceptance criteria failed. 2 non-blocking observations (both Low).

## How it was tested
Real app only — no mocks, no diff reading.
- Dev: `npm run dev` → `http://127.0.0.1:5311/john-rey-portfolio/`
- Prod: `npm run build` → `npm run preview` → `http://127.0.0.1:4311/john-rey-portfolio/`
- Driven in headless Edge over CDP (real clicks, real key events, real wheel events).
- Raw run output: `qa/evidence/*.json`, screenshots `qa/evidence/*.png`.

## Gate re-runs (my own, not the developer's)
| Gate | Command | Result |
|---|---|---|
| G1 | `npm run lint` | `LINT_EXIT=0`, no output (eslint `--max-warnings 0`) |
| G2 | `npm run build` | `BUILD_EXIT=0`, `✓ 361 modules transformed`, `✓ built in 3.29s`, `index-MhbuhYHG.css 23.70 kB`, `index-bUAI0doM.js 281.53 kB` |
| G3 | dev + preview driven in browser | all 7 sections render; every section interaction exercised by mouse **and** keyboard |
| G4 | console, dev **and** preview | errors `[]`, warnings `[]`, exceptions `[]`, HTTP failures `[]` — on load, on full scroll, and while opening/closing the lightbox |

## Postman run (asset smoke, executed — not shipped unrun)
`newman run qa/smoke.postman_collection.json -e qa/smoke.postman_environment.json --env-var baseUrl=http://127.0.0.1:4311`
→ **exit 0** · requests 53/53 · test-scripts 53/53 · **assertions 161 executed, 0 failed** · 6.0 s.
Full log: `qa/newman-run.txt`. Covers index.html (200 + `id="root"` + hashed bundle links, both
bundles fetched from the parsed paths), 6 project screenshots, all 13 award photos, me.png,
26 skill icons, 4 social icons — each 200 with an `image/*` content-type.

## Criterion → observed result

| AC | Observed | Verdict |
|----|----------|---------|
| T1.1 | `canvas` 0; no starfield/flight-path/rail element at 375–1440 | PASS |
| T1.2 | Only banned hit is "mission" inside `Mission Harvest Robotics Competition` (real competition name, out of scope per brief); other 9 words absent | PASS |
| T1.3 | Eyebrows/headings = Projects/Selected Work · Toolbox/Tech Stack · Career/Experience · Competitions & Research/Tech Events & Awards · Background/Education · Say hello/Get in Touch; no bracket-wrapped heading | PASS |
| T1.4 | No emoji glyph (only `©` in footer); `body` background `rgb(255,255,255)` | PASS |
| T2.1 | Exactly one `h1` = `John Rey Seguma` | PASS |
| T2.2 | Intro = 2 sentences, `#about` contains no digits at all | PASS |
| T2.3 | No stat tiles, no `Typewriter`/canvas in hero | PASS |
| T2.4 | `View Work`: mouse → `#projects` top 72; `Enter` → top 72. `Contact`: mouse → `#contact` top 72; `Enter` → top 72 | PASS |
| T3.1 | @1440: features `1088×413 / 1088×368 / 1088×413` vs cards `532×208 / 532×208 / 532×189`; same ratio @1024 | PASS |
| T3.2 | 3 full-width feature rows + 2-col compact grid — not a uniform 6-box grid | PASS |
| T3.3 | `View details` toggles `aria-expanded` false→true by click and by `Enter`, false by `Space`; panel holds screenshot + full description + stack chips + repo link | PASS |
| T3.4 | all 6 screenshots load (9 `img` elements incl. teaser crops, all `complete && naturalWidth>0`); 6 repo links, all `target="_blank" rel="noopener noreferrer"`; 0 HTTP failures | PASS |
| T4.1 | 6 named categories visible (Frontend, Mobile, Languages & Backend, Data, Cloud & DevOps, Tooling) + All, as a labelled `role="tablist"`; the tile grid is a `role="tabpanel"` `aria-labelledby` the active category | PASS |
| T4.2 | 26 tiles under `All`; labels match §5.4/§5.5 casing byte-for-byte | PASS |
| T4.3 | 0 broken icons; every `alt` equals its visible label (26/26) | PASS |
| T4.4 | Mouse `Mobile` → 2 tiles; `→` → `Languages & Backend` → 6; `→` → `Data` → 4; `Home` → `All` → 26; exactly 1 tab in the tab order | PASS |
| T5.1 | Nav `Recognition`, heading `Tech Events & Awards`, `/academic/i` = false in the section | PASS |
| T5.2 | 9 records, each with its PRD §I2.4 thumbnail, all loaded | PASS |
| T5.3 | Overlay opens on click; all 13 mapped photos reachable — `araw_ng_parangal` 1/3→2/3→3/3, `national_robotics` 1/2→2/2, `robo_fest` 1/2→2/2, `Previous` wraps 1/3→3/3 | PASS |
| T5.4 | Visible `Close` 36×36 closes it; `Esc` closes it; focus returns to the `.award-card__open` opener; wheel during open: scrollY 4294→4294 (locked), 4294→4694 after close | PASS |
| T6.1 | Kabataan record renders poster `awards/kabataan_inyovator.jpg` 846×475 + visible `Watch on Facebook` → `https://www.facebook.com/share/v/19N5bPPYJk/` | PASS |
| T6.2 | That link is `target="_blank" rel="noopener noreferrer"` | PASS |
| T6.3 | Developer's `embed:false` claim independently re-verified: `iframes 0`, poster present and loaded, link visible, dialog height 618 px — no blank box, no error frame (`qa/evidence/kabataan-lightbox.png`) | PASS |
| T6.4 | Opened all 9 records: `iframes 0` on every one; only record 2 has a facebook link | PASS |
| T7.1 | Both roles show company, title, `Full-Time`/`Internship`, `08/2025 – Present` + `Ongoing` / `01/2025 – 05/2025` | PASS |
| T7.2 | `View highlights` toggles by click, by `Space` and by `Enter`; panel lists the highlights | PASS |
| T7.3 | No HUD/mono record chrome; `PRESENT` in caps absent (renders `Present`) | PASS |
| T8.1 | 2 education entries with institution/program/range; `education` is the last section before `contact` | PASS |
| T8.2 | Empty submit → 3 visible `role="alert"` messages (23 px tall each); `bad@@x` → "Please enter a valid email address…" with `aria-describedby=contact-email-error`, `aria-invalid=true`; no "message sent" string | PASS |
| T8.3 | `mailto:thisisjohnrey@gmail.com`, second mailto, `tel:+639261714623` and 4 socials all clickable | PASS |
| T9.1 | Nav = About · Work · Skills · Experience · Recognition · Education · Contact, in order | PASS |
| T9.2 | All 7 clicked: each target lands at top 72 and exactly that entry gets `is-active` | PASS |
| T9.3 | @375 hamburger `aria-expanded` false→true, 7 entries + brand all inside the viewport, selection scrolls to Recognition (top 72), highlights it and closes the menu (`aria-expanded` false) | PASS |
| T9.4 | Footer = `© 2026 John Rey Seguma` + `Back to top`; no `//`, no space wording | PASS |
| T10.1 | 375/414/768/1024/1280/1440: `scrollWidth == clientWidth` at every width, 0 clipped text nodes | PASS |
| T10.2 | 1 `h1`, 6 `h2` (one per section); 46 tab stops, all with `outline: 2px solid`, order follows the visual/column reading order | PASS |
| T10.3 | `prefers-reduced-motion: reduce` + reload: `getAnimations() 0`, 0 CSS `infinite` animations, nothing below `opacity 1` at first paint, lightbox opens at `opacity 1 / transform none` | PASS |
| T10.4 | dev **and** preview: 0 errors, 0 warnings, 0 exceptions, 0 HTTP failures on load, full scroll and lightbox open/close | PASS |

North-star extras: 50 images on the page, `brokenImages []` in both dev and preview;
every section has a real interaction, each exercised once by mouse and once by keyboard.

## Findings

**No blocking defects. No criterion failed.** Two Low-severity observations, neither tied to
an acceptance criterion — logged for Nala to scope, not for Masky to hot-fix this iteration.

**OBS-01 · Low · Hover "lift" never renders on cards.**
`.award-card`, `.project-card` and `.edu-card` declare `transform: translateY(-4px)` under
`@media (hover:hover) … :hover`, but framer-motion leaves an inline `transform: none` on those
elements after the entrance animation, and the inline style wins.
Repro: 1440 px, hover an award card → measured `matches(':hover') true`, `getComputedStyle().transform
"none"`, inline `style="opacity: 1; transform: none;"`. The rest of each hover state (border-color,
box-shadow, the education accent rule) does apply, so every interaction still works and reads as
hovered. Expected: card lifts 4 px. Actual: no lift. Purely cosmetic.

**OBS-02 · Low · `public/me.png` is 7.86 MB.**
The hero portrait alone is 7.86 MB and is fetched at first paint (newman recorded 19.23 MB for the
53 assets). No AC covers asset weight, so this is not a failure — but it will dominate load time on
the deployed site. Suggest routing to Nala as a follow-up (resize/compress the portrait and the
larger award JPEGs, e.g. `araw_ng_parangal_2.jpg` at 826 kB).

## Note back to Masky (documentation only, not a defect)
`execution-log.md` pass 2 records `sectionIds [about, projects, …]`. `#about` is a `div.hero`, not a
`<section>`; the page has 6 `section[id]`. Pass 1's "6 `section[id]`" is the accurate line. The
app is correct either way — the hero legitimately carries the `h1` instead of an `h2`.

## Artifacts
- `qa/smoke.postman_collection.json` · `qa/smoke.postman_environment.json` (set `baseUrl` to your preview origin)
- `qa/newman-run.txt` — the executed run, 161/161 assertions
- `qa/manual-checklist.md` — 20-step browser click-through for the user
- `qa/evidence/` — raw CDP run JSON (dev + preview) and screenshots
