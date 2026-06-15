import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal, 
  ShieldAlert, 
  BadgeAlert, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  HelpCircle,
  FileText,
  Clock,
  Play
} from "lucide-react";

interface LogLine {
  text: string;
  type: "system" | "user" | "metrics";
}

interface IncidentScenario {
  weekNum: number;
  title: string;
  theme: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  component: string;
  duration: string;
  context: string;
  threatLevel: string;
  initialLog: string;
  remediationSteps: string[];
  suggestedCommands: string[];
  mockResponses: {
    commandPattern: RegExp;
    output: string;
  }[];
}

interface IncidentSimulatorProps {
  currentWeek: number;
  weekTheme: string;
}

// 20 unique high-fidelity real-world SRE projects, one for every week in the 5-month syllabus.
const weeklyIncidents: Record<number, IncidentScenario> = {
  1: {
    weekNum: 1,
    title: "Checkout Gateway SLO Crash & Alert Storm",
    theme: "SRE Metrics & SLO Engineering",
    difficulty: "Beginner",
    component: "nginx-ingress & checkout-api",
    duration: "45 mins",
    context: "An anomalous spike in 5xx errors on the `/checkout` route is threatening to completely burn Month 1's error budget within a 1-hour window. Prometheus alerts are firing warning and critical alerts in an endless loop.",
    threatLevel: "CRITICAL (Burning 12x error budget rate)",
    initialLog: "CRITICAL Alert: SLO_BurnRate_Critical - Active for 6m32s\nValue: 14.4 (Scribble target: 2% budget consumption over 1h)\nTarget: checkout-api.production.svc.cluster.local\nMetrics: avg(rate(http_requests_total{status=~'5..'}[5m])) / avg(rate(http_requests_total[5m])) > 0.02",
    remediationSteps: [
      "Query current http_requests_total rate filtered by status codes.",
      "Identify the upstream microservice (checkout-db or billing-proxy) returning 503 Gateway Timeout.",
      "Formulate a transient alert inhibition rules policy to stop alerts downstream.",
      "Simulate service scaling or resource constraints check to mitigate checkout traffic."
    ],
    suggestedCommands: ["kubectl get service", "kubectl logs -f deployment/checkout-api", "promql rates"],
    mockResponses: [
      {
        commandPattern: /kubectl/i,
        output: "NAME           TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)             AGE\ncheckout-api   ClusterIP   10.96.22.44   <none>        8080/TCP            12d\n\nPod logs reveal:\n[ERROR] 2026-06-15 00:44:02 upstream connect error or disconnect/reset before headers. reset reason: connection timeout to billing-proxy:9000"
      },
      {
        commandPattern: /promql/i,
        output: "Active PromQL Metrics:\nsum(rate(http_requests_total{status=~'5..'}[5m])) = 42.5 req/sec\nsum(rate(http_requests_total{status=~'2..'}[5m])) = 631.0 req/sec\nError budget burn rate is currently: 14.8 (Target SLO threshold is 1.0; severe violation in progress)."
      }
    ]
  },
  2: {
    weekNum: 2,
    title: "OOM-Killed Container Loops (Exit 137)",
    theme: "Infrastructure Diagnostics & Linux Internals",
    difficulty: "Intermediate",
    component: "cgroups & container runtime daemon",
    duration: "1 hour",
    context: "Worker pods are repeatedly returning CrashLoopBackOff after processing memory-heavy telemetry. The kernel Out-Of-Memory (OOM) Killer is terminating container hosts under swap tension.",
    threatLevel: "HIGH (Loss of processing pipeline capacity)",
    initialLog: "Kubelet Notification Node-02:\nSystem OOM-killer invoked: Killed process 384013 (node-telemetry) total-vm:4194304kB, anon-rss:2097152kB, file-rss:0kB\nState: Pod Status: CrashLoopBackOff - Exit Code: 137 (OOMKilled)",
    remediationSteps: [
      "Check kernel system ring buffer for OOM events.",
      "Compare host limit boundaries to the cgroups runtime settings files.",
      "Check file descriptor limits setup inside limits.conf.",
      "Tune swappiness values and assign correct cgroup memory thresholds."
    ],
    suggestedCommands: ["dmesg -T | grep -i oom", "kubectl describe pod node-telemetry", "lsof | wc -l"],
    mockResponses: [
      {
        commandPattern: /dmesg/i,
        output: "[Mon Jun 15 00:44:02 2026] node-telemetry invoked oom-killer: gfp_mask=0xcc0(GFP_KERNEL), order=0, oom_score_adj=950\n[Mon Jun 15 00:44:02 2026] CPU: 12 PID: 384013 Comm: node-telemetry Not tainted 5.15.0-89-generic\n[Mon Jun 15 00:44:02 2026] Memory cgroup out of memory: Killed process 384013 (node-telemetry) swap-consumption: 0B"
      },
      {
        commandPattern: /kubectl/i,
        output: "State: Running (since Mon, 15 Jun 2026 00:41:00)\n Last State: Terminated\n  Reason: OOMKilled\n  Exit Code: 137\n  Started: Mon, 15 Jun 2026 00:42:00\n  Finished: Mon, 15 Jun 2026 00:43:55"
      },
      {
        commandPattern: /lsof/i,
        output: "Active File Descriptors on PID 384013: 4096 (WARNING: Hard limit reached! System is out of file handles)."
      }
    ]
  },
  3: {
    weekNum: 3,
    title: "Orphaned Traces & Missing Span Propagation",
    theme: "Distributed Observability",
    difficulty: "Intermediate",
    component: "OpenTelemetry SDK & envoy-proxy",
    duration: "50 mins",
    context: "Trace trees are showing orphan segments when traversing the API gateway proxy service. Downstream service spans are completely disconnected due to REST header laundering.",
    threatLevel: "MEDIUM (System blind-spots on microservice queries)",
    initialLog: "OTel Collector Export Warnings:\nSpan dropped: parent_span_id '0000000000000000' is null but trace_id '4f5c6b7d2e...' is present.\nCause: HTTP Gateway stripped W3C 'traceparent' headers on downstream pass.",
    remediationSteps: [
      "Examine API Gateway configuration policies for downstream headers stripping.",
      "Verify the W3C OpenTelemetry propagator is successfully registered inside application code.",
      "Debug transport endpoints with curl to confirm headers presence."
    ],
    suggestedCommands: ["curl -I http://api-gateway/health", "kubectl logs deployment/otel-collector"],
    mockResponses: [
      {
        commandPattern: /curl/i,
        output: "HTTP/1.1 200 OK\nDate: Mon, 15 Jun 2026 00:44:02 GMT\nContent-Type: application/json\nConnection: keep-alive\nx-envoy-upstream-service-time: 4\nServer: envoy\n(MISSING: 'traceparent' or 'b3' headers are conspicuously absent from downstream proxy headers!)"
      },
      {
        commandPattern: /kubectl/i,
        output: "[OTel Collector Logger] Ingested spans counts: 15 \nWarning: Trace ID '4f5c6b7d' references parent 'ab908e' which cannot be found. Root trace was declared by client-browser but was not propagated."
      }
    ]
  },
  4: {
    weekNum: 4,
    title: "Loki High Cardinality Index Blowout",
    theme: "Log Aggregation & Log-to-Metric Correlation",
    difficulty: "Advanced",
    component: "Grafana Loki & promtail-collector",
    duration: "1 hour",
    context: "Grafana Loki is failing to execute log queries, returning out-of-memory timeouts. An application developer committed a trace configuration that uses unique User IP addresses as static Loki index labels.",
    threatLevel: "HIGH (Complete loss of logging observability)",
    initialLog: "Loki Ingestion Warnings:\nIngester store rejected payload. Maximum allowed active streams limit (30,000) exceeded for label group 'user_ip'.\nHigh cardinality detected. Index file size has bloated by 520% in the last 4 hours.",
    remediationSteps: [
      "Review promtail configuration patterns to determine indexed labels.",
      "Remove dynamic parameters (such as IP addresses, user IDs, or UUIDs) from labels blocks.",
      "Re-configure labels extraction to use logfmt or structured JSON parsing.",
      "Verify stream counts decline back to standard tolerances."
    ],
    suggestedCommands: ["kubectl describe configmap/promtail", "logcli labels | grep ip"],
    mockResponses: [
      {
        commandPattern: /configmap/i,
        output: "scrape_configs:\n- job_name: app-logs\n  pipeline_stages:\n  - json:\n      expressions:\n        user_ip: ip_address\n  - labels:\n      user_ip: (CRITICAL ERROR: dynamic ip address added as static cluster index label!)"
      },
      {
        commandPattern: /logcli/i,
        output: "Active Index Labels found:\n- app\n- env\n- namespace\n- user_ip (384,105 unique streams - EXTREME HIGH CARDINALITY DETECTED!)"
      }
    ]
  },
  5: {
    weekNum: 5,
    title: "Terraform Shared DynamoDB Lockup",
    theme: "Infrastructure as Code & Advanced Terraform",
    difficulty: "Beginner",
    component: "Terraform remote state & DynamoDB lock table",
    duration: "30 mins",
    context: "Emergency VPC firewall rules cannot be applied because the shared S3/DynamoDB terraform remote state is locked by a stale, zombie Jenkins builder process that was killed midway.",
    threatLevel: "HIGH (Cannot update cloud resources during outage)",
    initialLog: "Terraform Plan Error:\nError: Error acquiring the state lock: State lock is already held by: ID: 'e89a3f2c-e761-4122-b5e1-8898144b673a'\nLock info: path: production/terraform.tfstate, Operation: Workspace, User: jenkins-vm, Created: 2026-06-15 00:10:00 UTC",
    remediationSteps: [
      "Trace state lockholder identity details in DynamoDB table.",
      "Confirm that the operation has indeed been terminated.",
      "Safely invoke the force-unlock code using the unique ID.",
      "Re-try terraform plan to confirm structural state access is restored."
    ],
    suggestedCommands: ["terraform plan", "terraform force-unlock e89a3f2c-e761-4122-b5e1-8898144b673a"],
    mockResponses: [
      {
        commandPattern: /plan/i,
        output: "Error: Error acquiring state lock. Locked by Operation Workspace ID: e89a3f2c-e761-4122-b5e1-8898144b673a\nPlease release the lock or run force-unlock."
      },
      {
        commandPattern: /force-unlock/i,
        output: "Local state lock successfully released in DynamoDB state mutex table.\nInitializing backend with S3 and verifying state file hashes... SUCCESS.\nReady to run 'terraform plan/apply' securely."
      }
    ]
  },
  6: {
    weekNum: 6,
    title: "Trivy Base Image Vulnerability Check Bypass",
    theme: "Secure Continuous Integration & Supply Chain Security",
    difficulty: "Intermediate",
    component: "GitLab CI Runner & Trivy Scanner",
    duration: "40 mins",
    context: "Production builds are failing completely inside GitLab CI. An automated Trivy container scan found 4 CVEs inside the standard Debian base image and threw a hard block, halting the entire delivery train.",
    threatLevel: "HIGH (CI pipeline blocked for hotfixes)",
    initialLog: "GitLab CI Job #104882 Failed:\n[VULNERABILITY REPORT] CVE-2023-4911 (Looney Tunables): CRITICAL score 9.8\nSeverity Threshold met: [CRITICAL/HIGH found]. Exiting with code 1. Pipeline Terminated.",
    remediationSteps: [
      "Analyze the dockerfile base-image configurations.",
      "Refactor the app to build atop a distroless or lightweight Alpine base-image.",
      "Execute local container checks and sign production images using Cosign keys."
    ],
    suggestedCommands: ["cat Dockerfile", "trivy image image-name:latest"],
    mockResponses: [
      {
        commandPattern: /cat/i,
        output: "FROM debian:stretch (OUTDATED BASE IMAGE! Heavy, with 120 unneeded dependencies exposing vulnerabilities)\nRUN apt-get update && apt-get install -y python3 curl nodejs\nCOPY . /app"
      },
      {
        commandPattern: /trivy/i,
        output: "debian:stretch (debian 9.0) found:\n- Total CVEs: 43 (3 CRITICAL, 12 HIGH)\n- Recommended: Update base layer to FROM gcr.io/distroless/nodejs20-debian11 or Alpine for minimal vulnerability footings."
      }
    ]
  },
  7: {
    weekNum: 7,
    title: "ArgoCD Repository Tag Sync-Loop Freeze",
    theme: "GitOps Continuous Delivery & Declarative Deployments",
    difficulty: "Advanced",
    component: "ArgoCD Application Controller & Kustomize",
    duration: "1 hour",
    context: "ArgoCD was configured to sync tags dynamically, but an invalid image tags format is throwing infinite reconciliations on the main controller, causing CPU starvation across the entire cluster namespaces.",
    threatLevel: "HIGH (Cluster synchronization is frozen)",
    initialLog: "ArgoCD Application Controller Logs:\nError: Application 'billing-service' is parsing target revision: manifest generation failed.\nReason: invalid name: tag contains illegal format characters '!@#' inside image field override.",
    remediationSteps: [
      "Access ArgoCD controllers status with kubectl commands.",
      "Locate the malfunctioning application yaml resource.",
      "Update Kustomize files to target valid tag hashes or strict semver strings.",
      "Trigger manual synchronization on ArgoCD application limits."
    ],
    suggestedCommands: ["kubectl get application -n argocd", "kubectl describe application billing-service"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME              SYNC_STATUS   HEALTH_STATUS   AGE\nbilling-service   OutOfSync     Degraded        4d\nauth-proxy        Synced        Healthy         12d"
      },
      {
        commandPattern: /describe/i,
        output: "Spec:\n  Source:\n    Kustomize:\n      Image Overrides:\n        Name:        billing-image\n        New Tag:     v2.1.0-hotfix_!@#-$ (ILLEGAL SYNTAX! Spec failed validation on k8s master api)."
      }
    ]
  },
  8: {
    weekNum: 8,
    title: "Argo Rollouts Prometheus Analysis Template Failure",
    theme: "Progressive Delivery & SLO-driven Rollbacks",
    difficulty: "Advanced",
    component: "Argo Rollouts controller & prometheus",
    duration: "1 hour",
    context: "A progressive metric canary rollout has frozen at 20% validation stage. The AnalysisTemplate query is returning null, preventing Argo from automatically trigger roll-forward or rollback checks.",
    threatLevel: "CRITICAL (Deployment pipeline frozen midway)",
    initialLog: "Argo Rollout Status Description:\nApplication billing-canary: Running (Paused - step 1/5 at 20%)\nAnalysisRun 'billing-check-1' State: Failed\nErrorMessage: Prometheus Query returned no matching measurements. Check query metrics labels.",
    remediationSteps: [
      "Check Active AnalysisRun logs to verify exact Prometheus metrics query.",
      "Run the PromQL query directly on the terminal server.",
      "Identify label name clashes (e.g., mismatching cluster name mappings) in Prometheus.",
      "Update the AnalysisTemplate definitions to restore correct query outputs."
    ],
    suggestedCommands: ["kubectl get analysisrun", "kubectl describe analysistemplate billing-metric-check"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME              STATUS   SUCCESS   FAILURE   CRITICAL_COUNT\nbilling-check-1   Failed   0         1         0"
      },
      {
        commandPattern: /describe/i,
        output: "Spec:\n  Metrics:\n  - Name:   error-rate-ratio\n    Query:  sum(rate(http_500_total{cluster_name='wrong-deployment-env'}[5m]))\n    (ERROR: query target mismatch! Host cluster name is actually 'production-main')."
      }
    ]
  },
  9: {
    weekNum: 9,
    title: "Database Operator CRD Validation Rejections",
    theme: "Kubernetes Extensibility & Custom Controller Mechanics",
    difficulty: "Expert",
    component: "Kubernetes API Server & CRD API definitions",
    duration: "1h 15m",
    context: "An automated DB schema update failed because a newly updated Database-Operator CRD lacks safe structural OpenAPIV3 validation boundaries. The API Server rejected custom parameters on validation constraints.",
    threatLevel: "HIGH (Cannot execute DB scale adjustments)",
    initialLog: "Kubernetes Master API logs:\nEvent: ValidationFailed on spec.properties: type mismatch on Database schema. MaxConnections parameter exceeded structural parameters list.",
    remediationSteps: [
      "Examine API definition blocks of the custom resource definition.",
      "Configure required properties validations inside the OpenAPIV3Schema.",
      "Re-apply CRD schema fields and trigger database sync commands."
    ],
    suggestedCommands: ["kubectl get crd postgres-db-operator", "kubectl explain postgresdb.spec"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME                                         CREATED AT\npostgresdb.database.sre.io                   2026-06-10T00:00:00Z"
      },
      {
        commandPattern: /explain/i,
        output: "Spec:\n  MaxConnections: <integer_type>\n  (ERROR: validation schema inside database-operator CRD expects a string but received raw integer: '500'. Adjust CRD specification limits)."
      }
    ]
  },
  10: {
    weekNum: 10,
    title: "Infinite Reconciliation Loop Resource Thrashing",
    theme: "Operator Development with Kubebuilder / Operator SDK",
    difficulty: "Expert",
    component: "Controller Manager daemon & custom operator",
    duration: "1h 30m",
    context: "A custom scaling controller got stuck in an infinite reconciliation cycle, sending 25,000 requests per minute to the core K8s API server, triggering rate limits on cluster resources.",
    threatLevel: "CRITICAL (API Server rate limiting other services)",
    initialLog: "K8s API Trace Warnings:\nIP 10.244.1.10 rate-limit exceeded: 429 Too Many Requests on route /api/v1/namespaces/default/endpoints/scaling-service-lock.\nCause: Reconcile loop returned requeue:true on status update event.",
    remediationSteps: [
      "Check developer prints on the controller deployment logs.",
      "Verify code logic to prevent updating spec properties inside Status update callbacks.",
      "Enforce exponential backoff durations on failure return statements."
    ],
    suggestedCommands: ["kubectl logs deployment/custom-scaling-controller", "kubectl scale deployment/custom-scaling-controller --replicas=0"],
    mockResponses: [
      {
        commandPattern: /logs/i,
        output: "2026-06-15 00:44:02.321 INFO [Reconciler] Reconciling resources status state.\n2026-06-15 00:44:02.324 INFO [Reconciler] Updating Spec.Version override to avoid drifts...\n2026-06-15 00:44:02.342 DEBUG [Reconciler] Requeuing state instantly! (RECONCILE LOOP TRAP: updating spec triggers a new reconcile thread endlessly!)"
      },
      {
        commandPattern: /scale/i,
        output: "Deployment 'custom-scaling-controller' scaled to 0 replicas successfully.\nK8s API Server pressure is immediately declining... 200 OK restored."
      }
    ]
  },
  11: {
    weekNum: 11,
    title: "Crossplane aws-provider Rate Limiting Backoff",
    theme: "Infrastructure Declarations via Crossplane",
    difficulty: "Advanced",
    component: "Crossplane controller & AWS Cloud Provider API",
    duration: "1 hour",
    context: "Crossplane is failing to provision managed RDS resources. Out-of-band updates on subnets triggered continuous state checks, resulting in API rate limiting at the hypervisor level.",
    threatLevel: "HIGH (New databases provisioning is blocked)",
    initialLog: "Crossplane Provider-AWS logs:\nReconciliation error: RequestLimitExceeded: AWS API call counts exceeded standard quotas. Backoff dynamic wait: 4m15s before next retry loop.",
    remediationSteps: [
      "Review reconciler polling frequency thresholds metrics inside providers configuration.",
      "Adjust Crossplane resync-period variables to prevent high polling volume.",
      "Manually check subnet drift states to satisfy reconciler requirements."
    ],
    suggestedCommands: ["kubectl get managed", "kubectl describe providerconfig aws"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME                                                   SYNCED   READY   STATUS\npostgresql.database.aws.crossplane.io/production-rds   False    False   ReconcileError (RequestLimitExceeded)"
      },
      {
        commandPattern: /describe/i,
        output: "Spec:\n  Sync Period: 10s (EXTREME FAST resync loop! Polling AWS API every 10 seconds for 300 resources causes instant quota depletion. Set this to 10m)."
      }
    ]
  },
  12: {
    weekNum: 12,
    title: "Backstage Software Catalog GitHub Discovery Lock",
    theme: "Self-Service Platforms with Backstage Portals",
    difficulty: "Intermediate",
    component: "Backstage Server Core catalog sync engine",
    duration: "45 mins",
    context: "Backstage catalog discovery is failing to import new software components, showing authorization blocks. Git request limits blocked crawler token requests across 500+ microservice specifications.",
    threatLevel: "MEDIUM (Developers cannot register new systems)",
    initialLog: "Backstage Backend logs:\n[catalog] Failed to scan GitHub repository: Rate limit of 5000 requests exceeded for token client-id-998.\nError details: rate_limit_limit: 5000, rate_limit_remaining: 0, reset_time: 2026-06-15 01:10:00 UTC",
    remediationSteps: [
      "Verify crawler API token quotas on GitHub.",
      "Refactor repository crawler schedules to pull daily or use GitHub Webhooks instead of active polling.",
      "Increase cache lifetimes for discovered specifications."
    ],
    suggestedCommands: ["kubectl logs deployment/backstage-portal", "cat backstage-app-config.yaml"],
    mockResponses: [
      {
        commandPattern: /logs/i,
        output: "[catalog] ERROR: Repository search scheduler failed: 403 Forbidden - Rate Limit Exceeded.\nNo sync operations can occur for remaining 45 minutes."
      },
      {
        commandPattern: /cat/i,
        output: "catalog:\n  providers:\n    github:\n      schedule:\n        frequency: 30s (ERROR: Crawling 500 repositories every 30s runs out of Git API limits in minutes. Adjust to '2h')."
      }
    ]
  },
  13: {
    weekNum: 13,
    title: "Kyverno Policy Block on High-Privilege Containers",
    theme: "Policy-as-Code & Cluster Security Hardening",
    difficulty: "Advanced",
    component: "Kyverno Policy Engine controller",
    duration: "55 mins",
    context: "A high-priority cluster monitoring container is failing to deploy. The Kyverno Admission Controller is throwing validation blocks on the container's HostPID and SecurityContext properties.",
    threatLevel: "HIGH (Cannot deploy required monitoring agents)",
    initialLog: "Kyverno Webhook Verification Alert:\nAdmission webhook 'kyverno-resource-validate' denied request: Pod failed security validation: disallow-host-namespaces. spec.containers.hostPID must be false.",
    remediationSteps: [
      "Inspect policy exceptions lists and cluster rules matching the daemon pod.",
      "Check Kyverno ClusterPolicy parameters inside the active namespaces.",
      "Update pod security profiles or register proper policy exceptions to allow system-level tasks."
    ],
    suggestedCommands: ["kubectl get clusterpolicy", "kubectl describe clusterpolicy disallow-host-namespaces"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME                             BACKGROUND   VALIDATE_ACTION\ndisallow-host-namespaces        true         enforce (ACTIVE EXCLUSION SYSTEM: blocks all pods sharing host processes!)"
      },
      {
        commandPattern: /describe/i,
        output: "Rule Definitions:\n  Condition:\n    Exclude namespaces: [kube-system]\n  (REMEDIATION: Add the monitoring agent's namespace, e.g., 'monitoring', to the secure exceptions list to allow host namespace bindings)."
      }
    ]
  },
  14: {
    weekNum: 14,
    title: "Istio Envoy VirtualService Wildcard Host Routing loop",
    theme: "Service Mesh Architectures & Traffic Controllers",
    difficulty: "Advanced",
    component: "Istio Service Mesh Envoy Sidecars",
    duration: "1h 10m",
    context: "Incoming service requests are returning 503 Service Unavailable across all services. A wildcard route specification inside an Envoy VirtualService triggered routing loops.",
    threatLevel: "CRITICAL (Complete cluster wide ingress blackout)",
    initialLog: "VirtualService Routing error trace (Envoy logs):\nxx.xx.xx.xx:443 -> ingress-gateway -> billing-microservice (loop count: 20 exceeded. Throwing 503 Service Unavailable on max route recursions).",
    remediationSteps: [
      "Verify VirtualServices configuration specifications using istioctl validator.",
      "Check for wildcard domain matches overriding host parameters.",
      "Update destination routes rules and clear stale route caches."
    ],
    suggestedCommands: ["istioctl analyze", "kubectl get virtualservice"],
    mockResponses: [
      {
        commandPattern: /analyze/i,
        output: "[KIA0103] - VirtualService 'all-routes-wildcard' has a routing loop: host '*' routes to destination 'ingress-gateway' which feeds back to '*'. Recursion loop detected."
      },
      {
        commandPattern: /get/i,
        output: "NAME                   GATEWAYS          HOSTS   AGE\nall-routes-wildcard   [main-gateway]    [*]     12m"
      }
    ]
  },
  15: {
    weekNum: 15,
    title: "ChaosMesh Latency Injection Escalation",
    theme: "Chaos Engineering & System Resiliency Testing",
    difficulty: "Intermediate",
    component: "ChaosMesh operator & platform networking",
    duration: "1 hour",
    context: "An automated chaos test injecting a 15ms latency has cascade-triggered TCP connection timeouts, triggering socket exhaustion on the billing client's database interface.",
    threatLevel: "HIGH (Failed client service state propagation)",
    initialLog: "Client service daemon socket connection metrics:\n[SOCKET_ERR] TimeoutException: Connection timed out after 3000ms. Active sockets pool size: 500 (exhausted). TCP socket state: TIME_WAIT (15000 sockets).",
    remediationSteps: [
      "Check active running Chaos experiments inside ChaosMesh namespaces.",
      "Manually delete/suspend active NetworkChaos resources.",
      "Increase client connect pool capacities and lower the socket TIME_WAIT timeouts.",
      "Restore clean system flow paths."
    ],
    suggestedCommands: ["kubectl get networkchaos -n chaos-testing", "kubectl delete networkchaos billing-delay -n chaos-testing"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME            STATUS    DURATION   AGE\nbilling-delay   Injecting   20m        12m"
      },
      {
        commandPattern: /delete/i,
        output: "NetworkChaos 'billing-delay' successfully terminated inside chaos-testing namespace.\nNetwork interfaces restored back to < 1ms response latency. Socket counts are returning to normal."
      }
    ]
  },
  16: {
    weekNum: 16,
    title: "SBOM Spec Signature Tamper Webhook Rejection",
    theme: "Supply Chain Assurance & Deep System Audits",
    difficulty: "Expert",
    component: "Admission Control Webhook & cosign-validator",
    duration: "1 hour",
    context: "An urgent payment microservice build is being blocked by the cluster admission controller. The digital signature verifying the Software Bill of Materials (SBOM) is failing verification.",
    threatLevel: "HIGH (Cannot deploy critical emergency fixes)",
    initialLog: "Admission Controller Rejects Deploy:\nResource deployment/payment-svc denied. Reason: Failed SBOM signature attestation verification on target SHA digest. Match signature not verified.",
    remediationSteps: [
      "Audit the SBOM signature verification parameters.",
      "Verify build hash signatures locally with Cosign key parameters.",
      "Determine if container layer drift occurred during transport registries transitions.",
      "Re-sign verified package definitions to restore clean deployment pathways."
    ],
    suggestedCommands: ["cosign verify --key cosign.pub image-name:sha256", "kubectl get validatingwebhookconfigurations"],
    mockResponses: [
      {
        commandPattern: /cosign/i,
        output: "Verification FAILED: Signature is invalid for target digest! Deep analysis indicates a node compilation metadata modification occurred during secondary processing layers."
      },
      {
        commandPattern: /get/i,
        output: "NAME                              WEBHOOKS   AGE\ncosign-admission-validator-config  1          182d"
      }
    ]
  },
  17: {
    weekNum: 17,
    title: "Karpenter AWS Private IP Exhaustion in VPC CNI",
    theme: "Production EKS Scaling & Autoscaling with Karpenter",
    difficulty: "Expert",
    component: "Karpenter controller & AWS VPC-CNI subsystem",
    duration: "1h 20m",
    context: "Karpenter cannot scale host EC2 nodes during a traffic spike. Karpenter logs reveal they cannot attach secondary elastic network interfaces (ENIs) because EKS subnet IP addresses are completely exhausted.",
    threatLevel: "CRITICAL (Cannot autoscale to support user load)",
    initialLog: "Karpenter Provisioner Logs:\nError: Failed to launch node: unschedulable pod matching criteria: subnets 'subnet-87a1f5' have 0 remaining IP addresses out of pool.",
    remediationSteps: [
      "Check active subnet allocation capacities.",
      "Configure VPC CNI ENI_CONFIG fields and adjust parameters (WARM_IP_TARGET / MINIMUM_IP_TARGET) to safely conserve available subnet spaces.",
      "Route new compute namespaces to secondary larger CIDR blocks."
    ],
    suggestedCommands: ["kubectl get provisioner", "kubectl describe daemonset aws-node -n kube-system"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME      NODE_TEMPLATES   NODE_LIMITS   AGE\ndefault   default-template  cpu=400       62d"
      },
      {
        commandPattern: /describe/i,
        output: "Environment:\n  WARM_IP_TARGET:     16 (CRITICAL DESIGN FAULT: reserving 16 hot IPs per pod causes instant exhaustion on /24 subnets. Reduce WARM_IP_TARGET to 3 to optimize spacing)."
      }
    ]
  },
  18: {
    weekNum: 18,
    title: "Kube-Cost CPU Limit Policy Infraction Governance block",
    theme: "FinOps Cost Optimization & System Governance",
    difficulty: "Intermediate",
    component: "Kube-Cost analyzer & Gatekeeper OPA policies",
    duration: "40 mins",
    context: "An automated test pipeline is rejecting new staging deployments using OPA Gatekeeper. The deployment requested 64 CPU cores but only maintains a 0.1% baseline utilization, violating FinOps policies.",
    threatLevel: "MEDIUM (Staging updates blocked due to compliance violation)",
    initialLog: "Gatekeeper OPA Policy Block Event:\nAdmission webhook 'validation.gatekeeper.sh' denied: FinOps-Resource-Quota: Pod requested 64 CPU cores. Policy limits maximum unused CPU requests ratio margin to 400%.",
    remediationSteps: [
      "Audit active CPU and Memory allocations using Kube-Cost APIs.",
      "Refactor deployment specification resources request to closer fit actual historical run metrics.",
      "Re-apply application configuration profile with optimized, cost-efficient thresholds."
    ],
    suggestedCommands: ["kubectl get constraint", "cat deployment-spec.yaml"],
    mockResponses: [
      {
        commandPattern: /get/i,
        output: "NAME                               ENFORCEMENT_ACTION   TOTAL_VIOLATIONS\nstage-cost-quota-enforce           deny                 1"
      },
      {
        commandPattern: /cat/i,
        output: "spec:\n  containers:\n  - name: heavy-app\n    resources:\n      requests:\n        cpu: 64 (ERROR OVER-ALLOCATION: Change request CPU to 2 and memory limits down to optimize budget profile)."
      }
    ]
  },
  19: {
    weekNum: 19,
    title: "Route53 Multi-Region State Delay Lag Outage",
    theme: "High-Availability & Cross-Region Disaster Recovery",
    difficulty: "Advanced",
    component: "Core Route53 DNS & dynamic health probes",
    duration: "1 hour",
    context: "During a cross-region disaster recovery test, 100% of global traffic was routed to the primary region, which has a corrupted database. The Route53 failover DNS record failed to update because dynamic health checks were pointing to a cached mock port.",
    threatLevel: "CRITICAL (Corrupted state served to entire user base)",
    initialLog: "Route53 Global Resolver logs:\nHealth check 'hc-8a9d1' target: primary.platform.dns: Port 443 returns HTTP 200 OK (WARNING: Database state is offline but ingress is returning 200 via static health asset).",
    remediationSteps: [
      "Verify the global load balancer endpoint health configuration parameters.",
      "Configure active health checks to perform deep database availability validation, not just HTTP static routes.",
      "Lower Route53 DNS Time-To-Live (TTL) record value to 30 seconds."
    ],
    suggestedCommands: ["dig +trace platform.dns", "curl https://primary.platform.dns/healthz"],
    mockResponses: [
      {
        commandPattern: /dig/i,
        output: "platform.dns.   300 IN  A  198.51.100.12 (WARNING: TTL is 300 seconds [5 minutes]! Stale IP routing continues for minutes on failover. Reduce to 30)."
      },
      {
        commandPattern: /curl/i,
        output: "{\n  \"status\": \"healthy\",\n  \"checks\": { \"web\": \"ok\", \"database\": \"offline\" },\n  \"status_code\": 500 (API layer returned 500 but because headers match, basic load balancer checks are fooled into marking it healthy)."
      }
    ]
  },
  20: {
    weekNum: 20,
    title: "Postmortem Data Loss Discrepancy",
    theme: "Job Readiness & Blameless Postmortem Portfolios",
    difficulty: "Advanced",
    component: "Database snapshots & transaction logs",
    duration: "1 hour",
    context: "An emergency snapshot restore run has successfully booted, but has overwritten 5 hours of active client checkout updates. SREs must formulate the blameless remediation timeline and construct write-ahead recovery steps.",
    threatLevel: "HIGH (Data discrepancy on user database updates)",
    initialLog: "PostgreSQL Replica status logs:\nWARNING: Last transaction timestamp on physical snapshot is '2026-06-15 00:00:00'.\nCurrent UTC boundary is '2026-06-15 05:00:00'. Mismatch duration: 5 hours. Overwritten transactions count: 4,115 entries.",
    remediationSteps: [
      "Query secondary database replica logs for write-ahead log (WAL) trails.",
      "Construct a timeline of actual outage and recovery points.",
      "Draft a blameless postmortem report specifying architectural controls to prevent out-of-sync snapshot restores."
    ],
    suggestedCommands: ["kubectl logs deployment/postgres-replica", "cat blameless-remediations.md"],
    mockResponses: [
      {
        commandPattern: /logs/i,
        output: "[pg_replica] WARNING: Replica node has split-brain drift! Last synchronous write sequence gap is 12,014 records. Snapshot was restored manual-override without replay logs, wiping trace metrics."
      },
      {
        commandPattern: /cat/i,
        output: "### Actionable Postmortem Remediations Required:\n1. Establish synchronous replication on postgres cluster setups.\n2. Prevent raw snapshot override paths without automated checkpoint sequence evaluations.\n3. Implement active transactions queue auditing systems."
      }
    ]
  }
};

export default function IncidentSimulator({ currentWeek, weekTheme }: IncidentSimulatorProps) {
  // Gracefully clamp of week numbers between 1 and 20
  const normalizedWeekNum = Math.min(Math.max(currentWeek, 1), 20);
  const activeScenario: IncidentScenario = weeklyIncidents[normalizedWeekNum] || weeklyIncidents[1];

  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewingSolution, setViewingSolution] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, loading]);

  // Restart logs whenever the active week shifts to prevent mismatched context states
  useEffect(() => {
    setSimulationActive(false);
    setLogs([]);
    setUserInput("");
    setViewingSolution(false);
  }, [normalizedWeekNum]);

  const startScenario = async () => {
    setSimulationActive(true);
    setLoading(true);
    setUserInput("");
    setViewingSolution(false);
    
    const initialLogLine = `[SYSTEM] Bootstrapping real-world SRE Incident Simulator Sandbox...`;
    setLogs([{ text: initialLogLine, type: "system" }]);

    try {
      const response = await fetch("/api/mentor/incident-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioType: activeScenario.title,
          currentStep: 0,
          userResponse: "Start scenario",
          history: [],
          scenarioTitle: activeScenario.title,
          scenarioContext: activeScenario.context
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation endpoint returned non-OK code.");
      }

      const data = await response.json();
      setLogs([
        { text: initialLogLine, type: "system" },
        { text: `\n=== PAGERDUTY ALARM SEV-1 INITIATED ===\nTheme: ${activeScenario.theme} (Week ${activeScenario.weekNum})\nTarget resource: ${activeScenario.component}\nThreat Level: ${activeScenario.threatLevel}\n\n${data.text || activeScenario.initialLog}`, type: "metrics" }
      ]);
    } catch (err: any) {
      console.warn("Gemini SRE API offline or network disrupted. Initiating robust offline-first SRE shell sandbox container: ", err);
      // Fallback cleanly to high-fidelity offline system outputs
      setLogs([
        { text: initialLogLine, type: "system" },
        { text: `\n=== PAGERDUTY ALARM SEV-1 INITIATED ===\nTheme: ${activeScenario.theme} (Week ${activeScenario.weekNum})\nTarget: ${activeScenario.component}\nThreat Level: ${activeScenario.threatLevel}\n\n=== OUTAGE READOUTS ===\n${activeScenario.initialLog}\n\n[OFFLINE SANDBOX MODE] Live interactive fallback enabled. You can interrogate container components or run diagnostics now. Try commands like: 'kubectl list', 'dmesg', 'promql', or logs check.`, type: "metrics" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !simulationActive || loading) return;

    const command = userInput.trim();
    setUserInput("");
    
    const updatedLogs = [...logs, { text: `user@k8s-diagnostics-node-01:~$ ${command}`, type: "user" as const }];
    setLogs(updatedLogs);
    setLoading(true);

    try {
      const formattedHistory = updatedLogs.map(line => ({
        role: line.type === "user" ? "user" : "assistant",
        content: line.text
      }));

      const response = await fetch("/api/mentor/incident-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioType: activeScenario.title,
          currentStep: updatedLogs.filter(l => l.type === "user").length,
          userResponse: command,
          history: formattedHistory,
          scenarioTitle: activeScenario.title,
          scenarioContext: activeScenario.context
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP connection to AI model interrupted.");
      }

      const data = await response.json();
      setLogs([...updatedLogs, { text: data.text, type: "metrics" }]);
    } catch (err: any) {
      console.log("Using SRE dynamic local response evaluator for command: " + command);
      
      // Perform automated local command pattern matching and respond realistically
      let resolvedMatch = "Command completed successfully. No explicit errors returned, but system state is unchanged. Look closer at logs or parameters.";
      
      for (const rule of activeScenario.mockResponses) {
        if (rule.commandPattern.test(command)) {
          resolvedMatch = rule.output;
          break;
        }
      }

      // Provide generic fallback diagnostics response for common unix tags
      if (command.toLowerCase().includes("help") || command.toLowerCase().includes("man")) {
        resolvedMatch = `SRE Debug CLI Help Info:\nTry running commands closely matching your task deliverables:\n- Use 'kubectl describe pod' or 'kubectl logs'\n- Inspect network paths with 'curl' or 'promql' expressions\n- Check low-level files with 'cat' or shell utilities`;
      } else if (command.toLowerCase().includes("clear")) {
        setLogs([{ text: `Terminal screen flushed. Simulation ongoing: ${activeScenario.title}`, type: "system" }]);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setLogs([...updatedLogs, { text: `\n=== DIAGNOSTICS TERM OUTPUT ===\n${resolvedMatch}`, type: "metrics" }]);
        setLoading(false);
      }, 600);
    }
  };

  const stopSimulation = () => {
    setSimulationActive(false);
    setLogs([]);
    setUserInput("");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5 shadow-sm h-full overflow-y-auto" id="incident_simulator_panel">
      {/* Header and week indicator */}
      <div className="border-b border-rose-100 pb-4">
        <div className="flex items-center gap-2 mb-1.5 justify-between">
          <div className="flex items-center gap-2">
            <BadgeAlert className="w-5 h-5 text-rose-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800 font-sans">SRE Incident Lab</h3>
          </div>
          <span className="text-[10px] bg-rose-50 text-rose-700 font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-rose-200 rounded">
            Sev-1 Incident Project
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-500">
          Syllabus Week {activeScenario.weekNum}: <span className="text-indigo-600 font-semibold">{activeScenario.theme}</span>
        </p>
      </div>

      {/* Main scenario visual card */}
      <div className="bg-gradient-to-r from-rose-50/50 via-slate-50 to-indigo-50/20 border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-rose-600 uppercase block mb-0.5">Active Project</span>
            <h4 className="text-sm font-bold text-slate-800">{activeScenario.title}</h4>
          </div>
          <span className={`text-[10px] font-semibold font-mono rounded-full px-2 py-0.5 ${
            activeScenario.difficulty === "Beginner" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            activeScenario.difficulty === "Intermediate" ? "bg-blue-50 text-blue-700 border border-blue-200" :
            activeScenario.difficulty === "Advanced" ? "bg-amber-50 text-amber-700 border border-amber-200" :
            "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            {activeScenario.difficulty}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
          {activeScenario.context}
        </p>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-150 pt-3 mt-1.5 text-[11px] font-sans">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider">Outage Target</span>
            <span className="font-semibold text-slate-700 font-mono text-[10px]">{activeScenario.component}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider">Est. SRE Triage Goal</span>
            <span className="font-semibold text-slate-700">{activeScenario.duration}</span>
          </div>
        </div>
      </div>

      {/* Simulation active status / Launch Area */}
      {!simulationActive ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={startScenario}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg shadow-sm border border-rose-700 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Interactive Sandbox
            </button>
            <button
              onClick={() => setViewingSolution(!viewingSolution)}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              {viewingSolution ? "Hide Guide" : "Solve Guide"}
            </button>
          </div>

          {/* Collapsible solve guide */}
          {viewingSolution && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-sans animate-fade-in">
              <span className="font-bold text-slate-700 block mb-2 text-[11px] uppercase tracking-wide">Remediation Blueprint & Real-world Steps</span>
              <ul className="space-y-1.5 list-none pl-0">
                {activeScenario.remediationSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed text-slate-650">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wide">Key Command Clues to Run:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeScenario.suggestedCommands.map((command, idx) => (
                    <code key={idx} className="bg-slate-200 text-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-350 select-all">
                      {command}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Real Interactive Terminal Interface */
        <div className="flex flex-col bg-[#080b11] rounded-xl border border-slate-300 overflow-hidden font-mono text-[11px] shadow-lg flex-1 min-h-[350px]">
          {/* Top Bar decor */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e131d] border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="text-[10px] text-slate-400 ml-2 font-mono flex items-center gap-1">
                <span>sandbox-node-01</span>
                <span className="text-[#3b82f6] text-[9px] font-bold">● ONLINE</span>
              </div>
            </div>
            <button
              onClick={stopSimulation}
              className="text-[9px] px-2 py-0.5 bg-rose-950 hover:bg-rose-900 text-rose-350 font-bold border border-rose-800 rounded hover:text-rose-200 transition-colors uppercase cursor-pointer"
            >
              Abort Lab
            </button>
          </div>

          {/* Terminal stream log view */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#06080d] min-h-[180px]" ref={scrollRef}>
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.type === "system" ? "text-[#3b82f6] italic opacity-85 text-[10px]" :
                  log.type === "user" ? "text-emerald-400 font-semibold" :
                  "text-slate-200 whitespace-pre-wrap leading-relaxed select-all"
                }
              >
                {log.text}
              </div>
            ))}
            {loading && (
              <div className="text-slate-450 animate-pulse italic flex items-center gap-2 text-[10px]">
                <RefreshCw className="w-3 h-3 animate-spin text-rose-500" />
                Querying k8s endpoints and system journals...
              </div>
            )}
          </div>

          {/* Quick micro advice */}
          <div className="px-4 py-1.5 bg-[#0e131d] border-t border-slate-8 w-full flex items-center gap-1.5 text-[9px] text-slate-400 overflow-x-auto shrink-0 select-none">
            <span className="font-bold flex items-center gap-1 text-[#3b82f6]"><Eye className="w-3 h-3" /> Clues:</span>
            {activeScenario.suggestedCommands.map((command, i) => (
              <code key={i} className="bg-slate-850 hover:bg-slate-8 text-slate-300 px-1 rounded border border-slate-700/60 font-mono text-[9px]">
                {command}
              </code>
            ))}
          </div>

          {/* Input control block */}
          <form onSubmit={handleCommandSubmit} className="flex border-t border-slate-800 bg-[#090d16] items-center shrink-0">
            <span className="pl-4 text-emerald-500 font-bold shrink-0 font-mono text-[10px]">user@k8s:~$</span>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading || !simulationActive}
              placeholder="Enter validation commands or mitigation keys..."
              className="flex-1 bg-transparent border-none text-slate-100 p-2.5 focus:outline-none focus:ring-0 font-mono text-[11px]"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="px-4 bg-[#0d131f] border-l border-slate-800 hover:bg-slate-8 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors h-full py-2.5 font-bold uppercase text-[10px]"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
