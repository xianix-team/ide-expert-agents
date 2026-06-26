# IDF Agents Store

Agents built on the 99x Intent Delivery Framework for AI-DLC. They guide structured software delivery — from design through UAT, process health, and post-incident review.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Design Session** | `design-session` | Before the first unit is proposed in any mob elaboration — establishes API contracts, data models, and architectural patterns as binding constraints |
| **Bolt Risk Assessment** | `bolt-risk-assessment` | After elaboration sign-off, before the first unit in a bolt executes — assesses blast radius, sequencing risks, rollback, and feature flag requirements |
| **UAT** | `uat` | When all units under an intent are marked Done — generates a plain-language demo script and records the stakeholder validation outcome |
| **Root Cause Analysis** | `root-cause-analysis` | When an incident is resolved or recurring failures suggest a systemic issue — surfaces root causes across solution design, technology, and process |
| **Progress Digest** | `progress-digest` | At any point during delivery — generates a plain-language stakeholder update with no engineering jargon |
| **New Engineer Induction** | `new-engineer-induction` | When an engineer joins the project for the first time — explains the framework using the project's actual files and produces a personalised quick-reference card |
| **Process Health** | `process-health` | After every third or fourth bolt, or when the team suspects process drift — produces a quantitative health report across four metrics |
| **Dependency Audit** | `dependency-audit` | Monthly or when the scheduled audit date in the master rule file is reached — audits dependencies and converts findings into remediation backlog items |
| **Codebase Archaeology** | `codebase-archaeology` | Before onboarding AI-DLC into a mature project, before joining a new team, or as a standalone technical due diligence exercise — maps architecture, extracts coding patterns, audits for defects and technical debt, and classifies all identified work |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.

IDF agents require the 99x Intent Delivery Framework to be installed in the target project. The exception is `codebase-archaeology` and `dependency-audit`, which are fully standalone.
