# Live Inspection

Used in S3 (authentication) and S4 (discovery). Every command here is read-only. Prefer targeted queries scoped to the agreed resource group, tags, or project over account-wide listing. Add `--output json` / `--format=json` and narrow with `--query` / `--format` to keep output small.

## Secret-safe queries

Several "show" commands return secret values: app settings, environment variables, connection strings, and task definitions. **Always project names only**, as in the examples below. If a value is printed anyway, don't repeat it. Report that a credential-like value is stored in plain configuration and where, by setting name.

Never run: `az keyvault secret show`, `az webapp config appsettings list` without a name-only `--query`, `az storage account keys list`, `az cosmosdb keys list`, `aws secretsmanager get-secret-value`, `aws ssm get-parameter --with-decryption`, `gcloud secrets versions access`, `kubectl get secret -o yaml|json`, `terraform show`, or `terraform state pull`.

---

## Authentication

Check first. If the check fails, give the engineer the login command to run themselves and wait.

| Cloud | Check | Engineer logs in with |
|---|---|---|
| Azure | `az account show --output json` | `az login` (add `--tenant <TENANT_ID>` if needed), then `az account set --subscription <SUB>` |
| AWS | `aws sts get-caller-identity --output json` | `aws sso login --profile <PROFILE>` and `export AWS_PROFILE=<PROFILE>`, or `aws configure` |
| GCP | `gcloud auth list --format=json` and `gcloud config list --format=json` | `gcloud auth login`, then `gcloud config set project <PROJECT_ID>` |
| Kubernetes | `kubectl config current-context` and `kubectl auth can-i --list` | The engineer fetches credentials (`az aks get-credentials`, `aws eks update-kubeconfig`, `gcloud container clusters get-credentials`). These write to the local kubeconfig, so the engineer runs them |
| GitHub | `gh auth status` | `gh auth login` |
| Azure DevOps | `az devops configure --list` | `az devops login`; needs the `azure-devops` extension. Ask before `az extension add` |
| GitLab | `glab auth status` | `glab auth login` |

---

## Azure

```bash
# Inventory
az resource list --resource-group <RG> --output json
az graph query -q "Resources | where resourceGroup =~ '<RG>' | project name, type, location, sku, tags" --output json   # needs resource-graph extension

# Compute
az webapp list --resource-group <RG> --query "[].{name:name, state:state, httpsOnly:httpsOnly, plan:appServicePlanId}" --output json
az webapp config show --resource-group <RG> --name <APP> --query "{minTls:minTlsVersion, ftps:ftpsState, alwaysOn:alwaysOn, http2:http20Enabled, healthCheck:healthCheckPath}" --output json
az webapp config appsettings list --resource-group <RG> --name <APP> --query "[].name" --output json        # names only
az webapp identity show --resource-group <RG> --name <APP> --output json
az containerapp list --resource-group <RG> --query "[].{name:name, ingress:properties.configuration.ingress.external, minReplicas:properties.template.scale.minReplicas, maxReplicas:properties.template.scale.maxReplicas}" --output json
az aks list --resource-group <RG> --query "[].{name:name, version:kubernetesVersion, private:apiServerAccessProfile.enablePrivateCluster, rbac:enableRbac, aad:aadProfile.managed, pools:agentPoolProfiles[].{name:name, count:count, zones:availabilityZones, vmSize:vmSize}}" --output json
az functionapp list --resource-group <RG> --query "[].{name:name, httpsOnly:httpsOnly}" --output json

# Networking
az network vnet list --resource-group <RG> --output json
az network nsg list --resource-group <RG> --query "[].{name:name, rules:securityRules[?direction=='Inbound'].{name:name, port:destinationPortRange, ports:destinationPortRanges, src:sourceAddressPrefix, access:access}}" --output json
az network private-endpoint list --resource-group <RG> --output json
az network application-gateway list --resource-group <RG> --output json
az network front-door list --resource-group <RG> --output json   # classic; Front Door Standard/Premium: az afd profile list

# Data
az sql server list --resource-group <RG> --query "[].{name:name, publicAccess:publicNetworkAccess, minTls:minimalTlsVersion}" --output json
az sql db list --resource-group <RG> --server <SERVER> --query "[].{name:name, sku:currentSku.name, zoneRedundant:zoneRedundant, backupRedundancy:requestedBackupStorageRedundancy}" --output json
az postgres flexible-server list --resource-group <RG> --query "[].{name:name, ha:highAvailability.mode, backupDays:backup.backupRetentionDays, geoBackup:backup.geoRedundantBackup, public:network.publicNetworkAccess}" --output json
az cosmosdb list --resource-group <RG> --query "[].{name:name, public:publicNetworkAccess, locations:locations[].locationName, backup:backupPolicy.type}" --output json
az redis list --resource-group <RG> --query "[].{name:name, sku:sku.name, nonSsl:enableNonSslPort, minTls:minimumTlsVersion, public:publicNetworkAccess}" --output json
az storage account list --resource-group <RG> --query "[].{name:name, blobPublic:allowBlobPublicAccess, httpsOnly:enableHttpsTrafficOnly, minTls:minimumTlsVersion, sharedKey:allowSharedKeyAccess, network:networkRuleSet.defaultAction, replication:sku.name}" --output json

# Secrets and identity
az keyvault list --resource-group <RG> --query "[].name" --output json
az keyvault show --name <KV> --query "{softDelete:properties.enableSoftDelete, purgeProtection:properties.enablePurgeProtection, rbac:properties.enableRbacAuthorization, public:properties.publicNetworkAccess}" --output json
az role assignment list --resource-group <RG> --include-inherited --query "[].{principal:principalName, type:principalType, role:roleDefinitionName, scope:scope}" --output json
az lock list --resource-group <RG> --output json

# Monitoring
az monitor diagnostic-settings list --resource <RESOURCE_ID> --output json
az monitor log-analytics workspace list --resource-group <RG> --query "[].{name:name, retentionDays:retentionInDays}" --output json
az monitor metrics alert list --resource-group <RG> --output json
az monitor scheduled-query list --resource-group <RG> --output json
az monitor action-group list --resource-group <RG> --output json

# Posture and recommendations
az advisor recommendation list --query "[?contains(resourceMetadata.resourceId, '<RG>')]" --output json
az security assessment list --query "[?status.code=='Unhealthy'].{name:displayName, resource:resourceDetails.Id, severity:metadata.severity}" --output json
az policy state summarize --resource-group <RG> --output json
az consumption budget list --output json
```

**Change history:** `az deployment group list --resource-group <RG> --query "[].{name:name, time:properties.timestamp, state:properties.provisioningState}"` shows template deployments. `az monitor activity-log list --resource-group <RG> --offset 30d --query "[?contains(operationName.value, 'write') || contains(operationName.value, 'delete')].{time:eventTimestamp, op:operationName.value, caller:caller, resource:resourceId}"` shows who changed what. Any caller other than the pipeline identity is an out-of-band change.

## AWS

Pass `--region <REGION>` for each region in scope. IAM, CloudFront, and Route 53 are global.

```bash
# Inventory
aws resourcegroupstaggingapi get-resources --tag-filters Key=<TAG_KEY>,Values=<TAG_VALUE> --output json
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE UPDATE_ROLLBACK_COMPLETE --output json

# Compute
aws ec2 describe-instances --filters Name=tag:<TAG_KEY>,Values=<TAG_VALUE> --query "Reservations[].Instances[].{id:InstanceId, type:InstanceType, az:Placement.AvailabilityZone, public:PublicIpAddress, imds:MetadataOptions.HttpTokens, state:State.Name}" --output json
aws autoscaling describe-auto-scaling-groups --query "AutoScalingGroups[].{name:AutoScalingGroupName, min:MinSize, max:MaxSize, azs:AvailabilityZones, health:HealthCheckType}" --output json
aws ecs list-clusters --output json
aws ecs describe-services --cluster <CLUSTER> --services <SERVICES> --query "services[].{name:serviceName, desired:desiredCount, launch:launchType, deploymentCircuitBreaker:deploymentConfiguration.deploymentCircuitBreaker}" --output json
aws ecs describe-task-definition --task-definition <TD> --query "taskDefinition.containerDefinitions[].{name:name, image:image, envNames:environment[].name, secrets:secrets[].name, readonlyRoot:readonlyRootFilesystem, logs:logConfiguration.logDriver}" --output json   # names only
aws eks describe-cluster --name <CLUSTER> --query "cluster.{version:version, publicEndpoint:resourcesVpcConfig.endpointPublicAccess, publicCidrs:resourcesVpcConfig.publicAccessCidrs, logging:logging.clusterLogging}" --output json
aws lambda list-functions --query "Functions[].{name:FunctionName, runtime:Runtime, memory:MemorySize, timeout:Timeout, envNames:Environment.Variables && keys(Environment.Variables), dlq:DeadLetterConfig.TargetArn, tracing:TracingConfig.Mode}" --output json   # names only

# Networking
aws ec2 describe-vpcs --output json
aws ec2 describe-subnets --filters Name=vpc-id,Values=<VPC_ID> --query "Subnets[].{id:SubnetId, az:AvailabilityZone, publicIp:MapPublicIpOnLaunch}" --output json
aws ec2 describe-security-groups --query "SecurityGroups[].{id:GroupId, name:GroupName, inbound:IpPermissions[].{from:FromPort, to:ToPort, cidrs:IpRanges[].CidrIp, v6:Ipv6Ranges[].CidrIpv6}}" --output json
aws elbv2 describe-load-balancers --output json                    # ALB / NLB
aws elb describe-load-balancers --output json                      # classic ELB
aws elbv2 describe-target-groups --query "TargetGroups[].{name:TargetGroupName, healthPath:HealthCheckPath}" --output json
aws wafv2 list-web-acls --scope REGIONAL --output json
aws shield get-subscription-state --output json

# Data
aws rds describe-db-instances --query "DBInstances[].{id:DBInstanceIdentifier, class:DBInstanceClass, multiAZ:MultiAZ, encrypted:StorageEncrypted, public:PubliclyAccessible, backupDays:BackupRetentionPeriod, deletionProtection:DeletionProtection, iamAuth:IAMDatabaseAuthenticationEnabled}" --output json
aws rds describe-db-clusters --query "DBClusters[].{id:DBClusterIdentifier, multiAZ:MultiAZ, encrypted:StorageEncrypted, backupDays:BackupRetentionPeriod, deletionProtection:DeletionProtection}" --output json
aws dynamodb describe-continuous-backups --table-name <TABLE> --output json
aws elasticache describe-replication-groups --query "ReplicationGroups[].{id:ReplicationGroupId, multiAZ:MultiAZ, failover:AutomaticFailover, transit:TransitEncryptionEnabled, rest:AtRestEncryptionEnabled}" --output json
aws s3control get-public-access-block --account-id <ACCOUNT_ID> --output json
aws s3api get-public-access-block --bucket <BUCKET> --output json
aws s3api get-bucket-encryption --bucket <BUCKET> --output json
aws s3api get-bucket-versioning --bucket <BUCKET> --output json
aws sqs get-queue-attributes --queue-url <URL> --attribute-names RedrivePolicy --output json

# Secrets and identity
aws secretsmanager list-secrets --query "SecretList[].{name:Name, rotation:RotationEnabled, lastRotated:LastRotatedDate}" --output json
aws iam get-account-summary --output json
aws iam list-roles --query "Roles[].{name:RoleName, trust:AssumeRolePolicyDocument}" --output json
aws iam list-attached-role-policies --role-name <ROLE> --output json
aws iam list-open-id-connect-providers --output json                    # CI OIDC federation present?
aws iam list-users --query "Users[].UserName" --output json
aws iam list-access-keys --user-name <USER> --output json               # key age, not the secret

# Monitoring
aws cloudwatch describe-alarms --query "MetricAlarms[].{name:AlarmName, metric:MetricName, actions:AlarmActions}" --output json
aws logs describe-log-groups --query "logGroups[].{name:logGroupName, retentionDays:retentionInDays}" --output json
aws cloudtrail describe-trails --output json
aws xray get-groups --output json

# Posture and recommendations
aws securityhub get-findings --filters '{"RecordState":[{"Value":"ACTIVE","Comparison":"EQUALS"}],"SeverityLabel":[{"Value":"CRITICAL","Comparison":"EQUALS"},{"Value":"HIGH","Comparison":"EQUALS"}]}' --max-items 100 --output json
aws configservice describe-compliance-by-config-rule --compliance-types NON_COMPLIANT --output json
aws compute-optimizer get-ec2-instance-recommendations --output json
aws support describe-trusted-advisor-checks --language en --region us-east-1 --output json   # needs Business or Enterprise support
aws budgets describe-budgets --account-id <ACCOUNT_ID> --output json
```

Cost Explorer (`aws ce get-cost-and-usage`) is charged per request. Ask before using it.

**Change history:** `aws cloudtrail lookup-events --lookup-attributes AttributeKey=ReadOnly,AttributeValue=false --start-time <30-days-ago> --max-results 200 --query "Events[].{time:EventTime, name:EventName, user:Username, source:EventSource}"`. Writes by identities other than the pipeline role are out-of-band changes. For CloudFormation stacks, `aws cloudformation describe-stack-resource-drifts --stack-name <STACK>` reads the last drift detection.

## GCP

```bash
# Inventory
gcloud asset search-all-resources --scope=projects/<PROJECT_ID> --format=json     # needs Cloud Asset API

# Compute
gcloud run services list --project=<PROJECT_ID> --format=json
gcloud run services describe <SERVICE> --region=<REGION> --project=<PROJECT_ID> --format="json(spec.template.metadata.annotations, spec.template.spec.serviceAccountName, spec.template.spec.containers[].env[].name, metadata.annotations)"   # env names only
gcloud compute instances list --project=<PROJECT_ID> --format="json(name, zone, machineType, status, networkInterfaces[].accessConfigs[].natIP, serviceAccounts[].email, shieldedInstanceConfig)"
gcloud compute instance-groups managed list --project=<PROJECT_ID> --format=json
gcloud container clusters list --project=<PROJECT_ID> --format="json(name, location, currentMasterVersion, privateClusterConfig, masterAuthorizedNetworksConfig, workloadIdentityConfig, releaseChannel, nodePools[].{name:name, autoscaling:autoscaling, locations:locations})"
gcloud functions list --project=<PROJECT_ID> --format=json
gcloud app versions list --project=<PROJECT_ID> --format=json

# Networking
gcloud compute networks list --project=<PROJECT_ID> --format=json
gcloud compute firewall-rules list --project=<PROJECT_ID> --format="json(name, direction, sourceRanges, allowed, targetTags, disabled)"
gcloud compute forwarding-rules list --project=<PROJECT_ID> --format=json
gcloud compute url-maps list --project=<PROJECT_ID> --format=json
gcloud compute backend-services list --project=<PROJECT_ID> --format="json(name, healthChecks, securityPolicy, logConfig)"
gcloud compute security-policies list --project=<PROJECT_ID> --format=json        # Cloud Armor
gcloud compute ssl-certificates list --project=<PROJECT_ID> --format="json(name, type, expireTime, managed.status)"

# Data
gcloud sql instances list --project=<PROJECT_ID> --format="json(name, databaseVersion, settings.tier, settings.availabilityType, settings.backupConfiguration, settings.ipConfiguration.ipv4Enabled, settings.ipConfiguration.requireSsl, settings.ipConfiguration.authorizedNetworks, settings.deletionProtectionEnabled)"
gcloud firestore databases list --project=<PROJECT_ID> --format=json
gcloud redis instances list --project=<PROJECT_ID> --region=<REGION> --format="json(name, tier, transitEncryptionMode, authEnabled)"
gcloud storage buckets list --project=<PROJECT_ID> --format="json(name, location, public_access_prevention, uniform_bucket_level_access, versioning_enabled, lifecycle_config)"

# Secrets and identity
gcloud secrets list --project=<PROJECT_ID> --format="json(name, replication, rotation)"
gcloud projects get-iam-policy <PROJECT_ID> --format=json
gcloud iam service-accounts list --project=<PROJECT_ID> --format=json
gcloud iam service-accounts keys list --iam-account=<SA_EMAIL> --managed-by=user --format=json   # user-managed keys present?
gcloud iam workload-identity-pools list --location=global --project=<PROJECT_ID> --format=json   # CI federation present?

# Monitoring
gcloud logging sinks list --project=<PROJECT_ID> --format=json
gcloud logging buckets list --location=global --project=<PROJECT_ID> --format="json(name, retentionDays)"
gcloud monitoring channels list --project=<PROJECT_ID> --format=json
gcloud alpha monitoring policies list --project=<PROJECT_ID> --format=json

# Posture and recommendations
gcloud recommender recommendations list --project=<PROJECT_ID> --location=<ZONE_OR_REGION> --recommender=google.compute.instance.MachineTypeRecommender --format=json
gcloud recommender recommendations list --project=<PROJECT_ID> --location=global --recommender=google.iam.policy.Recommender --format=json
gcloud scc findings list organizations/<ORG_ID> --filter="state=\"ACTIVE\" AND resourceName:\"projects/<PROJECT_NUMBER>\"" --format=json   # needs org-level SCC access
gcloud billing budgets list --billing-account=<BILLING_ACCOUNT> --format=json
```

**Change history:** `gcloud logging read 'logName:"cloudaudit.googleapis.com%2Factivity"' --project=<PROJECT_ID> --freshness=30d --limit=200 --format="json(timestamp, protoPayload.methodName, protoPayload.authenticationInfo.principalEmail, protoPayload.resourceName)"`. Principals other than the pipeline service account are out-of-band changes.

## Kubernetes (AKS / EKS / GKE)

Confirm the context first (S3). Then:

```bash
kubectl get namespaces -o json
kubectl get deploy,sts,ds -n <NS> -o json          # replicas, probes, resources, securityContext, image tags
kubectl get svc,ingress -n <NS> -o json            # exposure
kubectl get hpa,pdb,networkpolicy -n <NS> -o json
kubectl get secrets -n <NS> -o name                # names only, never -o yaml/json
kubectl get clusterrolebindings -o json            # cluster-admin bindings
kubectl get applications -A -o json                # Argo CD, if present
```

## Pipeline platforms

```bash
# GitHub
gh run list --limit 30 --json workflowName,conclusion,event,headBranch,createdAt
gh secret list                                     # names only
gh variable list
gh api repos/{owner}/{repo}/environments                       # protection rules, reviewers
gh api repos/{owner}/{repo}/branches/<DEFAULT_BRANCH>/protection   # needs admin; a 404 may mean no protection or no access, so record which
gh api repos/{owner}/{repo}/actions/permissions

# Azure DevOps (azure-devops extension)
az pipelines list --output json
az pipelines runs list --top 30 --output json
az devops service-endpoint list --output json      # check authorization scheme: WorkloadIdentityFederation vs ServicePrincipal secret
az pipelines variable-group list --output json     # secret values are masked; record names only
az repos policy list --output json                 # branch policies

# GitLab
glab ci list
glab api projects/:id/protected_branches
glab api projects/:id/protected_environments
```
