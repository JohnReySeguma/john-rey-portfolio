# ADR-0002 — Skills become `{ file, label }` records; `Skill` props change (breaking)

- **Status:** Accepted
- **Date:** 2026-08-27
- **Iteration:** 01
- **Deciders:** Ponta (Solution Architect)
- **Relates to:** PRD §5.4, §5.5, D5, D6 · plan T5 · architecture.md §4

## Context

`src/content/skills.js` is currently a flat array of 18 filename strings:

```js
const skills = ["react.svg", "laravel.png", "nodejs.svg", "postgre.png", "c++.png", …];
```

`Skill.jsx` derives both the visible label and the `alt` text by stripping the extension:

```js
const label = skill.replace(/\.(svg|png)$/, "");
```

That produces the visible strings `nodejs`, `postgre`, `c++`, `js` — which PRD D5 calls
out as failing the "professional" goal, and which plan T5 AC3/AC4/AC6 now forbid. PRD
§5.5 fixes an explicit display label for all 18 existing tiles, §5.4 adds 8 more, and
T5 AC6 requires `alt` to equal the display label. There is no derivation rule that can
produce `PostgreSQL` from `postgre.png` or `Node.js` from `nodejs.svg`; the label must be
authored data.

A secondary question: PRD §5.4/§5.5 present the tiles as one undifferentiated set of 26
and plan T5 AC1/AC7 require a single grid of uniformly-sized tiles. Should the model also
carry a `category` so the grid could later be grouped (Frontend / Backend / Cloud / …)?

A third: the current call site is `<Skill key={index} skill={skill} />` — keyed by array
index, and passing a single string prop.

## Decision

1. **New shape.** `src/content/skills.js` becomes an array of 26 objects:

   ```js
   { file: "postgre.png", label: "PostgreSQL" }
   ```

   `file` is the exact filename in `public/skills/` (case-sensitive, extension included).
   `label` is the display string fixed by PRD §5.4/§5.5, verbatim, including `XAMPP`
   (D6) and `Next.js`, `Node.js`, `Tailwind CSS`, `C++`, `HTML5`, `CSS3`.

2. **Breaking prop change on `Skill.jsx`, done now.** The component takes two flat scalar
   props, matching the `ProjectCard` style, rather than an object prop:

   ```jsx
   Skill.propTypes = {
     file: PropTypes.string.isRequired,
     label: PropTypes.string.isRequired,
   };
   ```

   All label/`alt` derivation logic is deleted from the component. The component becomes
   presentational with zero string manipulation.

3. **No `category` field in iteration 01.** The array stays flat and ungrouped. Ordering
   is still meaningful and is authored deliberately (see §Consequences), but no grouping
   metadata is stored and no group headings are rendered.

4. **Key by `file`, not by index:** `<Skill key={skill.file} … />`. `file` is unique
   across the 26 records and is a natural stable id.

5. **`nextjs.svg` is eradicated.** The string must not appear anywhere under `src/`
   after this change (T5 AC5 verifies via the Network tab).

## Consequences

**Positive**

- Every visible tile string and every `alt` string becomes authored content traceable
  one-to-one to a PRD table row — checkable by diff, per architecture.md §4.
- `Skill.jsx` loses its only piece of logic, so there is nothing left in it that can be
  wrong.
- Adding a tile in future is a two-field data edit; nothing in the component changes.
- Keying by `file` removes an index key, which is the one React-correctness smell in the
  current skills grid.

**Negative / accepted costs**

- This is a **breaking change** to `Skill`'s public props. It is worth doing now rather
  than adding a compatibility path, because (a) there is exactly one call site,
  `App.jsx`; (b) the props are validated by PropTypes, so a missed call site produces a
  loud dev-console warning rather than a silent regression; and (c) leaving a
  string-or-object dual signature would permanently encode the very filename-derived
  labelling this ADR exists to remove.
- Both the data module and any future tile addition now require the author to keep `file`
  in sync with an actual asset. A wrong `file` yields a broken image, which T10 AC2/AC3
  catch in the Network tab.

**Neutral**

- Because the record is an object, adding `category` (or `url`, `since`, `level`) later
  is additive and non-breaking — that option is preserved, just not exercised.

**Ordering decision (visible to the user, not specified by the PRD).** PRD §5.4/§5.5 list
the tiles in two separate tables (18 existing, then 8 new) but state no display order, and
no acceptance criterion constrains order. Appending the 8 new tiles to the end would put
Docker next to XAMPP next to nothing coherent, and would read as "bolted on" — against
T8. The array is therefore authored in a domain-grouped order (frontend → mobile →
languages & backend → data → cloud/infra → tooling). This is an ordering-only change; no
tile is added, removed or relabelled, and the rendered set is still one uniform grid.
The exact order is fixed in `task.md` task 1 (**T5-D1**) so QA can diff it.

**Rendered casing [A1].** PRD **D11** subsequently ruled that the authored `label` must
also be what is *painted on screen*, so `text-transform: uppercase` comes off
`.module__label`. Without that, this ADR's whole purpose would be defeated at the last
step — the data would say `PostgreSQL` and the page would show `POSTGRESQL`. Plan T5
AC2/AC3/AC4 are written against rendered glyphs (screenshot), not DOM text, precisely
because `Ctrl+F` is case-insensitive and cannot detect the difference.

## Alternatives considered

1. **Keep the flat string array and add a filename→label lookup map inside
   `Skill.jsx`.** Rejected: it splits one record across two structures, puts content in a
   component (violating architecture.md §4), and a missing map entry silently falls back
   to the ugly filename — exactly the bug class T5 exists to close.
2. **Pass the whole record as one prop (`<Skill skill={{file,label}} />`) with
   `PropTypes.shape`.** Rejected only on consistency grounds: `ProjectCard` already
   destructures flat scalar props, and a second convention for the same job costs more
   than the extra prop.
3. **Group into categories now** (`{ category: "Frontend", items: [...] }` or a `category`
   field plus grouped rendering). Rejected: PRD §4 forbids content not listed in §5, and
   §5 contains no categories — inventing "Frontend / Backend / DevOps" buckets would be
   me authoring product content. It also risks T5 AC1 (exactly 26 tiles) and T5 AC7
   (uniform footprint) by introducing heading rows into the grid. Routed back to Nala as
   a candidate for a future iteration rather than absorbed here.
4. **Derive the label with a smarter transform** (title-case + a few special cases).
   Rejected: `postgre` → `PostgreSQL` and `js` → `JavaScript` are not derivations, they
   are data.
