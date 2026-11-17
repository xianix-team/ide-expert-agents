# Pre-sales pipeline walkthrough

A fictional opportunity taken from the first conversation to a proposal draft. It uses the `presales-pipeline` runbook to decide each next step, and the pre-sales agents to do the work.

**Scenario:** *Northwind Freight* (fictional), a mid-sized logistics company, wants customers to track shipments in its existing web portal. The slug used in file names is `shipment-tracking`.

Commands below use the MCP prompt form (`/mcp__ide-expert-agents__<name>`). If you installed the agents as skills, use `/<name>` instead.

---

## 1. Ask the runbook where to start

```
/mcp__ide-expert-agents__presales-pipeline
```

The runbook asks which engagement this is, where its documents live, and whether it is a standard opportunity. Answer:

> 1. Northwind Freight, slug `shipment-tracking`
> 2. Default paths, in this repo
> 3. Nothing produced yet
> 4. Standard opportunity

It finds no stage outputs. It reports every stage as **missing** and recommends `discovery-interview` first.

## 2. Discovery

```
/mcp__ide-expert-agents__discovery-interview
```

Give the topic in a sentence: *"Northwind Freight wants customers to see live shipment status in their portal; we need to decide what 'live' means and what's in scope for a first release."* The agent then interviews you **one question at a time**: the current state, constraints, stakeholders and what is still unknown. It writes `docs/discovery/shipment-tracking-discovery.md`, which ends with an **Open Questions** section.

## 3. Back to the runbook

Run `presales-pipeline` again. It now sees the discovery record. Suppose two open questions remain, for example *"Which carrier feeds are in scope?"* In that case it reports stage 1 as **gate open** and recommends closing those questions first. If you choose to carry them forward as assumptions, it recommends `elaborate` and gives you a paste-ready answer block:

> 1. Request: `docs/discovery/shipment-tracking-discovery.md`
> 2. Codebase: the portal repository (path)
> 3. Slug: `shipment-tracking`
> 4. Write to: `docs/specs/shipment-tracking-spec.md`

## 4. Spec, then estimate

Run `/mcp__ide-expert-agents__elaborate` and paste that block. The agent reads the portal code to ground the spec, shows a draft for you to confirm, and then writes `docs/specs/shipment-tracking-spec.md`.

Run the runbook again. It points to `estimate`, with a block like this:

> 1. Spec: `docs/specs/shipment-tracking-spec.md`
> 2. Unit: days
> 3. Contingency: 15%
> 4. Write to: `estimates/shipment-tracking-estimate.md`

## 5. Proposal

The runbook's last recommendation is `proposal`. Point it at the discovery record, the spec and the estimate:

> 1. Northwind Freight
> 2. `docs/discovery/shipment-tracking-discovery.md`, `docs/specs/shipment-tracking-spec.md`, `estimates/shipment-tracking-estimate.md`
> 3. Write to: `docs/proposals/northwind-freight-proposal.md`

The draft marks anything the inputs don't support as **to be confirmed**. A person fills in those placeholders and sends the proposal. No agent sends anything to a client.

## 6. After delivery

Once the project ships, `casestudy-drafter` turns the delivered codebase into a case study. Later `proposal` runs can use it as a proof point.

---

## What to take away

- **The runbook never does a stage's work.** It reads what exists, reports status, and hands you the next command with the answers pre-filled.
- **Every agent asks before it starts and stops before it writes**, so you stay in control at each step.
- **The files are the handoff.** Each agent's output path is the next agent's input, so you can resume an engagement weeks later by running the runbook again.
