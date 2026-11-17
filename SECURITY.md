# Security Policy

## Reporting a vulnerability

Please **don't open a public issue** for a security problem. Report it privately through GitHub:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability** ([direct link](https://github.com/xianix-team/ide-expert-agents/security/advisories/new)).
3. Describe the issue, how to reproduce it, and what an attacker could do with it.

We aim to acknowledge reports within 5 working days and will keep you updated until the issue is resolved. Please give us a reasonable chance to fix it before disclosing it publicly.

## Supported versions

Only the latest published version of `@99x-ai-dlc/ide-expert-agents-mcp` and the `main` branch receive security fixes.

## What's in scope

- **The MCP server** (`mcp-server/`) — both the stdio and HTTP transports, the Docker image, and the AI Hub usage reporting (for example, leaking the AI Hub token, or the HTTP server exposing more than the agent prompts).
- **The installer** (`scripts/`) — for example, writing outside the target directory.
- **Agent and runbook prompts** — instructions that would make an agent take a destructive or hard-to-reverse action without asking, run commands it doesn't declare in `tools:`, or send data somewhere it shouldn't.
- **Leaked secrets or client data** committed to the repository.

## What's out of scope

- Prompt injection that comes from content a user chose to give an agent (a malicious file in their own codebase), unless one of our prompts makes the impact worse than the tools it declares.
- Vulnerabilities in the IDEs, CLIs, or models that run the agents — report those to their vendors.
