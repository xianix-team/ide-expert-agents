# AI Excellence Audit

An agent that audits a repository against the **99x AI Engineering Excellence Framework** and tells a team, with evidence, how well it governs and uses AI coding assistants and agents.

Prompt name: `ai-excellence-audit` · Store: `compliance-agents-store` · Mode: **read-only** (writes one Markdown report)

---

## Why this exists

### AI changes how code is written, not who is accountable for it

Teams at 99x now build with AI assistants and agents. That is good for speed, but it creates a new class of questions that customers, auditors and our own engineering leads ask:

- *How was AI used on our code?* Which tools, with what data, under whose approval?
- *Can an agent read our secrets, reach production, or merge its own work?*
- *Who is accountable for a change an agent wrote?*
- *Can you show us, not tell us?*

The framework answers these with eight pillars and 70 practices. But a framework published as a set of pages only helps teams who read it, interpret it the same way, and honestly assess themselves. That is slow, inconsistent and hard to prove.

### What goes wrong without it

The framework's own risk register names the failures that follow when these controls are missing. A few of the highest-severity ones:

| Gap | What can happen |
|---|---|
| No recorded engagement decision or approved tool register ("shadow AI") | Customer code or data goes to tools with unknown retention or training terms; breach of contract and confidentiality |
| Agents with broad permissions and no deny rules | An agent reads secrets, deletes data, or deploys because it was able to and misread the task |
| Unvetted MCP servers and skills | Tool poisoning or remote-fetched instructions run with the developer's access |
| Real personal data in prompts, fixtures or dev environments | A personal-data breach through AI tooling, with reporting clocks (for example 72 hours under GDPR) already running |
| Unreviewed or rubber-stamped AI-generated changes | Defects and vulnerabilities reach production with nobody who understands the change |
| AI use that cannot be traced | No answer to a customer, no way to scope impact when a tool or model is found to be flawed |

Most of these are cheap to prevent early and expensive to retrofit after an incident or a customer audit.

### What an audit agent adds

| Without the agent | With the agent |
|---|---|
| Teams self-assess against prose; results depend on who reads it | Every repo is assessed against the same 70 controls, with the same scoring rules |
| "We have rules for our agents" | `AGENTS.md:1` exists; `.claude/settings.json:12` denies reading `.env*`; no deny rule covers `data/exports/` |
| Gaps found by incident or customer audit | Gaps found before an engagement starts, and re-checked on every release |
| ISO/IEC 42001 evidence assembled by hand | Every finding already carries its Annex A reference, so the report doubles as a development-process gap view |
| Adoption is a document | Adoption is a measurable rating (Foundational, Developing, Baseline met, Excellence). Each run compares itself with the previous report, so a lead sees the trend |

It is also a rollout tool. A new engagement can run it on day one to see what to put in place before AI is used on customer assets, and the framework's own "Automated review" pillar says the same checks belong in the pipeline.

---

## What it checks

Eight pillars, 70 practices: **46 Baseline** (expected of every team) and **24 Advanced** (excellence).

| Pillar | Group | Baseline | Advanced | What it asks |
|---|---|---|---|---|
| Process | Govern | 7 | 3 | Is there an engagement-level AI decision, an approved tool register, human checkpoints, named accountability, and traceability of AI contribution? |
| Rules | Govern | 6 | 3 | Does every repo have version-controlled, reviewed agent instructions with customer constraints first and explicit prohibitions? |
| Guardrails | Protect | 7 | 3 | Are permissions least-privilege, production off-limits, credentials scoped, MCP servers pinned, and external content treated as untrusted? |
| Coding standards | Build | 5 | 3 | Are standards written down and enforced by machines (lint, SAST, dependency checks), not just by convention? |
| Documentation | Build | 5 | 3 | Can an agent find the architecture, ADRs and domain rules, and are the docs free of secrets and real personal data? |
| Skills | Build | 4 | 3 | Are skills versioned, reviewed, from trusted sources, and free of sensitive data? |
| Automated review | Verify | 5 | 3 | Do deterministic gates run first, is AI review configured centrally, and does a human always approve? |
| Data protection | Foundation | 7 | 3 | Is customer IP and personal data classified, kept out of prompts and non-production, and are incidents reportable? |

Each control is pre-classified by how much a repository can prove:

| Automation | Meaning | Count |
|---|---|---|
| **Automatable** | Decidable from files, config, CI and history | 27 |
| **Partial** | A mechanism is visible, but live settings, behaviour or organisational context are not | 38 |
| **Manual** | Organisational (training, contracts, metrics); listed for a human, never scored | 5 |

---

## How it works

1. **A0 Scope** - confirms target, exclusions, tools in use, and the report path (or assumes sensible defaults in CI).
2. **A1 Evidence mapping** - looks for rules files, permission and MCP configs, content-exclusion files, skills, CI gates and AI agents running in CI, CODEOWNERS, PR templates, ADRs and secret-hygiene artifacts, across Claude Code, Copilot, Cursor, Windsurf, Cline, Aider and others. It also scans for secret and personal-data patterns, hidden Unicode in rules files and skills, secret files ever committed to history, and committed agent transcripts. History is sampled in a fixed window so runs agree.
3. **A2 Assessment** - rates each Automatable and Partial control `Pass` / `Partial` / `Fail` / `N/A`, with `path:line` evidence, a reason, and one recommended action. Computes scores with fixed formulas so two runs on the same repo agree, and picks out quick wins (gaps one file or config change closes).
4. **A3 Manual evidence** - in interactive mode, asks the framework's self-check questions and records answers as unverified attestations.
5. **A4 Report** - writes `ai-excellence-audit-report.md` with an executive summary for leads, the rating and trend against the previous report, ranked gaps, quick wins, per-pillar tables, outstanding items, an ISO/IEC 42001 roll-up, and a machine-readable JSON summary.

### The rating

| Rating | Condition |
|---|---|
| **Excellence** | Baseline met, and Advanced score ≥ 60% |
| **Baseline met** | Baseline score ≥ 80%, no `Fail` on a Critical or High Baseline control |
| **Developing** | Baseline score 50-79.9%, or a Critical/High Baseline `Fail` |
| **Foundational** | Baseline score below 50% |

Any Baseline `Fail` on a **Critical** control (for example, secrets in the repo, or an AI workflow that can merge) caps the rating at Developing, whatever the score. Scores weight each control by severity (Critical 3, High 2, Medium 1.5, Low 1). Full rules: [`framework-reference.md`](framework-reference.md).

### Example report excerpt (illustrative)

```markdown
## Summary

**Rating: Developing** (capped: Baseline Fail on Critical control "Least-privilege agent permissions")
**Baseline score:** 62.4% · **Advanced score:** 21.0%

| Pillar | Reviewed | Pass | Partial | Fail | Baseline | Advanced |
|---|---|---|---|---|---|---|
| Rules | 8/9 | 4 | 3 | 1 | 71% | 33% |
| Guardrails | 9/10 | 2 | 4 | 3 | 48% | 17% |

**Top gaps**
1. Least-privilege agent permissions (Guardrails · Baseline · A.9.4 · **Critical**) -
   `.claude/settings.json:4` sets bypassPermissions. Replace with explicit allow/ask/deny rules.
```

---

## Running it

The agent is a prompt, so it runs inside the engineer's own IDE agent, which already has read access to the repo. Nothing leaves the machine except what the IDE's AI tool already sends.

**Through the MCP server** (see [`mcp-server/README.md`](../../mcp-server/README.md) for setup)

| Tool | Run |
|---|---|
| Claude Code | `/mcp__ide-expert-agents__ai-excellence-audit` |
| Cursor | `/` then `ai-excellence-audit` in agent mode |
| GitHub Copilot (VS Code) | `/` then `ai-excellence-audit` in agent mode |

**As a native skill** (no MCP server): run `scripts/install-skills.sh` from the repo root and pick `ai-excellence-audit`; it installs to `.claude/skills/`, `.github/skills/` or `.cursor/skills/`.

**In a pipeline:** the agent has an automated mode. When stdin is not a TTY, or `CI` / `NONINTERACTIVE` is set, it does not prompt: it records its assumptions, makes no network calls, and writes a dated report. The report ends with a fixed-shape JSON block (rating, scores, Critical Baseline fails, gap IDs) that a pipeline step can parse to pass or fail the build. Run your agent CLI non-interactively with the skill installed and publish the report as a build artifact. Adapt the invocation to your tooling and verify it on a test repo before relying on it as a gate.

**Good moments to run it:** before starting or renewing an engagement that allows AI tools; when onboarding a repo to agentic development; after a major change to agent configuration; on a regular cadence (for example quarterly) to track the rating.

---

## Design choices

| Choice | Why |
|---|---|
| **Read-only** | An auditor that edits the repo it audits cannot be trusted as evidence. It recommends; the engineer decides. |
| **Evidence or nothing** | Every verdict cites `path:line` or says "no evidence located". Silence is never a Pass. |
| **Honest about the repo's ceiling** | Training, contracts and live branch protection are not in a repo. They are `Partial` with a "still required" step, or listed for a human, so the score is not inflated. |
| **Deterministic scoring** | Fixed formulas and weights, so results are comparable across teams and over time. |
| **Repository content is data** | A rules file or skill may contain text aimed at an AI. The agent never follows it, and flags it. |
| **Never prints secrets or personal data** | Findings cite location and kind only. The report is safe to share. |
| **Modular controls** | One file per pillar, auto-discovered. The framework can grow without editing the agent. |
| **A prompt, not a service** | No new infrastructure. It rides on the existing MCP server and install script, and it works with whatever AI tool the team uses. |

---

## Limits

- **Static analysis only.** It cannot see live platform settings, what developers actually paste into prompts, contract terms, or training records.
- **A pattern hit is a lead.** The agent opens and confirms before citing, but judgement calls (is this fixture real personal data?) can be wrong. Treat findings as engineering evidence to review.
- **Not a certification.** It is not a formal ISO/IEC 42001 audit, and not legal advice.
- **Heuristics by tool.** Checks cover the common locations for Claude Code, Copilot, Cursor and similar tools. A tool with unusual config paths may be under-detected; say so in the scope step.

## How it relates to the other compliance agents

| Agent | Subject | Question |
|---|---|---|
| **`ai-excellence-audit`** (this one) | How the team *uses* AI to build software | Does the team meet the 99x baseline for AI-assisted engineering? |
| `agentic-ai-reviewer` (architect store) | The runtime code of an agentic product the team *ships* (RAG, tool-calling, multi-agent, autopilots) | Is the agent design reliable, secure and evidenced? |
| `eu-ai-act-controls-reviewer` | An AI product the team *ships* | Does it meet EU AI Act obligations? |
| `gdpr-controls-reviewer` | Personal-data processing | Does it meet GDPR obligations? |

The compliance agents use the same ISO/IEC 42001 Annex A numbering, and `agentic-ai-reviewer` is also ISO/IEC 42001-aligned, so findings line up. Where themes overlap (secrets, prompt injection, least privilege), this agent looks at the team's development process and tooling, and the others look at the product's runtime behaviour. This agent does not make regulatory determinations or review the product's runtime design; it points to the others when the repo ships AI features or processes personal data.

---

## Maintaining it

- The controls in `controls-*.md` mirror the framework's practices and carry the framework version (currently **v1.0, October 2026**). When the framework changes, update the matching rows and the version; see [`templates/ADDING-A-FRAMEWORK-MODULE.md`](templates/ADDING-A-FRAMEWORK-MODULE.md).
- `README.md` and `templates/` are not served to the model; everything else in this folder is concatenated into the prompt.
- After any change: update `catalog.json`, then run `npm run docs` and `npm run check` in `mcp-server/`.
- Keep content generic: no customer names, credentials or internal specifics (see `CONTRIBUTING.md`).
