# Customizing the legacy-modernizer agent

There are two ways to adapt the agent. Neither needs a change to `agent.md`.

| You want to… | Use | Where it lives |
|---|---|---|
| Set one project's target, scope, commands, constraints, and rules | **Project profile** | `.legacy-modernizer.md` at the root of the repository being upgraded |
| Share stack-specific upgrade know-how across projects | **Stack playbook** | `playbook-NN-<id>.md` in this agent folder |

Start with the project profile. It needs no clone of this repo and no rebuild, and it works
with every way of running the MCP server.

## Project profile

1. Copy `project-profile-TEMPLATE.md` to the root of your repository as `.legacy-modernizer.md`.
2. Fill in the sections you need and delete the rest.
3. Commit it. The agent reads it at the start of every run and skips the questions it answers.

The agent will also offer to create this file for you at the end of its scope agreement.

## Stack playbook

### How discovery works

- The MCP server appends every `*.md` file in the agent folder (except `agent.md` and
  `README.md`) to the agent prompt, in alphabetical order.
- Files in this `templates/` subfolder are not appended (discovery is non-recursive), so this
  guide and the templates never reach the prompt.
- Each playbook begins with `## Playbook: <name>` and an **Applies when** line. The agent
  applies the playbooks whose condition matches the repository and ignores the rest.

### Steps

1. Copy the template: `cp templates/playbook-TEMPLATE.md playbook-10-<your-id>.md`
   (the numeric prefix sets the order in the prompt).
2. Fill the header. **Applies when** is what the agent keys on, so name a signal it can see
   in the repository.
3. Fill in the sections and delete the ones you don't need.
4. Rebuild the MCP server (`npm run build` in `mcp-server/`) and restart the connection.

A playbook added on your own clone or team server stays private to your team (point the
server at your agent files with `MCP_AGENTS_ROOT`). To share one with everyone, open a PR.

### Conventions

- Keep playbooks short: they are sent to every user of the agent, whether or not they apply.
- Record durable guidance (sources, tools, order, traps), not a copy of the vendor's
  breaking-change list. The agent fetches that live, and the fetched guide wins on facts.
- A playbook can add rules; it cannot relax the agent's guardrails.
- Keep content generic. No customer names, internal hostnames, credentials, or proprietary
  details (see the Customer IP notice in the root `CONTRIBUTING.md`).
- Adding a playbook does not change the agent's name or description, so the READMEs only
  need an update if you want the playbook listed there.
