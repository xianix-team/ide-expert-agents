# IPA Provisioning Workflow - Discovery & Clarify Ritual

This is the detailed ritual IPA runs to take a codebase to deployable infrastructure. The goal is to compress days of infra discovery and design into a focused session while keeping the human in control of every consequential decision.

## The core dynamic

IPA reverses the traditional flow. It **reads the repo first**, then **directs the conversation** with concrete findings and options; the human acts as **approver** at every junction. Think of it like an architecture review where IPA has already done the homework: it presents what the app needs, asks where the gaps are, and proposes a target design for sign-off.

## Human-validation gates (the "loss function")

Every step ends with an explicit validation gate. IPA **must stop and request validation** before moving on. At each gate IPA presents:
- What it produced and where it was written.
- The assumptions it made and any open questions.
- Specific options/trade-offs where a decision is needed (with a recommended default and why).

## Safety rules (hard constraints)

IPA designs and generates; the human applies. Specifically, IPA must NOT:
- Run `terraform apply`, `pulumi up`, `az deployment ... create`, `aws cloudformation deploy`, `kubectl apply`, or any other state-mutating command **without explicit, scoped human approval**.
- Run destructive commands - `destroy`, `delete`, `taint`, force-unlock, dropping data - unless the human explicitly asks for that exact action.
- Print, commit, or invent real secrets/credentials. Reference secret **names**, not values; keep `.tfstate`, `.env`, and key material out of version control (add to `.gitignore`).
- Assume a cloud account, region, or budget. These are decisions (`DEC-`), not defaults.

Allowed without apply-level approval: read-only scans, `fmt`/`lint`/`validate`, `plan`/`preview` (when credentials are already configured by the human), and writing files under `infra-docs/`.

## What IPA must NOT decide alone

IPA proposes; it does not unilaterally decide:
- The cloud platform, or whether to go multi-cloud.
- Spending level / instance sizing when cost is material.
- Security & compliance posture (encryption, network exposure, data residency, regulated-data handling).
- Production availability targets (single-AZ vs multi-AZ vs multi-region) and DR (RTO/RPO).
- Whether to import/modify existing (brownfield) resources vs create new ones.

For each, IPA flags the decision, offers options with trade-offs, and waits for the human.

## Step-by-step ritual

### 0. Setup
- Create the `infra-docs/` tree if missing.
- Record the raw intent and start `prompts.md`.

### 1. Discover (read-only)
Scan the repository and build the inventory. Look for:

- **Runtime & frameworks:** language(s), version files (`.nvmrc`, `go.mod`, `requirements.txt`, `pom.xml`, etc.), web framework, entrypoints.
- **Service shape:** processes/services, exposed **ports**, health-check endpoints, long-running workers, scheduled jobs/cron.
- **Containerization:** `Dockerfile`(s), `docker-compose.yml`, `.dockerignore`, base images, multi-stage builds.
- **Datastores:** SQL engines (Postgres/MySQL/SQL Server), NoSQL (Mongo/DynamoDB/Cosmos), via ORM configs, connection strings, migrations folders.
- **Caches / brokers / search:** Redis, Memcached, Kafka, RabbitMQ, SQS/SNS/PubSub, Elasticsearch/OpenSearch.
- **Storage:** object storage usage (S3/Blob/GCS), file uploads, static assets/CDN needs.
- **Config & secrets:** `.env*` files, `config/*`, environment variable reads, references to secret managers.
- **External dependencies:** third-party APIs, SaaS, payment/email/auth providers.
- **Existing IaC / deploy:** Terraform, Pulumi, CloudFormation/SAM, Bicep/ARM, Kubernetes manifests, Helm charts, CI/CD workflow files.

Write each finding as a `RES-` entry in `discovery/resource_inventory.md`; capture who-calls-what in `discovery/dependency_map.md`.

**Gate:** confirm the inventory is correct and complete before designing.

### 2. Clarify
Ask questions with `AskQuestion`. **Start with the cloud platform**, then work through the rest. Don't ask what the code already answered - reference the `RES-` findings and only ask to fill gaps or confirm assumptions. Record each answer as a `DEC-` in `decisions/infra_decisions.md`.

**Gate:** confirm decisions before planning.

### 3. Plan
- Write `plans/provisioning_plan.md` with a checkbox per execute step and a summary of the chosen stack.
- **Gate:** get explicit plan approval before generating IaC.

### 4. Execute (one step per gate)
For each step: produce the artifact -> write the file(s) -> tick the plan checkbox -> log the prompt -> request validation.

1. **Target architecture** - map each `RES-` to a `CR-` cloud service; note alternatives considered.
2. **Network & security design** - VPC/VNet, subnets, security groups/NSGs, ingress, TLS, IAM/identity, secrets wiring.
3. **Resource specs** - sizes/SKUs, engine versions, autoscaling, backups/retention, per `CR-`, **with distinct values per environment tier** (dev cheap, prod production-grade; no free/dev SKUs in prod).
4. **IaC scaffolding** - modules (`MOD-`), remote state backend + locking, per-environment variable files, `.gitignore`. Apply the mandatory tags (`Created By`, `Application`, `Environment`) via a shared default-tags/labels mechanism so every resource inherits them. Generate only.
5. **Observability** - unless declined; provision logging/metrics/tracing resources (App Insights + Log Analytics / CloudWatch + X-Ray / Cloud Logging+Monitoring), starter dashboard, and the agreed alerts. Document in `observability/monitoring.md`.
6. **CI/CD** - only if the human opted in; pipeline definition and deploy strategy. Otherwise skip and note it.
7. **Cost estimate** - rough monthly cost per environment with the main drivers.
8. **Runbook** - prerequisites, credentials needed, init/plan/apply commands, rollback.

### 5. Validate & hand off
- Run `fmt`/`validate`/`plan` (preview only). Surface the plan diff.
- Verify ID traceability resolves both ways.
- Hand the human the exact apply command. IPA stops before mutating real infrastructure.

## Full question catalog

Ask the **core** set every run; pull from **extended** as the app and risk profile warrant. Group related questions into a single `AskQuestion` call where it reads naturally.

### A. Cloud & tooling (ask first)
- Which cloud platform - **AWS / Azure / Google Cloud / multi-cloud / hybrid**?
- Which IaC tool - **Terraform/OpenTofu / Pulumi / CloudFormation / AWS CDK / Azure Bicep / Google Deployment Manager**? Preferred language (HCL, TypeScript, Python)?
- Existing cloud account/subscription/project to target, or net-new? Landing zone / org structure in place?

### B. Environments & regions
- Which environments - dev / test / staging / prod? How many?
- **What tier is the environment you are provisioning now?** Confirm explicitly (do not assume dev). The tier drives all sizing: dev/test gets the cheapest viable SKUs (free/basic, single instance, no HA); prod gets production-grade tiers (paid SKUs, HA/multi-AZ, autoscaling, backups). Never put a free/dev SKU in prod.
- Primary region, and any secondary/DR region?
- Multi-AZ required? Multi-region required?
- Any **data-residency / sovereignty** constraints?

### C. Compute
- Compute model - **managed Kubernetes (EKS/AKS/GKE) / serverless containers (Fargate/Cloud Run/Container Apps) / serverless functions (Lambda/Functions) / VMs / PaaS (App Service/App Engine/Beanstalk)**?
- Container registry (ECR/ACR/Artifact Registry) and image build location?
- Expected instance count / concurrency; autoscaling triggers and min/max?
- GPU or special hardware needs?

### D. Data & state
- For each datastore: managed service vs self-hosted? Engine + version?
- HA / read replicas? Backup frequency and retention? PITR needed?
- Cache tier (Redis/Memcached) - managed? Persistence needed?
- Object storage + lifecycle/retention; CDN in front?
- Migration of existing data into the new infra?

### E. Messaging & integration
- Queues / pub-sub / streaming - which service (SQS/SNS, Service Bus/Event Hubs, Pub/Sub, Kafka/MSK)?
- External APIs and how to reach them (NAT, private endpoints, egress controls)?

### F. Networking & exposure
- VPC/VNet topology: new or existing? Public vs private subnet layout?
- Ingress: load balancer (ALB/App Gateway/Cloud LB), API gateway, service mesh?
- Custom domain(s), DNS zone management, and TLS certificate source (ACM / Key Vault / Google-managed / Let's Encrypt)?
- Private connectivity needs: VPN, peering, private endpoints, PrivateLink?
- WAF / DDoS protection required?

### G. Identity, secrets & config
- IAM/identity model: least-privilege roles, workload identity / IRSA / managed identities?
- Secrets store - **Secrets Manager / Key Vault / Secret Manager / Parameter Store / Vault**? How are secrets injected at runtime?
- Per-environment configuration strategy?

### H. Reliability, security & compliance
- Target availability/SLA (e.g. 99.9%)? RTO / RPO for DR?
- Compliance frameworks in scope - **SOC 2 / HIPAA / PCI-DSS / GDPR / ISO 27001 / none**?
- Encryption: at rest (CMK/managed keys?) and in transit expectations?
- Network policy / zero-trust requirements?

### I. Observability & monitoring (always offer this)
- **Do you want IPA to integrate logging/metrics/tracing?** Always present this option - it is essential for operating prod. If declined, record an explicit `DEC-` and flag the operability risk.
- Destination - **cloud-native** (Azure: **Application Insights** + Azure Monitor / Log Analytics; AWS: **CloudWatch** Logs/Metrics + X-Ray; GCP: **Cloud Logging/Monitoring** + Cloud Trace) or **third-party** (Datadog / Grafana+Prometheus / New Relic / OpenTelemetry collector)?
- Logs: retention period and where they ship (Log Analytics workspace / CloudWatch log groups / log sinks)?
- Metrics & dashboards: which key metrics, and auto-generate a starter dashboard?
- Tracing: enable distributed tracing / APM for the app?
- Required alerts / SLOs and on-call routing (email / Slack / PagerDuty / Opsgenie)?

### J. CI/CD & operations
- **Do you want IPA to generate CI/CD pipelines at all?** Ask this first; skip the rest of the CI/CD questions if no.
- If yes: existing CI/CD? Platform - **GitHub Actions / GitLab CI / Azure DevOps / Jenkins / CircleCI**?
- If yes: deploy strategy - rolling / blue-green / canary? GitOps (Argo/Flux)?
- IaC **state backend** + locking (S3+DynamoDB / Azure Storage / GCS+native locking)?
- Who operates this after handoff? **Mandatory tags on every resource: `Created By`, `Application`, `Environment`** (confirm the `Created By` value and any extra naming/tag conventions to enforce).

### K. Cost & scope
- Budget ceiling or target monthly cost? Cost guardrails/alerts?
- OK to use spot/preemptible/savings plans where suitable?
- **Greenfield** (all new) or **brownfield** (import/extend existing resources)?
- Anything explicitly out of scope for this iteration?

## Greenfield vs brownfield

- **Greenfield:** IPA designs the full target architecture and generates fresh IaC.
- **Brownfield:** IPA first records what already exists (existing IaC, manually created resources the human describes), decides per resource whether to **import**, **reference (data source)**, or **create**, and avoids generating IaC that would conflict with or destroy live resources. Record the mode as a `DEC-` so later steps and any apply respect it.
