# Better Harness Report: NoivaAI-antes

Full report from the Better Harness review run on 2026-10-03. It contains everything in the rendered report (`report.md` / `report.html`) plus the parts the renderer does not output: each finding's fix prompt, the evidence boundary with the analyzer's real numbers, what was not observed, and the candidates that were deferred.

## Review Scope

- Target: `C:\Users\gabri\VScode\NoivaAI-antes` (git repo root, route `.`, no package member)
- Provider: Claude Code (`claude`)
- Depth: normal. Window 2026-09-03 to 2026-10-03, up to 5 evidence items per lane.
- Authority: project scope only. User-home, global configuration, Memory titles and bodies, and installed plugins were **not** included.
- Evidence bundle: `complete`, with all three lanes and the lead analyzer available. Warning: `missing-optional-root` (1 of 3 enabled session roots exists).
- Model: `agent-work-loop-v4`, report contract version 25
- Support track: **Bootstrap (0 -> 1)**. The kept findings show that the basic validation and risk routes (permissions, hook, test commands) are not working yet.

## At a Glance

- Loop Effectiveness: 37/100. It changes only after comparable later task outcomes.
- Asset Health / Repair Progress: 0/100 (0 verified, 0 partial, 6 pending)
- Demonstrated autonomy radius: not observed
- Strongest loop: Not enough evidence difference to name one.
- Largest observed leak: Use the priority moves; no single loop is uniquely weakest.
- Top expected gain: No priority benefit is available in this evidence boundary.

### Overview

Spec 001 is concrete and testable, but the Claude Code controls are written in a format Claude Code does not recognize. The secret-file protections and the post-edit lint are likely inactive, and the AGENTS.md rules are not loaded automatically. No product-development session was observed, so the real effect of the rules, Skill, and Hook remains unobserved.

## What You Can Rely On Today

- No reliable user outcome has been demonstrated in this evidence boundary yet.
- Strongest capability seen in the static evidence: Spec 001 is close to test-ready. It has scope and out-of-scope, data, RN-01..RN-04, an examples table, CA-01..CA-03 in Given/When/Then form, the mobile-first constraint, and a decision log. Each RN and CA is concrete and observable (exact messages, button state, red border).
- The instruction layering is small and simple: CLAUDE.md at the root points to AGENTS.md. The intent to protect secrets and the rule "verify before declaring done" are already written down.

## Five Lifecycle Dimensions

| Dimension | Score | Summary | Kept findings |
| --- | --- | --- | --- |
| Task Understanding | 55 | Spec 001 has clear rules, examples, and acceptance criteria. But CLAUDE.md only points to AGENTS.md in prose, so the stack, the commands, and the read-specs-first rule depend on the agent choosing to open it. | claude-md-agents-import |
| Controlled Execution | 30 | The permission rules do not follow the Claude Code schema, so the read denies for .env and *.secret are likely not enforced. The documented npm commands cannot run without a package.json. | settings-permissions-schema, agents-md-unrunnable-commands, mobile-skill-routing |
| Change Validation | 25 | No runnable check exists: there are no tests or lint config, the post-edit lint Hook is malformed, and the one observed change closed without a check. | settings-hook-schema, agents-md-unrunnable-commands |
| Reliable Delivery | 40 | No acceptance boundary (PR, CI, review) and no high-risk action was observed. Recovery is plain git, and acceptance remains unobserved. | none |
| Learning Capture | 35 | All three sessions in the window were tooling setup, none product work. So there is no comparable repeated work and no evidence that the Skill or the rules were used. | no-product-session-evidence |

Scoring notes:
- Each score was set independently and not derived from the number of findings.
- Every dimension has at best "Present" evidence, or "Missing"/"Unobserved". No task episode exercised any mechanism, so no score can go above 59 for the first four dimensions.
- Learning Capture is at the 35 floor: the bounded review was completed, but with no exercised detector, no reusable intervention, and no later effect.

## Findings

### 1. Reads of .env and *.secret are likely not blocked

- ID: `settings-permissions-schema`
- Severity: **High**
- Dimension / check: Controlled Execution / Permission Boundary (`permission-boundary`)
- Evidence: not observed at runtime. This is a present defect found by reading the active configuration.
- Reason:
  - **Fact:** In `.claude/settings.json`, `permissions` is a list of `{tool, args, path, action}` objects with tool names like `bash` and `read_file`. Claude Code expects an object of allow/ask/deny rule strings, such as `Read(./.env)`.
  - **Inference:** The repository's only secret protections, and the lint/test allowlist, exist on paper only.
  - **Owner:** `.claude/settings.json` (project).
  - **Uncertainty:** This was established by reading the file. How Claude Code handles the file at runtime was not observed.
  - **Provider:** claude.
- Expected artifact: `.claude/settings.json`
- Expected output:
  1. Project permissions in the allow/deny format Claude Code recognizes, with the read denies for .env and *.secret visible in /permissions.
- Fix prompt:

```text
/better-harness fix this issue

Rewrite the 'permissions' block of .claude/settings.json in the Claude Code schema, keeping the same intent: allow Bash(npm run lint) and Bash(npm test); deny Read(./.env) and Read(./**/*.secret). Do not touch user or global settings.

## Validation

- Open /permissions in Claude Code and confirm the deny and allow rules appear as project rules
- Confirm /doctor reports no validation errors for .claude/settings.json
```

### 2. The configured post-edit lint never runs after Edit or Write

- ID: `settings-hook-schema`
- Severity: **Medium**
- Dimension / check: Change Validation / Relevant Verification (`relevant-check`)
- Evidence: not observed at runtime. This is a present defect found by reading the active configuration.
- Reason:
  - **Fact:** `hooks.PostToolUse` is written as an object keyed by tool (`Edit`, `Write`) with lists of strings. Claude Code expects a list of `{matcher, hooks:[{type:'command', command}]}`. The asset lint reads the block as a match-all, synchronous matcher.
  - **Inference:** The automatic lint feedback the team intended does not exist. If the hook were fixed as written, it would fail on every edit, because there is no package.json.
  - **Owner:** `.claude/settings.json`.
  - **Uncertainty:** Runtime handling was not observed.
- Expected artifact: `.claude/settings.json`
- Expected output:
  1. A recognized PostToolUse hook limited to Edit|Write that does not fail while the project has no package.json.
- Fix prompt:

```text
/better-harness fix this issue

Rewrite hooks.PostToolUse in .claude/settings.json as one entry with matcher 'Edit|Write' and a command-type hook. Until a package.json with a 'lint' script exists, the command must exit cleanly when that script is missing, or the hook stays disabled with a note explaining why. Do not create package.json in this fix.

## Validation

- Open /hooks in Claude Code and confirm a PostToolUse entry with matcher Edit|Write is listed
- Edit a scratch file and confirm the hook runs without blocking the session
```

### 3. AGENTS.md rules are not loaded automatically into Claude Code sessions

- ID: `claude-md-agents-import`
- Severity: **Medium**
- Dimension / check: Task Understanding / Relevant Context (`relevant-context`)
- Evidence: observed in this review session. The project context loaded automatically contained only CLAUDE.md.
- Reason:
  - **Fact:** CLAUDE.md says, in prose, to import and follow AGENTS.md ("Importa e segue todas as regras definidas no ficheiro `AGENTS.md`"). It has no `@AGENTS.md` import line. In this review session, the loaded project context contained only CLAUDE.md.
  - **Inference:** The stack, commands, folders, and the read-specs-first and always-test principles reach the agent only if it chooses to open the file.
  - **Owner:** `CLAUDE.md`.
  - **Uncertainty:** The effect on real product tasks was not observed.
- Expected artifact: `CLAUDE.md`
- Expected output:
  1. A CLAUDE.md that loads AGENTS.md through `@AGENTS.md` while keeping the role and mobile-first rules.
- Fix prompt:

```text
/better-harness fix this issue

In CLAUDE.md, replace the prose import sentence with an @AGENTS.md import line. Keep the two additional rules already there and do not duplicate AGENTS.md content.

## Validation

- Start a new session and run /memory to confirm AGENTS.md is listed as loaded
- Without opening files, ask the agent for the lint command and confirm it answers npm run lint
```

### 4. The always-test-before-done rule cannot be satisfied in the current repo

- ID: `agents-md-unrunnable-commands`
- Severity: **Medium**
- Dimension / check: Controlled Execution, Change Validation / Reproducible Startup (`instruction-led-start`)
- Evidence: the instruction contradicts the current state of the repository, which was inspected.
- Reason:
  - **Fact:** AGENTS.md declares `npm install`, `npm run dev`, `npm test` and `npm run lint`. It forbids claiming completion without running `npm test` or `npm run lint`. There is no package.json, `src/`, test, or lint config, and the only change observed in the window ended without a check.
  - **Inference:** An agent following the rule either fails, or declares the work done without real verification. The "or" also lets lint alone count as proof.
  - **Owner:** `AGENTS.md`.
  - **Uncertainty:** The repository is deliberately at a specs-only stage. The defect is that the instruction contradicts the current state, not that code is missing.
- Expected artifact: `AGENTS.md`
- Expected output:
  1. Commands and completion rule in AGENTS.md that match both the current state of the repository and its state after scaffolding.
- Fix prompt:

```text
/better-harness fix this issue

In AGENTS.md, mark the 'Comandos Principais' section as applying once the Next.js project is scaffolded. Add a current-phase rule: while no package.json exists, verifying a change to docs/specs or .claude means reviewing the diff and confirming it does not contradict the specs. Change 'npm test ou npm run lint' to require both npm run lint and npm test. Do not create package.json or scaffolding in this fix.

## Validation

- Read AGENTS.md and confirm every referenced command exists or is clearly marked as future
- Confirm the completion rule requires both lint and tests
```

### 5. The mobile-first check the spec requires is unlikely to trigger

- ID: `mobile-skill-routing`
- Severity: **Low**
- Dimension / check: Controlled Execution / Supported Operation (`supported-operation`)
- Evidence: governing requirement (Spec 001 §8) plus the asset lint warnings `skill-missing-description` and `skill-name-mismatch`.
- Reason:
  - **Fact:**
    - Spec 001 section 8 makes mobile-first mandatory, and CLAUDE.md asks for the check whenever a visual component changes.
    - The verificar-mobile Skill has no frontmatter `name` or `description`. Claude Code therefore lists only its heading, and the "Quando usar" triggers stay in the body.
    - CLAUDE.md does not name the Skill.
    - Step 3 rewrites the component before asking the team, which goes against the "small steps, ask for feedback" rule.
    - The check is a static scan of Tailwind classes and does not render at phone width.
  - **Inference:** Whether the check happens depends on the agent remembering it.
  - **Uncertainty:** No components exist yet, and actual triggering was not observed.
- Expected artifact: `.claude/skills/verificar-mobile/SKILL.md`
- Expected output:
  1. A Skill with frontmatter `name` and `description`, a rewrite step that asks for confirmation first, and an explicit reference in CLAUDE.md.
- Fix prompt:

```text
/better-harness fix this issue

Add YAML frontmatter to .claude/skills/verificar-mobile/SKILL.md with name: verificar-mobile and a description stating when to use it (creating or editing files in src/components/, or requests to check how it looks on a phone). Change step 3 to propose changes and wait for confirmation before rewriting. In CLAUDE.md, name the verificar-mobile Skill in the mobile-first rule.

## Validation

- Start a new session and confirm the Skill list shows the new description
- Ask to check whether a component looks good on a phone and confirm the Skill is selected
```

### 6. It is not yet possible to tell whether the rules, Skill, and Hook help real work

- ID: `no-product-session-evidence`
- Severity: **Low**
- Dimension / check: Learning Capture / Lifecycle Opportunity Detection (`lifecycle-repeat-detection`)
- Evidence: an evidence gap, not a project defect.
- Reason:
  - **Fact:** The 3 eligible sessions in the 30-day window (5 Task Episodes, 4 distinct requests) were Claude Code and tooling setup, with no Noiva.AI product task, no checks, and no comparable repeated Episodes.
  - **Inference:** This observation boundary blocks any decision on whether there is repeated work or the window is clean.
  - **Owner:** the next review cycle.
  - **Uncertainty:** This is an evidence gap, not a project defect.
- Expected artifact: Better Harness review
- Expected output:
  1. A review window with real product Task Episodes, so the use and effect of the rules, Skill, and Hook can be judged.
- Fix prompt:

```text
/better-harness fix this issue

After fixing settings.json and the AGENTS.md import, run at least two real Spec 001 tasks in this workspace with Claude Code (for example the form and the RN-01 to RN-04 validations), then rerun the Better Harness review to compare use of the verificar-mobile Skill and checks.

## Validation

- Confirm the new review finds at least two product-development Task Episodes
- Confirm whether the verificar-mobile Skill and the Hook appear as used in those Episodes
```

## Agent Asset Coverage

Surfaces inspected (content opened): Rules, Skills, Hooks.

| Surface | Scope | Count | Paths | State |
| --- | --- | --- | --- | --- |
| Rules | Project | 1 | CLAUDE.md (points to AGENTS.md) | Inspected |
| Skills | Project | 1 | .claude/skills/verificar-mobile/SKILL.md | Inspected |
| Hooks | Project | 1 | .claude/settings.json | Inspected (outside the expected schema) |
| MCP | — | 0 | — | Not applicable |
| Commands | — | 0 | — | Not applicable |
| Custom Agents | — | 0 | — | Not applicable |
| Plugins | — | 0 | — | Not applicable |
| Memory | — | — | — | Outside authority (not included) |

Deterministic asset lint: 0 errors, 2 warnings, 1 advisory.
- `hook-broad-high-frequency-matcher` (warning): the PostToolUse hook is synchronous and matches all tools. This is probably an artifact of the parser finding no `matcher` field; see finding 2.
- `skill-missing-description` (warning): verificar-mobile does not declare a description in its frontmatter.
- `skill-name-mismatch` (advisory): the name declared in the heading ("Skill: Verificar Responsividade Mobile (Noiva.AI)") differs from the folder name (`verificar-mobile`).

Asset integrity: 0 findings. There is 1 active hook, with no duplicates, no fan-out, and no plugin or Memory collisions.

## Evidence and Boundaries

Note: the "Evidence and Boundaries" section of the rendered `report.md` shows "0 episodes / 0 sessions". That happened because the renderer did not receive the analyzer's facts. The real numbers from the evidence bundle are below.

- Sessions: 3 eligible, 3 analyzed (all-eligible selection, no sampling). All 3 matched the workspace by direct cwd. Confidence: low, because of the small population.
- Task Episodes: 5 admitted, 4 distinct requests, 4 candidates emitted, 1 duplicate discarded.
- Population coverage: 1 with changes, 0 with checks, 0 with a reviewed relevant check, 2 with a result signal, 2 with assistant handoff, 0 with structured completion, 0 with user correction, 0 with execution friction.
- Diagnostic flag: `no-reviewed-relevant-check-evidence`.
- Analyzer observations:
  - No validation command category was observed in the analyzed sample.
  - 1 edit event was observed with no later validation. The sample is too small (fewer than 5 edits) for a post-edit finding.
  - Friction category observed: `permission-rejection` (12). This is an aggregated lead; the sessions behind it were not opened.
  - Most-used tool: Bash (7).
  - 1 long session by wall time, but none met the active-long threshold (the span was mostly idle or resumed work).
- Repository: 8 commits, all on one day. 0 source files, 0 tests, no core candidates. Commit history confidence: low.
- Regression-test evidence: scanned-empty (8 commits inspected, 0 source/test co-change candidates).
- Sensitive-config scan: complete (1 of 1 file, 0 errors).
- Learning Capture coverage:
  - Asset Coverage = checked-clean
  - Capture = not evaluable (missing normalized events)
  - Pattern Detection = insufficient episodes
  - Routing = not evaluable (missing invocation events)
  - Freshness = not evaluable
  - Application = not evaluable
  - Evolution = not evaluable
  - Effectiveness = pending (no later window)
  - Memory Governance = checked-clean
- Delivery evidence: none observed. Intervention history: none observed.

## What Was Not Observed

These points stay outside the evidence boundary. They must not be presented as conclusions.

**Use and effect of the assets**
- Whether the `verificar-mobile` Skill, the AGENTS.md/CLAUDE.md rules, or the configured hook were ever used, ignored, effective, or ineffective. There is no evidence of invocation, retrieval, or outcome.
- Whether the Skill is triggered automatically. Discoverability is uncertain, not proven absent.
- How Claude Code actually treats `.claude/settings.json` at runtime: rejected, partly applied, or ignored. The schema mismatch was inferred statically and was not observed.
- Whether the hook really matches all tools at runtime.
- Whether any secret was exposed. All that can be said is that the deny rules are likely not enforced.

**Product, validation, and delivery**
- Any test, lint, hook, or CI passing, failing, or running. There is no test, runtime, or log.
- Any violation of the mobile-first rule. No UI code exists.
- Remote CI, branch protection, PRs, or reviews on the GitHub remote.
- Untracked or local settings (for example `.claude/settings.local.json`) and user-level settings. They were outside authority.

**Sessions**
- Whether the settings fix in session E2 was correct, accepted, or harmful.
- Whether the Node installation in session E3 succeeded (only a handoff was observed).
- Any repeated workflow or procedure demand. There are not 2 or more distinct, comparable Episodes.
- Whether zero friction and zero corrections mean the harness is working well. Missing data means unavailable evidence, not smooth operation.

**Learning and history**
- Anything about Memory or Learning Capture. It was not authorized, and no chain was observed.
- Any hotspot or core-risk conclusion drawn from churn. The 8 commits are all docs and config, from a single day.
- Any severity derived only from asset counts.

## Deferred Candidates (not promoted to findings)

| Candidate | Origin | Reason for not promoting |
| --- | --- | --- |
| The one change observed (E2) ended without a check | Sessions | Sample of 1 edit is too small for a post-edit finding; absorbed into the evidence of finding 4. |
| The user repeats safety-confirmation rules in the prompt instead of relying on harness controls (E2/E4) | Sessions | E2 and E4 are probably the same goal, so this is not repeated demand. It is related to finding 1, but there is no separate consequence. |
| Node runtime dependency surfaced in the middle of the task (E1 → E3) | Sessions | Self-referential to this review run, and the outcome was not observed. It says nothing about the project harness. |
| The spec's acceptance criteria have no route to tests or to a merge decision | Project | Prospective: no code exists yet. This stays as a lead for when implementation starts. |
| The Context Map points to `src/components/`, `src/app/` and an undecided AI provider (OpenAI/Gemini) | Project | Planned structure is normal before scaffolding, and no consequence was observed. Partly covered by finding 4. |
| The mobile check is a static scan of classes, not rendering | Project | Merged into finding 5 (same owner and same repair route). |
| Hook that matches all tools (lint warning) | Agent Customize | Merged into finding 2. The real cause is the malformed schema, not the scope of the matcher. |

## Report Files

- Rendered report: `.claude/better-harness/2026-10-03-review/report.html`
- Rendered Markdown: `.claude/better-harness/2026-10-03-review/report.md`
- Source data: `.claude/better-harness/2026-10-03-review/findings.json`
