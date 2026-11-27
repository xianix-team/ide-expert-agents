# Report Templates

Used in S7 and S8. Replace every bracketed placeholder. Keep the *Coverage gaps*, *Assumptions*, and *Open questions* sections, and write "None" when they are empty.

## 1. As-deployed architecture

`[docs-folder]/[YYYY-MM-DD]-[app]-[env]-as-deployed.md`

````markdown
# As-Deployed Architecture — [Application] / [Environment]

_Generated [YYYY-MM-DD] by `deployment-architect`. Mode: [Full review / Code only / Live only]. Inputs: [IaC paths], [pipeline files], [cloud] [account/subscription/project], inspected as [identity]._

## System overview
[One paragraph: what the system does and who uses it, inferred from names, tags, and code. Mark inferences as such.]

```mermaid
graph TD
  %% Generate from the Resource Inventory (or the Code Inventory in Code-only mode).
  %% Subgraphs per network boundary and tier. Shapes:
  %%   ([Users])  LB[Gateway / LB]  APP[Compute]  DB[(Data store)]  Q[[Queue / topic]]  KV[(Secrets)]
  %%   Monitoring edges dashed:  APP -.->|logs/metrics| MON
  %%   Mark unmanaged (not in IaC) resources with  :::unmanaged
  classDef unmanaged stroke-dasharray: 5 5
```

## Service map
- **Ingress / edge:** [CDN, WAF, gateway, load balancer]
- **Application tier:** [service — SKU/size, instance count / scale bounds, zones]
- **Data tier:** [store — engine, SKU, HA/replicas, backup]
- **Async:** [queues, topics, DLQs]
- **Secrets and configuration:** [vaults and how the app reads them]

## Network topology
[VNets/VPCs, subnets, peering, private endpoints, public exposure points.]

## Identity and access
[Workload identities and their roles; human access model; deploy identities per environment.]

## Delivery flow

```mermaid
flowchart LR
  %% commit → CI (build, test, scan) → artifact → deploy dev → test → approval → prod
  %% Show manual steps and missing gates explicitly.
```

| Environment | Pipeline | Trigger | Deploy identity | Auth | Gates |
|---|---|---|---|---|---|

## Observability
[Log destinations and retention, metrics, tracing, alerts and where they route.]

## IaC ownership
[Which IaC root/stack owns which resources; resources with no IaC owner.]

## Resource inventory
| Resource | Type | Region / zones | SKU / size | IaC source | Notes |
|---|---|---|---|---|---|
````

## 2. Infrastructure review

`[docs-folder]/[YYYY-MM-DD]-[app]-[env]-infrastructure-review.md`

```markdown
# Infrastructure Review — [Application] / [Environment]

_Generated [YYYY-MM-DD] by `deployment-architect`. Mode: [mode]. Baseline: [NFR spec name / [Provider] Well-Architected Framework]. As-deployed document: [link]._

## Executive summary
**Overall:** [Healthy / Needs attention / At risk]. [N] Critical, [N] High, [N] Medium, [N] Low findings. [N] drift items.

> [3–5 sentences: the most significant risks, the root causes behind them, and the recommended first action.]

| Dimension | Checks | ✅ | ⚠️ | ❌ | ➖ | 🔍 |
|---|---|---|---|---|---|---|
| IaC quality | | | | | | |
| Delivery pipeline | | | | | | |
| Performance efficiency | | | | | | |
| Security | | | | | | |
| Reliability | | | | | | |
| Robustness | | | | | | |
| Observability | | | | | | |
| Cost optimisation | | | | | | |
| **Total** | | | | | | |

Overall rating: **At risk** if any Critical finding, or more than three High. **Needs attention** if any High, or more than five Medium. Otherwise **Healthy**.

## Root causes
| Root cause | Findings it explains | Recommendation |
|---|---|---|

## Findings
[Ordered by severity, then dimension.]

### [ID] — [title]
- **Severity:** [Critical / High / Medium / Low] [adjustment and reason, if any]
- **Dimension / pillar:** [dimension] / [Well-Architected pillar]
- **Source:** [code / pipeline / live / drift]
- **Evidence:** [`path:line`, resource + property, or pipeline job — never a secret value]
- **Impact:** [what can go wrong, and for whom]
- **Recommendation:** [the change]. **Effort:** [S / M / L]
- **Options** (structural items only): [A — trade-offs] / [B — trade-offs]. **Recommended:** [A/B, because …]

## Drift between code and live
| Resource | Class | Code says | Live is | Likely cause | Finding |
|---|---|---|---|---|---|

[Say how drift was determined: manual reconciliation, or the native preview command that was approved and run.]

## Accepted risks
| Finding | Reason given | Accepted by |
|---|---|---|

## Roadmap
| Horizon | Item | Findings closed | Effort | Suggested agent |
|---|---|---|---|---|
| Now | | | | |
| Next | | | | |
| Later | | | | |

## Target state
[Short narrative of the recommended architecture and delivery flow, and why.]

```mermaid
graph TD
  %% Only what changes from today; label new elements "new".
```

## Decisions for the team
| Decision | Why it matters | Options | Input needed from |
|---|---|---|---|

## Method and coverage
- **Checks run:** [dimensions in scope]
- **Tools:** [static analysers and versions, native previews run, platform signals read]
- **Coverage gaps:** [check or resource → reason (permissions, mode, API disabled) → the reader role or access that would close it]
- **Review-session identity:** [identity; note if it had write access]

## Assumptions
[What the findings rest on that wasn't verified.]

## Open questions
[What the team must answer — or "None".]
```

## 3. Closing summary (S8)

```
Infrastructure Review — Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Application / env:   [name] / [env]
Mode:                [Full review / Code only / Live only]
Evidence:            [N] IaC files, [N] pipelines, [N] live resources
Overall:             [Healthy / Needs attention / At risk]
Findings:            [N] Critical · [N] High · [N] Medium · [N] Low
Drift:               [N] unmanaged · [N] undeployed · [N] diverged · [N] out-of-band
Coverage gaps:       [N]

Top recommendations:
  1. [highest-value item — finding IDs]
  2. [...]
  3. [...]

Reports:
  [path to as-deployed doc]
  [path to infrastructure review]

Next: [agent name] to [what it does with this review]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
