# Runbooks

A runbook coordinates several agents through a multi-stage workflow, such as taking a pre-sales opportunity from discovery to proposal.

The MCP server serves each runbook as a prompt, the same way it serves agents. When you run a runbook, it:

1. asks a few scoping questions (which engagement, and where its documents live);
2. looks for each stage's output file and checks that stage's gate (for example, open questions still unresolved);
3. prints a status table, then recommends one next agent to run, with a paste-ready answer block for that agent's opening questions.

A runbook can't run other agents, because MCP prompts can't call each other. You run each agent yourself, then run the runbook again for the next step. Runbooks are read-only: they never write files.

---

## Available runbooks

<!-- generated:runbooks:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Runbook | Prompt name | Coordinates | When to use |
|---|---|---|---|
| [**Data Platform Cycle**](data-platform-cycle.md) | `data-platform-cycle` | `repo-analyst`, `due-diligence`, `architecture-advisor`, `opportunity-scout`, `data-platform-developer`, `data-platform-validator`, `regression-monitor`, `context-keeper` | Coordinates one data-platform work cycle across the data-platform agents — repo-analyst → due-diligence → architecture-advisor → opportunity-scout → data-platform-developer ⇄ data-platform-validator → regression-monitor → context-keeper. Checks which reports exist and which ADR/OPP items are built and validated, then tells you which agent to run next and exactly what to answer its opening questions with. Read-only. Use when starting or resuming data-platform work, or when asked "what's next on the data platform" or "run the data-platform cycle". |
| [**Pre-Sales Pipeline**](presales-pipeline.md) | `presales-pipeline` | `discovery-interview`, `explore-agentic-ai-usecases`, `elaborate`, `estimate`, `proposal`, `casestudy-drafter` | Coordinates the pre-sales agents from first conversation to client proposal — discovery-interview → elaborate → estimate → proposal, with an optional agentic-AI entry point (explore-agentic-ai-usecases) and post-delivery case studies (casestudy-drafter). Checks which stage outputs already exist, then tells you which agent to run next and exactly what to answer its opening questions with. Read-only. Use when starting or resuming a pre-sales engagement, or when asked "what's next in pre-sales" or "run the pre-sales pipeline". |
| [**SEO/GEO Pipeline**](seo-geo-pipeline.md) | `seo-geo-pipeline` | `seo-auditor`, `geo-auditor`, `seo-implementer`, `content-seo-optimizer` | Coordinates an SEO and GEO improvement cycle across the seo-geo-agents-store agents — seo-auditor and geo-auditor (parallel audits) → seo-implementer (technical fixes) → content-seo-optimizer (content-level improvements). Checks which audit reports exist and which fixes have been applied, then tells you which agent to run next and exactly what to answer its opening questions with. Read-only. Use when starting or resuming an SEO/GEO improvement sprint, or when asked "what's next for SEO", "run the SEO pipeline", or "improve our search visibility". |
<!-- generated:runbooks:end -->

---

## Adding a runbook

1. Create `runbooks/<name>.md` with this frontmatter:

   ```yaml
   ---
   name: my-runbook            # the prompt name; must not clash with an agent's name
   title: My Runbook           # display name in the README tables
   description: What it coordinates and when to use it.
   agents:                     # every agent it coordinates, by prompt name
     - first-agent
     - second-agent
   ---
   ```

2. In the body, follow the pattern of the existing runbooks:
   - a boundary statement (read-only; never does a stage's work);
   - a stage table: agent, inputs, default output path, and the gate before moving on;
   - S0 scope questions, S1 state detection, and S2 report and recommend.

   Take each stage's inputs and default paths from that agent's own S0 questions, so the answer blocks match what the agent asks.
3. In `mcp-server/`, run `npm run docs`, then `npm run check`. The check fails if any agent listed under `agents` doesn't exist.

Runbooks are served from this folder only. `scripts/install-skills.sh` doesn't install them as skills.
