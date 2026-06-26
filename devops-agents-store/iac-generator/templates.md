# IPA Artifact Templates

Copy the relevant template into the target file under `infra-docs/` and fill it in. Keep stable IDs once assigned - downstream artifacts and IaC reference them.

---

## Resource inventory -> `discovery/resource_inventory.md`

```markdown
# Resource Inventory

## Intent (verbatim)
> <the user's original words, unedited>

## Mode
- [ ] Greenfield (all new infrastructure)
- [ ] Brownfield (import/extend existing resources)

## Discovered resources
### RES-1: <name, e.g. HTTP API service>
- **Type:** service / datastore / cache / queue / object-storage / worker / cron / external-api / secret / existing-iac
- **Evidence:** <file(s) and lines, e.g. `src/server.ts:12`, `Dockerfile`>
- **Details:** <runtime, port, engine+version, library, env vars referenced>
- **Needs from infra:** <compute, managed DB, network exposure, secret, etc.>

### RES-2: <name>
...
```

---

## Dependency map -> `discovery/dependency_map.md`

```markdown
# Dependency Map

## Edges (who depends on what)
- RES-1 (API) -> RES-2 (Postgres): reads/writes orders
- RES-1 (API) -> RES-3 (Redis): session cache
- RES-1 (API) -> RES-4 (S3 bucket): file uploads

## Diagram
\`\`\`mermaid
graph LR
  RES1[API service] --> RES2[(Postgres)]
  RES1 --> RES3[(Redis)]
  RES1 --> RES4[S3 bucket]
\`\`\`
```

---

## Decisions -> `decisions/infra_decisions.md`

```markdown
# Infrastructure Decisions

## DEC-1: Cloud platform
**Question:** Which cloud platform?
**Decision:** <AWS | Azure | Google Cloud | multi-cloud | hybrid>
**Options considered:** <...>  **Rationale:** <why>

## DEC-2: IaC tool
**Decision:** <Terraform | Pulumi | CloudFormation | CDK | Bicep | ...>

## DEC-3: Environments & tier
**Decision:** <which environments; tier of the one being provisioned now, e.g. "prod - production-grade SKUs, multi-AZ, backups">

## DEC-4: Region(s) & availability
**Decision:** <primary region; multi-AZ? DR region?>

## DEC-5: Compute model
**Decision:** <EKS | Fargate | Cloud Run | Lambda | App Service | VMs | ...>

## DEC-6: Mandatory tags
**Decision:** `Created By` = <e.g. IPA / team>, `Application` = <app name>, `Environment` = <dev|staging|prod>; plus <any extra naming/tag conventions>

## DEC-7: Observability & monitoring
**Decision:** <integrate? yes/no; destination - App Insights+Log Analytics / CloudWatch+X-Ray / Cloud Logging+Monitoring / Datadog / ...; log retention; dashboards; alerts/SLOs + on-call routing>

## DEC-8: CI/CD pipelines
**Decision:** <generate pipelines? yes/no; if yes: platform + deploy strategy>

## DEC-9..n: <other answered questions from the catalog>
...
```

---

## Target architecture -> `architecture/target_architecture.md`

```markdown
# Target Architecture

## Summary
<one paragraph: chosen cloud, compute model, data tier, exposure>

## Resource mapping (RES -> CR)
| CR | Cloud service | Satisfies | Shaped by | Notes |
|----|---------------|-----------|-----------|-------|
| CR-1 | <e.g. ECS Fargate service> | RES-1 | DEC-1, DEC-5 | <...> |
| CR-2 | <e.g. RDS Postgres> | RES-2 | DEC-1, DEC-6 | Multi-AZ |
| CR-3 | <e.g. ElastiCache Redis> | RES-3 | DEC-1 | <...> |

## Diagram
\`\`\`mermaid
graph TD
  Internet --> LB[Load Balancer]
  LB --> CR1[Fargate service]
  CR1 --> CR2[(RDS Postgres)]
  CR1 --> CR3[(ElastiCache Redis)]
\`\`\`

## Alternatives considered
- <option> - rejected because <reason>
```

---

## Network & security design -> `architecture/network_design.md`

```markdown
# Network & Security Design

## Network topology
- VPC/VNet: <CIDR, new/existing>
- Subnets: public <...> / private <...> across AZs <...>
- Ingress: <LB / API gateway>; egress: <NAT / controls>

## Security
- Security groups / NSGs: <rules summary>
- IAM / identity: <roles, workload identity>
- Secrets: <store, injection method - names only, no values>
- Encryption: at rest <keys>; in transit <TLS/cert source>
- WAF / DDoS: <yes/no + service>

## Compliance notes
- Frameworks in scope: <SOC2 / HIPAA / PCI / GDPR / none>
- Controls addressed: <...>
```

---

## Resource specs -> `specs/resource_specs.md`

```markdown
# Resource Specifications

> Sizes are per environment tier. dev/test = cheapest viable; prod = production-grade
> (never a free/dev SKU in prod). Add a column per environment you are provisioning.

## CR-1: <name>
- **Service:** <e.g. ECS Fargate>
- **Size/SKU:** dev `<free/basic SKU>` | prod `<paid/standard SKU>`
- **Count / scaling:** dev `min 1 / max 1` | prod `min <n> / max <n>, trigger <CPU%/RPS>`
- **Version:** <engine/runtime version>
- **Backups/retention:** dev `<n/a or minimal>` | prod `<schedule + retention>`
- **High availability:** dev `single-AZ` | prod `<multi-AZ / multi-region>`

## CR-2: <name>
...
```

---

## IaC scaffolding -> `iac/<tool>/<env>/...`

Organize into modules; keep state and secrets out of git.

```
iac/terraform/
  modules/
    network/        # MOD-1
    compute/        # MOD-2
    database/       # MOD-3
  envs/
    dev/{main.tf,variables.tf,terraform.tfvars,backend.tf}
    prod/{main.tf,variables.tf,terraform.tfvars,backend.tf}
  .gitignore        # *.tfstate, *.tfvars with secrets, .terraform/
```

Module header convention (top of each module's `main.tf`):

```hcl
# MOD-2 Compute - provisions CR-1 (app service)
# Satisfies: RES-1 | Shaped by: DEC-5, DEC-11
```

Mandatory tags applied once at the provider level so every resource inherits them
(Terraform AWS example; use the Azure tags variable / GCP labels equivalent):

```hcl
provider "aws" {
  default_tags {
    tags = {
      "Created By"  = var.created_by   # e.g. "IPA"
      "Application" = var.application   # app/service name
      "Environment" = var.environment  # dev | staging | prod
    }
  }
}
```

For clouds/resources without provider-level default tags (e.g. Azure), define a
shared `tags`/`labels` local and merge it into every resource, or enforce via policy.

---

## Observability & monitoring -> `observability/monitoring.md`

```markdown
# Observability & Monitoring

## Decision
Shaped by: DEC-7. Stack: <App Insights + Log Analytics | CloudWatch + X-Ray | Cloud Logging + Monitoring | Datadog | ...>

## Telemetry resources (CR)
| CR | Resource | Purpose | Notes |
|----|----------|---------|-------|
| CR-x | <e.g. Log Analytics workspace / CloudWatch log group> | logs | retention <n> days |
| CR-y | <e.g. Application Insights / X-Ray> | metrics + tracing/APM | <...> |
| CR-z | <dashboard> | starter dashboard | key metrics: <...> |

## App integration
- Logs: <how the app ships logs - SDK, agent, stdout->collector>
- Metrics: <key metrics emitted>
- Tracing: <distributed tracing / APM enabled? instrumentation>

## Alerts & SLOs
| Alert | Condition | Severity | Route |
|-------|-----------|----------|-------|
| <e.g. 5xx rate> | <> 1% over 5m> | high | <Slack/PagerDuty/email> |
| <e.g. CPU high> | <> 85% over 10m> | medium | <...> |

## Retention & cost notes
- Log retention <n> days; <cost driver note>
```

---

## CI/CD pipeline -> `cicd/pipeline.md`

```markdown
# CI/CD Pipeline

## Platform
<GitHub Actions | GitLab CI | Azure DevOps | ...>

## Stages
1. Build & test
2. Build image -> push to <registry>
3. IaC: fmt / validate / plan (PR) -> apply (on approval)
4. Deploy: <rolling | blue-green | canary>

## Deploy strategy & rollback
<description; how rollback is triggered>
```

---

## Cost estimate -> `cost/cost_estimate.md`

```markdown
# Cost Estimate (rough, monthly)

> Indicative on-demand pricing; confirm with the cloud pricing calculator.

| CR | Service | Assumed usage | Est. $/mo |
|----|---------|---------------|-----------|
| CR-1 | <...> | <...> | <...> |
| CR-2 | <...> | <...> | <...> |
| **Total (per env)** | | | **<...>** |

## Cost drivers & levers
- <biggest cost item> - reduce via <spot / smaller SKU / autoscale-to-zero>
```

---

## Runbook -> `runbook.md`

```markdown
# Runbook

## Prerequisites
- Tools: <terraform x.y, cloud CLI, docker>
- Credentials the human must provide: <cloud auth, no secrets in repo>
- State backend: <bucket/container + lock table/native locking>

## Provision
\`\`\`bash
cd infra-docs/iac/terraform/envs/<env>
terraform init
terraform plan -out tfplan        # review the diff
terraform apply tfplan            # human runs this after approval
\`\`\`

## Rollback / teardown
<how to roll back a deploy; destroy only on explicit instruction>

## Post-provision checks
- [ ] Health endpoint reachable
- [ ] DB connectivity verified
- [ ] Secrets resolve at runtime
```

---

## Provisioning plan -> `plans/provisioning_plan.md`

```markdown
# Provisioning Plan

## Chosen stack (summary)
<cloud, IaC tool, compute, data, exposure - one paragraph>

## Execute steps
- [ ] 1. Target architecture (architecture/target_architecture.md)
- [ ] 2. Network & security design (architecture/network_design.md)
- [ ] 3. Resource specs (specs/resource_specs.md)
- [ ] 4. IaC scaffolding (iac/<tool>/...)
- [ ] 5. Observability & monitoring (observability/monitoring.md) - unless declined (DEC-7)
- [ ] 6. CI/CD pipeline (cicd/pipeline.md) - only if opted in (DEC-8); otherwise mark skipped
- [ ] 7. Cost estimate (cost/cost_estimate.md)
- [ ] 8. Runbook (runbook.md)

## Open decisions
- <anything still awaiting human input>
```

---

## Prompt log -> `prompts.md`

```markdown
# Prompt Log

## <timestamp> - <step name>
<the prompt or decision recorded for traceability>
```
