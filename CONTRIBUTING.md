# Contributing to IDE Expert Agents

Thanks for contributing an agent or improving the MCP server. This guide covers the conventions this repo expects.

## Repository layout

Agents live under `*-agents-store/<agent-name>/`, one folder per agent:

```
*-agents-store/
  <agent-name>/
    agent.md   ← instruction set + YAML frontmatter (Claude Code style)
    SKILL.md   ← instruction set + YAML frontmatter (Cursor style)
    *.md       ← supporting docs, auto-concatenated into the prompt
```

The MCP server in `mcp-server/` discovers agents by globbing these folders at startup — there is no registry to update.

## Adding a new agent

1. Pick the store that matches the agent's domain (see the "Agent stores" table in the root [README.md](README.md)), or propose a new store if none fits.
2. Create a folder: `*-agents-store/<agent-name>/`.
3. Start from the template: copy [templates/AGENT_TEMPLATE.md](templates/AGENT_TEMPLATE.md) to `<agent-name>/agent.md`. It sets out the structure the [quality checklist](.claude/skills/agent-quality-review/SKILL.md) expects:
   - frontmatter with trigger phrases and only the tools the agent needs;
   - a boundary statement and a "done when";
   - S0 scope agreement, read-only grounding, the work stages, a checkpoint that stops for confirmation, and a write step with an output skeleton;
   - a handoff that names the next agent, and guardrails.

   Replace the placeholders and delete every `<!-- GUIDE: … -->` comment; `npm run check` fails while any are left. The required frontmatter fields are `name` (equal to the folder name), `description`, `autonomy`, and `human-judgement` (see [Autonomy and human judgement](#autonomy-and-human-judgement)).

4. Split long instruction sets into supporting `.md` files in the same folder if it improves readability — they're concatenated into the prompt at serve time.
5. Add the agent to [catalog.json](catalog.json) under its store, with a display `title` and `whenToUse` text (see [Keep the docs in sync](#keep-the-docs-in-sync--required-not-optional)).
6. In `mcp-server/`, run `npm run docs` to regenerate the README tables, then `npm run check` to validate, build, and smoke-test.
7. Restart your MCP client connection and confirm the agent appears.

> **⚠️ Customer IP notice:** keep the agent generic and reusable — see [Customer IP notice](#customer-ip-notice) before you start.

No changes to the MCP server code are needed. Don't edit the generated README tables by hand: `npm run check` (and CI) fails when they don't match `catalog.json`. Agent changes reach `npx` users with the next npm release (see [Releasing the npm package](#releasing-the-npm-package)).

## Autonomy and human judgement

Every agent states two ratings in its frontmatter, each `high`, `medium`, or `low`:

```yaml
autonomy: high
human-judgement: medium
```

**`autonomy`** — how much of the task the agent carries out on its own once scope is agreed.

| Level | Meaning | Typical shape |
|---|---|---|
| `high` | Runs the task end to end and hands back a finished result, with few or no checkpoints after scope agreement. | Audits, scans, reports, test runs, drafts generated from inputs. |
| `medium` | Does most of the work but stops at defined checkpoints for the human to approve, choose, or confirm before it continues. | Propose → approve → apply loops; design specs with a decision per section; gated code changes. |
| `low` | The human drives. The agent facilitates step by step — an interview, a walkthrough, or a session where the content comes from the human's answers or actions. | Discovery interviews, checklists walked item by item, guided sessions. |

**`human-judgement`** — how much expert human judgement the output needs before anyone acts on it.

| Level | Meaning | Typical shape |
|---|---|---|
| `high` | The output is a decision, commitment, or risk position that a qualified person must evaluate and own: architecture, security, compliance, commercial, or stakeholder sign-off. | Estimates, proposals, architecture specs, compliance reviews, infra plans, UAT. |
| `medium` | A practitioner should review and triage the output, but it is grounded in evidence they can check. | Findings to prioritise, code changes to review, research to validate. |
| `low` | The output is factual or can be checked mechanically. A quick sanity check is enough. | Inventories, regression reports, test results, summaries of existing material. |

Rate the agent's default mode. If it has an optional mode that changes the picture (for example, an audit that can also apply fixes), rate the mode most users run. `npm run check` fails if either field is missing or has another value. The generated README tables and the MCP `list_agents` tool show both ratings.

## Keep the docs in sync — required, not optional

The agent tables in the store READMEs and the root README are **generated** from [`catalog.json`](catalog.json) and the runbook frontmatter. Don't edit them by hand.

Whenever an agent is **added**, **removed**, or **updated** (name, prompt name, description, "when to use", autonomy, or human-judgement changes), in the same PR:

1. **`catalog.json`** — add/remove/edit the agent's entry under its store (`title`, `whenToUse`), and update the store's `description` if the change alters what the store covers.
2. **Runbooks** — if a runbook in [`runbooks/`](runbooks/README.md) lists the agent under `agents`, update it.
3. **Regenerate** — run `npm run docs` in `mcp-server/` and commit the changes it makes: the READMEs, and the skill list served with `team-planner-and-trainer`.
4. **Trainer playbooks** — if you renamed or removed an agent, update [playbooks.md](delivery-agents-store/team-planner-and-trainer/playbooks.md). For a new agent, add it to the playbook it fits.

`npm run check` (and CI) fails if `catalog.json` disagrees with the agents on disk, a runbook or trainer playbook names an agent that doesn't exist, or the docs weren't regenerated. If you're unsure whether a change is significant enough to warrant a description update, update it anyway.

## Customer IP notice

Agents and skills here are shared publicly across teams. Content must be **generic and reusable**:

- No customer-specific data, proprietary business logic, confidential architecture details, credentials, or other protected IP belonging to a client.
- If an agent was inspired by client work, generalize the naming, examples, and domain specifics before contributing it.
- When in doubt, leave it out and check with your engagement lead.

## MCP server changes

Server code lives in `mcp-server/src/`. Common tasks:

```bash
cd mcp-server
npm install
npm run dev        # stdio transport, live reload via tsx
npm run dev:http    # HTTP Streamable transport
npm run build       # tsc + postbuild — always run before opening a PR that touches server code
```

Both transports (`index.ts` stdio, `http.ts` HTTP) share the same agent loader — you generally shouldn't need to touch server code just to add or edit an agent. See [docs/architecture.md](docs/architecture.md) for how the pieces fit together.

## Releasing the npm package

Don't change `version` in `mcp-server/package.json` in your PR — the release version comes from a Git tag, so parallel PRs never conflict over it. A maintainer releases by tagging a commit on `main`:

```bash
git checkout main && git pull
git tag v1.2.0          # semver, prefixed with "v"
git push origin v1.2.0
```

The [publish workflow](.github/workflows/publish-npm.yml) checks that the tagged commit is on `main`, sets the package version from the tag, builds, and publishes to npm. See [Publish](mcp-server/README.md#publish) for details.

## Review before you push

Before opening (or pushing further commits to) a PR that adds, removes, or updates
an agent, self-review it against **[pr-review.md](pr-review.md)**. It's the same
checklist a reviewer will use — repo conventions, the two-README sync rule, the
agent quality-attribute checklist, the customer IP notice, and MCP server build
checks — so running it yourself first catches gaps before they cost a review round
trip.

## Submitting changes

1. Branch off `main`.
2. Make your changes, keeping agent content and README updates in the same commit/PR (see above).
3. Run `npm run check` in `mcp-server/` (Node 20+) and confirm it passes. It validates agent frontmatter and both README agent tables, builds the server, and smoke-tests that every agent is served. CI runs the same check on every PR.
4. Self-review against [pr-review.md](pr-review.md) — fix anything marked blocking before opening the PR.
5. Open a PR against `main` with a clear description of what the agent does and, if relevant, what prompted it.
6. Keep customer-identifying details out of PR descriptions and commit messages, same as agent content.
