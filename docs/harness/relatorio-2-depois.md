# Better Harness Report: NoivaAI-depois

Full report from the Better Harness review run on 2026-10-03, after the fixes from the first review. It contains everything in the rendered report (`report.md` / `report.html`) plus the parts the renderer does not output: each finding's fix prompt, the evidence boundary with the analyzer's real numbers, what was not observed, and the candidates that were deferred.

## Review Scope

- Target: `C:\Users\gabri\VScode\NoivaAI` (git repo root, route `.`, no package member)
- Provider: Claude Code (`claude`)
- Depth: normal. Window 2026-09-03 to 2026-10-03, up to 5 evidence items per lane.
- Authority: project scope only. User-home, global configuration, Memory titles and bodies, and installed plugins were **not** included.
- Evidence bundle: `complete`, with all three lanes and the lead analyzer available. Warning: `missing-optional-root` (1 of 3 enabled session roots exists).
- Model: `agent-work-loop-v4`, report contract version 25
- Support track: **Operationalize (1 -> 60)**. The mechanisms now exist and are in the format Claude Code recognizes (rules import, permissions, PostToolUse hook, Skill, npm scripts), but the kept findings show they are not yet wired to a result: the test run checks nothing, a lint failure likely does not reach the agent, and the Skill does not measure the spec criterion.

## At a Glance

- Loop Effectiveness: 46/100. It changes only after comparable later task outcomes.
- Asset Health / Repair Progress: 0/100 (0 verified, 0 partial, 9 pending)
- Demonstrated autonomy radius: not observed
- Strongest loop: Not enough evidence difference to name one.
- Largest observed leak: Use the priority moves; no single loop is uniquely weakest.
- Top expected gain: No priority benefit is available in this evidence boundary.

### Overview

Agent rules load and the real commands work, but the checks behind "done" verify nothing yet: npm test passes with 0 tests, a post-edit lint failure likely never reaches the agent, and the mobile Skill does not measure the spec's 360 px criterion.

## What You Can Rely On Today

- No reliable user outcome has been demonstrated in this evidence boundary yet.
- `CLAUDE.md` imports `AGENTS.md` with `@AGENTS.md`, and the import resolves: both files were loaded into this review session's instructions.
- The commands documented in `AGENTS.md` match `package.json` and run: `npm run lint` exits 0 and `npm test` exits 0 (with 0 tests; see finding 1). No drift was found between the guidance and the real commands.
- `.claude/settings.json` now uses the Claude Code permissions schema (allow/ask/deny rule strings) and a PostToolUse hook with a valid `Edit|Write|MultiEdit` matcher. The deterministic asset lint and integrity scans report 0 findings.
- Spec 001 is concrete: RN-01 to RN-06, acceptance criteria CA-01 to CA-07 in Given/When/Then form with exact messages, and a measurable mobile-first constraint (360 px, no horizontal scroll).

## Five Lifecycle Dimensions

| Dimension | Score | Summary | Kept findings |
| --- | --- | --- | --- |
| Task Understanding | 64 | CLAUDE.md imports AGENTS.md and spec 001 is concrete, but the mobile Skill checks a proxy (Tailwind classes) instead of the spec's CA-06 criterion. | mobile-skill-ignores-ca06, mobile-skill-scope-and-rewrite |
| Controlled Execution | 58 | Install, lint, and test run as documented; the .env block and the install ask rule each cover only some commands, and a real .env exists at the root. | env-deny-list-incomplete, npm-install-aliases-skip-ask |
| Change Validation | 38 | There are no tests, ESLint applies one rule as a warning, and nothing stops the agent from finishing without seeing a failure. | npm-test-passes-with-no-tests, lint-hook-failure-hidden-from-agent, eslint-has-almost-no-rules, no-gate-before-done |
| Reliable Delivery | 35 | No CI exists in the repository; GitHub review and branch protection were not observed. git push requires confirmation. | none |
| Learning Capture | 36 | All 6 sessions in the window had no code changes, so neither repeated work nor the effect of the Skill or Hook can be judged. | no-change-episodes-in-window |

Scoring notes:
- Each score was set independently and not derived from the number of findings.
- Task Understanding reaches "Wired" for the rules (the import was confirmed loaded), but the mobile route points at the wrong criterion and no task episode exercised it.
- Controlled Execution: the lint and test commands were exercised by this review (both exit 0), but the permission boundary has open gaps, so the score stays below 60.
- Change Validation: the relevant check is effectively missing (0 tests, near-empty lint), so the dimension stays well below 59.
- Reliable Delivery: the real acceptance boundary (PR, CI, review) is absent in the repository and unobserved on GitHub. No high-risk action was observed. No finding is kept, because an inaccessible host stays unobserved rather than missing.
- Learning Capture is just above the 35 floor: the bounded review was completed, but with no exercised detector, no reusable intervention, and no later effect.

## Findings

### 1. npm test is green without testing any rule

- ID: `npm-test-passes-with-no-tests`
- Severity: **High**
- Dimension / check: Change Validation / Relevant Verification (`relevant-check`)
- Evidence: executed in this review. `npm test` printed `tests 0, pass 0, fail 0` and exited 0. The project lane reports `testFiles: 0`.
- Reason:
  - **Fact:** `npm test` (node --test) runs 0 tests, reports 0 failures, and exits 0; the repository has no test files. AGENTS.md ("Testa sempre") requires npm test before claiming done.
  - **Inference:** The agent can follow the rule to the letter and report green tests while nothing was verified. Spec 001 rules RN-01 to RN-05 and its exact messages can regress with no signal.
  - **Owner:** the test script in package.json plus a first test folder.
  - **Uncertainty:** none on the vacuous result; it was executed.
  - **Provider:** claude.
- Expected artifact: Test
- Expected output:
  1. npm test runs at least one test tied to a spec 001 criterion and fails when that rule breaks.
- Fix prompt:

```text
/better-harness fix this issue

`npm test` (node --test) passes with 0 tests. Make the check required by AGENTS.md prove something:

1. Read docs/specs/001-pesquisa-fornecedores.md and pick one pure validation rule that does not need Next.js, for example the City/UF validation in CA-05.
2. Create the smallest validation module in src/ and a test using the built-in runner (`node:test` + `node:assert`) covering the valid case and the "UF inválida" case with the exact spec message.
3. Make `npm test` fail when it finds no tests (for example, point the script at an explicit test-file pattern).
4. Do not install new dependencies.

## Validation

- `npm test` reports at least 1 test and passes
- Deliberately breaking the invalid-UF message makes `npm test` fail; revert the break afterwards
- `npm run lint` passes
```

### 2. A lint failure after an edit likely never reaches the agent

- ID: `lint-hook-failure-hidden-from-agent`
- Severity: **Medium**
- Dimension / check: Change Validation / Failure Diagnosis and Repair (`failure-repair`)
- Evidence: not observed at runtime. The configuration was read; the effect is inferred from Claude Code's documented hook exit-code semantics.
- Reason:
  - **Fact:** The PostToolUse hook in .claude/settings.json runs `npm run lint` after Edit/Write/MultiEdit; when ESLint finds errors it exits 1. Under Claude Code's documented hook semantics only exit code 2 feeds stderr back to the model; exit 1 is a non-blocking error shown only to the user.
  - **Inference:** The agent can introduce a lint error and move on to "done" without seeing it. The hook also lints the whole repository on every edit, including documentation edits.
  - **Owner:** the hook command in .claude/settings.json.
  - **Uncertainty:** not exercised in this window, because no session had edits. Both the Project and the Agent Customize lanes raised this independently.
  - **Provider:** claude.
- Expected artifact: Hook
- Expected output:
  1. An edit that breaks lint returns the ESLint message to the agent within the same session.
- Fix prompt:

```text
/better-harness fix this issue

The PostToolUse hook in .claude/settings.json runs `npm run lint`, but an ESLint failure exits 1, which Claude Code does not return to the agent. Change only that hook command so that, when lint fails, its output goes to stderr and the hook exits 2. Keep the Edit|Write|MultiEdit matcher and do not change permissions.

## Validation

- In a temporary file under src/, introduce a syntax error, make one edit, and confirm the agent receives the ESLint output on the next turn
- Delete the temporary file
- `npm run lint` and `npm test` pass on the final state
```

### 3. The mobile Skill does not check the spec's 360 px criterion

- ID: `mobile-skill-ignores-ca06`
- Severity: **Medium**
- Dimension / check: Task Understanding / Relevant Context (`relevant-context`)
- Evidence: static content, read in full (SKILL.md, CLAUDE.md, AGENTS.md, spec 001 CA-06 and section 8).
- Reason:
  - **Fact:** CLAUDE.md says to check the mobile-first rule "described in the spec constraints"; spec 001 makes it measurable (CA-06 and section 8: usable at 360 px width, no horizontal scroll). The verificar-mobile Skill never mentions 360 px, horizontal scroll, or docs/specs: it only looks for Tailwind prefixes (md:, lg:), and Tailwind is not installed yet (AGENTS.md).
  - **Inference:** The agent can pass the Skill and still violate CA-06.
  - **Owner:** steps 1 to 3 of SKILL.md.
  - **Uncertainty:** whether the Skill triggers in real tasks was not observed (it was loaded once in the sessions, with no linked change).
  - **Provider:** claude.
- Expected artifact: Skill
- Expected output:
  1. The mobile check cites and evaluates CA-06: 360 px width with no horizontal scroll.
- Fix prompt:

```text
/better-harness fix this issue

The Skill .claude/skills/verificar-mobile/SKILL.md checks Tailwind classes instead of the spec criterion. Edit only the Skill body so that it:

1. Tells the agent to read the "Restrições" section and acceptance criteria of the active spec in docs/specs/ (today: CA-06 and section 8 of spec 001: 360 px width, no horizontal scroll).
2. Asks for a short result: each element of the component, whether it fits in 360 px, and why (fixed widths, min-width, overflow).
3. Makes the Tailwind-prefix steps conditional on Tailwind being present in package.json.

Keep the Portuguese wording style of the file. Do not change the frontmatter description or any other file.

## Validation

- Apply the Skill to src/components/BotaoTeste.jsx and confirm the result cites the 360 px / no horizontal scroll criterion
- `npm run lint` and `npm test` pass
```

### 4. The real .env can be read by commands the deny list misses

- ID: `env-deny-list-incomplete`
- Severity: **Medium**
- Dimension / check: Controlled Execution / Permission Boundary (`permission-boundary`)
- Evidence: the configuration was read. The bypass was deliberately not exercised, and the `.env` content was not read.
- Reason:
  - **Fact:** A .env exists at the root (git-ignored, not read in this review). The deny rules in .claude/settings.json block the Read tool and only four shell commands (cat, type, more, Get-Content) on .env*. Other reads such as head, grep, sed, Select-String, or node -e with readFileSync match no pattern. Sessions show a request to read .env that ended in an execution failure rather than a permission denial, so the current protection leaves no clear audit signal.
  - **Inference:** With the planned keys (Supabase, OpenAI/Gemini), an accidental read could expose secrets.
  - **Owner:** the permissions block (or a guard hook) in .claude/settings.json.
  - **Uncertainty:** the bypass is inferred from prefix-matching semantics, not demonstrated.
  - **Provider:** claude.
- Expected artifact: Hook
- Expected output:
  1. Any shell command that tries to read a .env file is refused with a clear message and no content exposed.
- Fix prompt:

```text
/better-harness fix this issue

The .env protection in .claude/settings.json blocks only a few commands. Protect the file rather than individual commands:

1. Keep the existing Read(./.env) and Read(./.env.*) rules.
2. Add a PreToolUse hook with a Bash matcher that refuses (exit 2, reason on stderr) any command mentioning `.env`, without ever reading or printing the file.
3. Do not read or modify the real .env.

## Validation

- With a fake `.env.exemplo-teste` file created only for the test, confirm `head .env.exemplo-teste` is refused by the hook; delete the fake file afterwards
- `npm run lint` and `npm test` remain allowed and pass
```

### 5. Lint only fails on syntax errors

- ID: `eslint-has-almost-no-rules`
- Severity: **Medium**
- Dimension / check: Change Validation / Relevant Verification (`relevant-check`)
- Evidence: `eslint.config.mjs` read in full; `npm run lint` executed (exit 0).
- Reason:
  - **Fact:** eslint.config.mjs loads no recommended rules; its only rule is no-unused-vars as a warning, and `npm run lint` exits 0. Undefined variables, unreachable code, and common JSX mistakes pass.
  - **Inference:** AGENTS.md treats lint as part of the proof of "done", and docs/harness/evidencias.md describes it as a barrier against off-standard code, which overstates it today.
  - **Owner:** eslint.config.mjs.
  - **Uncertainty:** none on the rule coverage.
  - **Provider:** claude.
- Expected artifact: Config
- Expected output:
  1. npm run lint fails on common errors such as undefined variables, not only on syntax errors.
- Fix prompt:

```text
/better-harness fix this issue

eslint.config.mjs has only no-unused-vars as a warning. Enable ESLint 9's recommended rules (`@eslint/js` configs.recommended), keeping the current JSX options and ignores. If `@eslint/js` cannot be resolved without installing anything, stop and ask before any `npm install`.

## Validation

- `npm run lint` passes on the current code (fix only what the new rules flag in src/)
- A temporary file with an undefined variable makes `npm run lint` fail; remove it afterwards
- `npm test` passes
```

### 6. Nothing stops the agent from saying "done" with failing tests or lint

- ID: `no-gate-before-done`
- Severity: **Low**
- Dimension / check: Change Validation / Post-repair Revalidation (`validate-again`)
- Evidence: `.claude/settings.json` read (PostToolUse only, no Stop hook); `.github/` absent from the repository.
- Reason:
  - **Fact:** The rule "never say you are done without running npm test and npm run lint" exists only as text in AGENTS.md. .claude/settings.json has a PostToolUse lint hook but no Stop hook, and the repository has no .github/ or other CI.
  - **Inference:** Compliance depends on the agent remembering the rule. This gate only adds value once finding 1 (npm test with 0 tests) is fixed.
  - **Owner:** a Stop hook in .claude/settings.json.
  - **Uncertainty:** no session in this window had changes, so compliance was not observed.
  - **Provider:** claude.
- Expected artifact: Hook
- Expected output:
  1. A session does not end silently when npm test or npm run lint fail.
- Fix prompt:

```text
/better-harness fix this issue

The "Testa sempre" rule in AGENTS.md has no mechanism. Add a Stop hook in .claude/settings.json that runs `npm test` and `npm run lint` and, if either fails, writes the output to stderr and exits 2 so the agent sees the failure before finishing. Do not change existing hooks or permissions.

## Validation

- With a temporary failing test, confirm the agent receives the failure when trying to finish; remove the test afterwards
- On the final state, `npm test` and `npm run lint` pass and the Stop hook does not block
```

### 7. Installing packages with npm i or npx skips confirmation

- ID: `npm-install-aliases-skip-ask`
- Severity: **Low**
- Dimension / check: Controlled Execution / Permission Boundary (`permission-boundary`)
- Evidence: the ask list in `.claude/settings.json` was read. Not exercised.
- Reason:
  - **Fact:** .claude/settings.json asks for confirmation on `npm install:*`, but not on the aliases `npm i`, `npm add`, or `npx`, which also install or run packages.
  - **Inference:** The intent of the rule (no dependencies without a team decision, consistent with the "planned, not yet installed" stack in AGENTS.md) can be bypassed by accident.
  - **Owner:** the ask list in .claude/settings.json.
  - **Uncertainty:** other destructive commands (git reset --hard, git clean) are deferred for lack of impact evidence; see Deferred Candidates.
  - **Provider:** claude.
- Expected artifact: Config
- Expected output:
  1. Every way of installing or running npm packages asks for confirmation first.
- Fix prompt:

```text
/better-harness fix this issue

The ask rule in .claude/settings.json covers `npm install:*` but not equivalent aliases. Add `Bash(npm i:*)`, `Bash(npm add:*)`, and `Bash(npx:*)` to the ask list. Do not change the allow or deny lists.

## Validation

- .claude/settings.json is still valid JSON (for example `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'))"`)
- `npm run lint` and `npm test` remain allowed and pass
```

### 8. The mobile Skill rewrites components before asking and skips pages

- ID: `mobile-skill-scope-and-rewrite`
- Severity: **Low**
- Dimension / check: Task Understanding / Scope Boundary (`scope-boundary`)
- Evidence: static content of SKILL.md (description vs. body) and AGENTS.md (folder structure and principles).
- Reason:
  - **Fact:** The Skill description includes screens and layouts, but the body's "Quando usar" is limited to src/components/; pages under src/app/ (AGENTS.md) fall outside it once Next.js arrives. Step 3 rewrites the component and only step 4 asks whether the mobile behavior looks right.
  - **Inference:** This conflicts with the AGENTS.md principle "small steps: one change at a time and ask for feedback", and pages may skip the mobile check.
  - **Owner:** the "Quando usar" line and steps 3-4 of SKILL.md.
  - **Uncertainty:** whether the Skill triggers on page edits was not observed; no page exists yet.
  - **Provider:** claude.
- Expected artifact: Skill
- Expected output:
  1. The Skill covers components and pages and proposes changes before rewriting code.
- Fix prompt:

```text
/better-harness fix this issue

In .claude/skills/verificar-mobile/SKILL.md:

1. Widen the body's "Quando usar" to include src/app/, matching the description and the folder structure in AGENTS.md.
2. Swap steps 3 and 4: first show the proposed changes and ask, then rewrite.

Keep the Portuguese wording style. Do not change the frontmatter description or any other file.

## Validation

- Re-read SKILL.md and confirm src/app/ appears under "Quando usar" and the question comes before the rewrite
- `npm run lint` and `npm test` pass
```

### 9. No sessions with code changes yet to tell whether the Skill and Hook help

- ID: `no-change-episodes-in-window`
- Severity: **Low**
- Dimension / check: Learning Capture / Lifecycle Opportunity Detection (`lifecycle-repeat-detection`)
- Evidence: session facts envelope (`withChanges: 0`, `withReviewedRelevantCheck: 0`, flags `no-change-evidence` and `no-reviewed-relevant-check-evidence`).
- Reason:
  - **Fact:** All 6 sessions in the window had 0 code changes; no check was linked to a change, and repeated-work detection could not run (no comparable episodes).
  - **Inference:** It cannot be decided whether the verificar-mobile Skill, the lint Hook, or the "Testa sempre" rule work in real tasks. This is an evidence gap, not a defect.
  - **Owner:** the evidence log in docs/harness/evidencias.md.
  - **Uncertainty:** 5 of 9 Task Episodes were omitted as low-signal or without a request.
  - **Provider:** claude.
- Expected artifact: Document
- Expected output:
  1. A defined trigger and checklist for observing real use of the Skill, Hook, and tests in a later window.
- Fix prompt:

```text
/better-harness fix this issue

The review has no task with code changes to evaluate. In docs/harness/evidencias.md, add a short "Próxima observação" section stating: after at least two real tasks that change src/ (for example, the spec 001 form), rerun the harness review and record whether the lint Hook, the verificar-mobile Skill, and `npm test` were used and with what result. Keep the file's Portuguese. Do not create Skills, Hooks, or schedules.

## Validation

- The section exists in docs/harness/evidencias.md with the trigger (two tasks changing src/) and what to record
- `npm run lint` and `npm test` pass
```

## Agent Asset Coverage

Surfaces inspected (content opened): Rules, Skills, Hooks.

| Surface | Scope | Count | Paths | State |
| --- | --- | --- | --- | --- |
| Rules | Project | 1 | CLAUDE.md (imports AGENTS.md with `@AGENTS.md`) | Inspected; import confirmed loaded |
| Skills | Project | 1 | .claude/skills/verificar-mobile/SKILL.md | Inspected; listed and discoverable |
| Hooks | Project | 1 | .claude/settings.json (PostToolUse `Edit\|Write\|MultiEdit` → `npm run lint`) | Inspected |
| MCP | — | 0 | — | Not applicable (matches AGENTS.md: no MCP installed) |
| Commands | — | 0 | — | Not applicable |
| Custom Agents | Project | 0 | — | Not applicable |
| Plugins | — | 0 | — | Not applicable |
| Memory | — | — | — | Outside authority (not included) |

Deterministic asset lint: 0 errors, 0 warnings, 0 advisories, 0 missing references (1 entrypoint, 1 document).

Asset integrity: 0 findings. There is 1 active hook, with no duplicates, no fan-out, and no plugin or Memory collisions.

Note: neither scanner evaluates permission coverage or hook exit-code semantics. Their zero-finding results do not mean the permissions or the hook are sound; findings 2, 4, and 7 come from reading the content.

## Evidence and Boundaries

Note: the "Evidence and Boundaries" section of the rendered `report.md` shows "0 episodes / 0 sessions", and the dimension table there shows "Not observed yet" for every dimension. That happened because the renderer did not receive the analyzer's facts. The real numbers from the evidence bundle are below.

- Sessions: 6 eligible, 6 analyzed (all-eligible selection, no sampling). All 6 matched the workspace by direct cwd. Selection confidence: High; overall session confidence: low, because the population is small and no session had changes.
- Task Episodes: 9 projected, 4 admitted as candidates, 4 distinct requests, 4 candidates emitted. Omitted: 4 low-signal, 1 without a request, 0 duplicates. No candidate or check budget was exhausted.
- Population coverage: 0 with changes, 2 with checks, 0 with a reviewed relevant check, 2 with a result signal, 2 with assistant handoff, 0 with structured completion, 0 with user correction, 1 with execution friction, 0 with a friction consequence.
- Diagnostic flags: `no-change-evidence`, `no-reviewed-relevant-check-evidence`.
- Session-workspace match: preflight qualified 6 sessions by direct cwd; the hydration stage records 0 sessions (aggregate basis).
- Representative episodes:
  - "Create a test button and check it on mobile": the verificar-mobile Skill was loaded, then `npm test` and `npm run lint` passed in a no-change context. 0 edits, 0 files.
  - "Read the .env contents": 1 classified read, 1 execution failure, 0 permission denials, followed by an assistant handoff.
  - One episode is probably the Better Harness run itself (execute only, acceptance unobserved), although the self-analysis count is 0.
- Analyzer observations:
  - Validation command category observed: lint (2).
  - 1 edit event was observed with no later validation. The sample is too small (fewer than 5 edits) for a post-edit finding.
  - Friction category observed: `permission-rejection` (17). This is an aggregated lead; the sessions behind it were not opened. It does not agree with the facts envelope (0 permission denials in the admitted candidates), because the two use different populations.
  - Most-used tool: Bash (5).
  - None of the 6 sessions met the active-long threshold (about 9.5 active minutes in total). Model: claude-opus-5-5 (10 responses).
- Repository: 12 commits, all on one day (history span 0 days, confidence medium). 19 tracked files, 2 source files (`eslint.config.mjs`, `src/components/BotaoTeste.jsx`), 0 test files, no framework detected, 1 core candidate with low confidence.
- Current change: 4 untracked documentation files in `docs/harness/`; no core hits and no change-drift findings.
- Executed in this review: `npm run lint` → exit 0; `npm test` → `tests 0`, exit 0. Local Node: v24.19.0.
- Regression-test evidence: scanned-empty (12 commits inspected, 0 source/test co-change candidates).
- Sensitive-config scan: complete (2 of 2 files, 0 errors).
- Learning Capture coverage:
  - Asset Coverage = checked-clean
  - Capture = not evaluable (missing normalized events)
  - Pattern Detection = insufficient recurrence
  - Routing = not evaluable (missing invocation events)
  - Freshness = not evaluable
  - Application = not evaluable
  - Evolution = not evaluable
  - Effectiveness = pending (no later window)
  - Memory Governance = checked-clean
- Workflow demand: 0 current handoffs and 0 repeated candidates. Repeated-workflow discovery was unavailable (no request roots in the envelope), not empty.
- Delivery evidence: none observed. Intervention history: none observed.

## What Was Not Observed

These points stay outside the evidence boundary. They must not be presented as conclusions.

**Use and effect of the assets**
- Whether the `verificar-mobile` Skill works or fails. It was loaded once, and its result was not observed.
- Whether the Skill triggers automatically on edits under `src/components/` or `src/app/`.
- Whether the PostToolUse lint hook ever fired, or whether its output reached the agent. No session had an Edit or Write.
- Whether the AGENTS.md rules are followed. Only their loading is confirmed.
- That the zero-finding lint and integrity scans mean the permissions or the hook are sound. Those scanners do not check permission coverage or hook exit codes.

**Secrets and permissions**
- Whether `.env` was read, exposed, or protected. Its content was deliberately not read.
- Whether the deny list can actually be bypassed with `head`, `grep`, `node -e`, and similar commands. This was inferred from the patterns and not tested.
- Whether the `.env` read request in the sessions failed because of a control, because of a missing file, or for another reason.
- What is behind the 17 aggregated `permission-rejection` events. The sessions were not opened.
- Whether any destructive command (`git reset --hard`, `git clean`, `rm -rf`) or outward network call was ever run.

**Product, validation, and delivery**
- Whether the UI meets the mobile-first rule or CA-06. There is no running app, and Tailwind is not installed.
- Whether the test button was created, refused, or accepted by the user.
- Remote CI, branch protection, PRs, or reviews on the GitHub remote.
- Runtime or UI behavior and AI-debugging observability. There is no executable app path, so this is unavailable rather than a gap.
- Untracked or local settings (for example `.claude/settings.local.json`) and user-level settings. They were outside authority.

**Sessions**
- The 4 low-signal episodes and the 1 episode without a request. They were omitted, not shown to have zero relevant activity.
- Any repeated workflow or procedure demand. There are not 2 or more distinct, comparable Episodes.
- Whether zero corrections means the harness works well. Missing data means unavailable evidence, not smooth operation.

**Learning and history**
- Anything about Memory or Learning Capture effectiveness. It was not authorized, and no exists → retrieved → applied chain was observed.
- Any hotspot or long-term churn conclusion. All 12 commits are from a single day.
- The untracked `relatorio-1-antes.*` and `achado-e-reparo.md` files. They were excluded from the project lane because they are derived from a previous report.

## Deferred Candidates (not promoted to findings)

| Candidate | Origin | Reason for not promoting |
| --- | --- | --- |
| The mobile check closed without an observed change and without a mobile-specific check | Sessions | Single episode with 0 edits; the facts do not show whether the button was refused, deferred, or created elsewhere. The Skill's missing criterion is covered by finding 3. |
| The validation loop was never exercised on a change, and the post-edit hook stayed unobserved | Sessions | Coverage gap, not a defect. Covered by finding 9 as an evidence gap. |
| Selection and hydration blind spots (hydration 0, 5 of 9 episodes omitted, probable self-analysis episode) | Sessions | Collector scope limit. Kept in the evidence boundary above. |
| Destructive or outward commands are unguarded (`git reset --hard`, `git clean`, `rm -rf`, `curl`, `gh pr create`) | Agent Customize | Theoretical risk with no observed impact. Only the install-alias gap, which bypasses an explicit existing rule, was promoted (finding 7). |
| The lint hook runs on the whole repository on every edit, including docs | Agent Customize | Cost grows with src/, but no slowdown was observed. Merged into the reason of finding 2. |
| No skill trigger is enforced by a hook for edits under src/components/ | Agent Customize | Skill activation is model-driven by design; no missed trigger was observed. Partly covered by finding 8. |
| Node version only declared in AGENTS.md (no `engines`, no `.nvmrc`) | Project | Low value now; no startup failure was observed. |
| No spec → feature → test index | Project | Covered by finding 1 (first spec-mapped test). |
| No CI or branch protection | Project | The GitHub boundary was not observed, so it stays unobserved rather than missing. The local gate is covered by finding 6. |

## Report Files

- Rendered report: `report.html` in the session scratchpad run directory (`bh-report`), validated with `status: pass` (9 findings, self-contained HTML).
- Rendered Markdown: `report.md` in the same run directory.
- Source data: `findings.json` in the same run directory.
- The run directory is temporary and outside the repository. This file is the durable copy of the full report.
