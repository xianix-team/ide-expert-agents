# IaC and Pipeline Review

Used in S1 (discovery), S2 (review), and S4 (native drift previews). Everything here is read-only unless marked otherwise.

## Discovery

Glob for these in the agreed paths, excluding `node_modules`, `.terraform`, `vendor`, and build output:

| Kind | Patterns | Confirm with |
|---|---|---|
| Terraform / OpenTofu | `**/*.tf`, `**/*.tfvars`, `**/.terraform.lock.hcl`, `**/terragrunt.hcl` | `terraform {`, `backend "`, `provider "` |
| Bicep / ARM | `**/*.bicep`, `**/*.bicepparam`, `**/azuredeploy*.json`, `**/*.parameters.json` | `targetScope`, `"$schema": ".../deploymentTemplate.json` |
| CloudFormation / SAM | `**/*.template.{yaml,yml,json}`, `**/template.{yaml,yml}`, `**/samconfig.toml` | `AWSTemplateFormatVersion`, `Transform: AWS::Serverless` |
| AWS CDK | `**/cdk.json` | `aws-cdk-lib` in the package manifest |
| Pulumi | `**/Pulumi.yaml`, `**/Pulumi.*.yaml` | `runtime:` |
| GCP Deployment Manager / Config Connector | `**/*.jinja`, YAML with `apiVersion: *.cnrm.cloud.google.com` | |
| Kubernetes / Helm / Kustomize | `**/Chart.yaml`, `**/values*.yaml`, `**/kustomization.yaml`, YAML with `kind: Deployment` | `apiVersion:` |
| Containers | `**/Dockerfile*`, `**/docker-compose*.yml`, `**/compose*.yaml` | |
| GitOps | `Application` / `ApplicationSet` (Argo CD), `Kustomization` / `HelmRelease` (Flux) | |
| GitHub Actions | `.github/workflows/*.{yml,yaml}`, `.github/actions/**/action.yml` | |
| Azure Pipelines | `azure-pipelines*.yml`, `**/*.pipeline.yml`, `templates/**/*.yml` with `stages:` or `jobs:` | |
| GitLab CI | `.gitlab-ci.yml`, `**/*.gitlab-ci.yml` | |
| Others | `Jenkinsfile`, `bitbucket-pipelines.yml`, `.circleci/config.yml`, `cloudbuild.yaml`, `buildspec.yml`, `atlantis.yaml`, `spacelift`, `env0` config | |
| Policy as code | `**/*.rego`, `**/*.sentinel`, `policy/**`, Azure Policy definitions (`"policyRule"`) | |

Then Grep for the signals the rubric needs instead of reading every file:

- **State and backends:** `backend "`, `terraform.tfstate` files committed, `use_lockfile`, `dynamodb_table`.
- **Pinning:** `required_version`, `required_providers`, `source = "git::` without `?ref=`, `uses: .*@(main|master|v?\d+)$` (unpinned actions).
- **Secrets in code:** `password\s*=\s*"`, `secret`, `access_key`, `client_secret`, `AccountKey=`, `-----BEGIN`, `AKIA[0-9A-Z]{16}`. Report the location only and never copy the value into the report.
- **Exposure:** `0.0.0.0/0`, `"*"` in source address prefixes, `public_network_access_enabled\s*=\s*true`, `publicly_accessible\s*=\s*true`, `allow_blob_public_access`, `acl\s*=\s*"public`.
- **Protection:** `prevent_destroy`, `deletion_protection`, `ignore_changes`.
- **Pipeline auth and gates:** `id-token: write`, `azure/login`, `aws-actions/configure-aws-credentials`, `google-github-actions/auth`, `role-to-assume`, `AWS_SECRET_ACCESS_KEY`, `ARM_CLIENT_SECRET`, `credentials_json`, `environment:`, `pull_request_target`, `permissions:`, `continue-on-error: true`, `|| true`, `-auto-approve`.

For each pipeline, write one line: *trigger → stages → environment → deploy identity → gates → scans*. Then draw the delivery flow per environment. Mark any manual step, for example "prod applied from a laptop" when no pipeline targets prod.

## Optional tooling

Offer these only if they are already on `PATH` (`command -v <tool>`). Ask before running, and say what each one does. Never install a tool without approval.

| Tool | Command (read-only) | Notes |
|---|---|---|
| terraform / tofu | `terraform fmt -check -recursive -diff` | Writes nothing |
| terraform validate | `terraform init -backend=false -input=false` then `terraform validate` | `init` writes `.terraform/` into the working tree and downloads providers. Ask first |
| tflint | `tflint --recursive` | May need `tflint --init` to download plugins. Ask first |
| checkov | `checkov -d <path> --compact --quiet` | Terraform, Bicep, ARM, CloudFormation, Kubernetes, Dockerfile, GitHub Actions |
| trivy | `trivy config <path>` | IaC misconfiguration; `trivy fs --scanners secret <path>` for secrets |
| Bicep | `az bicep lint --file <file>` | |
| cfn-lint | `cfn-lint <templates>` | |
| actionlint / zizmor | `actionlint`; `zizmor .github/workflows` | Workflow correctness and security |
| hadolint | `hadolint <Dockerfile>` | |
| kubeconform | `kubeconform -summary <manifests>` | Schema validation |

Treat tool hits as leads. Open the file, confirm the hit, and cite `path:line`. Record the tool, its version, and the counts in the report's method section.

## Native drift previews

Offered in S4, step 5, and run only after the engineer approves the exact command. These read real state and can see the live environment, so explain the caveats first:

- They execute the repository's IaC code with the engineer's credentials. Terraform `external` data sources, local-exec in data sources, CDK synth, and Pulumi programs run arbitrary code. Read them first, and decline if anything looks unsafe.
- They need the backend and state access. State contains secrets, so never print `terraform show` or `terraform state pull` output.
- They must not acquire a lock that blocks the team's pipeline, and they must never write a plan that someone could apply by mistake.

| Tool | Command | Why this form |
|---|---|---|
| Terraform / OpenTofu | `terraform plan -refresh-only -lock=false -input=false -no-color` | Shows live versus state without proposing changes; no lock; no `-out` file |
| Terraform (code vs live) | `terraform plan -lock=false -input=false -no-color` | Shows what an apply would change, which is the drift between code and reality |
| Bicep / ARM | `az deployment group what-if --resource-group <RG> --template-file <file> --parameters <params> --no-pretty-print` | Preview only |
| CloudFormation | `aws cloudformation describe-stack-resource-drifts --stack-name <STACK>` reads the last detection. `detect-stack-drift` starts a new detection: it doesn't change resources but is an API action, so ask | |
| CDK | `cdk diff` | Runs synth (code execution) |
| Pulumi | `pulumi preview --diff --non-interactive` | No `--refresh` unless approved |

Never run `apply`, `deploy`, `up`, `destroy`, `import`, `state rm`, `state mv`, `taint`, or `force-unlock`. If a preview fails on auth or backend access, record it as a coverage gap and fall back to the manual reconciliation.
