# 5-Month DevOps → SRE → AI-Integrated Platform Engineer Roadmap

An intensive, structured, 20-week daily curriculum designed for experienced DevOps and Platform Engineers aiming to transition into high-stakes Site Reliability Engineering (SRE) and Platform Engineering roles that value advanced telemetry, GitOps, Kubernetes Operators, chaos resilience, and modern AI-augmented platform workflows.

---

## 1. PREREQUISITES & ENVIRONMENT SETUP

Before starting Week 1, provision your study and testing environment to ensure you can execute the hands-on daily labs without interruption.

### Hardware Requirements
* **Local Hypervisor/Host:** Windows 10/11 (WSL2), macOS (M1/M2/M3 or Intel), or native Linux.
* **Minimum Resources:** 4 CPU Cores, 16 GB RAM, 50 GB free SSD storage.
* **Recommended Resources:** 8 CPU Cores, 32 GB RAM, 100 GB SSD (necessary to run full Kubernetes clusters alongside Prometheus, Tempo, Loki, and several mock applications simultaneously).

### Accounts & Tooling
1. **GitHub Account:** For storing daily deliverables, committing configurations, and hosting your capstone projects as a public portfolio.
2. **Cloud Account:** AWS Free Tier account (to follow parallel AWS/EKS tracks, budgets, cost management).
3. **CLI Utilities Installed:**
   * `git` (v2.40+)
   * `docker` (v24.0+) or `colima`/`rancher-desktop`
   * `kubectl` (v1.28+)
   * `helm` (v3.12+)
   * `kind` (v0.20+) or `k3d`
   * `terraform` (v1.5+) or `opentofu`
   * `aws-cli` (v2.12+)

---

## 2. HOW TO USE THIS ROADMAP

### The Daily Rhythm (3 to 4.5 Hours per Day)
* **Theory & Reading (1 - 1.5h):** Deep dive into official manuals, whitepapers, and specifications. Answer the self-check questions to verify understanding.
* **Hands-on Labs (1.5 - 2.5h):** Implement architectural components from scratch in your cluster. Avoid using copy-paste shortcuts; build line-by-line to internalize syntax and APIs.
* **Stretch Goal (0.5h):** Push past basic tutorials. Break things deliberately, debug the discrepancies, and test edge features.
* **Deliverable:** Commit configs, charts, and diagrams directly into your personal repository immediately after completion.

### The Debt Log & Buffer Strategy
* **Do not rush:** If a daily lab takes longer than your scheduled block, record the remaining tasks in your personal **Debt Log**.
* **Catch-Up Blocks:** Friday afternoons and designated Sunday blocks are reserved strictly for clearing your Debt Log. Do not proceed to the next week if you carry overdue critical labs.

---

## 3. PROGRAM OVERVIEW TABLE

| Week | Month | Theme | Primary Tools | AWS / EKS Thread | Capstone Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Week 1** | Month 1 | SRE Metrics & SLO Engineering | Grafana, PromQL, Alertmanager | CloudWatch SRE Targets | [M1 Capstone: Full Stack Observability](#month-1-capstone-observable-homelab-k8s) |
| **Week 2** | Month 1 | Infrastructure Diagnostics | strace, lsof, nsenter, sysctl | EBS Storage Diagnostics | [M1 Capstone: Full Stack Observability](#month-1-capstone-observable-homelab-k8s) |
| **Week 3** | Month 1 | Distributed Observability | Prometheus Operator, OpenTelemetry, Tempo | ADOT Collector setups | [M1 Capstone: Full Stack Observability](#month-1-capstone-observable-homelab-k8s) |
| **Week 4** | Month 1 | Log Aggregation & Correlation | Grafana Loki, Vector, Promtail | CloudWatch Stream Shipping | [M1 Capstone: Full Stack Observability](#month-1-capstone-observable-homelab-k8s) |
| **Week 5** | Month 2 | Infrastructure as Code | Terraform, OpenTofu, Terragrunt | Multi-AZ VPC / EKS VPC | [M2 Capstone: GitOps CD & Auto-Rollback](#month-2-capstone-gitops-multi-env-with-auto-rollbacks) |
| **Week 6** | Month 2 | Secure Continuous Integration | GitLab CI, Trivy, SonarQube, Cosign | ECR Registries & AWS OIDC | [M2 Capstone: GitOps CD & Auto-Rollback](#month-2-capstone-gitops-multi-env-with-auto-rollbacks) |
| **Week 7** | Month 2 | GitOps Continuous Delivery | ArgoCD, FluxCD, Kustomize | EKS Access Entries configurations | [M2 Capstone: GitOps CD & Auto-Rollback](#month-2-capstone-gitops-multi-env-with-auto-rollbacks) |
| **Week 8** | Month 2 | Progressive Delivery | Argo Rollouts, Flagger, mTLS Envoy | ALB Canary Integrations | [M2 Capstone: GitOps CD & Auto-Rollback](#month-2-capstone-gitops-multi-env-with-auto-rollbacks) |
| **Week 9** | Month 3 | Kubernetes Extensibility | CRDs, Webhook Controllers, API Loops | EKS VPC CNI optimizations | [M3 Capstone: Backstage IDP Engine](#month-3-capstone-self-service-dev-portal) |
| **Week 10** | Month 3 | Operator SDK & Go/Rust Controllers | Kubebuilder, Kuttl, Client-Go | EKS IAM Role IRSA automation | [M3 Capstone: Backstage IDP Engine](#month-3-capstone-self-service-dev-portal) |
| **Week 11** | Month 3 | Infrastructure via Crossplane | Crossplane Providers, Compositions | RDS & S3 Cloud Provisioners | [M3 Capstone: Backstage IDP Engine](#month-3-capstone-self-service-dev-portal) |
| **Week 12** | Month 3 | Self-Service Backstage Platforms | Spotify Backstage, App Catalogs | EKS Blueprint Bootstrapping | [M3 Capstone: Backstage IDP Engine](#month-3-capstone-self-service-dev-portal) |
| **Week 13** | Month 4 | Policy-as-Code & Hardening | Kyverno, OPA Gatekeeper | AWS KMS EKS Encryption | [M4 Capstone: Hardened Chaos App Stack](#month-4-capstone-hardened-policy-enforced-chaos-tested-stack) |
| **Week 14** | Month 4 | Service Mesh & Traffic Controls | Istio, Cilium Service Mesh, CertManager | AWS Route53 Certificate integrations | [M4 Capstone: Hardened Chaos App Stack](#month-4-capstone-hardened-policy-enforced-chaos-tested-stack) |
| **Week 15** | Month 4 | Chaos Engineering | Chaos Mesh, LitmusChaos, steady states | AWS AZ Loss Recovery Drills | [M4 Capstone: Hardened Chaos App Stack](#month-4-capstone-hardened-policy-enforced-chaos-tested-stack) |
| **Week 16** | Month 4 | Supply Chain Verification | Sigstore Cosign, Falco, runtime audits | CloudTrail & IAM Audit Streams | [M4 Capstone: Hardened Chaos App Stack](#month-4-capstone-hardened-policy-enforced-chaos-tested-stack) |
| **Week 17** | Month 5 | AWS Production EKS & Karpenter | Karpenter, EKS nodes, KEDA | Node Provisioning & Consolidations | [M5 Capstone: AI-Integrated SRE App](#month-5-capstone-ai-augmented-platform-engineering-portal) |
| **Week 18** | Month 5 | FinOps & Core Cost Governance | Kubecost, Spot instances optimization | Cost Allocation Tags, Compute Opt | [M5 Capstone: AI-Integrated SRE App](#month-5-capstone-ai-augmented-platform-engineering-portal) |
| **Week 19** | Month 5 | AI Platform Integrations | Model Context Protocol, Gemini, RAG | AWS Bedrock models integration | [M5 Capstone: AI-Integrated SRE App](#month-5-capstone-ai-augmented-platform-engineering-portal) |
| **Week 20** | Month 5 | Career Ready & Case Studies | Case Studies, STAR Method, Resume | AWS SRE Complete Skills Audit | [M5 Capstone: AI-Integrated SRE App](#month-5-capstone-ai-augmented-platform-engineering-portal) |

---

## MONTH 1: OBSERVABILITY STACK & SRE FUNDAMENTALS

### Week 1 — SRE Metrics & SLO Engineering

#### Day 1 — SLI, SLO, SLA Deconstruction & Math
* **Time estimate:** ~3.5 hours
* **Context/Why:** SREs distinguish technical metrics from customer-facing reliability commitments. You will learn the mathematical foundation of error budgets and how 99.9% vs 99.99% impacts engineering velocity.
* **Theory/Reading (1h):**
  * Read *Google SRE Book - Chapter 4 (SLO)* & *SRE Workbook - Chapter 2 (Implementing SLOs)*.
  * Understand the core formula: $SLI = \frac{\text{Good Events}}{\text{Total Events}} \times 100$.
  * Understand Error Budgets: $\text{Error Budget} = 100\% - \text{SLO Target}$.
  * *Self-Check:* What is the exact maximum allowed downtime (in minutes) for a 99.9% SLO over a 30-day billing cycle?
* **Hands-on Lab (2h):**
  * Model an HTTP API scenario tracking rolling 30-day counts.
  * Write a Python/Bash script that parses simulated API traffic logs, isolates non-5xx requests, calculates the rolling SLI, and detects exactly when the remaining budget is breached.
  * *Stretch Goal:* Introduce a sliding-window calculation feature to compute budget burning over the last 1-hour and 6-hour chunks.
* **Deliverable:** A script named `error_budget_calcs.py` emitting percentage states over standard stdout.
* **Common Pitfalls:** Do not count client-side execution issues (e.g., HTTP 404s) as system failures. Only treat infrastructural limits (502, 503, 504, 500) as valid bad events.

#### Day 2 — The Four Golden Signals & RED/USE Methods
* **Time estimate:** ~3 hours
* **Context/Why:** Standardizing metric models accelerates dashboard creation and incident triage. You will master the RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors) frameworks.
* **Theory/Reading (1h):**
  * Study *Google SRE Book - Chapter 6 (Monitoring)* and Brendan Gregg’s *USE Method*.
  * Learn to partition services: RED is for user-facing APIs; USE is for hardware resources.
  * *Self-Check:* How does CPU saturation manifest differently from CPU utilization?
* **Hands-on Lab (1.5h):**
  * Draft a technical schema map (JSON, YAML, or Markdown) mapping all components of a standard stack: Load Balancer, Node App Process, and PostgreSQL instance.
  * Specifically label which telemetry lines will be gathered using RED vs USE patterns.
  * *Stretch Goal:* Outline the exact metric queries that identify system backlogs (queues) for networking buffers.
* **Deliverable:** A taxonomy map committed to your repo named `signals_taxonomy.md`.
* **Common Pitfalls:** Confusing CPU utilization with CPU saturation. CPU can show 100% busy (high utilization) but still have no queue backlog (no saturation).

#### Day 3 — PromQL Fundamentals & Advanced Rate Queries
* **Time estimate:** ~4 hours
* **Context/Why:** SREs use Prometheus Query Language to query timeseries databases dynamically. Knowing how rate(), irate(), and histogram aggregations work is critical for building correct dashboards.
* **Theory/Reading (1.5h):**
  * Learn Prometheus timeseries models, selectors, and metric functions.
  * Understand why we take `rate()` before taking `sum()` (never sum counters before rating them, or resets get corrupted).
  * *Self-Check:* What is the functional difference between `irate()` and `rate()`?
* **Hands-on Lab (2h):**
  * Use a Prometheus sandbox. Write PromQL queries to extract the following information:
    1. Average HTTP request speed over 5m intervals.
    2. CPU utilization percent by instance: `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`.
    3. The ratio of HTTP 5xx responses compared to total requests.
  * *Stretch Goal:* Write a complex query to calculate the 95th and 99th percentile HTTP latencies using `histogram_quantile`.
* **Deliverable:** A curated file named `promql_cheatsheet.promql` containing comments explaining each query.
* **Common Pitfalls:** Never map `irate()` to long-term charts or alert trigger thresholds; because `irate()` responds to immediate spikes, it generates noisy graphs and false alerts. Use `rate()` for alerts.

#### Day 4 — Alerting Rules, Alertmanager & Multi-Burn Rates
* **Time estimate:** ~4 hours
* **Context/Why:** Over-alerting causes pager fatigue. SREs design alerts based on how fast the system is consuming ('burning') its error budget, rather than static thresholds.
* **Theory/Reading (1.5h):**
  * Read *SRE Workbook - Chapter 5 (Alerting)*. Understand Multi-Burn Rate configurations.
  * Learn how Alertmanager routes, groups, silences, and inhibits alerts.
  * *Self-Check:* What is a 14.4x burn rate alert indicating during a 1-hour window?
* **Hands-on Lab (2h):**
  * Create a YAML alert template for Prometheus.
  * Design a rule group featuring 2 classes: a critical alarm if the budget burns by 2% in under 1 hour ($\text{Burn Rate} = 14.4$), and a warning if the budget burns 5% across a 6-hour block ($\text{Burn Rate} = 6.0$).
  * *Stretch Goal:* Write alert inhibition rules to silence downstream client pods if their database cluster is down.
* **Deliverable:** A clean Prometheus alert rule manifest named `prometheus_alerts.yml`.
* **Common Pitfalls:** Putting short metric windows (e.g. 1m raw counter spikes) directly in alerts. This leads to flapping pages that resolve before an engineer can open their laptop.

#### Day 5 — Grafana Dashboards & Visual Hierarchy
* **Time estimate:** ~3.5 hours
* **Context/Why:** Dashboards should be highly functional during high-stress triage events. Good dashboards represent the mental model of the system with clear hierarchical paths.
* **Theory/Reading (1h):**
  * Study Grafana’s documentation on dashboard design.
  * Learn grid-based layout structures: High-level SLO health status top-left, progressing down to specific components.
  * *Self-Check:* What is the 'two-second rule' for dashboards during building?
* **Hands-on Lab (2h):**
  * Write a schematic mockup of a billing app dashboard inside a markdown directory.
  * Map out the physical grid layout: Row 1 for SLO gauge status; Row 2 for RED Metrics; Row 3 for individual machine resources.
  * *Stretch Goal:* Export a functional Grafana JSON template incorporating variables (e.g., `$environment`, `$pod`).
* **Deliverable:** Dashboard structures committed to `billing_dashboard_blueprint.json`.
* **Common Pitfalls:** Rainbow-colored dashboards with too many colors. Keep graphs gray/muted, and only use amber or red alert highlights to signal serious degradation.

#### Day 6 — Mock Incident Management & Blameless Culture
* **Time estimate:** ~3.5 hours
* **Context/Why:** Culture is as vital to SRE success as mechanics. Blameless postmortems surface structural, configuration, and systemic issues instead of blaming human error.
* **Theory/Reading (1h):**
  * Read *Google SRE Book - Chapter 9 (Disasters)* & *Chapter 15 (Postmortem Culture)*.
  * Learn incident command roles: Incident Commander (IC), Ops Lead, Communications Lead.
  * *Self-Check:* Why must postmortems avoid calling out specific individuals or writing human actions as the root cause?
* **Hands-on Lab (2h):**
  * Review a mock scenario: A developer ran an uncommitted database migration that locked production tables for 40 minutes because of a missing lock timeout target configuration.
  * Write a comprehensive, highly formal, blameless postmortem report detailing the timeline, impact, lessons, and automation remediations.
  * *Stretch Goal:* Propose 3 automation checks that prevent this exact scenario from reaching production again.
* **Deliverable:** A documentation markdown file named `blameless_postmortem_database_lockout.md`.
* **Common Pitfalls:** Recommending actions like 'tell developers to pay more attention' or 'retrain the team to write safer queries'. Focus instead on writing technical safeguards like automated linters or static timeout rules.

#### Sunday — Week 1 Review
* **Concept Quiz:**
  1. *Calculate rolling 30-day SLA bounds:* Calculate the allowable error count for 10 million transactions at 99.9%. **[Answer: 10,000 bad requests allowed]**
  2. *Standard RED queries:* Write a PromQL snippet measuring error percentage rates over a 5-minute interval. **[Answer: `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100`]**
* **Integration Task:** Link your Day 4 alert rules directly into your Day 5 dashboard layout fields.
* **Weekly Writing/Blog Prompt:** Post on LinkedIn or write a short article about 'Why Static CPU alerts (like CPU > 90%) are Broken in Modern Kubernetes'.

---

### Week 2 — Infrastructure Diagnostics & Linux Internals

Master diagnostic pipelines by isolating processes on real container nodes, tracing network namespaces, memory limits, and process calls.

* **Day 7 — Namespaces, cgroups, and Container Runtimes:** Deep dive into PID, NET, MNT, and USER namespaces. Debug container OOM events (exit code 137). Write a shell script, `trace_cgroup_bounds.sh`, to read container RAM limits directly from `/sys/fs/cgroup/memory` on the host node.
* **Day 8 — Process Inspection with strace, lsof, and procfs:** Intercept system calls dynamically on hanging processes. Build a deadlock diagnostic guide, `deadlock_diagnosis.md`, showing how `strace -p <PID>` and `lsof -p <PID>` isolate open block file descriptor leaks.
* **Day 9 — Kernel System Tuning via sysctl & Virtual Memory:** Tune the host operating system. Build an optimized `/etc/sysctl.d/99-sre-performance.conf` file containing overrides for TCP backlog limits (`net.core.somaxconn`), file handle maximum bounds (`fs.file-max`), and Swappiness thresholds (`vm.swappiness`).
* **Day 10 — Debugging Pods in Kubernetes with nsenter:** Bypass shell-less or distroless container environments. Draft a sequence, `distroless_networking_nsenter.sh`, showing how to find container PID namespaces on host nodes and enter them using `nsenter -t <PID> -n ip addr` to trace routing.
* **Day 11 — Storage Diagnostics & Disk I/O Saturation:** Trace disk I/O. Use `iostat -xz 1` and `fio` to run synthetic storage stress tests. Document inode depletion diagnostics (the 'No Space Left on Device' issue when blocks are 50% free) in `storage_diagnostics_iostat.md`.
* **Day 12 — Systemd Service Unit Configurations & Process Caging:** Create a custom system daemon integration. Write a systemd worker unit, `dummy-app.service`, utilizing security configurations: `ProtectSystem=strict`, `PrivateDevices=true`, and CPU quotas matching cgroup allocations.

#### Sunday — Week 2 Review
* **Concept Quiz:**
  1. *What occurs when container memory matches cgroup limits?* **[Answer: The Linux kernel throws an Out-Of-Memory (OOM) alarm and triggers the OOM killer, killing process PID 1 and forcing container restart with exit code 137]**
  2. *Are open file sockets visible as standard files?* **[Answer: Yes, on Linux everything is a file. Active network sockets are logged as active file descriptors inside `/proc/<PID>/fd`]**
* **Integration Task:** Build an automation script triggering host alerts if storage node write delays (%utilization) hold above 95% for over 3 minutes.
* **Weekly Writing/Blog Prompt:** 'Distroless Debugging: How to use nsenter to Peer inside Minimalist Production Containers'.

---

### Week 3 — Distributed Observability

Trace transactions through complex microservice systems by configuring custom monitors and instrumenting open-source code.

* **Day 13 — Prometheus Operator & Custom ServiceMonitors:** Master declarative scraping. Build an `app_servicemonitor.yaml` Custom Resource defining custom pod metrics capture endpoints using target label selectors.
* **Day 14 — OpenTelemetry Collector Ingestion Architectures:** Configure the vendor-neutral telemetry collector. Write a valid `otel_collector_config.yaml` specifying pipelines for Receivers, Processors, and Exporters.
* **Day 15 — Traces, Spans, Context Propagation & Parent-Child Trees:** Map the life of a distributed transaction. Model trace mappings in `transaction_span_tree.json` illustrating traceparent HTTP headers passing TraceID/SpanID bounds across API boundaries.
* **Day 16 — Auto vs Manual Instrumentation with OTEL SDK:** Instrument an application. Add custom trace indicators into an Express/Python server inside a `manual_instrumentation_demo.js` utility, recording custom payment metadata.
* **Day 17 — Tempo/Jaeger Storage & Trace Visualizations:** Design backend storage. Write a valid Tempo configuration manifest, `tempo_storage_configuration.yaml`, to write compressed trace chunks to persistent S3-compatible cloud storage.
* **Day 18 — Distributed Tracing Samplers & Cost Optimization:** Minimize telemetry costs. Write standard OpenTelemetry collector rules inside `otel_collector_tail_sampling.yaml` to enforce tail-based sampling, retaining 100% of errors and only 2% of successful HTTP transactions.

#### Sunday — Week 3 Review
* **Concept Quiz:**
  1. *What is the role of the W3C traceparent header?* **[Answer: It standardizes context propagation format across systems, transmitting Version, TraceID, ParentSpanID, and TraceFlags over HTTP]**
  2. *Contrast head-based vs tail-based telemetry sampling.* **[Answer: Head-based drops traces arbitrarily when transactions initialize; Tail-based collects the entire execution span tree first, filtering based on exceptions or latency targets before committing to disk]**
* **Integration Task:** Integrate your custom auto-trace metrics directly into alert rules to page engineers on high P99 latency times.
* **Weekly Writing/Blog Prompt:** 'Architecting Trace Samplers: Why You shouldn't Store 100% of Your Production traces'.

---

### Week 4 — Log Aggregation & Log-to-Metric Correlation

Build lightweight log management systems, query dynamic streams, and link logs and traces together for high-speed debugging.

* **Day 19 — Ingestion Pipelines: Prometheus-style Labels for Logs:** Set up Loki targets. Create a high-throughput Promtail log routing configuration, `promtail_configurations.yaml`, that parses unstructured fields with regex and maps target pod labels onto log chunks.
* **Day 20 — Querying with LogQL Parsing & Filtering:** Query logs. Author 6 LogQL queries in `logql_queries.logql`, parsing JSON outputs and creating real-time timeseries logs (e.g., measuring the rate of 5xx errors from raw unstructured console output).
* **Day 21 — Correlating Logs, Metrics, and Tracing IDs:** Build the three-way diagnostic loop. Format application outputs to output matching Trace IDs in `traced_application_logs.json`. Write Grafana Derived Fields config converting trace strings into direct links inside Tempo.
* **Day 22 — Alerting on Logs & Metric-from-Log Engines:** Act on log patterns. Write a valid Loki Alerting rules configuration, `loki_alerting_rules.yaml`, that triggers alerts when specific exceptions (e.g., NullPointerException) recur inside rolling 10-minute blocks.
* **Day 23 — Scaling Log Pipelines & Storage Cleanup:** Route high-throughput logging. Build an advanced log-agent pipeline named `vector_router_pipeline.toml`, prioritizing dropping debug logs, archiving compliance trails to cold storage, and routing error alerts to indexing engines.

#### Sunday — Week 4 Review
* **Concept Quiz:**
  1. *How does Loki minimize index costs compared to traditional search layers?* **[Answer: It does not index log payloads; it only indexes metadata labels exactly corresponding to Prometheus metrics, storing compressed raw text blocks directly in S3]**
  2. *What is high identity cardinality in log labels, and why does it cause issues?* **[Answer: When labels hold highly variable fields like UserID or IP. Since Loki creates a different stream for every unique label combination, high cardinality crashes the index engine with Out-Of-Memory exceptions]**
* **Integration Task:** Connect Loki log-rate alerts directly into Prometheus dashboards to compare error logs with metric anomalies.
* **Weekly Writing/Blog Prompt:** 'A Guide to Logging: Linking Dynamic Trace IDs inside Grafana Loki Logs'.

---

### MONTH 1 CAPSTONE: OBSERVABILITY HOMELAB K8S
* **Objective:** Deploy a complete, production-grade observability suite (Prometheus Operator, Grafana, Loki, Tempo, and Vector) onto a local Kubernetes environment. Configure full end-to-end trace-to-log correlation, SLO metrics tracking, and budget burn-rate alerts under simulated stress workloads.

---

## FUTURE MODULES (MONTHS 2 - 5 OVERVIEWS)

### MONTH 2: GITOPS, PROGRESSIVE DELIVERY, AND IAC
Learn software-defined deployment models using GitOps and Infrastructure-as-Code frameworks.
* **Week 5 — Infrastructure Module Design:** Modular configurations, state file security, and drift containment.
* **Week 6 — Secure CI Pipelines:** Multi-resource builders, secret management pipelines, secure container image validation.
* **Week 7 — GitOps Principle Deployments:** Git-managed state verification, continuous reconciliation loops, drift mitigation.
* **Week 8 — Progressive Canary Delivery:** Rolling out canary deploys and automating rollbacks based on live metrics.
* **EOM Capstone:** Build a GitOps continuous synchronization pipeline that deploys multi-environment workloads and automatically rolls back canary versions if error burn-rate budgets are violated.

### MONTH 3: KUBERNETES OPERATORS & INTERNAL DEVELOPER PLATFORMS
Decouple applications and build modern internal developer portals (IDPs) to automate operations.
* **Week 9 — Kubernetes Extensions:** Architectural design of custom resources, validation controllers, webhooks.
* **Week 10 — Writing Operators:** Building reconciler lifecycles in Go/Rust with Kubebuilder.
* **Week 11 — External Infra via Crossplane:** Direct cloud resources declaration in Kubernetes manifests.
* **Week 12 — Backstage IDP Setup:** Building a centralized software catalog and self-service Golden Paths.
* **EOM Capstone:** Create a Backstage self-service catalog that lets developers request environments, automatically deploying RDS and Kubernetes databases via Crossplane compositions.

### MONTH 4: POLICY, SERVICE MESH, AND CHAOS
Enforce security standards across clusters, secure communications, and verify resilience using fault injection.
* **Week 13 — Policy-as-Code Enforcement:** Enforcing cluster-wide constraints statically.
* **Week 14 — Service Mesh controls:** Securing cluster communication with mTLS, circuit breaking, and traffic splitting.
* **Week 15 — Chaos Exercises:** Injecting resource exhaustions and network delays in production simulations.
* **Week 16 — Advanced Auditing:** Verifying compliance by monitoring system calls (Falco) and enforcing image signature validation at admission.
* **EOM Capstone:** Harden a microservice application stack by locking it down with policy policies, placing it within an mTLS Service Mesh, and validating its recovery capabilities under automated Chaos drills.

### MONTH 5: AWS PRODUCTION SCALING & AI-INTEGRATED PLATFORMS
Expose platform infrastructure to AI workflows, scale production EKS clusters, and finalize your portfolio.
* **Week 17 — Pod & Node Autoscaling:** Karpenter configuration, custom scale metrics, Spot instance integrations.
* **Week 18 — Platform Governance & Cost Audit:** Advanced Kubecost analyses, Spot consolidations, asset runtimes.
* **Week 19 — AI-Integrated SRE Engineering:** Constructing RAG chatbot advisors, ChatOps Slack engines, and building local Model Context Protocol (MCP) server adapters.
* **Week 20 — SRE Career Refineries:** Designing case studies, mock incident deep-dives, and publishing postmortems.
* **EOM Capstone:** Deploy an SRE Diagnostics Portal with a server-side Gemini system that analyzes logs and allows developers to run interactive, AI-assisted incident triage drills.

---

## 6. JOB READINESS CHECKLIST

| Skill Area | Week(s) Learned | Portfolio Evidence / Asset | Typical SRE Interview Question Target |
| :--- | :--- | :--- | :--- |
| **SLO Engineering** | Week 1 | `error_budget_calcs.py`, `prometheus_alerts.yml` | "How do you define a multi-burn rate alert system, and why is it superior to static CPU thresholds?" |
| **Host Diagnostics** | Week 2 | `deadlock_diagnosis.md`, `dummy-app.service` | "A production process is deadlocked without logs. How would you isolate the system call it is hanging on?" |
| **Distributed Tracing** | Week 3 | `otel_collector_config.yaml`, `manual_instrumentation_demo.js` | "Explain context propagation. How does a trace query span across multiple decoupled Node engines?" |
| **Log-Trace Correlation** | Week 4 | `traced_application_logs.json`, Grafana configs | "We see an API latency spike. Walk me through the exact steps to jump from the alert to the offending log line." |
| **GitOps & Canary** | Weeks 7-8 | Argo Rollouts configuration manifests | "Walk me through how you protect production workloads during canary deployments, and how you automate rollbacks." |
| **K8s Custom Controllers** | Week 10 | Custom Operator built with Kubebuilder | "Explain how a reconciliation loop works inside a Kubernetes custom controller." |
| **Cloud Autoscaling** | Week 17 | Karpenter NodePool manifests | "How does Karpenter optimize resource scheduling and node consolidation differently from Cluster Autoscaler?" |
| **AI Workflows (MCP)** | Week 19 | Custom MCP SRE Mock Server endpoint | "How can we safely integrate Large Language Models into incident response channels without giving them direct root access?" |

---

## 7. APPENDIX: GLOSSARY OF SRE ACRONYMS

* **ALB:** Application Load Balancer (AWS layer 7 load distributor)
* **API:** Application Programming Interface
* **CFS:** Completely Fair Scheduler (the Linux CPU scheduler allocating shares to processes)
* **CNI:** Container Network Interface (the plugin responsible for cluster network routing)
* **CRD:** Custom Resource Definition (Kubernetes API server schema extender)
* **EKS:** Elastic Kubernetes Service (AWS managed Kubernetes platform)
* **GCS:** Google Cloud Storage
* **IaC:** Infrastructure as Code (Terraform, Pulumi, etc.)
* **IDP:** Internal Developer Platform (Self-service portals reducing developer friction)
* **JVM:** Java Virtual Machine
* **KEDA:** Kubernetes Event-driven Autoscaling
* **Loki:** Grafana's cost-effective log storage and search engine
* **MCP:** Model Context Protocol (an open standard connecting LLM agents to operational database/system tooling)
* **mTLS:** Mutual Transport Layer Security (cryptographic verification on both sides)
* **OOM:** Out of Memory (Linux kernel process termination event)
* **OTel:** OpenTelemetry (vendor-neutral telemetry collector standard)
* **PromQL:** Prometheus Query Language
* **RAG:** Retrieval-Augmented Generation (context injector for LLMs)
* **RED:** Rate, Errors, Duration (microservice telemetry metrics design pattern)
* **SLA:** Service Level Agreement (business contract detailing service obligations)
* **SLI:** Service Level Indicator (raw metric measuring system reliability)
* **SLO:** Service Level Objective (the target reliability SRE teams agree to maintain)
* **SRE:** Site Reliability Engineer
* **USE:** Utilization, Saturation, Errors (system and hardware telemetry metrics design pattern)
