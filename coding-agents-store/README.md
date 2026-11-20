# Coding Agents Store

Agents for code quality, review, and targeted code improvements.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **Error Handling Audit** | `error-handling-audit` | Medium | Medium | When you want to inspect code for incorrect, missing, or poorly structured error handling — covers empty catch blocks, swallowed exceptions, missing async guards, lost error context, and unsafe cleanup patterns. Finds issues and applies fixes after approval |
| **Runtime Debugger** | `runtime-debugger` | Medium | Medium | When you have a real bug in hand — debug logs, crash logs/stack traces, requirement docs, and/or your own observation of expected vs. actual behavior — and want help going from symptom to root cause to an approved fix |
| **Observability Implementer** | `observability-implementer` | Medium | Medium | When you want to add or improve observability (logging, metrics, tracing) on a platform of your choice — OpenTelemetry, Datadog, New Relic, Grafana/Prometheus/Loki/Tempo, AWS CloudWatch/X-Ray, Elastic/ELK, Splunk, Honeycomb, Sentry, etc. Designs and implements structured logging with dynamic log-level switches, cardinality-safe metrics, sampled tracing, and explicit cost guardrails (volume budgets, alerts, kill-switches) to prevent excessive log/metric/trace volume and runaway cost |
| **Auth Implementer** | `auth-implementer` | Medium | High | When you want to implement authentication (login/logout, SSO/OIDC/SAML, MFA, passwordless) and authorization (RBAC/ABAC, centralized access checks, IDOR prevention) with security as a first-class constraint. Designs and implements credential hashing, session/token strategy, account-abuse protection, and threat mitigations mapped to live-fetched OWASP ASVS / NIST 800-63B guidance and any named compliance framework (GDPR, HIPAA, PCI-DSS, SOC2) — while being explicit about what code alone can and can't guarantee, and recommending a follow-up scan (e.g. `owasp-security-scanner`) and audit for regulated contexts |
| **Code Cleanup** | `code-cleanup` | Medium | Medium | When you want to clean up an existing codebase—especially AI/vibe-coded ones—by removing waste, simplifying bulky code, and fixing evidenced quality, performance, or security issues while preserving required behavior. Default CLEAN finds one worthwhile cleanup at a time, proposes it, waits for approval, fixes, verifies, then continues; Analyze and Review only when explicitly requested. For a dedicated error-handling audit use `error-handling-audit`; for a full OWASP scan use `owasp-security-scanner` |
| **Legacy Modernizer** | `legacy-modernizer` | Medium | Medium | When you need to plan or carry out a major framework, runtime, or language-version upgrade in a legacy codebase (e.g. .NET Framework → modern .NET, Java 8 → 21, Spring Boot 2 → 3, React class components → hooks, Python 2 → 3). Profiles the versions actually in use, fetches the official migration guides live, maps every breaking change and deprecated API to `file:line` in a risk-weighted inventory, and writes a batched upgrade plan with a rollback point per batch. After sign-off it applies the upgrade in small approved batches, verified against a build/test baseline captured before the first edit. Teams can customize it without forking: an optional project profile (`.legacy-modernizer.md` in the target repo) sets the target, scope, commands, and project rules, and drop-in stack playbooks add stack-specific guidance (see the agent's `templates/` folder). For routine dependency/CVE triage use `dependency-audit` instead |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` (or `SKILL.md`) file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
