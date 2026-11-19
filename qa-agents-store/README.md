# QA Agents Store

Agents for testing and quality assurance.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **OWASP Security Scanner** | `owasp-security-scanner` | High | Medium | When you want a static code scan against OWASP Top 10 (2025) and/or OWASP Top 25 Parameters, with the latest standards fetched live from owasp.org. You choose which scan(s) to run; the agent reports severity-ranked findings with evidence — it does not edit code |
| **Black-Box Testing** | `black-box-testing` | High | Low | When you want to design and execute functional tests against a live web app without source access — equivalence partitioning, boundary value analysis, decision tables, state transition, pairwise, and negative testing — then run them through Playwright |
| **White-Box Testing** | `white-box-testing` | High | Low | When you can run the code and want coverage-driven structural tests — statement/branch/condition/MC-DC, basis path, data flow, loop, and mutation testing — to improve coverage or assess an existing suite |
| **UI/UX & Accessibility Testing** | `ui-ux-accessibility-testing` | High | Medium | When you want a design-parity audit against a design spec and/or a WCAG 2.2 AA accessibility audit (axe-core + Lighthouse + manual passes), producing a self-contained HTML report |
| **Test Cases From Code** | `test-cases-from-code` | High | Medium | When you must QA a feature branch with no spec, no reachable author, and no existing tests — reverse-engineer behavior as the oracle, check tenant/authorization isolation, reconcile stale test cases, and hand off a risk register (never confabulates intent) |
| **Smoke & Sanity Testing** | `smoke-sanity-testing` | High | Low | When you want a fast go/no-go gate on a build — wide-and-shallow smoke across critical paths, or narrow-and-deep sanity on a changed area after a fix |
| **Exploratory Testing** | `exploratory-testing` | High | Medium | When you want structured, charter-guided exploratory testing to find bugs scripted tests miss — tours, heuristics (SFDPOT/HICCUPPS), plus light accessibility and usability lenses |
| **Explore & Build** | `explore-and-build` | Low | Low | When you want to interactively explore a web app (agent-driven, Playwright Codegen, or Chrome DevTools Recorder) and turn the session into a test instruction file and a runnable Playwright spec |
| **Bug Report** | `bug-report` | High | Low | When you have annotated screenshots and want them turned into structured, copy-paste-ready bug reports — with an optional direct file into Jira via the Atlassian MCP |
| **Test Case Generator** | `test-case-generator` | High | Low | When you want structured functional, edge, negative, and regression test cases generated from a feature spec, a git diff/PR, or both. Cases are grounded in the actual codebase and priority-ranked — it does not write or scaffold test code |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
