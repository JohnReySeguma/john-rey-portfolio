# ADR-0008 — Fragment deep links are resolved by a mount-time hook, not by the browser

- **Status:** Accepted
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §6.1, §6.2 · plan **T7 AC2**, and the opening "navigating to
  `/#id` scrolls to…" clause of T2 AC1, T3 AC1, T4 AC1 · architecture.md §3.1, §5, §10,
  §14 · ADR-0005 (section registry), ADR-0006 (non-blocking boot), ADR-0007 (reduced motion)
- **Supersedes:** nothing. **Superseded by:** nothing.

## Context

Masky's verification (`execution-log.md` §5 F-1) found a hard failure of plan T7 AC2:
loading `http://localhost:5173/john-rey-portfolio/#experience` in a fresh tab leaves the
page at the top. `window.scrollY` stays `0`, sampled every 500 ms for 6.6 s, even though
`location.hash` is correct and the section's document top is 3139.

The cause was established by controls, not assumed:

- A plain static HTML page with the target present at parse time scrolls correctly in the
  same browser and harness (`scrollY 3608`).
- Calling `document.getElementById(id).scrollIntoView()` in the app *after* mount also
  scrolls correctly (`scrollY 4625`, section `top 0`).

So the ids, the anchors and the DOM are all fine. This is the classic client-rendered-SPA
fragment race: the browser resolves the fragment during parse, when `#root` is still empty,
finds nothing at that id, and **never retries**. React then mounts the sections
underneath a scroll position of 0.

**This is not a regression.** The pre-existing `#projects`, `#skills` and `#contact`
anchors fail identically, so the defect predates iteration 01. It became a *graded*
criterion this iteration because ADR-0005 made the anchor registry a first-class contract
and T7 AC2 tests every id in it.

Masky correctly refused to fix it: a mount-time scroll is new composition-layer behaviour
that no task authorised, and it interacts with scroll-spy, the hero boot sequence and the
reduced-motion strategy — all of which are decided in ADRs.

Four things make this more than a one-liner:

1. **`html { scroll-behavior: smooth }` is set globally** in `App.css`. Any scroll API
   called with the default `behavior: "auto"` therefore *animates*, which turns a page-load
   positioning operation into a multi-second theatrical scroll past the whole hero.
2. **Late layout shift.** If the target's document offset is still moving when we scroll,
   we land in the wrong place.
3. **Scroll-spy** (`IntersectionObserver`, architecture §10) observes exactly these
   elements, so a programmatic scroll will fire it.
4. **In-page nav clicks already work** (Masky measured all 7 landing at `top: 0`). Any fix
   must not double-handle them.

## Decision

**Add one new module, `src/lib/useHashScroll.js`, a hook called once from `App.jsx`.**

### 1. It lives in `src/lib/`, and `src/lib/` is hereby widened to include hooks

Before this ADR, `src/lib/` held exactly one file (`motion.js`) and architecture §3.1
described it as *pure config*. That description is widened: **`src/lib/` is for
cross-cutting, non-content, non-presentational modules — configuration and behavioural
hooks — and still never contains JSX.**

Rejected alternative: an inline `useEffect` in `App.jsx`. ADR-0001 §Consequences explicitly
values `App.jsx` remaining "a flat, scannable composition file with no logic", and warned
about it growing past ~250 lines. This behaviour is ~25 lines of rAF, promise, listener and
cleanup logic — real logic, with a real cleanup contract. It does not belong inline in the
file whose job is to show what is on the page and in what order.

The hook **imports the registry itself** (`content/sections`) rather than taking it as an
argument. This is layering-legal (§3.1 puts `content/` below `lib/`), keeps ADR-0005's
registry as the single source of truth for which fragments are valid, and avoids a
parameter that would either be a new array identity every render or a dependency-array
hazard. The call site is therefore just `useHashScroll();`.

### 2. The registry is an allowlist

Only an `id` present in `content/sections.js` is acted on. An unknown, empty or hostile
fragment is ignored. This falls out of ADR-0005 for free and means the set of scrollable
fragments cannot drift from the set of sections the page declares.

### 3. The scroll is always instant — in both motion modes

`scrollIntoView({ behavior: "instant", block: "start" })`. **`"instant"` is required and
`"auto"` is forbidden**: `"auto"` defers to the CSS-declared `scroll-behavior`, which is
`smooth` globally, so `"auto"` would animate.

Consequently the hook does **not** call `useReducedMotion()` and has no reduced-motion
branch. This is a deliberate simplification, and it is the correct reading of ADR-0007
rather than an exception to it:

- Native fragment navigation — the behaviour we are restoring — is instant. We are
  repairing browser behaviour that React broke, not adding an effect.
- A smooth scroll from the top to y=3139 on first paint is *worse* for everyone: it delays
  arrival, and it drags the reader past the hero at speed, which is precisely the
  "content held hostage on first load" failure ADR-0006 exists to prevent.
- ADR-0007's rule is that a user who asks for less motion gets **no** animation. Instant
  satisfies that by construction. Branching would create two code paths where the
  reduced-motion path is the one we want in both cases — twice the surface, half the
  confidence.

So the reduced-motion requirement is met not by a conditional but by never animating at
all. What *is* required is passing `"instant"` explicitly, because the global CSS default
would otherwise animate it.

### 4. Two phases, because webfonts can move the target

The reveal animations are **not** a layout hazard, and this was checked rather than
assumed: `riseItem`, `cardRise`, `headingRise` and `consoleRise` animate only `opacity`,
`transform` (`y` / `scale` / `rotateX`) and `filter`. None of those are layout-affecting
properties — a translated element occupies its original box — so **every section's document
offset is final at first paint**, regardless of whether its reveal has played. Nor can
images shift it: every image on the page sits in a fixed-size box
(`.mission-card__viewport` is `height: 170px`, `.module__img` is `42 × 42`,
`.hero__porthole` is `150 × 150`), so image loading cannot reflow the document.

The one genuine late-shift source is the **webfont swap**. `App.css` loads Google Fonts via
`@import`; until those faces are applied, text is laid out in fallback metrics and every
section offset below the fold can move.

Therefore:

- **Phase 1** — one `requestAnimationFrame`, then jump. The user lands immediately.
- **Phase 2** — after `document.fonts.ready` resolves, one more `requestAnimationFrame`,
  then jump again to the same element, **unless the user has already interacted**.

Phase 2 is guarded by a one-shot cancel on `wheel`, `touchstart`, `keydown` and
`pointerdown`. Without that guard, a late correction would yank a user who had started
reading — which is scroll-hijacking, and worse than being 20 px off. With it, the
correction only ever happens while the user is still passively waiting.

### 5. Mount-only. No `hashchange`, no `popstate`, no `scrollRestoration` change

The effect has `[]` dependencies and reads the hash **once**. In-page nav clicks are
handled natively by the browser and already work; adding a `hashchange` listener would
double-handle them and fight the native smooth scroll that makes them feel good. Browser
scroll restoration is left alone so hash-less reloads behave normally; when a fragment
*is* present the hook runs after restoration and the fragment wins, which is the right
precedence for an explicit instruction in the URL.

### 6. Scroll-spy is not coordinated with, suppressed, or synchronised

The programmatic scroll fires the `IntersectionObserver` exactly as a user scroll would,
and the deterministic "first intersecting id in registry order" rule (architecture §10)
then marks the target section active. That is the desired outcome, so there is nothing to
reconcile. **Do not add suppression flags or observer pausing** — that would reintroduce
the non-determinism ADR-0005/§10 removed.

## Consequences

**Positive**

- T7 AC2 becomes passable, along with the opening clause of T2/T3/T4 AC1. A three-year-old
  latent defect in the pre-existing anchors is fixed at the same time.
- Deep links become real: a fragment can be shared, bookmarked and linked from a CV.
- The registry is now the allowlist for fragments as well as for nav and scroll-spy, so
  ADR-0005's "four facts that must agree" becomes five, still from one array.
- No dependency, no new concept in the page's mental model, ~25 lines.

**Negative / accepted costs**

- `src/lib/` is no longer purely declarative. Mitigated by stating the widened charter
  explicitly (§1) rather than letting it drift.
- Two phases means the scroll can, in the worst case, happen twice on one load. The
  user-interaction guard bounds the blast radius, but a very slow font load plus a very
  patient user will see one corrective jump. Accepted: the alternative is landing wrong.
- `document.fonts.ready` is relied on. It is universally supported in the browsers this
  project targets; if absent, phase 2 simply never runs and phase 1's position stands.
- Under React `StrictMode` the effect runs twice in development. It is idempotent — the
  second jump targets the same element and is a no-op — and cleanup removes both rAFs and
  all four listeners, so this is safe rather than merely tolerable.

**Neutral**

- `#about` resolves to the hero at offset 0, so the jump is a no-op. No special case.

## Alternatives considered

1. **Do nothing; ask Nala to relax T7 AC2 to "in-page nav clicks work".** Rejected. The
   criterion describes something a hiring manager may actually do (paste a link to a
   specific section), the anchors are advertised in the nav, and the same reasoning that
   rejected narrowing AC4 in PRD D15 applies: fix the product, not the yardstick.
2. **`scrollIntoView` with default/smooth behaviour.** Rejected — see §3. It animates
   because of the global CSS, delays arrival, and drags the reader past the hero.
3. **`window.scrollTo(0, el.offsetTop)` instead of `scrollIntoView`.** Rejected:
   `offsetTop` is relative to the offset parent, not the document, so it needs manual
   accumulation and breaks silently if a positioned ancestor is ever introduced.
   `scrollIntoView({ block: "start" })` expresses the intent directly.
4. **`useLayoutEffect` instead of `useEffect`.** Rejected: it runs before paint, when the
   fonts and first layout are least settled, and it blocks painting — the opposite of
   ADR-0006's priority. The `requestAnimationFrame` in phase 1 already guarantees we run
   after layout.
5. **A `<ScrollToHash />` component rendered inside `App`.** Rejected: a component that
   renders `null` purely to host an effect is a hook wearing a costume, and it would sit in
   `components/` where every other file is presentational (architecture §3.1).
6. **Polling the target's offset until it stabilises** (instead of `document.fonts.ready`).
   Rejected as unbounded and untestable; font readiness is the actual signal, and it is
   directly observable.
7. **Server-side rendering or pre-rendering so the fragment resolves natively.** The only
   fix that needs no JavaScript, and genuinely the *right* long-term answer — but PRD §4
   forbids a framework change (no Next.js migration), so it is out of scope by requirement.
   Recorded here as the direction a future iteration would take if SSR ever arrives.
