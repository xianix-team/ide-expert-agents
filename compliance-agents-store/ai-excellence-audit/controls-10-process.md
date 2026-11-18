## Framework module: Process

- **Module ID:** process
- **Pillar group:** Govern
- **Applies when:** Always.
- **Intent:** AI changes how code is written - not who is accountable for it. Defined development lifecycle governing agent usage.
- **Controls:** 10 (1 Automatable, 6 Partial, 3 Manual); 7 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Engagement-level AI usage decision** - Before any AI tool touches customer code, confirm what the contract / SOW and customer policy allow. Record the decision (allowed tools, allowed data, restrictions) in the project wiki and in the repository rules. | Baseline | 4.1/4.2 · A.9.2 | Critical | Partial | Look in `AGENTS.md`/`CLAUDE.md`/README/`docs/` for an engagement-constraints section stating the customer's position on AI use, approved tools and data. The wiki/SOW record itself is outside the repo. |
| 2 | **Approved AI tool register** - Maintain a list of approved assistants, agents, models, MCP servers and plugins per project, with owner, data-retention terms, hosting region and licence. Anything not on the list is not used. | Baseline | A.4.4 · A.10.3 | High | Partial | Look for a register (e.g. `docs/ai/`, `AI-TOOLS.md`, rules-file section) with owner, retention terms, region, licence. Cross-check tools evidenced in the repo (MCP configs, CI actions, agent config folders) against it; an unlisted tool is a gap. The register should carry a last-reviewed date (the framework expects periodic review); none, or older than a year, is `Partial`. |
| 3 | **Human-in-the-loop checkpoints** - Humans define intent and acceptance criteria, approve the agent's plan for non-trivial work, and review and merge every change. Agents never merge to protected branches. | Baseline | A.6.1.3 · A.9.4 | High | Partial | Look for rules requiring plan approval for non-trivial work, CODEOWNERS, PR-triggered CI, and rulesets/branch protection as code. Flag any workflow or bot that merges or approves (`gh pr merge`, `--auto`, `event: APPROVE`). Live branch settings are not in the repo. |
| 4 | **Named accountability** - The developer who opens or approves the pull request owns the change, regardless of how much was generated. "The AI wrote it" is never an acceptable root cause. | Baseline | A.3.2 | Medium | Partial | Look for CODEOWNERS and a PR template where the author attests to having read and tested the change. Accountability in practice is organisational. |
| 5 | **Traceability of AI contribution** - Mark AI-assisted pull requests (label, commit trailer such as Assisted-by:, or PR template checkbox) so reviews, audits and incident analysis can see where AI was involved. | Baseline | A.6.2.8 · 7.5 | High | Automatable | Look for a PR-template AI section, a commit-trailer convention (`Assisted-by:`, `Co-Authored-By:`), label automation, or a commit-msg hook. Sample recent `git log` for trailers actually in use. |
| 6 | **Small, reviewable batches** - Keep agent tasks and pull requests small and focused. Large AI-generated diffs overwhelm reviewers and hide defects. | Baseline | A.6.2.4 | Low | Partial | Look for a rules/contributing line on PR size and a CI size check or labeller. Optionally sample recent merge sizes with `git log --shortstat`. |
| 7 | **Competence & onboarding** - Every engineer completes 99x AI-engineering onboarding (secure usage, data handling, prompt-injection awareness, reviewing AI output) before using agents on customer work. | Baseline | 7.2/7.3 · A.4.6 | High | Manual | Training completion is a people-record, not a repo artifact. Ask for evidence; at most note an onboarding doc exists. |
| 8 | **Spec-driven development** - For larger features, write a short spec (problem, constraints, acceptance criteria, non-goals) that both humans and agents work from. Store it with the code. | Advanced | A.6.2.2 | Low | Partial | Look for `specs/`, `docs/specs/`, `rfcs/`, `openspec/`, `.specify/` or a spec template; check that specs are referenced from rules or PR template. |
| 9 | **Measure impact, not just usage** - Track delivery metrics (lead time, change failure rate, rework, review time) alongside AI adoption, so the team can see whether AI is improving outcomes or just moving work downstream. | Advanced | 9.1 | Low | Manual | Delivery-metric dashboards (lead time, change failure rate, rework) live outside the repo. Ask for evidence. |
| 10 | **Retrospectives on AI use** - Include AI-related learnings in retros. Turn recurring problems into new rules, skills or guardrails. | Advanced | 10.1 | Low | Manual | Retro practice is organisational. Ask for evidence. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Unapproved or "shadow" AI tools** (high) - Customer code or data sent to tools with unknown retention, training use or hosting location; breach of contract and confidentiality.
- **No human accountability for merged code** (high) - Defects and vulnerabilities reach production with nobody who understands the change; slow incident response and loss of customer trust.
- **AI use not traceable** (med) - Cannot answer customer or auditor questions about how AI was used; cannot scope impact when a tool or model is found to be flawed.
- **Inconsistent ways of working** (med) - Quality depends on the individual; onboarding is slow; good practices don't spread across teams.
- **Untrained users of powerful agents** (high) - Unsafe approvals, prompt-injection exposure and over-trust in fluent but wrong output.
- **Large, unreviewable AI diffs** (med) - Rubber-stamp reviews; hidden defects; growing technical debt.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Can the team show where the customer's position on AI use is recorded?
- Is there a current list of approved AI tools, models and MCP servers for this project?
- Can you identify which recent pull requests were AI-assisted?
- Has every engineer on the team completed AI-engineering onboarding?
- Do agents have any path to merge or deploy without a human approval?
