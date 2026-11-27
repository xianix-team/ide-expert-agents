# Assessment Rubric

Used in S2 for the checks that are visible in code, and in S5 for the full assessment. The **Source** column says where the evidence usually comes from: **C** = IaC code, **P** = pipeline definitions or run history, **L** = live inspection. Score the strongest source available. In Code-only mode, a check that needs **L** is 🔍.

**Scoring key:** ✅ Compliant · ⚠️ Partial · ❌ Non-compliant · ➖ Not applicable · 🔍 Unable to assess (say why: permissions, mode, or missing data)

Where the engineer supplied an NFR spec or targets in S0, those override the default standard in the tables. Cite the target in the finding.

## Severity scale

| Severity | Meaning | Examples |
|---|---|---|
| **Critical** | Exploitable or data-losing now. Fix before anything else. | Database open to `0.0.0.0/0`; secret committed to the repo; no backups on the prod data store; a pipeline that anyone can run against prod with owner rights |
| **High** | A likely incident, outage, or audit failure. Fix this iteration. | Single-AZ prod database; long-lived cloud keys in CI; no alerting on 5xx; manual prod changes with no record |
| **Medium** | Weakens resilience, security in depth, or operability. Plan it. | Unpinned modules; no plan output on PRs; log retention under 30 days |
| **Low** | Hygiene and cost. Do opportunistically. | Missing tags; oversized non-prod SKU; inconsistent naming |

Raise severity one level for prod and for internet-facing resources. Lower it one level for isolated non-prod, and state the adjustment in the finding.

## Drift classes

Used in S4 when reconciling code with live.

| Class | Meaning | Typical cause | Default severity |
|---|---|---|---|
| **Unmanaged** | Exists live, not declared in any IaC in scope | Click-ops, legacy, or another repo owns it | Medium (High in prod, or if security-relevant) |
| **Undeployed** | Declared in IaC, not found live | Pipeline not run, failed apply, or wrong scope | Medium |
| **Diverged** | Exists in both, with a different property | Manual hotfix, portal change, or an `ignore_changes` gap | High if the property is security- or reliability-relevant, otherwise Medium |
| **Out-of-band change** | Change history shows a write by a non-pipeline identity | Manual change in console or CLI | High in prod, otherwise Medium |
| **Expected** | Difference by design (auto-scaled count, provider-managed defaults) | — | No finding. List as expected |

Before recording **Unmanaged**, check whether the resource is provider-created (managed resource groups, `MC_*` node groups, default VPCs, service-linked roles). Those are **Expected**.

---

## IaC quality

| ID prefix | Check | Source | Standard | Pillar |
|---|---|---|---|---|
| IAC | Coverage | C+L | Every prod resource in scope is declared in IaC. No click-ops estate | Operational excellence |
| IAC | Remote state | C | Remote backend with locking and encryption (S3 with lockfile or DynamoDB lock, azurerm with blob lease, GCS); no local or committed state files | Reliability / Security |
| IAC | State access | C+L | State storage is private, versioned, and readable only by the deploy identity and admins. State holds secrets | Security |
| IAC | Environment separation | C | Separate state per environment; environments differ by parameters, not by copy-pasted code | Operational excellence |
| IAC | Version pinning | C | Tool, provider, and module versions pinned (`required_version`, `required_providers`, module `?ref=` or `version`), lock file committed | Reliability |
| IAC | Modularity | C | Reusable modules for repeated patterns; no single huge root with every environment inline | Operational excellence |
| IAC | No secrets in code | C | No literal passwords, keys, or connection strings in IaC, tfvars, parameter files, or Helm values. Secrets come from a vault or are generated | Security |
| IAC | Sensitive outputs | C | Secret outputs marked `sensitive`; no secrets in outputs consumed by pipelines' logs | Security |
| IAC | Tagging and naming | C+L | Consistent naming; mandatory tags (owner, environment, cost centre, data classification) applied through defaults or policy | Cost / Operational excellence |
| IAC | Policy as code | C+P | Guardrails enforced in code or the platform: Azure Policy, AWS SCPs or Config rules, GCP Org Policy, or OPA/Conftest/Sentinel in the pipeline | Security / Operational excellence |
| IAC | Lifecycle protection | C | `prevent_destroy`, deletion protection, or resource locks on stateful prod resources | Reliability |
| IAC | Drift suppression | C | `ignore_changes` / equivalent used narrowly and commented. Blanket ignores hide drift | Operational excellence |
| IAC | Static analysis clean | C | No unresolved high-severity hits from checkov, trivy, tflint, or cfn-lint, or each one suppressed with a reason | Security |
| IAC | Container images | C | Dockerfiles use pinned, minimal base images, run as non-root, use multi-stage builds, and contain no secrets in layers | Security |
| IAC | Kubernetes manifests | C | Resource requests and limits, probes, `securityContext` (non-root, read-only rootfs, no privilege escalation), PodDisruptionBudgets, image tags not `latest` | Reliability / Security |

## Delivery pipeline

| ID prefix | Check | Source | Standard | Pillar |
|---|---|---|---|---|
| PIPE | Everything through the pipeline | P+L | Infra and app changes reach prod only through a pipeline; change history shows no manual writes | Operational excellence |
| PIPE | Keyless cloud auth | P+L | OIDC / workload identity federation from CI to cloud; no long-lived access keys or client secrets stored as CI secrets | Security |
| PIPE | Least-privilege deploy identity | L | Deploy identity scoped to its environment's resources; not Owner / AdministratorAccess / `roles/owner` at subscription, account, or project level; separate identity per environment | Security |
| PIPE | Plan on PR, apply on merge | P | IaC plan, what-if, or diff posted on PRs and reviewed; apply runs only from the protected branch using the reviewed plan | Operational excellence |
| PIPE | Protected prod | P+L | Branch protection with required reviews and status checks; prod environment requires approval; who can approve is restricted | Security |
| PIPE | Build once, promote | P | One immutable, versioned artifact (image digest, package) promoted through environments; prod does not rebuild from source | Reliability |
| PIPE | Security scanning | P | SAST, dependency/SCA, IaC scan, container image scan, and secret scanning run and block on high severity | Security |
| PIPE | Supply chain | P | Third-party actions or tasks pinned to a commit SHA or a vetted version; minimal `permissions:` in workflows; SBOM or provenance for images (recommended) | Security |
| PIPE | Untrusted triggers | P | No `pull_request_target` or equivalent running untrusted code with secrets; fork PRs get no secrets | Security |
| PIPE | Tests gate deploys | P | Unit and integration tests before deploy; smoke test after deploy | Reliability |
| PIPE | Safe rollout and rollback | P+L | Progressive strategy (slots, blue/green, canary, rolling with health checks) and a documented, tested rollback path | Reliability |
| PIPE | Database changes | P | Migrations versioned, run by the pipeline, and backward-compatible with the previous app version | Reliability |
| PIPE | Scheduled drift detection | P | A scheduled plan or drift job that alerts on difference | Operational excellence |
| PIPE | Pipeline health | P | Recent runs mostly green; no long-disabled stages; no `continue-on-error` or `\|\| true` on scans and tests | Operational excellence |

---

## NFR-1: Performance efficiency

| Check | Source | Standard |
|---|---|---|
| Compute sizing | L | Not on free or dev tiers in prod; right-sized against observed utilisation where metrics are available |
| Auto-scaling | C+L | Scale rules with min/max bounds on every stateless compute tier; min ≥ 2 in prod |
| Caching | C+L | A cache layer where reads dominate or the database is the bottleneck |
| CDN / edge | C+L | Static assets and global traffic served through a CDN for public-facing apps |
| Connection pooling | C+L | Database connection pooling or a proxy (PgBouncer, RDS Proxy); no connection per request |
| Load balancer health checks | C+L | A health probe on every load-balanced backend |
| Data placement | L | Compute and data in the same region; no chatty cross-region calls on the request path |

## NFR-2: Security

| Check | Source | Standard |
|---|---|---|
| Network isolation | C+L | Compute and data in private subnets; data stores reachable through private endpoints or service endpoints only; public exposure only through a gateway or WAF |
| Inbound rules | C+L | No `0.0.0.0/0` or `*` on management (22, 3389) or data ports; least-privilege security groups / NSGs / firewall rules |
| Encryption at rest | C+L | Enabled on all data stores and disks; customer-managed keys where the data classification requires them |
| Encryption in transit | C+L | HTTPS only, HTTP redirected, minimum TLS 1.2, TLS enforced on database connections |
| Secrets management | C+L | Secrets in Key Vault / Secrets Manager / Secret Manager, referenced by the app; no credential-like values in app settings, environment variables, tags, or task definitions (check names and references, never read values) |
| Workload identity | C+L | Services use managed identity / IAM roles / service accounts; no shared keys or embedded credentials; no service-account key files |
| Human access | L | No standing Owner/Admin for individuals on prod; MFA and SSO; break-glass accounts documented; no IAM users with access keys older than 90 days (AWS) |
| Public storage | C+L | No public buckets or containers unless intended and documented; account-level public-access block on (AWS) |
| Certificates | L | Managed or auto-renewing certificates; expiry more than 30 days away; an expiry alert |
| Edge protection | C+L | WAF on public HTTP endpoints; DDoS protection (Azure DDoS Protection, AWS Shield, Cloud Armor) on prod public endpoints |
| Vulnerability management | L | Container image scanning and VM vulnerability assessment enabled; Defender / Security Hub / SCC findings triaged |
| Audit logging | L | Control-plane audit logs (Activity Log, CloudTrail, Cloud Audit Logs) retained centrally for at least 90 days, and at least 1 year in prod where compliance applies |

## NFR-3: Reliability

| Check | Source | Standard |
|---|---|---|
| Availability zones | C+L | Prod compute and data spread across at least 2 AZs, or zone-redundant SKUs |
| Database HA | C+L | HA standby or replica in prod |
| Backups | C+L | Automated backups; retention ≥ 7 days in prod, or as the NFR spec requires; point-in-time restore enabled |
| Restore tested | P | Evidence of a restore test (runbook, pipeline, or recent restore); otherwise ⚠️ and ask |
| Disaster recovery | C+L | Cross-region backup copy or replica consistent with the stated RTO/RPO; if no RTO/RPO is stated, list it as a decision for the team |
| Deletion protection | C+L | Soft delete, deletion protection, or resource locks on prod data stores and vaults |
| Health endpoint | C+L | Application health endpoint wired to the load balancer or orchestrator |
| Self-healing | C+L | Restart policies, health-based instance replacement, Kubernetes liveness probes |
| Quotas and limits | L | No resource near a service quota that would block scale-out |

## NFR-4: Robustness

| Check | Source | Standard |
|---|---|---|
| Graceful shutdown | C+L | Connection draining or deregistration delay > 0; termination grace period that fits the longest request |
| Timeouts | C | Outbound timeouts configured on HTTP clients and DB connections (from app config or IaC settings) |
| Retries and circuit breakers | C | Retry with back-off on calls to dependencies; circuit breaker or bulkhead on critical paths |
| Dead-letter queues | C+L | A DLQ or dead-letter topic wherever message processing can fail, with an alert on depth |
| Rate limiting | C+L | Inbound rate limiting at the gateway or WAF for public APIs |
| Readiness probes | C+L | Kubernetes readiness and startup probes on all deployments; PodDisruptionBudgets for replicated workloads |

## NFR-5: Observability

| Check | Source | Standard |
|---|---|---|
| Centralised logging | C+L | All compute and platform diagnostic logs flow to a central workspace or sink |
| Structured logs | C | JSON or structured logs (from app or logging config) |
| Application metrics / APM | C+L | APM agent or custom metrics; infrastructure metrics alone are not enough |
| Distributed tracing | C+L | Tracing with propagated correlation IDs in multi-service systems |
| Alerting | C+L | Alerts on 5xx rate, P95 latency, saturation (CPU, memory, connections, queue depth), and failed deploys, routed to an on-call channel |
| Runbooks | C+L | Alert descriptions link to a runbook (recommended) |
| Log retention | C+L | ≥ 30 days in prod; < 7 days is a defect |
| Dashboards and SLOs | L | A service dashboard; SLOs defined for user-facing journeys (recommended) |

## NFR-6: Cost optimisation

| Check | Source | Standard |
|---|---|---|
| Idle resources | L | No stopped-but-billed VMs, unattached disks or IPs, empty load balancers, or orphaned snapshots |
| Non-prod sizing | C+L | Dev and test on smaller SKUs than prod; scale to zero or auto-shutdown out of hours where possible |
| Commitment discounts | L | Reservations or savings plans for steady workloads running more than 6 months (recommended) |
| Storage tiering | C+L | Lifecycle rules moving infrequently accessed data to cool or archive tiers |
| Budgets and alerts | L | A budget with alerts per subscription, account, or project; cost-allocation tags applied |
| Provider recommendations | L | Advisor / Compute Optimizer / Recommender right-sizing items reviewed |

---

## Well-Architected mapping

Name the provider's framework in the report: **Azure Well-Architected Framework**, **AWS Well-Architected Framework**, or **Google Cloud Well-Architected Framework**. Map each finding to one pillar: Security, Reliability, Performance efficiency, Cost optimisation, Operational excellence, plus Sustainability for AWS and GCP. Robustness findings map to Reliability. IaC and pipeline findings usually map to Operational excellence or Security, as shown in the tables.
