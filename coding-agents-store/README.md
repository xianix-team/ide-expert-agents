# Coding Agents Store

Agents for code quality, review, and targeted code improvements.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Error Handling Audit** | `error-handling-audit` | When you want to inspect code for incorrect, missing, or poorly structured error handling — covers empty catch blocks, swallowed exceptions, missing async guards, lost error context, and unsafe cleanup patterns. Finds issues and applies fixes after approval |
| **Runtime Debugger** | `runtime-debugger` | When you have a real bug in hand — debug logs, crash logs/stack traces, requirement docs, and/or your own observation of expected vs. actual behavior — and want help going from symptom to root cause to an approved fix |
| **Observability Implementer** | `observability-implementer` | When you want to add or improve observability (logging, metrics, tracing) on a platform of your choice — OpenTelemetry, Datadog, New Relic, Grafana/Prometheus/Loki/Tempo, AWS CloudWatch/X-Ray, Elastic/ELK, Splunk, Honeycomb, Sentry, etc. Designs and implements structured logging with dynamic log-level switches, cardinality-safe metrics, sampled tracing, and explicit cost guardrails (volume budgets, alerts, kill-switches) to prevent excessive log/metric/trace volume and runaway cost |
| **Auth Implementer** | `auth-implementer` | When you want to implement authentication (login/logout, SSO/OIDC/SAML, MFA, passwordless) and authorization (RBAC/ABAC, centralized access checks, IDOR prevention) with security as a first-class constraint. Designs and implements credential hashing, session/token strategy, account-abuse protection, and threat mitigations mapped to live-fetched OWASP ASVS / NIST 800-63B guidance and any named compliance framework (GDPR, HIPAA, PCI-DSS, SOC2) — while being explicit about what code alone can and can't guarantee, and recommending a follow-up scan (e.g. `owasp-security-scanner`) and audit for regulated contexts |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
