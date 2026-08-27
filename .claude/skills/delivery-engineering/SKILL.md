---
name: delivery-engineering
description: Run a multi-persona plan->act->observe delivery loop (Nala/PO, Ponta/Architect, Masky/Developer, Candy/QA, Pixie/Auditor) against a north-star prompt, documenting every artifact under docs/execution and tracking resumable loop state in docs/execution/README.md. Use when the user gives a feature/product prompt and wants it driven end-to-end through requirements, design, implementation, testing, and sign-off — not for one-off code edits or quick questions.
---

# Delivery Engineering Loop

Runs a north-star prompt through a five-persona **Plan -> Act -> Observe** loop until the
work is signed off, or a persona has a blocking question only the user can answer.

## Constitution — the gold standard

`governance/constitution.md` is the supreme rulebook for you and every persona. Read it
at bootstrap; never act against it, and never dispatch a persona with instructions that
would make it act against it. Key consequences for this loop:

- No verification step is ever skipped, and no completion is ever reported without
  evidence for all criteria.
- Verification happens against the **real running application** — never mock data.
- Files under `governance/` are never modified by you or any persona.
- On a constraint violation: stop, record it in `README.md`, and escalate to the user.

Each persona is a real subagent defined under `.claude/agents/` (`nala.md`, `ponta.md`,
`masky.md`, `candy.md`, `pixie.md`), following standard Claude Code subagent conventions
(frontmatter `name`/`description`/`tools`, persona-scoped tool access, single-responsibility
system prompt). You are the **orchestrator**: you own `docs/execution/README.md`, dispatch
each persona via the `Agent` tool (`subagent_type` = persona name) in sequence, and advance
the loop based on what they report back.

Subagents start cold — each `Agent` call must be self-contained. Never write "based on the
prior step, do X"; instead give each persona the north star, the exact file paths to read
(their own prior artifacts plus whichever upstream persona's artifacts they depend on), and
what to produce this call. Run persona calls in the foreground (`run_in_background: false`)
since each phase's dispatch depends on the previous one's result — don't race the loop
ahead of a persona that hasn't reported back yet.

## 0. Bootstrap — always do this first

1. Check whether `docs/execution/README.md` exists.
   - **Exists** -> this is a resume. Read it fully, plus the most recent iteration
     folder's artifacts, to reconstruct where the loop left off (which persona was
     mid-task, what phase, what the north star is). Do not restart from scratch or
     re-litigate decisions already recorded.
   - **Does not exist** -> this is a fresh loop. The user's prompt in this conversation is
     the **north star**. Create `docs/execution/` and initialize `README.md` (template
     below) with status `ongoing`, iteration `1`, phase `plan`.
2. Never overwrite `PRD.md`, `architecture.md`, or ADRs wholesale — these are living
   documents that accumulate across iterations. Edit them; don't recreate them.

## Directory layout

```
docs/execution/
  README.md                     # loop state — single source of truth for resumability
  PRD.md                        # Nala — living product requirements doc
  architecture.md               # Ponta — living architecture/design doc
  adr/
    ADR-0001-<slug>.md          # Ponta — one file per architectural decision
  iteration-01-<slug>/
    plan.md                     # Nala — jira-style ticket breakdown for this iteration
    task.md                     # Ponta — execution tasks handed to Masky
    execution-log.md            # Masky — what was implemented/changed and why,
                                #         incl. evidence that DB scripts were executed
    bug-report.md               # Candy — bugs found this iteration (empty if none),
                                #         plus criterion -> request pass/fail map
    qa/                         # Candy — Postman collection + environment + run evidence
      <slug>.postman_collection.json
      <slug>.postman_environment.json
    audit.md                    # Pixie — sign-off or rejection with reasons
  iteration-02-<slug>/
    ...
```

Create the next `iteration-NN-<slug>/` folder at the start of every loop pass (`slug` is a
short kebab-case label for that iteration's focus, e.g. `iteration-02-auth-refresh`).

## README.md state template

```markdown
# Delivery Loop State

**North Star:** <verbatim prompt/goal>
**Status:** ongoing | blocked | finished
**Current Iteration:** NN
**Current Phase:** plan | act | observe
**Current Persona:** Nala | Ponta | Masky | Candy | Pixie
**Last Updated:** <ISO date>

## Blocker (if status = blocked)
<question that needs the user, or empty>

## Iteration Log
| Iter | Folder | Summary | Outcome |
|------|--------|---------|---------|
| 01   | iteration-01-<slug> | ... | signed off / bugs found / rework |
```

Update this file at the end of **every** persona step, not just at iteration boundaries —
that's what makes a mid-loop interruption resumable.

## The personas (`.claude/agents/`)

Each persona's full responsibilities, tool access, and output discipline live in its own
agent definition — read the relevant file if you need the details, don't duplicate its
system prompt here:

| Persona | Agent file | `subagent_type` | Phase | Owns |
|---|---|---|---|---|
| Nala — Product Owner | `.claude/agents/nala.md` | `nala` | PLAN | `PRD.md`, `iteration-NN/plan.md` |
| Ponta — Solution Architect | `.claude/agents/ponta.md` | `ponta` | PLAN | `architecture.md`, `adr/*`, `iteration-NN/task.md` |
| Masky — Developer | `.claude/agents/masky.md` | `masky` | ACT | `iteration-NN/execution-log.md` + code |
| Candy — QA | `.claude/agents/candy.md` | `candy` | OBSERVE | `iteration-NN/bug-report.md` |
| Pixie — Auditor | `.claude/agents/pixie.md` | `pixie` | OBSERVE | `iteration-NN/audit.md` |

Each agent definition already scopes that persona's tools (e.g. Nala has
`AskUserQuestion` to raise product ambiguity directly with the user; Pixie is read-only
plus `audit.md`). You don't need to grant or restrict anything at dispatch time — just
call `Agent` with the matching `subagent_type` and a self-contained prompt.

### Dispatching a persona

Every `Agent` call for a persona should give it, explicitly (subagents share none of your
context):
1. The north star (verbatim or a faithful restatement).
2. The current iteration folder path (`docs/execution/iteration-NN-<slug>/`).
3. Which upstream files to read first (e.g. Masky needs `task.md` + `plan.md`; Pixie
   needs `PRD.md`, `architecture.md`, and the whole iteration folder).
4. What this call should produce, and where to write it.

Example dispatch for Ponta at the start of iteration 1:

```
Agent({
  subagent_type: "ponta",
  description: "Design iteration-01 architecture + tasks",
  run_in_background: false,
  prompt: "North star: <verbatim>. Nala just wrote
    docs/execution/iteration-01-<slug>/plan.md with tickets T1-T3 — read it. Also read
    docs/execution/architecture.md and every file under docs/execution/adr/ (create the
    former if absent, the latter is empty on iteration 1). Extend architecture.md and add
    any ADRs this iteration's tickets require, then write
    docs/execution/iteration-01-<slug>/task.md breaking T1-T3 into concrete developer
    tasks. Report back a short summary of what you wrote and any tickets you flagged as
    infeasible."
})
```

## Loop algorithm

You (the orchestrator) run this loop, dispatching one persona at a time and reading their
artifacts/report before deciding the next step:

```
loop:
  update docs/execution/README.md to reflect current phase/persona before each dispatch

  PLAN:
    dispatch nala  -> writes/extends PRD.md, writes iteration-NN/plan.md
                       (may itself call AskUserQuestion; if it reports a blocker, stop)
    dispatch ponta -> reads architecture.md + adr/, extends them, writes iteration-NN/task.md

  ACT:
    dispatch masky -> implements per task.md, EXECUTES all required DB scripts/migrations
                       against the real database, confirms the app runs, writes
                       execution-log.md with that evidence
                       (if it reports infeasible drift, route back to nala/ponta first)
                       do NOT advance to OBSERVE if execution-log.md lacks evidence that
                       DB scripts ran — re-dispatch masky instead

  OBSERVE:
    dispatch candy -> tests the REAL running application (no mocks); for API-facing work
                       generates a Postman collection under iteration-NN/qa/, executes it,
                       and maps every acceptance criterion to a passing request; writes
                       bug-report.md (the collection doubles as the user's validation
                       artifact)
      if bugs found -> dispatch masky again (ACT) for this iteration, then re-dispatch candy
    dispatch pixie -> audits against the north star, PRD.md/architecture.md, and the
                       constitution — verifies the result works as a testable application
                       (Candy's qa/ evidence + Masky's DB-script evidence) — writes audit.md
      if rejected -> dispatch the owning persona (nala/ponta/masky) to resolve the gap,
                     continue within this iteration (or open iteration-(NN+1) if the
                     rejection needs re-planning)
      if signed off and north star fully satisfied -> status = finished, stop
      if signed off but north star has remaining scope -> start iteration-(NN+1) at PLAN
```

Stop and mark `README.md` status `blocked` (with the open question recorded) only when a
persona genuinely cannot proceed without user input — otherwise keep the loop running
across iterations until Pixie signs off on the full north star.

## Finishing

When the north star is achieved: set `README.md` status to `finished`, write a short
closing summary in the iteration log table, and report to the user what was delivered,
pointing at `PRD.md`, `architecture.md`, the final iteration's `audit.md`, and the
`qa/` Postman collection (with its environment file) the user can import and run to
validate the delivered application themselves.
