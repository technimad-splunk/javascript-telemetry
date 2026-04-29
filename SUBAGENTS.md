# Subagent setup

This repo defines four [Cursor subagents](https://cursor.com/docs/subagents) that together turn a high-level plan in `plans/` into verified code changes. They live in `.cursor/agents/` (project scope, checked in).

## Agents

| Agent          | File                              | Model     | Role                                                                                       |
| :------------- | :-------------------------------- | :-------- | :----------------------------------------------------------------------------------------- |
| `orchestrator` | `.cursor/agents/orchestrator.md`  | `inherit` | Coordinator. Runs planner → builder → verifier, forwards clarification questions, loops on FAIL. |
| `planner`      | `.cursor/agents/planner.md`       | `inherit` | Reads a plan, asks clarifying questions about high-impact assumptions, writes a detailed plan. Will not declare ready below 90% confidence. |
| `builder`      | `.cursor/agents/builder.md`       | `inherit` | Implements code from the detailed plan. Only subagent allowed to modify source. Hands off only when build/tests are green. |
| `verifier`     | `.cursor/agents/verifier.md`      | `fast`    | Skeptical, autonomous validator. Derives its own checks; uses MCP servers when needed; only asks for input if a verification truly cannot be done with available tools. |

## Workflow

```
plans/<base>.md  ──►  planner  ──►  plans/<base>.plan.md
                                           │
                                           ▼
                                       builder  ──►  source edits + plans/<base>.build.md
                                           │
                                           ▼
                                      verifier  ──►  plans/<base>.verify.md
                                           │
                              PASS ◄──────┴──────► FAIL → planner (with feedback) → loop
```

The orchestrator owns the sequencing, the clarification hand-offs to the user, and the loop cap (default 3 cycles).

## Hand-off contract

For every input plan `plans/<base>.md`, three sibling artifacts are produced — each owned by exactly one agent so there are no merge conflicts:

| File                       | Owner       | Purpose                                                                  |
| :------------------------- | :---------- | :----------------------------------------------------------------------- |
| `plans/<base>.plan.md`     | planner     | Goal, sequenced steps (with `Category` + `Why` per step), accepted assumptions, risks, success criteria, confidence. |
| `plans/<base>.build.md`    | builder     | Files changed, per-step status, deviations from the plan, build/test output. |
| `plans/<base>.verify.md`   | verifier    | Per-item PASS / FAIL / UNVERIFIED with evidence + concrete feedback for re-planning. |

The original `plans/<base>.md` is treated as immutable input. File-based hand-off is used because subagents start with a clean context and don't see prior conversation history — written artifacts are the only durable way to pass detail between cycles and to survive a chat clear.

## Documentation updates

`README.md` and any other user-facing docs are kept current as part of the workflow:

- The **planner** lists every required doc edit under a `Documentation impact` section in `plans/<base>.plan.md` (file path, section, one-line change description). If nothing user-facing changes, it explicitly writes `None required` with a justification.
- The **builder** treats each `Documentation impact` entry as a mandatory step and applies the README/docs edits in the same cycle as the code. It will not return `GREEN` while a doc step is unfinished.
- The **verifier** confirms each promised doc change is actually present in the diff. A missing or stale doc edit is a FAIL even if the code is correct.
- `CHANGELOG.md` is **not** part of `Documentation impact` — it has its own owner (see below).

## Changelog

The orchestrator maintains a project-wide [`CHANGELOG.md`](./CHANGELOG.md) at the repo root. Rules:

- Entries are appended **only** on a successful or partial run (verifier `STATUS: PASS`, or `FAIL` where some items genuinely passed). Failed cycles and mid-loop builds never produce changelog entries.
- Each PASSED plan item becomes one bullet, grouped under one of four categories:
  - **Bugfix** — fixes incorrect behaviour or a defect
  - **Enhancement** — new user-visible feature or capability
  - **Improvement** — performance, refactor, code quality, tooling, or other non-functional gain
  - **Other** — anything else (docs, infra, chore)
- The category is declared by the **planner** in `plans/<base>.plan.md` (one per step). The orchestrator just groups and writes; it does not re-categorize.
- Format per run:
  ```
  ## YYYY-MM-DD — plans/<base>.md (<passed>/<total> passed, <loops> loop(s))

  ### Bugfix
  - <one-sentence "Why" from the plan> — `<file:line>` (item: <plan item title>)
  ```
- Append-only. Prior dated sections are never rewritten or reordered.

## Git hygiene

The orchestrator is the only agent that runs state-changing git commands. Builder and verifier leave their work in the working tree so a FAIL is trivially rollbackable.

Defaults on a successful run (`PASS` or `PARTIAL`):

- **One commit per passed plan step**, staged from the builder's `Files changed → code` mapping. Subject uses Conventional Commits derived from the step's category:

  | Category      | Prefix      |
  | :------------ | :---------- |
  | `bugfix`      | `fix:`      |
  | `enhancement` | `feat:`     |
  | `improvement` | `refactor:` (or `perf:` when the step's `Why` mentions performance/latency/memory/throughput/battery) |
  | `other`       | `chore:`    |

  Body carries the step's `Why` sentence plus `Plan:` and `Verified-by:` trailers pointing at the plan and verify report.

- **One trailing `docs:` commit** with `CHANGELOG.md` and any README/docs files the builder edited.
- **Pre-flight safety**:
  - On `main` or `master`: stop and ask the user before committing (suggest a branch like `agent/<base>-YYYYMMDD`).
  - If staging would include a likely-secret path (`.env`, `*credentials*`, files containing common API-key prefixes or PEM private-key blocks): stop and ask.
- **Never** pushes, force-pushes, amends, rebases, skips hooks, or modifies git config. Pushing requires you to say so explicitly (e.g. "…and push").
- Set `commit_on_pass: false` when invoking the orchestrator to instead receive a ready-to-paste commit plan in the final report rather than have commits made automatically.

## Usage

Invoke the orchestrator with the path to one input plan:

```text
> /orchestrator implement plans/bug-fixes.md
```

You can also run a stage in isolation, e.g. just produce the detailed plan:

```text
> /planner draft a detailed plan for plans/improvements.md
```

The orchestrator will surface every clarifying question from the planner or verifier to you before continuing. After PASS or final FAIL it returns a short summary with paths to the three artifacts and how many loops were used.

## Design notes

- **Why a separate orchestrator.** Subagents return their result to whoever invoked them. Without a dedicated orchestrator, the main chat agent has to know the workflow rules (when to loop, when to stop, where artifacts live). Encoding this in `orchestrator.md` makes the workflow reusable from any chat.
- **Why ≥90% planner confidence.** The verifier loop is expensive (full build, tests, MCP queries). Forcing the planner to ask clarifying questions about high-impact assumptions up front trades a few seconds of dialogue for avoided rework.
- **Why `readonly: false` on planner & verifier.** Cursor's `readonly: true` blocks _all_ file edits and state-changing shell commands. The planner needs to write its plan file; the verifier needs to run `npm run build` and call MCP tools. The boundaries are enforced by each agent's prompt instead (e.g. the verifier may only fix formatter output and typos in its own report).
- **Why `fast` for the verifier.** Verification is high-volume and benefits from cheap iteration — running tsc, build, tests, and MCP queries doesn't need the same reasoning depth as drafting a plan.
- **MCP usage.** The verifier reads each MCP tool's descriptor JSON in `mcps/<server>/tools/` before calling and follows input schemas exactly, per the workspace MCP rules. If an MCP server is unavailable (e.g. errored `STATUS.md`) it records the gap and asks the user instead of silently passing.

## Tweaking

- Loop cap: pass `max_loops: <n>` when invoking the orchestrator.
- Model: edit the `model:` field in the relevant frontmatter.
- Restrict scope: a subagent's `description` field is what Cursor uses to decide automatic delegation — narrow it if the agent is being invoked outside its intended job.

See the [Cursor subagents docs](https://cursor.com/docs/subagents) for the full configuration reference.
