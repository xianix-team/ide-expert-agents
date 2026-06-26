# DevOps Agents Store

Agents for DevOps and infrastructure engineering tasks.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **IPA — Infrastructure Provisioning Agent** | `ipa` | When you want to provision cloud infrastructure, generate Terraform / Bicep / Pulumi / CDK, design a target cloud architecture, or stand up environments for an existing repo — IPA scans the codebase, asks targeted questions, and generates IaC with a step-by-step approval flow |

---

## Adding an agent

1. Create a folder here with an `agent.md` or `SKILL.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
