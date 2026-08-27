# ADR-0006 — Hero boot sequence becomes non-blocking; telemetry counts derived from data

- **Status:** **Superseded by [ADR-0012](ADR-0012-plain-professional-hero.md)** (iteration 02,
  2026-08-27) · was Accepted · amended 2026-08-27 (amendment A1)

> **Superseded.** Iteration 02 removes the boot ticker, the typewriter and the telemetry
> strip entirely — the user rejected the "bragging" hero device this ADR was built to
> deliver. Everything below is retained as the record of why iteration 01 looked the way it
> did. ADR-0007's reduced-motion mechanism, which this ADR leaned on, is **not** superseded.
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §5.6, §7.3, G1, G2, D1, **D10**, **D12** · plan T1 (esp. AC6, AC7,
  AC8, AC12, AC13, AC16, AC17) · architecture.md §11

> **Amendment A1 (2026-08-27).** Three corrections, none reversing a decision:
> 1. §4's word budget omitted the boot ticker, which plan T1 AC6 does count. Corrected
>    from 37 to **39 / 40 words, 1 sentence**, with the boot cut to a single line.
> 2. The telemetry `STATUS` value is now `Full-Time` with a capital `T` (PRD **D10**),
>    matching the Experience badge. One spelling site-wide.
> 3. The copy trims in §4 and the CTA labels in §5 were routed to the PO as flags F4 and
>    were **approved**: they are now canonical PRD copy (PRD §5.6 items 1, 7, 8, 9 and
>    **D12**), not architect-initiated deviations.

## Context

The hero currently withholds **all** content behind a timer:

```js
const BOOT_DURATION_MS = 2100;
useEffect(() => { const t = setTimeout(() => setBooted(true), 2100); … }, []);
…
<motion.div className="hero__content" animate={{ opacity: booted ? 1 : 0 }}
            transition={{ duration: 0.7 }}>
```

So the earliest any hero content is fully opaque is 2100 + 700 = **2.8 s**, and the
porthole spring plus a 0.18 s-stagger dossier reveal run after that. Plan T1 AC12
requires the mission statement and telemetry to be **legible within 1.5 s** of load, and
AC13 requires them to be visible **immediately** under `prefers-reduced-motion: reduce`.

Meanwhile the user's own complaint — and G2 — pull in opposite directions: strip the
text-heavy dossier, but keep the theatre. "Condensation, not de-theming."

Separately, PRD §5.6 requires three telemetry values (`6 projects shipped`, `9 academic
awards`, `26 tools & technologies`) that must *equal the real rendered counts*, verified
by T1 AC8 by counting on screen. Hardcoding those strings guarantees they will be wrong
the first time a project or award is added.

## Decision

### 1. The boot sequence stops gating content

- `hero__content` is **never** opacity-gated. It mounts visible at `t = 0` and performs a
  short staggered rise (`staggerChildren: 0.06`, item duration `0.35 s`,
  `delayChildren: 0`), so the mission line and telemetry tiles are settled by ~0.6 s.
- The boot sequence survives as a **non-blocking HUD ticker**: `.hero__boot` becomes a
  small mono strip pinned to the top of the hero (not a centred full takeover), plays a
  two-line uplink message, and unmounts itself. `BOOT_DURATION_MS` drops from `2100` to
  **`900`**.
- The ticker never covers the mission line, the telemetry strip or the CTAs — it occupies
  its own reserved band, so nothing it does can delay legibility. Because it neither
  covers nor gates content, T1 AC12 is satisfied by the content stagger alone, with
  ~0.9 s of margin against the 1.5 s limit.
- The porthole spring (`scale 0 → 1`, `rotate -30 → 0`) is retained but no longer keyed
  off `booted`; it runs from mount. The avatar therefore counts toward the same ~0.6 s
  window.

### 2. Reduced motion skips the boot entirely

Under `useReducedMotion()`, the boot strip is **never mounted** (not merely shortened),
and the hero content reveal returns no animation props at all. Nothing fades, nothing
delays. See ADR-0007.

### 3. Telemetry values are derived, not typed

`src/content/hero.js` imports `projects`, `achievements` and `skills` and builds three of
the four values from `.length`:

```js
{ label: "MISSIONS",      value: `${projects.length} projects shipped` }
{ label: "COMMENDATIONS", value: `${achievements.length} academic awards` }
{ label: "SYSTEMS",       value: `${skills.length} tools & technologies` }
```

`STATUS` stays a literal (**`Full-Time @ Smartech Solutions PH`** — capital `T`, per PRD
D10, identical to the Experience badge) because it is not derivable from any list. With
the content modules as specified in `task.md`, these render exactly
`6 projects shipped`, `9 academic awards`, `26 tools & technologies` — the strings T1 AC7
demands — and T1 AC8's "the numbers match reality" becomes structurally true.

### 4. The hero copy budget is fixed and documented

T1 AC6 caps countable hero body copy at 40 words / 2 sentences, and its exclusion list
covers only the nav, the name, the designation kicker, the classification line and
social-icon labels. **The boot ticker is counted.** With the previous 4-line boot sequence
(~13 words) the hero would have landed near 50 and failed AC6 outright. The design
therefore trims three pieces of themed chrome:

- boot sequence: 4 lines → **one** line, `> uplink established` (~13 words → 2)
- scroll cue: `scroll to descend ↓` → `descend ↓` (3 words → 1)
- channels label: `open comm channels` → `comm channels` (3 words → 2)

Final allocation: 2 (boot) + 11 (mission) + 4 (telemetry labels) + 15 (telemetry values)
+ 4 (CTA labels) + 2 (channels label) + 1 (scroll cue) = **39 words, 1 sentence**, leaving
one word of headroom. The table is recorded in architecture.md §11 and must be re-checked
on any hero copy change.

`hero.classificationStatic` (the reduced-motion replacement for the typewriter, PRD D13)
is **excluded** from the count on the same basis as the typewriter it replaces — PRD §5.6
item 4 states this explicitly. A reduced-motion visitor must not be penalised for the
accommodation.

**All three trims were routed to the PO as flag F4 and approved (PRD D12).** They are now
canonical PRD copy — §5.6 items 1, 8 and 9 — and are no longer described anywhere as
"existing, unchanged". `open` and `scroll to` carry no information a reader needs.

### 5. CTA copy is plain, not themed

PRD §5.6 item 6 mandates two CTAs but specifies no labels. They are **`View Projects`**
(→ `#projects`) and **`Contact Me`** (→ `#contact`), rendered as real `<a href="#…">`
anchors so `Enter` works and the existing `html { scroll-behavior: smooth }` handles the
scroll (T1 AC9).

Themed alternatives (`Launch missions`, `Open channel`) were rejected: persona P1 in PRD
§2 explicitly fails when she has to guess what a control means, and the two most
important controls on the page are the wrong place to spend theme budget. The theme is
carried by the surrounding telemetry HUD.

*[A1] The PO adopted both labels verbatim; they are now canonical copy in PRD §5.6 item 7
rather than an architect's choice.*

### 6. Retired hero content

`information.userData.description` (the ~90-word emoji bio) is **deleted from the data
module**, not merely unrendered, along with `Hero`'s `splitIntoLogEntries` helper, the
`hero__dossier*` markup, and the `description` prop and PropType. This is what makes T1
AC1–AC4 verifiable by page-wide text search rather than by hoping nothing renders it.

## Consequences

**Positive**

- Time-to-legible drops from ~2.8 s to ~0.6 s, against a 1.5 s requirement.
- Telemetry numbers cannot drift from what renders; the "verifiable by counting on
  screen" property PRD §5.6 asks for holds by construction.
- The theatrical beat survives in a form that costs the reader nothing.
- Deleting the bio from `information.js` removes the emoji source entirely, so T1 AC4
  ("no emoji anywhere in the hero") cannot regress by accident.

**Negative / accepted costs**

- The boot sequence is visibly less dramatic — a one-line top ticker rather than a
  full-screen takeover. This was raised as a user-visible change beyond what Nala
  specified. **[A1] Now approved and specified by the PO** (PRD §5.6 item 1, D12) and
  tested by plan T1 AC17. Justified by T1 AC6/AC12/AC13, none of which the previous
  treatment could satisfy.
- `content/hero.js` importing three sibling content modules is a content→content
  dependency, which architecture.md §3.1 otherwise discourages. Explicitly allowed here
  and only here.
- If a project/award/skill is ever added without the PRD being updated, the telemetry
  will silently follow the data rather than the PRD. That is the desired direction of
  truth, but it means the PRD's literal strings in §5.6 become derived facts, not
  authored ones.
- ~~Shortening `open comm channels` and `scroll to descend` touches copy PRD §5.6 called
  "existing, unchanged". Flagged; it is a word-budget necessity, not a redesign.~~
  **[A1] Resolved — approved by the PO as PRD D12 and folded into §5.6 items 8 and 9 as
  canonical copy. No longer a deviation.**

**Neutral**

- `BOOT_DURATION_MS` remains a named constant so it stays tunable; T1 AC12 is explicitly
  measured on a recording, not by reading the constant.

## Alternatives considered

1. **Just lower `BOOT_DURATION_MS` to ~900 ms and keep the full-screen gate.** Would pass
   AC12 numerically (900 + 400 fade ≈ 1.3 s), but leaves the hero blank for the first
   second on every visit — the worst possible first impression for a 45-second scan, and
   with no margin if the machine is slow.
2. **Delete the boot sequence entirely.** Simplest and safest for AC12/AC13, but gives up
   theatre the user explicitly values (G2, "creative"). The non-blocking ticker keeps it
   at zero cost.
3. **Play the boot sequence only on first visit** (`sessionStorage`). Rejected: adds
   state, adds a non-deterministic QA surface (behaviour differs between the first and
   second load, making AC12 hard to reproduce), for a marginal gain.
4. **Hardcode the telemetry strings from PRD §5.6.** Rejected: it makes AC8 a manual
   recount forever and guarantees eventual drift.
5. **Compute telemetry inside `Hero.jsx`.** Rejected: it would put content strings and
   three data imports into a presentational component, against architecture.md §4.
