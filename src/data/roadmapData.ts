export interface DailyTask {
  dayNum: number;
  title: string;
  timeEstimate: string;
  context: string;
  theory: {
    concepts: string[];
    readings: string[];
    questions: string[];
  };
  lab: {
    scenario: string;
    steps: string[];
    stretchGoal: string;
  };
  deliverable: string;
  pitfalls: string[];
}

export interface WeekData {
  weekNum: number;
  theme: string;
  summary: string;
  primaryTools: string[];
  awsThread?: string;
  days: DailyTask[];
  sundayReview: {
    quizQuestions: { question: string; answer: string }[];
    miniTask: string;
    reflectionPrompt: { title: string; requirements: string[] };
  };
}

export interface MonthData {
  monthNum: number;
  title: string;
  overview: string;
  weeks: WeekData[];
  capstone: {
    title: string;
    architecture: string;
    deliverables: string[];
    docRequirements: string[];
  };
}

export const roadmapData: MonthData[] = [
  {
    monthNum: 1,
    title: "Observability Stack & SRE Fundamentals",
    overview: "This month establishes your core SRE foundation. You will transition from basic infrastructure management to target-driven system reliability, mastering SLI/SLO/SLA math, error budgets, telemetry aggregation, and deep Linux-level diagnostics. This enables you to measure and maintain production system health scientifically.",
    weeks: [
      {
        weekNum: 1,
        theme: "SRE Metrics & SLO Engineering",
        summary: "Learn SRE math, error budgets, service level indicators, and alerting structures based on the Google SRE workbook. Align technical metrics with user experience.",
        primaryTools: ["SRE Workbook math", "Grafana", "Prometheus expressions"],
        awsThread: "AWS CloudWatch Metrics & IAM Role Mapping for agent authentication",
        days: [
          {
            dayNum: 1,
            title: "SLI, SLO, SLA Deconstruction & Math",
            timeEstimate: "3.5h",
            context: "SREs distinguish technical metrics from customer-facing reliability commitments. You will learn the mathematical foundation of error budgets and how 99.9% vs 99.99% impacts engineering velocity.",
            theory: {
              concepts: [
                "The mathematical definition of SLI: (Good Events / Total Events) * 105",
                "SLO target setting versus SLA business commitments (legal/financial contracts)",
                "Error Budget Calculation: Error Budget = 100% - SLO. Burn rates and impact of downtime windows"
              ],
              readings: [
                "Google SRE Book - Chapter 4 (Service Level Objectives)",
                "SRE Workbook - Chapter 2 (Implementing SLOs)"
              ],
              questions: [
                "If a service handles 5,000,000 requests over 30 days, how many bad requests can it tolerate at a 99.9% SLO?",
                "What is the difference between a rolling 30-day window and a calendar month window for error budgets?"
              ]
            },
            lab: {
              scenario: "Calculate the error budget for an API gateway that received 10,000,000 requests over 30 days. Define a 99.95% SLO and compute exactly the downtime budget allowed in minutes.",
              steps: [
                "Write a python/bash script or use a spreadsheet to model rolling 30-day counts.",
                "Calculate total allowable failed requests: 10,000,000 * (1 - 0.9995) = 5,000.",
                "Calculate allowable minutes of complete disruption: 30 * 24 * 60 * 0.0005 = 21.6 minutes."
              ],
              stretchGoal: "Extend your script to model multi-window multi-burn-rate alerts (e.g. alert if 2% of budget is consumed in 1 hour)."
            },
            deliverable: "An `error_budget_calcs.json` or markdown layout containing the SRE spreadsheet calculations.",
            pitfalls: [
              "Failing to filter out clean client-side errors (e.g., 404s) from your error metrics when calculating system reliability."
            ]
          },
          {
            dayNum: 2,
            title: "The Four Golden Signals & RED/USE Methods",
            timeEstimate: "3h",
            context: "Standardizing metric models accelerates dashboard creation and incident triage. You will master the RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors) frameworks.",
            theory: {
              concepts: [
                "The Four Golden Signals: Latency, Traffic, Errors, Saturation",
                "RED Method (user-facing high-level services) vs USE Method (hardware/resource components)",
                "How queues and saturation buffer traffic before expressing as high latency"
              ],
              readings: [
                "Google SRE Book - Chapter 6 (Monitoring Distributed Systems)",
                "The USE Method by Brendan Gregg"
              ],
              questions: [
                "When would you prioritize the RED method over the USE method?",
                "How do you mathematically measure saturation in a disk or network device?"
              ]
            },
            lab: {
              scenario: "Examine a simulated slow service with saturated CPU of 98%. Identify whether RED or USE metrics best signal the root cause.",
              steps: [
                "Create a text diagram representing the saturation path.",
                "Define 3 specific USE indicators for a Linux CPU (user, system, iowait; and run queue length).",
                "Define 3 RED indicators for an API proxy (request frequency, response code count, p99 duration)."
              ],
              stretchGoal: "Write a high-concept architecture explaining how a CPU spike of 100% can cause 0% error rate but high p99 latency."
            },
            deliverable: "A `signals_taxonomy.md` file charting metric telemetry points for a classic Nginx -> Node App -> Postgres system.",
            pitfalls: [
              "Confusing raw utilization (percent time busy) with saturation (queue backlog). Saturation occurs after utilization reaches 100%."
            ]
          },
          {
            dayNum: 3,
            title: "PromQL Fundamentals & Advanced Rate Queries",
            timeEstimate: "4h",
            context: "SREs use Prometheus Query Language to query timeseries databases dynamically. Knowing how rate(), irate(), and histogram aggregations work is critical for building correct dashboards.",
            theory: {
              concepts: [
                "Timeseries data models: timestamp, value, label sets",
                "Range vectors [5m] versus Instant vectors",
                "Why `rate()` handles counter resets internally, while `increase()` calculates cumulative changes",
                "Proper usage of `irate()` (instant rate based on last two data points) versus `rate()` (average rate over range window)"
              ],
              readings: [
                "Prometheus Official Docs - Querying Basics & Functions",
                "Robust Perception - rate() vs irate() deep dive"
              ],
              questions: [
                "Why must you always apply `rate()` before taking `sum()`, and never the other way around?",
                "How does `histogram_quantile(0.99, ...)` compute percentiles?"
              ]
            },
            lab: {
              scenario: "Spin up a local Prometheus instance container or use a PromQL sandbox tool. Write queries to analyze CPU usage and HTTP request rates.",
              steps: [
                "Formulate a rate query: `sum(rate(http_requests_total{status=~'5..'}[5m]))`",
                "Formulate a CPU saturation query: `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)`",
                "Write a query calculating the ratio of 5xx errors to total HTTP requests over a 1-hour window."
              ],
              stretchGoal: "Write a complex query to calculate the 99th percentile response time for `http_request_duration_seconds_bucket` aggregations."
            },
            deliverable: "A collection of 5 highly useful, commented PromQL queries in `promql_cheatsheet.promql`.",
            pitfalls: [
              "Using `irate()` for alerts or long-term graphing. Because `irate()` responds instantly to spikes, it generates noisy graphs and false alerts. Use `rate()` instead."
            ]
          },
          {
            dayNum: 4,
            title: "Alerting Rules, Alertmanager & Multi-Burn Rates",
            timeEstimate: "4h",
            context: "Over-alerting causes pager fatigue. SREs design alerts based on how fast the system is consuming ('burning') its error budget, rather than static thresholds.",
            theory: {
              concepts: [
                "Multi-window, multi-burn-rate alerts (e.g. burn 2% score in 1h, or burn 5% in 6h)",
                "Alertmanager architecture: deduplication, grouping, inhibition, routing",
                "PagerDuty integration schemas and priority matrices"
              ],
              readings: [
                "SRE Workbook - Chapter 5 (Alerting on SLOs)",
                "Prometheus Docs - Alerting Rules"
              ],
              questions: [
                "Why are static alerts (e.g. disk usage > 80% or CPU > 90%) fragile in elastic cloud environments?",
                "How does alert grouping prevent storm notifications when a primary database goes offline?"
              ]
            },
            lab: {
              scenario: "Draft a Prometheus alerting rules YAML file that implements a multi-burn rate alert targeting the error budget of a core user-facing service.",
              steps: [
                "Structure a standard `prometheus_alerts.yml` rule group.",
                "Build a rule that fires critical severity if the error budget burn rate is > 14.4 over a 1h window (threatening 2% of budget).",
                "Build a warning rule if the burn rate is > 3.0 over a 6h window."
              ],
              stretchGoal: "Add an alert inhibition rule so that downstream microservice database alerts are silenced if the primary datastore is confirmed offline."
            },
            deliverable: "A fully valid `prometheus_alerts.yml` configuration targeting SLO burn rates.",
            pitfalls: [
              "Alerting on short time windows without verification. A rapid scale-out or transient spike can trigger a page before auto-healing acts. Balance speed with signal confidence."
            ]
          },
          {
            dayNum: 5,
            title: "Grafana Dashboards & Visual Hierarchy",
            timeEstimate: "3.5h",
            context: "Dashboards should be highly functional during high-stress triage events. Good dashboards represent the mental model of the system with clear hierarchical paths.",
            theory: {
              concepts: [
                "Establishing dashboard triage hierarchy: High-level SLO health status top-left, progressing down to specific components",
                "Variables and templates in Grafana to toggle clusters, environments, and pods dynamically",
                "Threshold visualization and styling conventions (avoid rainbow layouts, highlight deviations)"
              ],
              readings: [
                "Grafana Best Practices for Dashboard Design",
                "Google SRE Book - Chapter 12 (Effective Troubleshooting)"
              ],
              questions: [
                "What is the 'two-second rule' for dashboards during building?",
                "Why should you limit the number of widgets on a single panel grid?"
              ]
            },
            lab: {
              scenario: "Design an SRE 'Dashboard Blueprint' in JSON or mock layout. Represent the four golden signals corresponding to a critical billing service.",
              steps: [
                "Layout a top row featuring: Error Budget Remaining (Single Stat), SLO Status (gauge), Active Alerts.",
                "Layout a second row: RED Metrics (Rate, Error, Duration 99th percentile) of incoming HTTP traffic.",
                "Layout a third row: USE Metrics (CPU, Memory, Disk, Network) of underlying container hosting node instances."
              ],
              stretchGoal: "Convert the visual layout mock into an actual Grafana JSON Model template snippet utilizing variables (`$environment`)."
            },
            deliverable: "A `billing_dashboard_blueprint.json` or mock text schematic displaying SRE dashboards.",
            pitfalls: [
              "Failing to document what the panels show, or neglecting to include a link to the corresponding runbook inside the panel description."
            ]
          },
          {
            dayNum: 6,
            title: "Mock Incident Management & Blameless Culture",
            timeEstimate: "3.5h",
            context: "Culture is as vital to SRE success as mechanics. Blameless postmortems surface structural, configuration, and systemic issues instead of blaming human error.",
            theory: {
              concepts: [
                "Standard SRE incident command roles: Incident Commander, Communications Lead, Operations Lead",
                "Blameless postmortems: Focus on the 'how' and 'what', not 'who'",
                "Designing actionable SRE remediation items (prevent, detect, mitigate, repair)"
              ],
              readings: [
                "Google SRE Book - Chapter 9 (Simulating Disasters) & Chapter 15 (Postmortem Culture)",
                "Etsy's Guide to Blameless Postmortems"
              ],
              questions: [
                "What occurs during an incident when the 'Incident Commander' does not delegate tasks?",
                "What are the qualities of a preventative action item in a postmortem report?"
              ]
            },
            lab: {
              scenario: "Review a transcript of a catastrophic production database outage caused by a developer running an un-indexed migration lock. Draft a fully blameless, retrospective root-cause report.",
              steps: [
                "Analyze timeline anomalies: migration run at 14:00, database locked at 14:02, alert fired at 14:08, rollbacked at 14:35.",
                "Structure a SRE blameless report avoiding naming individuals; focus on missing locking safe protection tooling and slow alarm alerts.",
                "Propose 3 automation actions: pre-migration execution timeout wrappers, automatic static analysis check (PR linter) for indexes."
              ],
              stretchGoal: "Map the incident root-cause into an updated runbook process that will let developers execute emergency single-row operations."
            },
            deliverable: "A professional, portfolio-grade `blameless_postmortem_database_lockout.md` report.",
            pitfalls: [
              "Writing soft remediations like 'Tell the team to be more careful' or 'Re-train devs on database queries'. Human care is not a system control. Automate safety instead."
            ]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is the formula representing SLO Service Level Agreements mathematically?", answer: "(Good transactions / Total transactions) * 100." },
            { question: "Compare the RED and USE service observation methods.", answer: "RED (Rate, Errors, Duration) is for apps. USE (Utilization, Saturation, Errors) is for hardware." },
            { question: "What happens to the error budget burn rate metric if a catastrophic failure takes a cluster completely down structure?", answer: "The burn rate will spike to 100% capacity instantly, leading to an immediate SLO breach." }
          ],
          miniTask: "Map custom Prometheus multi-window queries into an interactive system status summary dashboard layout.",
          reflectionPrompt: {
            title: "From DevOps to SRE Practice: Rethinking Metrics",
            requirements: ["Discuss why host alerts are broken in cloud-native settings.", "Explain how error budgets align engineering incentives."]
          }
        }
      },
      {
        weekNum: 2,
        theme: "Infrastructure Diagnostics & Linux Internals",
        summary: "Trace systemic issues by diving into container networks, process sandboxes, file descriptors, CPU scheduler dynamics, and low-level Linux diagnostics.",
        primaryTools: ["strace", "lsof", "sysctl", "cgroups", "systemd", "nsenter"],
        awsThread: "AWS EC2 Nitro hypervisor namespaces and EBS volume throughput saturation metrics",
        days: [
          {
            dayNum: 7,
            title: "Namespaces, cgroups, and Container Runtimes",
            timeEstimate: "4h",
            context: "Containers are just normal processes bound by Linux Namespaces (isolation) and cgroups (limits). SREs must debug when limits cause process crashes.",
            theory: {
              concepts: [
                "Linux Namespaces: PID, NET, MNT, IPC, UTS, USER",
                "cgroups v1 vs v2: Memory limits, CPU shares, and CFS (Completely Fair Scheduler) throttling"
              ],
              readings: ["Linux Kernel Documentation - namespaces"],
              questions: ["What is the difference between CPU limits (CFS quota) and CPU requests (shares)?"]
            },
            lab: {
              scenario: "Investigate a pod repeatedly failing with CrashLoopBackOff as a result of OOM-killing (Exit Code 137).",
              steps: [
                "Simulate memory constraint inside a dedicated cgroup testing layer.",
                "Review system kernel logs via dmesg command for direct OOM kills verification."
              ],
              stretchGoal: "Write a script to read a process's current memory configuration limit directly from its cgroups folder."
            },
            deliverable: "Diagnostic logs showing automated kernel container resource metrics.",
            pitfalls: ["Failing to understand RAM limits mapping compared to JVM active heaps configuration."]
          },
          {
            dayNum: 8,
            title: "Process Inspection with strace, lsof, and procfs",
            timeEstimate: "3.5h",
            context: "When a binary hangs or crashes without clear logging, you must intercept its system calls directly using low-level kernel analysis interfaces.",
            theory: {
              concepts: ["Syscall tracing via strace", "Tracking resource allocations with lsof", "Exploring the proc filesystem"],
              readings: ["Man pages: strace(1), lsof(8)"],
              questions: ["What syscall indicates a service has depleted its allowed file descriptor allocations?"]
            },
            lab: {
              scenario: "Analyze process syscall locks and track lingering un-closed system assets.",
              steps: [
                "Locate lingering non-closed descriptors with lsof paths.",
                "Attach strace process bindings to intercept current waiting syscall hooks."
              ],
              stretchGoal: "Locate socket network descriptors using proc namespace files."
            },
            deliverable: "A markdown log summarizing the trace outputs of deadlocked processes.",
            pitfalls: ["Executing strace directly in critical heavy production paths without strict limits."]
          },
          {
            dayNum: 9,
            title: "Kernel System Tuning via sysctl & Virtual Memory",
            timeEstimate: "4h",
            context: "Cloud infrastructure scales but Linux OS defaults are often tuned for single workstations. System-level bottlenecks occur in TCP buffers and file limits.",
            theory: {
              concepts: ["Kernel configuration with sysctl", "Virtual memory management and swappiness", "TCP connection queues"],
              readings: ["Linux Sysctl Documentation"],
              questions: ["How does swappiness tuning adjust physical RAM preservation?"]
            },
            lab: {
              scenario: "Formulate a custom sysctl system profile override optimized for high throughput workloads.",
              steps: [
                "Establish sysctl bindings inside a systemd settings overrides configuration.",
                "Configure optimal system limits for virtual memory dirty ratios."
              ],
              stretchGoal: "Simulate the performance difference under synthetic network stress loads."
            },
            deliverable: "A fully valid 99-performance.conf override file for Linux systems.",
            pitfalls: ["Using aggressive legacy tcp_tw_recycle configuration flags in NAT routers."]
          },
          {
            dayNum: 10,
            title: "Debugging Pods in Kubernetes with nsenter",
            timeEstimate: "3.5h",
            context: "Modern distroless/minimalist containers omit critical tools like curl, netstat, or bash. SREs bypass this by entering namespaces from the host OS directly.",
            theory: {
              concepts: ["Entering container namespaces", "Checking distroless networks from host OS namespaces", "The nsenter utility"],
              readings: ["Man page: nsenter(1)"],
              questions: ["Why is installing redundant shell assets inside containers a security risk?"]
            },
            lab: {
              scenario: "Troubleshoot a minimalist container lacking debugging packages by accessing its socket interfaces directly from the host.",
              steps: [
                "Isolate the container namespace location on the Docker/Containerd worker node.",
                "Bind diagnostic sockets using nsenter networks directly into the isolated runtime."
              ],
              stretchGoal: "Analyze TCP packet payloads over the virtual interfaces of the container."
            },
            deliverable: "An execution checklist to target minimal shell environments via host interfaces.",
            pitfalls: ["Failing to extract correct namespace processes matching the runtime process table."]
          },
          {
            dayNum: 11,
            title: "Storage Diagnostics & Disk I/O Saturation",
            timeEstimate: "3.5h",
            context: "Slow I/O can bottleneck database systems, causing upstream queue lockup. Chart disk usage and understand scheduler queue latency.",
            theory: {
              concepts: ["Tracking mount disk sectors and inodes allocations", "IO queue wait timings and saturation metrics"],
              readings: ["Brendan Gregg - Systems Performance (Disks)"],
              questions: ["Explain why a disk throws disk-full errors despite showing available storage room."]
            },
            lab: {
              scenario: "Conduct dynamic disk IO latency testing using the fio utility to test hardware limits.",
              steps: [
                "Check active inode count allocations using the command df -i.",
                "Monitor real-time write saturation using the iostat metrics tools."
              ],
              stretchGoal: "Find the process utilizing high disk channels with specialized diagnostic commands."
            },
            deliverable: "A detailed test report charting performance limits across disk stress files.",
            pitfalls: ["Ignoring metrics like inode capacity when monitoring only generic storage spaces."]
          },
          {
            dayNum: 12,
            title: "Systemd Unit Configurations & Process Caging",
            timeEstimate: "3.5h",
            context: "SREs must ensure systemd services run with secure limits, isolating host system resources and defining graceful restart behaviors.",
            theory: {
              concepts: ["Setting bounds inside service units", "Isolating directories and limiting resources", "Systemd restart protocols"],
              readings: ["Systemd exec directives"],
              questions: ["How do resource rules protect other host processes from memory leakage?"]
            },
            lab: {
              scenario: "Hardened a Linux microservice daemon from potential host privilege escalations.",
              steps: [
                "Define custom memory and scheduling constraints directly inside a systemd unit.",
                "Apply filesystem isolation parameters to restrict access to system roots."
              ],
              stretchGoal: "Perform hot reloading of service properties without disrupting availability."
            },
            deliverable: "A validated Systemd configuration file mapping secure isolated boundaries.",
            pitfalls: ["Failing to invoke systemd unit reloads, leaving configuration states out of match."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Where is process data and network configs located inside Linux virtual interfaces?", answer: "The proc filesystem (`/proc`)." },
            { question: "Contrast CPU quota bounds against CPU shares allocation.", answer: "CFS quota enforces strict maximum limits, whereas shares allocate proportional access." }
          ],
          miniTask: "Create a rapid triage checklist connecting OOM logs to kernel metrics.",
          reflectionPrompt: {
            title: "Securing Minimal Container Deployments",
            requirements: ["Highlight the benefits of distroless footings.", "Contrast alternative host namespace diagnostic patterns."]
          }
        }
      },
      {
        weekNum: 3,
        theme: "Distributed Observability",
        summary: "Trace queries and operations end-to-end across complex microservice boundaries using Prometheus metrics, OpenTelemetry instrumentation, and Tempo distributed tracing.",
        primaryTools: ["Prometheus Operator", "Grafana Tempo", "OpenTelemetry SDK", "Jaeger", "Vector"],
        awsThread: "AWS Distro for OpenTelemetry (ADOT) and AWS X-Ray integration models",
        days: [
          {
            dayNum: 13,
            title: "Prometheus Operator & Custom ServiceMonitors",
            timeEstimate: "4h",
            context: "Standard Prometheus scraping configuration gets messy at scale. SREs use the Prometheus Operator to manage target configurations dynamically with Custom Resources.",
            theory: {
              concepts: ["Kubernetes Operator pattern", "ServiceMonitor vs standard scraping configurations"],
              readings: ["Prometheus Operator documentation"],
              questions: ["How do ServiceMonitors map targets across different namespaces dynamically?"]
            },
            lab: {
              scenario: "Set up the Prometheus operator and register a custom service dynamically with a ServiceMonitor resource.",
              steps: [
                "Install Prometheus Operator using official Helm charts.",
                "Author a custom ServiceMonitor yaml targeting app services with label metadata."
              ],
              stretchGoal: "Apply scraping filter rules to drop heavy, unneeded target metrics."
            },
            deliverable: "A fully valid `servicemonitor.yaml` manifest.",
            pitfalls: ["ServiceMonitors failing to pull because metadata selectors mismatch actual service tags."]
          },
          {
            dayNum: 14,
            title: "OpenTelemetry Core Architecture & Collectors",
            timeEstimate: "3.5h",
            context: "Vendor lock-in is a major risk for enterprise telemetry. OpenTelemetry standardizes metric, log, and trace collection under a single vendor-neutral spec.",
            theory: {
              concepts: ["MELT data consolidation pillars", "Collector components: Receivers, Processors, Exporters"],
              readings: ["OpenTelemetry Collector guide"],
              questions: ["Explain the critical tasks of Processors in collector data pipelines."]
            },
            lab: {
              scenario: "Configure a local OTel Collector pipeline to ingest telemetry packets and route trace files.",
              steps: [
                "Configure a custom collector specification using a YAML properties file.",
                "Open listener systems to capture telemetry data via gRPC configurations."
              ],
              stretchGoal: "Establish metric filters to feed OTel statistics directly into Prometheus."
            },
            deliverable: "A verified `otel_collector_config.yaml` profile.",
            pitfalls: ["Failing to set memory constraints on collector buffers, leading to host crash."]
          },
          {
            dayNum: 15,
            title: "Traces, Spans, Context Propagation & Parent-Child Trees",
            timeEstimate: "4h",
            context: "During microservice interactions, system requests traverse multiple processes. Context propagation tracks transactions across network boundaries.",
            theory: {
              concepts: ["The structure of spans and traceparent values", "W3C headers and proprietary formats"],
              readings: ["W3C Trace Context spec"],
              questions: ["How are children spans linked to parent trace IDs mathematically?"]
            },
            lab: {
              scenario: "Deconstruct an API response payload to parse trace links and map out traceparent logs.",
              steps: [
                "Format nested transaction logs mapping a multi-hop API service flow.",
                "Extract incoming headers to correlate downstream database queries."
              ],
              stretchGoal: "Map transaction latency gaps where third-party APIs are called."
            },
            deliverable: "A detailed transaction span tree JSON payload mapping requests correctly.",
            pitfalls: ["Clocks drift across separate nodes causing child operations to appear to start before parent systems."]
          },
          {
            dayNum: 16,
            title: "Auto vs Manual Instrumentation with OTEL SDK",
            timeEstimate: "4h",
            context: "Auto-instrumentation gets you basic tracing instantly without modifying code, but manual instrumentation is required to capture custom business logic and domain-specific spans.",
            theory: {
              concepts: ["Auto-instrumentation vs compiling SDKs inside application code", "Creating boundaries for spans"],
              readings: ["OTel SDK manual for programming languages"],
              questions: ["Under what operational constraints would you prefer manual tracing additions?"]
            },
            lab: {
              scenario: "Integrate tracing telemetry within a mock express shell using custom OTel properties.",
              steps: [
                "Initialize telemetry SDK frameworks directly inside code setups.",
                "Enclose active database runs within customized tracer blocks."
              ],
              stretchGoal: "Export system errors directly as span exception details."
            },
            deliverable: "A trace-ready node script file utilizing manual OpenTelemetry API.",
            pitfalls: ["Leaving spans open on failure due to bad error encapsulation blocks."]
          },
          {
            dayNum: 17,
            title: "Tempo/Jaeger Storage & Trace Visualizations",
            timeEstimate: "3.5h",
            context: "To handle the massive scale of enterprise tracing, you must configure a reliable distributed storage backend like Grafana Tempo or Jaeger.",
            theory: {
              concepts: ["Distributed database engines for traces storage", "Indexless vs database-backed models"],
              readings: ["Grafana Tempo architectural guidelines"],
              questions: ["Why do indexless models achieve higher cost savings over traditional systems?"]
            },
            lab: {
              scenario: "Set up trace retention limits and configure target object storage pools.",
              steps: [
                "Configure Tempo properties specifying blocks creation files.",
                "Integrate with simulated long-term storage buckets."
              ],
              stretchGoal: "Enforce a trace consolidation routine to clear logs on-schedule."
            },
            deliverable: "A functional tempo configuration properties profile.",
            pitfalls: ["Underestimating memory buffer requirements for ring buffers under heavy traffic."]
          },
          {
            dayNum: 18,
            title: "Distributed Tracing Samplers & Cost Optimization",
            timeEstimate: "3.5h",
            context: "Capturing 100% of traces in high-traffic systems is incredibly expensive. SREs use smart sampling to capture errors and rare anomalies while dropping repetitive normal traces.",
            theory: {
              concepts: ["Head-based vs Tail-based tracing sampling strategies", "Filtering for exceptions"],
              readings: ["OTel Collector Processor rules"],
              questions: ["Under what scenarios does head-based sampling risk dropping diagnostic context?"]
            },
            lab: {
              scenario: "Design a tail-based filter matrix to guarantee error sequences are retained.",
              steps: [
                "Establish OTel properties declaring custom tail sampling logic.",
                "Filter blocks targeting long-duration steps while dropping green runs."
              ],
              stretchGoal: "Construct rate limit rules to reject trace spikes."
            },
            deliverable: "An optimized `otel_collector_tail_sampling.yaml` manifest.",
            pitfalls: ["Failing to route related spans to the same collector node, causing broken trace graphs."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What are the core telemetry pillars under the MELT model?", answer: "Metrics, Logs, and Traces." },
            { question: "Define the function of tail-based sampling.", answer: "It allows filter actions after the full trace completes, ensuring anomalies and slow traces are preserved." }
          ],
          miniTask: "Sketch a cluster context propagation flow over multiple API boundaries.",
          reflectionPrompt: {
            title: "Optimizing Tracing Cost Footprints",
            requirements: ["Discuss the economics of trace sampling.", "Design rules to capture high-value data at low costs."]
          }
        }
      },
      {
        weekNum: 4,
        theme: "Log Aggregation & Log-to-Metric Correlation",
        summary: "Build high-throughput, structured log ingestion architectures, and correlate trace IDs directly to application logs for instant system routing diagnostics.",
        primaryTools: ["Grafana Loki", "Promtail", "Vector", "Elasticsearch FluentBit (EFK)", "LogQL"],
        awsThread: "AWS CloudWatch Logs Insights querying structures and IAM S3 log shipping policies",
        days: [
          {
            dayNum: 19,
            title: "Ingestion Pipelines: Prometheus-style Labels for Logs",
            timeEstimate: "4h",
            context: "Traditional heavy index structures like Elasticsearch are very expensive. Grafana Loki keeps logs lightweight by indexing only search metadata labels (just like Prometheus).",
            theory: {
              concepts: ["Metadata indexing vs full data indices", "Configuring log forwards like Promtail and Vector"],
              readings: ["Loki index constraints"],
              questions: ["Why are high cardinality labels like user IP addresses a major risk in Loki?"]
            },
            lab: {
              scenario: "Configure Promtail routes to ingest node level log assets smoothly.",
              steps: [
                "Configure a promtail mapping script with custom labeling rules.",
                "Extract structured fields and push clean data streams to Loki."
              ],
              stretchGoal: "Implement Promtail regex rules to isolate and tag specific security events."
            },
            deliverable: "A fully valid `promtail_configurations.yaml` manifest.",
            pitfalls: ["Injecting highly dynamic variables as index labels, causing index degradation."]
          },
          {
            dayNum: 20,
            title: "Querying with LogQL Parsing & Filtering",
            timeEstimate: "3.5h",
            context: "Unstructured logs are useless in a crisis. You must know how to parse, extract JSON attributes, and search through gigabytes of logs using LogQL.",
            theory: {
              concepts: ["LogQL formatting: Stream selectors and line filters", "On-the-fly JSON parsing in queries"],
              readings: ["Grafana LogQL guides"],
              questions: ["Contrast a basic log line filter against a rate metric aggregation query."]
            },
            lab: {
              scenario: "Formulate LogQL expressions to check real-time system failure rates.",
              steps: [
                "Query Loki matching JSON application outputs for key failures.",
                "Aggregate failure frequency into a live Grafana metrics graph."
              ],
              stretchGoal: "Extract median service latencies directly from text logfmt strings."
            },
            deliverable: "A cheat-sheet directory compiling 6 high-value troubleshooting LogQL queries.",
            pitfalls: ["Failing to wrap parameters properly, leading to empty query outputs."]
          },
          {
            dayNum: 21,
            title: "Correlating Logs, Metrics, and Tracing IDs",
            timeEstimate: "4h",
            context: "Triage becomes instantly faster when you can jump directly from a metric spike to its associated trace, and then view the exact log line that recorded the failure.",
            theory: {
              concepts: ["The three-way correlation loop", "Injecting TraceParent metrics directly inside Winston logs", "Configuring Grafana's Derived Fields"],
              readings: ["Linking trace IDs into structured logging frameworks"],
              questions: ["How do derived field rules generate direct Jaeger links from plain log texts?"]
            },
            lab: {
              scenario: "Generate a synthetic application output stream featuring correlated Trace IDs.",
              steps: [
                "Setup unified logging formatting containing trace attributes.",
                "Structure a derived field configuration in Grafana matching the log output format."
              ],
              stretchGoal: "Validate deep correlation through an entire multi-hop call chain."
            },
            deliverable: "A JSON file template containing structured, traced application logs.",
            pitfalls: ["Using conflicting trace field names across services, breaking correlation patterns."]
          },
          {
            dayNum: 22,
            title: "Alerting on Logs & Metric-from-Log Engines",
            timeEstimate: "3.5h",
            context: "Sometimes applications can't easily emit custom metrics, but we can detect issues by alerting on specific log occurrences.",
            theory: {
              concepts: ["Converting text logs to timeseries counters", "Authoring Loki alerting rules"],
              readings: ["Loki rules and metrics guide"],
              questions: ["Why is it better to emit metrics directly rather than generating them from logs?"]
            },
            lab: {
              scenario: "Draft a Loki alerting template that monitors checkout crashes in real-time.",
              steps: [
                "Formulate a ruler configurations block tracking specific error frequencies.",
                "Define trigger values for warning alerts when ratios exceed 5%."
              ],
              stretchGoal: "Link triggering rules back to automated trouble runbooks."
            },
            deliverable: "A fully valid `loki_alerting_rules.yaml` manifest.",
            pitfalls: ["Configuring short evaluation periods that cause excessive query load on Loki."]
          },
          {
            dayNum: 23,
            title: "Scaling Log Pipelines & Storage Cleanup",
            timeEstimate: "3.5h",
            context: "Ingesting massive volumes of debug logs is incredibly expensive. SREs design scalable pipelines that drop debug logs and archive trails.",
            theory: {
              concepts: ["Ingestion routing and filtering strategies", "Cloud cold storage lifecycle architectures"],
              readings: ["Loki cluster resizing"],
              questions: ["What are the savings of lifecycle archiving vs keeping logs database active?"]
            },
            lab: {
              scenario: "Prepare Vector filter rules to drop verbose system logs before database storage.",
              steps: [
                "Write Vector pipelines to drop all verbose logs at ingestion points.",
                "Route compliance trails safely to long term object storage buckets."
              ],
              stretchGoal: "Calculate exact cost savings of dropping 90% of raw debug lines."
            },
            deliverable: "A robust `vector_router_pipeline.toml` profile.",
            pitfalls: ["Accidentally drop core error footprints due to overly strict routing metrics."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "How does Loki save disk expenditures?", answer: "By indexing labels rather than message texts." },
            { question: "What is the role of Grafana Derived Fields?", answer: "Automatically link span values in text logs to Tempo trace dashboards." }
          ],
          miniTask: "Write a Loki alerting configuration tracking token failure errors.",
          reflectionPrompt: {
            title: "Cost Management in Scale Observability",
            requirements: ["Highlight differences of full text catalogs vs indexless setups.", "Propose a retention cleanup scheme to balance records against fees."]
          }
        }
      }
    ],
    capstone: {
      title: "Fully Observable personal/homelab Kubernetes cluster",
      architecture: "Deploy an entire Observability stack (Prometheus Operator, Grafana, Loki, Tempo, and Vector) onto a local Kubernetes environment. Configure correlation and custom metrics dashboards.",
      deliverables: [
        "A directory containing Kubernetes YAML configurations for telemetry deployment.",
        "Custom Prometheus Rules YAML tracking system metrics.",
        "Grafana Dashboard JSON models demonstrating SLO structures."
      ],
      docRequirements: [
        "Architecture diagram detailing telemetry pipeline paths.",
        "Simulations testing demonstrating metric transitions under failure loads."
      ]
    }
  },
  {
    monthNum: 2,
    title: "GitOps, Progressive Delivery, and IaC",
    overview: "This month moves your infrastructure management to software-defined processes. You will transition from manual updates to complete GitOps automation, mastering advanced Terraform module architectures, secure continuous integration, and canary deployments with automated rollbacks.",
    weeks: [
      {
        weekNum: 5,
        theme: "Infrastructure as Code & Advanced Terraform",
        summary: "Develop modular cloud infrastructure using Terraform and OpenTofu. Master state locks and module mappings.",
        primaryTools: ["Terraform", "OpenTofu", "Terragrunt", "tflint"],
        awsThread: "EKS networking architecture definitions and module mapping configs",
        days: [
          {
            dayNum: 24,
            title: "Declarative Provisioning & S3 Remote State Locks",
            timeEstimate: "3.5h",
            context: "SREs coordinate secure cloud deployment states via distributed remote lock mechanisms.",
            theory: {
              concepts: ["Terraform State locks", "AWS S3 and DynamoDB backend coordinates"],
              readings: ["HashiCorp State Locks docs"],
              questions: ["Why are state file locks critical in multi-user environments?"]
            },
            lab: {
              scenario: "Configure a complete, locked AWS S3/DynamoDB remote state backend configuration.",
              steps: [
                "Establish state storage resources in a bootstrap run.",
                "Migrate local state records securely to the remote storage locks."
              ],
              stretchGoal: "Force release a stuck system lock manually using safe CLI parameters."
            },
            deliverable: "A fully valid `backend.tf` configuration.",
            pitfalls: ["Failing to encrypt the remote state file, exposing structural credentials."]
          },
          {
            dayNum: 25,
            title: "Modularizing Infrastructure & Workspaces",
            timeEstimate: "3.5h",
            context: "Structuring infrastructure into clean, reusable modules guarantees consistency across environments.",
            theory: {
              concepts: ["Dry-routing modules schemas", "Terraform Workspaces vs layout hierarchies"],
              readings: ["HashiCorp Modular Design"],
              questions: ["When should you prefer directory-based environment separation over CLI workspaces?"]
            },
            lab: {
              scenario: "Refactor a monolithic infrastructure definition into nested VPC and EC2 modules.",
              steps: [
                "Draft parameter variables and modules outputs structure.",
                "Call child modules dynamically inside production environment directories."
              ],
              stretchGoal: "Publish and import a module from local repository branches."
            },
            deliverable: "A dry-refactored `modules/` and `environments/` folder system.",
            pitfalls: ["Using hardcoded environment strings inside generic child modules."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is the role of remote state locks?", answer: "Prevents simultaneous runs from corrupting shared infrastructure blueprints." }
          ],
          miniTask: "Write a modular configuration building private subnet spaces.",
          reflectionPrompt: {
            title: "Standardizing Platform Blueprints",
            requirements: ["Recommend modular directory bounds for staging vs production environments."]
          }
        }
      },
      {
        weekNum: 6,
        theme: "Secure Continuous Integration & Supply Chain Security",
        summary: "Build high-integrity CI/CD pipelines. Implement automated testing, container security analysis, and static analysis checkpoints.",
        primaryTools: ["GitLab CI", "Trivy", "SonarQube", "hadolint", "cosign"],
        awsThread: "AWS ECR container registries and secure IAM pipeline authentication",
        days: [
          {
            dayNum: 26,
            title: "Docker Linting & Static Container Scans",
            timeEstimate: "3h",
            context: "Eliminating vulnerabilities early in the delivery pipeline prevents vulnerable code from hitting registry services.",
            theory: {
              concepts: ["Linting configurations with Hadolint", "Container vulnerability reports via Trivy"],
              readings: ["Hadolint rules guide"],
              questions: ["How do container scans distinguish base-image issues from application bugs?"]
            },
            lab: {
              scenario: "Introduce static container scanning directly inside a code assembly pipeline.",
              steps: [
                "Add hadolint rules checking syntax during dockerfile creation.",
                "Run vulnerability checks using the Trivy scanner on output images."
              ],
              stretchGoal: "Halt pipeline runs instantly if severe vulnerability records are found."
            },
            deliverable: "A configured `.gitlab-ci.yml` run or scan script pipeline.",
            pitfalls: ["Ignoring vulnerabilities on base structures by skipping base-image evaluations."]
          },
          {
            dayNum: 27,
            title: "Image Signing & Registry Trust Verification",
            timeEstimate: "4h",
            context: "SREs sign build images at creation to ensure container engines run only verified, tamper-proof system releases.",
            theory: {
              concepts: ["Cryptographic signing operations using Cosign", "Establishing image verification gates"],
              readings: ["Cosign/Sigstore manuals"],
              questions: ["How does registry signature verification blocks unauthorized deployments?"]
            },
            lab: {
              scenario: "Generate certificate keys and sign docker container registry assets safely.",
              steps: [
                "Create a Cosign workspace and generate local signature pairs.",
                "Sign compiled container images and verify signatures in repositories."
              ],
              stretchGoal: "Ensure worker nodes reject deployments of unverified container bodies."
            },
            deliverable: "A verification script demonstrating validation of image integrity.",
            pitfalls: ["Storing signing keys directly inside loose, un-encrypted file directories."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Why is Trivy critical in CI setups?", answer: "Finds system-level security gaps in container files automatically." }
          ],
          miniTask: "Configure a secure container validation shell inside a CI builder.",
          reflectionPrompt: {
            title: "Hardening Software Delivery Channels",
            requirements: ["Discuss the mechanics of cryptographic image validation in large namespaces."]
          }
        }
      },
      {
        weekNum: 7,
        theme: "GitOps Continuous Delivery & Declarative Deployments",
        summary: "Adopt continuous synchronizations with GitOps principles. Master automatic application synchronization and configurations.",
        primaryTools: ["ArgoCD", "FluxCD", "Kustomize", "Helm"],
        awsThread: "Mapping cluster permissions dynamically using EKS Access Entries",
        days: [
          {
            dayNum: 28,
            title: "Pull-Based Reconciliations & ArgoCD Core Setup",
            timeEstimate: "4h",
            context: "GitOps decouples deploy steps from pushing tools, ensuring state matching happens automatically.",
            theory: {
              concepts: ["Pull-based vs push delivery architectures", "Applying sync definitions in clusters"],
              readings: ["ArgoCD Architecture docs"],
              questions: ["How does ArgoCD identify drift between git targets and live resources?"]
            },
            lab: {
              scenario: "Bootstrap an ArgoCD controller and define application synchronizations.",
              steps: [
                "Deploy the ArgoCD suite within a local Kubernetes playground.",
                "Author an active Application spec targeting declarative configuration repos."
              ],
              stretchGoal: "Enable automated self-healing options to rollback out-of-band updates."
            },
            deliverable: "A completely valid `argocd-app.yaml` resource profile.",
            pitfalls: ["Relying on manual deployments on namespaces managed by GitOps controllers."]
          },
          {
            dayNum: 29,
            title: "Secrets Injection via External Secrets Operator",
            timeEstimate: "3.5h",
            context: "SREs avoid storing raw passwords in Git, utilizing dynamic synchronizers instead.",
            theory: {
              concepts: ["Secret integration bounds", "Sinking secret inputs dynamically with External Secrets Operator"],
              readings: ["ESO specifications"],
              questions: ["How can an operator extract secure data fields from hosting vault instances?"]
            },
            lab: {
              scenario: "Deploy an External Secret mechanism to safely hydrate secure environment properties in namespaces.",
              steps: [
                "Configure secret descriptors linking cluster names to key vault managers.",
                "Publish a safe properties profile and extract secrets seamlessly."
              ],
              stretchGoal: "Perform automatic credentials rotation updates in your secure apps."
            },
            deliverable: "A valid `external-secret.yaml` manifest.",
            pitfalls: ["Accidentally committing base64 secure fields directly inside git branches."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is pull-reconciliation?", answer: "An agent polling Git targets to ensure live resources match declared manifests." }
          ],
          miniTask: "Create an ArgoCD configuration sync blueprint.",
          reflectionPrompt: {
            title: "Designing Zero-Trust Delivery Frameworks",
            requirements: ["Explain how GitOps workflows reduce direct node access privileges."]
          }
        }
      },
      {
        weekNum: 8,
        theme: "Progressive Delivery & SLO-driven Rollbacks",
        summary: "Minimize production downtime using automated canary rollouts, integrating custom metrics triggers for auto-rollback protection.",
        primaryTools: ["Argo Rollouts", "Flagger", "Cilium Traffic Splitting", "Prometheus Metrics"],
        awsThread: "AWS Application Load Balancer targets alignment with canary traffic routes",
        days: [
          {
            dayNum: 30,
            title: "Traffic Splitting & Canary Deployments",
            timeEstimate: "4h",
            context: "Deploy changes to small fractions of traffic first to evaluate stability mathematically before scale out.",
            theory: {
              concepts: ["Canary weights and traffic routers", "Configuring virtual pathways with ingress rules"],
              readings: ["Argo Rollouts specifications"],
              questions: ["Why is progressive splitting more robust than blue-green swap setups?"]
            },
            lab: {
              scenario: "Configure a canary rollout manifest with traffic splitting stages.",
              steps: [
                "Replace standard application deployment types with an active Rollout controller definition.",
                "Configure step patterns splits (e.g. 10%, 25%, 50%) inside the yaml configs."
              ],
              stretchGoal: "Use local ingress files to verify live split percentages."
            },
            deliverable: "An `argo_canary_rollout.yaml` manifest.",
            pitfalls: ["Failing to route cookies properly, causing clients to drift between variants."]
          },
          {
            dayNum: 31,
            title: "Continuous Metric Checks & Auto-Rollback Loops",
            timeEstimate: "4h",
            context: "SREs connect delivery pipelines to monitoring channels, allowing active code to auto-revent on system failure.",
            theory: {
              concepts: ["Continuous verification rules", "Prometheus metric queries inside deployment loops"],
              readings: ["SRE Workbook - Automated Canaries"],
              questions: ["What metrics indicate a canary launch has introduced critical system crashes?"]
            },
            lab: {
              scenario: "Introduce monitoring checks that auto-rollback updates when API request durations exceed bounds.",
              steps: [
                "Draft an active AnalysisTemplate resource mapping queries checking SLO statistics.",
                "Inject verification actions triggers directly inside deployment pipelines."
              ],
              stretchGoal: "Simulate service failure and confirm of mechanical, blameless rollback."
            },
            deliverable: "A fully valid `analysis_template.yaml` routing model.",
            pitfalls: ["Using metric windows that are too short, causing noise triggers."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Explain the role of AnalysisTemplates.", answer: "Tracks Prometheus metrics continuously during launches to auto-abort if thresholds break." }
          ],
          miniTask: "Draft a metric validation rule checking HTTP error frequencies.",
          reflectionPrompt: {
            title: "Establishing Closed-loop Automation",
            requirements: ["Discuss the importance of automated, telemetry-driven deployment rollbacks."]
          }
        }
      }
    ],
    capstone: {
      title: "GitOps Multi-Env Engine with Auto-Rollbacks",
      architecture: "Synthesize a multi-environment infrastructure sync loop running on ArgoCD, integrated with Argo Rollouts deployment paths that automatically rollback on synthetic error burn rate breaches.",
      deliverables: [
        "Terraform configs building active cluster components.",
        "ArgoCD Application controller setup manifests.",
        "Argo Rollouts definitions outlining Canary traffic splitting."
      ],
      docRequirements: [
        "Infrastructure pipeline blueprint showing deployment paths.",
        "Triage log showing canary status, progress metrics, and automatically triggered rollbacks."
      ]
    }
  },
  {
    monthNum: 3,
    title: "Kubernetes Operators & Internal Developer Platforms (IDPs)",
    overview: "This month focuses on building robust internal developer platforms and automating custom operations. You will learn to extend Kubernetes using Custom Resource Definitions (CRDs) and write custom controllers before bridging resources into a unified Backstage developer portal.",
    weeks: [
      {
        weekNum: 9,
        theme: "Kubernetes Extensibility & Custom Controller Mechanics",
        summary: "Understand custom resource definitions, API server communication paths, dynamic controllers watch routines, and admission validation filters.",
        primaryTools: ["CRDs", "Kubernetes Event loop", "Admission Webhooks", "Kube-builder"],
        awsThread: "EKS AWS VPC CNI extensions and custom cluster IAM mapping integrations",
        days: [
          {
            dayNum: 32,
            title: "Custom Resource Definitions (CRD) Schemas",
            timeEstimate: "3.5h",
            context: "Extending Kubernetes APIs lets platform teams model safe custom business setups directly as native components.",
            theory: {
              concepts: ["CRD openAPI v3 schemas specs", "Configuring spec and status subdivisions"],
              readings: ["Kubernetes Custom Resources manual"],
              questions: ["Why are status fields updated separately from custom resource specs?"]
            },
            lab: {
              scenario: "Define structural specifications of a custom database resource schema definition.",
              steps: [
                "Draft a valid YAML spec defining fields of a database asset.",
                "Register the configuration in cluster schemas and query schemas with kubectl commands."
              ],
              stretchGoal: "Enforce validation parameters to filter out bad values at API gateways."
            },
            deliverable: "A registered `database_crd.yaml` configuration profile.",
            pitfalls: ["Failing to declare openAPI constraint fields, accepting invalid resource profiles."]
          },
          {
            dayNum: 33,
            title: "Custom Controllers & Reconciliation Loops",
            timeEstimate: "4h",
            context: "Controllers manage live environments continuously, ensuring local states match desired values declared in specifications.",
            theory: {
              concepts: ["Watch schedules and worker queues", "Edge vs level trigger design systems"],
              readings: [ "Writing custom controller loops guides" ],
              questions: ["Explain reconciliation loop behaviors when managed assets are updated manually."]
            },
            lab: {
              scenario: "Code raw reconciliation loops modeling synchronization updates on custom resources.",
              steps: [
                "Establish worker callbacks registering watch systems checking target changes.",
                "Write functions that recreate missing resources dynamically."
              ],
              stretchGoal: "Ensure controller state loops avoid cyclic infinity recursion bottlenecks."
            },
            deliverable: "A mockup controller script outlining active watch states.",
            pitfalls: ["Including fast retries on persistent mistakes, triggering high node CPU consumption."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is the primary loop goal in controllers?", answer: "Continuously minimize delta adjustments between desire state targets and current systems state." }
          ],
          miniTask: "Outline a reconciler scheduling schema.",
          reflectionPrompt: {
            title: "Developing Extended Kubernetes Control Planes",
            requirements: ["Explain benefits of managing custom resources over running outside databases."]
          }
        }
      },
      {
        weekNum: 10,
        theme: "Operator Development with Kubebuilder / Operator SDK",
        summary: "Develop and test actual Kubernetes Operators. Master reconciliation loops, multi-resource state updates, mutations, and deep level debugging.",
        primaryTools: ["Kubebuilder", "Go", "Operator SDK", "Kuttl tests"],
        awsThread: "EKS IRSAs (IAM Roles for Service Accounts) mapping rules to operators",
        days: [
          {
            dayNum: 34,
            title: "Project Bootstrapping with Kubebuilder",
            timeEstimate: "3.5h",
            context: "Kubebuilder compiles skeleton scaffolding structure, accelerating Operator code creation.",
            theory: {
              concepts: ["API categories and versions mapping schemas", "Kubebuilder folder layout directives"],
              readings: ["Kubebuilder official handbook"],
              questions: ["How does Kubebuilder reduce redundant boilerplate lines?"]
            },
            lab: {
              scenario: "Scaffold an operational custom operator workspace targeted to service configuration files.",
              steps: [
                "Init a project module specifying target platforms parameters.",
                "Generate custom system APIs establishing clean core layouts."
              ],
              stretchGoal: "Configure local docker execution rules testing initial builder scopes."
            },
            deliverable: "A complete structured scaffold folder layout ready for compilation.",
            pitfalls: ["Failing to set correct domain suffixes in initialization phases."]
          },
          {
            dayNum: 35,
            title: "Operator Validation and Admission Webhooks",
            timeEstimate: "4h",
            context: "Admission webhooks intercept mutations dynamically, blocking unauthorized properties before storage files are saved.",
            theory: {
              concepts: ["Mutating vs Validating HTTP hook callbacks", "Certificates setups for webhook networks"],
              readings: ["Dynamic Admission Webhooks manual"],
              questions: ["Explain why webhook blocks are safer than checking loops in code."]
            },
            lab: {
              scenario: "Build a validator webhook script rejecting configuration objects missing mandatory security metrics.",
              steps: [
                "Extend scaffolding files adding admission validation capabilities.",
                "Launch validator server blocks checking incoming target requests."
              ],
              stretchGoal: "Enforce default security settings dynamically inside mutating webhooks."
            },
            deliverable: "Scaffolding configurations representing functioning dynamic webhooks.",
            pitfalls: ["Failing to verify network configurations, locking cluster registrations dynamically."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What task does Validating Webhooks perform?", answer: "Rejects incorrect specifications at API boundaries before any resources is created." }
          ],
          miniTask: "Write a webhook validation callback skeleton.",
          reflectionPrompt: {
            title: "Building Resilient Platforms with Operators",
            requirements: ["Highlight steps validating configuration security policies using webhooks."]
          }
        }
      },
      {
        weekNum: 11,
        theme: "Infrastructure Declarations via Crossplane",
        summary: "Bridge cloud-native patterns directly into external hardware. Use Crossplane to declaratively manage RDS, S3, or network assets as custom resources.",
        primaryTools: ["Crossplane", "Compositions", "XRDs", "Cloud Providers"],
        awsThread: "Crossplane AWS Provider (RDS databases, S3 buckets, SQS queues)",
        days: [
          {
            dayNum: 36,
            title: "Installing Crossplane & Provider Provisioning",
            timeEstimate: "4h",
            context: "SREs standardise external cloud dependencies using uniform declarative setups inside containers.",
            theory: {
              concepts: ["Crossplane providers architectures", "Managed Resources (MR) vs cloud credentials mappings"],
              readings: ["Crossplane Quickstarts docs"],
              questions: ["How does Crossplane secure and store AWS security metrics in pods?"]
            },
            lab: {
              scenario: "Install Crossplane controller engines and establish managed resources parameters.",
              steps: [
                "Bootstrap Crossplane engines utilizing modern package tools.",
                "Configure secret mappings allowing provider objects provisioning."
              ],
              stretchGoal: "Provision modular object storage buckets directly via Helm templates."
            },
            deliverable: "A registered AWS Provider specification manifest.",
            pitfalls: ["Leaving root security parameters open inside cluster providers config files."]
          },
          {
            dayNum: 37,
            title: "Composite Resource Definitions (XRD)",
            timeEstimate: "4h",
            context: "Compositions isolate complex cloud patterns behind basic, developer-friendly local blueprints.",
            theory: {
              concepts: ["Compositions schemas specifications", "Composite Resource Definitions (XRD)", "Blueprints abstraction"],
              readings: ["Crossplane Compositions manual"],
              questions: ["Why are composite structures cleaner than exposing raw resources to teams?"]
            },
            lab: {
              scenario: "Structure a unified composition delivering databases and networks at one single call.",
              steps: [
                "Model XRD configurations mapping properties into variables.",
                "Enforce composition engines linking AWS resources logically."
              ],
              stretchGoal: "Verify automatic drift correction is working on cloud resources."
            },
            deliverable: "A fully functional `composition.yaml` and `xrd.yaml` configuration.",
            pitfalls: ["Failing to map region properties correctly, causing dynamic provision faults."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Define XRD role in Crossplane workflows.", answer: "Declares abstract interfaces that map developer specs to multi-resource cloud blueprints." }
          ],
          miniTask: "Write a Crossplane abstract resource file.",
          reflectionPrompt: {
            title: "The Cloud-Native Infrastructure Control Loop",
            requirements: ["Evaluate advantages of Kubernetes-reconciled hardware over standard CI Terraform paths."]
          }
        }
      },
      {
        weekNum: 12,
        theme: "Self-Service Platforms with Backstage Portals",
        summary: "Design modern internal portals. Enable software templates, central catalogs, and user self-service provisioning to reduce developer friction.",
        primaryTools: ["Spotify Backstage", "Software Templates", "Entity Catalogs", "Golden Paths"],
        awsThread: "EKS automatic cluster bootstrapping configurations for Backstage templates",
        days: [
          {
            dayNum: 38,
            title: "Backstage Catalogs & Software Templates",
            timeEstimate: "4h",
            context: "Platform engineering teams abstract operational steps behind basic web selectors to reduce developer friction.",
            theory: {
              concepts: ["Developer portals frameworks", "Golden Paths and Software Templates layouts"],
              readings: ["Spotify Backstage conceptual docs"],
              questions: ["How do templates ensure standardized tracking across software systems?"]
            },
            lab: {
              scenario: "Create a software wizard layout bootstrapping a Node service with direct monitoring inclusions.",
              steps: [
                "Write templates manifests describing user parameters specifications.",
                "Setup pipeline actions writing code structures directly to Github repositories."
              ],
              stretchGoal: "Enable automatic registration of projects inside catalogs."
            },
            deliverable: "A verified template file `template.yaml` for Backstage.",
            pitfalls: ["Failing to configure schemas validation, accepting invalid project structures."]
          },
          {
            dayNum: 39,
            title: "Entity Schema Cataloging & Mappings",
            timeEstimate: "3.5h",
            context: "Central software catalogs list service details, domain parameters, and uptime links.",
            theory: {
              concepts: ["Backstage Entity Schema models", "Registering components, pipelines, systems"],
              readings: ["Backstage Catalog format description"],
              questions: ["How do catalogs establish clean owners accountability in clusters?"]
            },
            lab: {
              scenario: "Register microservice networks mappings in central catalogs tracking relationships.",
              steps: [
                "Author catalog entity descriptors matching microservice coordinates.",
                "Visualize catalog charts displaying dependencies across components."
              ],
              stretchGoal: "Correlate Prometheus metrics pages directly inside Backstage modules."
            },
            deliverable: "A fully valid `catalog-info.yaml` description profile.",
            pitfalls: ["Keeping catalog metrics unlinked, leading to out of date information."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is a Golden Path in platform engineering?", answer: "A pre-packaged, validated workflow allowing developers to build services on safe tracks." }
          ],
          miniTask: "Draft a catalog entry describing a checkout interface.",
          reflectionPrompt: {
            title: "Tackling Platform Friction Points",
            requirements: ["Detail how self-service infrastructure accelerates development team deliveries."]
          }
        }
      }
    ],
    capstone: {
      title: "Self-Service Dev Portal with Crossplane & Custom Operator",
      architecture: "Build a developer platform featuring a Backstage catalog allowing developers to request full application setups which provision underlying Kubernetes resources via a custom Operator.",
      deliverables: [
        "Backstage Software Template and catalog configuration.",
        "Crossplane custom composition (XRD) delivering an RDS instance and S3 bucket.",
        "Custom Operator built managing internal application setups."
      ],
      docRequirements: [
        "Detailed API spec for the custom Custom Resource Definitions (CRDs).",
        "Developer guide showing self-service portal functionality."
      ]
    }
  },
  {
    monthNum: 4,
    title: "Security Policy, Service Mesh, and Chaos",
    overview: "This month focuses on production hardening, high-traffic communication control, and resilience testing. You will master zero-trust security via Policy-as-Code and Service Meshes, and apply Chaos Engineering to verify cluster recovery.",
    weeks: [
      {
        weekNum: 13,
        theme: "Policy-as-Code & Cluster Security Hardening",
        summary: "Enforce security standards. Implement validating webhooks, compliance checklists, and secure security contexts in clusters.",
        primaryTools: ["Kyverno", "OPA Gatekeeper", "NetworkPolicies", "Trivy Admission"],
        awsThread: "EKS security groups mapping rules, KMS keys encryption configurations",
        days: [
          {
            dayNum: 40,
            title: "Kyverno Policy Engine Hardening",
            timeEstimate: "3.5h",
            context: "SREs automate cluster rule validations of properties using Kyverno, preventing insecure deployments from executing.",
            theory: {
              concepts: ["Kyverno architectures patterns", "Writing validation rules and mutation specifications"],
              readings: ["Kyverno rules manual"],
              questions: ["Why should Kyverno be preferred over complex programming-based runtime engines?"]
            },
            lab: {
              scenario: "Author policies blocking containers attempting access to host network ports.",
              steps: [
                "Install Kyverno and deploy policies in testing environments.",
                "Submit invalid container configurations and verify rejection checks."
              ],
              stretchGoal: "Automatically mutate files to inject safe non-root flags."
            },
            deliverable: "A fully valid `kyverno-policy.yaml` configuration.",
            pitfalls: ["Deploying strict block directives without testing impacts on older applications."]
          },
          {
            dayNum: 41,
            title: "NetworkPolicies for Tenant Isolations",
            timeEstimate: "3.5h",
            context: "Kubernetes defaults to wide open communication. NetworkPolicies isolate namespaces to prevent bad lateral movements.",
            theory: {
              concepts: ["Ingress vs egress filtering definitions", "Targeting selectors and namespace ranges"],
              readings: ["Securing clusters with Kubernetes NetworkPolicies"],
              questions: ["Why is ingress filtering critical to isolate backend databases?"]
            },
            lab: {
              scenario: "Harden namespace ports restricting traffic to authorized services.",
              steps: [
                "Configure default-deny policies closing namespaces access lines.",
                "Open selective communication doors between authorized microservices."
              ],
              stretchGoal: "Isolate external internet targets using egress policy segments."
            },
            deliverable: "A structured, secure `network-policy.yaml` profile.",
            pitfalls: ["Failing to allow basic CoreDNS traffic, blocking names lookup performance."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is network microsegmentation?", answer: "Restricting network communications to the bare minimum pathways needed by microservices." }
          ],
          miniTask: "Write a policy blocking cross-namespace transactions.",
          reflectionPrompt: {
            title: "Zero-Trust Infrastructure Planning",
            requirements: ["Assess why default-deny parameters are critical in large Kubernetes setups."]
          }
        }
      },
      {
        weekNum: 14,
        theme: "Service Mesh Architectures & Traffic Controllers",
        summary: "Master cluster networking. Install Service Meshes to enable mTLS, strict traffic routers, system circuit breakers, and network metrics.",
        primaryTools: ["Istio", "Cilium Service Mesh", "Envoy", "CertManager"],
        awsThread: "EKS integration designs with external Application load balancers and AWS Route53",
        days: [
          {
            dayNum: 42,
            title: "Istio Installation & Gateway Routing",
            timeEstimate: "4h",
            context: "Service meshes decouple network concerns from application codes, handling routing rules via proxies instead.",
            theory: {
              concepts: ["Sidecar proxy architectures", "VirtualServices vs Gateway configuration definitions"],
              readings: ["Istio traffic properties"],
              questions: ["How do envoy proxies intercept pod communications dynamically?"]
            },
            lab: {
              scenario: "Bootstrap an Istio mesh and deploy ingress gateways managing incoming path routes.",
              steps: [
                "Install Istio mesh controllers inside testing sandboxes.",
                "Configure Gateway configurations routing requests dynamically."
              ],
              stretchGoal: "Implement weights structures splitting traffic between versions."
            },
            deliverable: "Custom valid `virtualservice.yaml` manifests.",
            pitfalls: ["Namespace proxy injection failing because labels mismatches template files."]
          },
          {
            dayNum: 43,
            title: "Strict mTLS & Circuit Breaking",
            timeEstimate: "3.5h",
            context: "Enforcing encrypted mTLS channels blocks packet inspection, while circuit breaking protects systems from cascade failures.",
            theory: {
              concepts: ["PeerAuthentication rules in Istio", "Circuit breaking limits with connection pools"],
              readings: ["Istio security blueprints"],
              questions: ["Contrast strict mTLS locks against permissive transition states."]
            },
            lab: {
              scenario: "Secure cluster runtimes to encrypt all data transactions automatically.",
              steps: [
                "Enforce strict PeerAuthentication rules across namespace regions.",
                "Integrate Envoy circuit breakers to abort slow node connections."
              ],
              stretchGoal: "Map network traffic pathways using the visually rich Kiali portal."
            },
            deliverable: "A PeerAuthentication and DestinationRule policy file.",
            pitfalls: ["Aggressive circuit breaking configurations tripping alerts under normal traffic spikes."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Why is Circuit Breaking useful?", answer: "Aborts requests instantly on failing backends, protecting resources from cascading crashes." }
          ],
          miniTask: "Configure Istio mTLS rules for checkouts.",
          reflectionPrompt: {
            title: "The Service Mesh Value Proposition",
            requirements: ["Highlight security and telemetry values achieved through abstract proxies patterns."]
          }
        }
      },
      {
        weekNum: 15,
        theme: "Chaos Engineering & System Resiliency Testing",
        summary: "Inject production faults to verify system recovery. Design controlled failures and monitor rollbacks.",
        primaryTools: ["Chaos Mesh", "LitmusChaos", "SRE Workbook disaster recovery", "Steady State checks"],
        awsThread: "EKS node failures simulations, AWS AZ disruptions recovery loops",
        days: [
          {
            dayNum: 44,
            title: "Fault Injections & Chaos Frameworks",
            timeEstimate: "3.5h",
            context: "SREs verify system reliability by introducing synthetic disasters on schedule, verifying protection recovery systems.",
            theory: {
              concepts: ["Chaos testing principles", "Steady-state validation parameters check"],
              readings: ["Principles of Chaos Engineering guidelines"],
              questions: ["Why are live steady-state metrics monitoring vital during chaos runs?"]
            },
            lab: {
              scenario: "Assemble chaos experiment jobs simulating network delays inside staging environments.",
              steps: [
                "Deploy the Chaos Mesh engine controller into clean clusters.",
                "Submit custom execution manifest files declaring target pod delays."
              ],
              stretchGoal: "Confirm Prometheus dashboards register metrics tracking the injected stress."
            },
            deliverable: "A fully valid `chaos_mesh_delay.yaml` manifest.",
            pitfalls: ["Running experiments without strict abort bounds, risking persistent cluster outages."]
          },
          {
            dayNum: 45,
            title: "Simulating Node Kills & Disk Failures",
            timeEstimate: "4h",
            context: "Testing node crashes validates resilience strategies like affinity rules and backup replica networks.",
            theory: {
              concepts: ["Pod disruption budgets configuration", "Affinity and anti-affinity placement strategies"],
              readings: ["SRE Workbook - Disaster Recovery strategies"],
              questions: ["How do disruption budgets guarantee continuous availability under node deaths?"]
            },
            lab: {
              scenario: "Introduce node interruptions under load tests, verifying system transitions.",
              steps: [
                "Deploy PodDisruptionBudget specifications restricting system deaths rates.",
                "Execute pod kills and analyze automatic node allocations reschedule steps."
              ],
              stretchGoal: "Simulate storage connection losses testing system failsafes actions."
            },
            deliverable: "A Kubernetes `pod-disruption-budget.yaml` configuration.",
            pitfalls: ["Enforcing over-strict budgets that block standard system patches execution."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is PodDisruptionBudget?", answer: "A policy that guarantees a minimum number of healthy pods remain active during maintenance." }
          ],
          miniTask: "Author a chaos experiment specification file.",
          reflectionPrompt: {
            title: "Designing Resilient Infrastructures",
            requirements: ["Outline your recovery validation blueprint to ensure consistent uptimes."]
          }
        }
      },
      {
        weekNum: 16,
        theme: "Supply Chain Assurance & Deep System Audits",
        summary: "Protect clusters from supply chain exploits. Enforce image signature verification at admission, and monitor system execution.",
        primaryTools: ["Cosign", "Kyverno Verifier", "Falco", "KubeAudit"],
        awsThread: "AWS IAM CloudTrail log streaming analysis",
        days: [
          {
            dayNum: 46,
            title: "Validation Gates & Registry Verifications",
            timeEstimate: "3.5h",
            context: "SREs block unverified container runtimes by installing validation parameters at the admission controllers.",
            theory: {
              concepts: ["Enforcing image sign parameters inside Kyverno", "Validating container targets dynamically"],
              readings: ["Kyverno Image verification specifications"],
              questions: ["How does on-cluster validation preserve cluster security integrity?"]
            },
            lab: {
              scenario: "Deploy Kyverno rules looking up signature parameters automatically.",
              steps: [
                "Install keys metrics in validation parameters environments.",
                "Submit un-signed image specifications, verifying rejection triggers."
              ],
              stretchGoal: "Ensure validation rules check checksum signatures dynamically."
            },
            deliverable: "Kyverno image signature verification rule configurations.",
            pitfalls: ["Failing to allow essential common system containers, failing core cluster runtimes."]
          },
          {
            dayNum: 47,
            title: "Runtime Threat Detections with Falco",
            timeEstimate: "4h",
            context: "Monitoring container kernel interactions catches security issues after code gets loaded into clusters.",
            theory: {
              concepts: ["Syscall monitoring via eBPF probes", "Writing Falco threat alert queries"],
              readings: ["Falco Rule Design guides"],
              questions: ["How do runtime threat sensors detect unauthorized terminal access?"]
            },
            lab: {
              scenario: "Install threat alarms looking up illegal script execution events.",
              steps: [
                "Deploy Falco on nodes utilizing secure kernel eBPF probes.",
                "Trigger alerts by simulating root logins on active containers."
              ],
              stretchGoal: "Integrate automatic containment scripts stopping suspicious services."
            },
            deliverable: "A custom Falco security rule manifest.",
            pitfalls: ["Configuring over-sensitive notification alerts, causing operator blindness under logs."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Explain the role of Falco eBPF probes.", answer: "Monitors syscalls directly inside the kernel to catch suspicious behavior in real-time." }
          ],
          miniTask: "Draft a Falco alert checking private registry folders access.",
          reflectionPrompt: {
            title: "Consolidating Production Inspections",
            requirements: ["Highlight the benefits of runtime sensors over simple container files validation scans."]
          }
        }
      }
    ],
    capstone: {
      title: "Hardened, Policy-Enforced Chaos-Tested Stack",
      architecture: "Architect a hardened microservice system secured with Istio mTLS and Kyverno policies, and stress-tested under Chaos Mesh fault injections.",
      deliverables: [
        "Kyverno policies enforcing container signature verification.",
        "Istio VirtualServices configurations forcing cross-service mTLS communication.",
        "Chaos Mesh experiment files executing pod kills under peak loads."
      ],
      docRequirements: [
        "Security audit compliance matrix.",
        "Steady-state verification report showing uptime levels under fault injections."
      ]
    }
  },
  {
    monthNum: 5,
    title: "AWS/EKS Scaling, Platform Operations, & Profession Ready",
    overview: "This final month bridges your skills into advanced AWS production scaling and modern cost-efficient platform operations. You will learn dynamic autoscaling with Karpenter, implement FinOps controls, model advanced multi-region DR failovers, and compile your career portfolio.",
    weeks: [
      {
        weekNum: 17,
        theme: "Production EKS Scaling & Autoscaling with Karpenter",
        summary: "Master scale operations. Set up node provisioning, node consolidations, spot instance management, and high density targets.",
        primaryTools: ["Karpenter", "EKS", "Keda", "ClusterAutoscaler"],
        awsThread: "Karpenter Spot/On-Demand instance profiles and cost tracking metrics",
        days: [
          {
            dayNum: 48,
            title: "Karpenter Provisioners and Node Classes",
            timeEstimate: "4h",
            context: "SREs bypass slow traditional autoscaling by launching Karpenter to dynamically provision custom EC2 instances direct from pod needs.",
            theory: {
              concepts: ["Dynamic Node Allocation vs scaling groups", "Karpenter NodePools configurations and class attributes"],
              readings: ["Karpenter Scaling specifications"],
              questions: ["How does Karpenter reduce node startup duration to seconds?"]
            },
            lab: {
              scenario: "Configure a Karpenter NodePool setup handling dynamic container cluster loads.",
              steps: [
                "Install Karpenter engine controllers in AWS/EKS runtime locations.",
                "Author custom NodePool parameters matching instance type specifications."
              ],
              stretchGoal: "Enforce node requirements parameters limiting provisions to amd64 instances."
            },
            deliverable: "A fully valid `karpenter-nodepool.yaml` configuration.",
            pitfalls: ["Failing to configure resource requests, blocking Karpenter from executing scaling runs."]
          },
          {
            dayNum: 49,
            title: "Instance Consolidation Actions",
            timeEstimate: "3.5h",
            context: "Karpenter optimizes costs automatically by packing pods tightly and deleting idle EC2 host machines.",
            theory: {
              concepts: ["Consolidation policies rules", "Spot instance eviction triggers", "Graceful node drains"],
              readings: [ "Karpenter Consolidation best practices" ],
              questions: ["How does Karpenter balance infrastructure pricing against cluster disruption rules?"]
            },
            lab: {
              scenario: "Measure node migrations behaviors under dynamic cluster downsizes.",
              steps: [
                "Configure consolidation parameters inside node class definitions.",
                "Simulate application scaling down, tracking automatic node removals."
              ],
              stretchGoal: "Configure spot interruptions handling parameters protecting live workloads."
            },
            deliverable: "An optimized Karpenter profile demonstrating consolidation rules.",
            pitfalls: ["Failing to configure PodDisruptionBudgets, risking accidental active pod drops during consolidations."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "Why is Karpenter faster than cluster autoscaler?", answer: "Talks to EC2 APIs directly, bypasses scaling group constraints." }
          ],
          miniTask: "Write a node class target definition.",
          reflectionPrompt: {
            title: "The Future of Scalable Control Planes",
            requirements: ["Highlight the benefits of dynamic node generation under elastic resource spikes."]
          }
        }
      },
      {
        weekNum: 18,
        theme: "FinOps Cost Optimization & System Governance",
        summary: "Analyze and optimize platform spending. Maximize node allocations, identify idle resources, and configure automatic shutdowns.",
        primaryTools: ["Kubecost", "FinOps principles", "Cloud Custodian"],
        awsThread: "AWS Cost Explorer, Compute Optimizer, and Spot Instances integration",
        days: [
          {
            dayNum: 50,
            title: "Kubecost Allocations & Cost Metrics Analysis",
            timeEstimate: "3.5h",
            context: "Tracking cluster spending structures allows platform engineers to identify expensive underutilized environments.",
            theory: {
              concepts: ["FinOps principles in Kubernetes settings", "Tracing allocations back to namespaces and apps"],
              readings: ["Kubecost allocation manual"],
              questions: ["How is idle resource capacity priced logically inside clusters?"]
            },
            lab: {
              scenario: "Deploy Kubecost to discover which microservices generate high infrastructure costs.",
              steps: [
                "Install Kubecost inside testing clusters utilizing local charts.",
                "Extract cost allocation matrices across different team namespaces."
              ],
              stretchGoal: "Integrate spending statistics inside prometheus visualization targets."
            },
            deliverable: "An analytics spreadsheet mapping spending metrics across namespaces.",
            pitfalls: ["Using standard generic static pricing benchmarks on custom cloud discount accounts."]
          },
          {
            dayNum: 51,
            title: "Automated Non-Prod Idle Resource Shutdowns",
            timeEstimate: "3.5h",
            context: "Enforcing automatic schedules to turn off non-prod machines when developers are offline isolates massive cloud savings.",
            theory: {
              concepts: ["Scaling down deployment profiles automatically", "Cloud Custodian schedules policies"],
              readings: ["Kubernetes schedules operations manuals"],
              questions: ["Why are idle systems the biggest source of waste in non-production infrastructure?"]
            },
            lab: {
              scenario: "Deploy scheduling workflows closing down stage resources outside business hours.",
              steps: [
                "Setup cron systems triggering replica scaling rules inside stage environments.",
                "Write automated scripts scaling non-essential pools to zero."
              ],
              stretchGoal: "Incorporate automatic wakeup scripts before development shifts start."
            },
            deliverable: "A fully valid `cron-scaler.yaml` automation profile.",
            pitfalls: ["Accidentally scheduling shutdowns on core systems databases, losing transactions."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is FinOps?", answer: "Coordinating finance and engineering to optimize cloud spending dynamically." }
          ],
          miniTask: "Write a schedule scaling deployment replicas.",
          reflectionPrompt: {
            title: "Enforcing FinOps Platform Governance",
            requirements: ["Design rules that eliminate idle non-production waste across teams."]
          }
        }
      },
      {
        weekNum: 19,
        theme: "High-Availability & Cross-Region Disaster Recovery",
        summary: "Build high-availability disaster recovery plans. Configure DNS routing failovers, run Velero backups, and execute cross-region database replications.",
        primaryTools: ["Velero", "Route53", "S3 Replication", "Global Databases", "DNS Traffic Manager"],
        awsThread: "Active-Active AWS cross-region routing and Aurora Global Database configurations",
        days: [
          {
            dayNum: 52,
            title: "State Backups and Restore with Velero",
            timeEstimate: "4h",
            context: "SREs guarantee data recovery by taking scheduled volume backups and keeping copies outside isolated zones.",
            theory: {
              concepts: ["Taking state snapshots of live database volumes", "Velero backup controllers architectures"],
              readings: ["Velero backup and recovery instructions"],
              questions: ["Why do simple state snapshots fail to capture full database consistent runtimes?"]
            },
            lab: {
              scenario: "Deploy Velero to run scheduled snapshots and test backup restorations.",
              steps: [
                "Install Velero on clusters with access to external object stores.",
                "Perform cluster resources backup, execute a service wipe, and verify restitution."
              ],
              stretchGoal: "Configure cron jobs carrying out validation checks daily."
            },
            deliverable: "A tested Velero cron scheduling template.",
            pitfalls: ["Failing to backup Custom Resource definitions, losing operator context during rebuilds."]
          },
          {
            dayNum: 53,
            title: "Multi-Region DNS Failover and Recovery",
            timeEstimate: "4h",
            context: "Designing DNS health checks guarantees user requests bypass failing data centers instantly.",
            theory: {
              concepts: ["DNS failovers mechanics and low TTL routing settings", "Setting active-passive routing lines"],
              readings: ["Multi-region failover network designs"],
              questions: ["How do low DNS TTL coordinates speed up system failure redirections?"]
            },
            lab: {
              scenario: "Model AWS Route53 or Cloudflare global health routing profiles.",
              steps: [
                "Configure health probes watching public gateway status.",
                "Validate routing adjustments when simulation services trigger failure responses."
              ],
              stretchGoal: "Verify automatic cross-region database secondary failovers."
            },
            deliverable: "DNS routing configurations blueprints representing failover states.",
            pitfalls: ["Using long TTL values, caching dead coordinates on client systems during incidents."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "How does Route53 handle system failover?", answer: "Redirects user requests to healthy secondary regions when health probes fail." }
          ],
          miniTask: "Draft a Route53 failover routing policy outline.",
          reflectionPrompt: {
            title: "Architecting Multi-Fault Tolerant Systems",
            requirements: ["Discuss issues of syncing active-active databases across massive geographic distances."]
          }
        }
      },
      {
        weekNum: 20,
        theme: "Job Readiness & Blameless Postmortem Portfolios",
        summary: "Compile your portfolio, refine SRE interview narratives, and master high-stakes system incident management challenges.",
        primaryTools: ["SRE Interview matrices", "Portfolio site documentation", "Postmortem publications"],
        awsThread: "Full review of AWS platform engineering core capabilities",
        days: [
          {
            dayNum: 54,
            title: "Assembling Your SRE Work Showcase Portfolio",
            timeEstimate: "4h",
            context: "Platform hiring managers value real evidence of systematic troubleshooting skills over plain lists of technologies.",
            theory: {
              concepts: ["Documenting complex platform architectures", "Structuring high-value blameless postmortem articles"],
              readings: ["Publishing high-quality software engineering portfolios"],
              questions: ["Why are blameless postmortems highly valued by recruiting SRE directors?"]
            },
            lab: {
              scenario: "Consolidate your previous labs deliverables into an elegant portfolio layout.",
              steps: [
                "Assemble code files structured clearly under classified roadmap categories.",
                "Author robust README documentation outlining systems blueprints."
              ],
              stretchGoal: "Publish postmortem incident logs to open blogs dashboards."
            },
            deliverable: "A structured, clean, production-ready portfolio workspace.",
            pitfalls: ["Publishing real production secret keys or company credentials inside public Github spaces."]
          },
          {
            dayNum: 55,
            title: "Technical SRE Interview Simulation Drills",
            timeEstimate: "4h",
            context: "Interviews check your practical systems troubleshooting instincts, PromQL scripting speed, and scaling systems models.",
            theory: {
              concepts: ["System design constraints under load", "SRE behavioral questions expectations"],
              readings: [ "Google SRE Interview preparations book" ],
              questions: ["Explain step by step how you troubleshoot a hanging microservice."]
            },
            lab: {
              scenario: "Conduct simulated live incident triage runs checking system issues.",
              steps: [
                "Isolate mock performance bottlenecks on virtual database systems.",
                "Detail exact commands running strace/lsof diagnostics under pressure."
              ],
              stretchGoal: "Model scalable architectures serving 1,005,000 API operations."
            },
            deliverable: "A prep booklet detailing 10 classic SRE technical scenario models.",
            pitfalls: ["Suggesting lazy solutions like 'restart nodes' instead of investigating root causes."]
          }
        ],
        sundayReview: {
          quizQuestions: [
            { question: "What is standard SRE incident command protocol?", answer: "Establishing Incident Commander, Operations Lead, and Communications Lead to avoid chaos." }
          ],
          miniTask: "Write a short, professional introduction for SRE panels.",
          reflectionPrompt: {
            title: "Transitioning to SRE Professional Practice",
            requirements: ["Highlight the key lessons of system reliability and cost balance mastered over the 5-month journey."]
          }
        }
      }
    ],
    capstone: {
      title: "Production Scaled EKS Infrastructure & Disaster Recovery Suite",
      architecture: "Configure a multi-region highly-available EKS environment equipped with Karpenter dynamic scaling, real-time Kubecost finance tracking, and a fully rehearsed Velero regional backup/recovery protocol.",
      deliverables: [
        "Karpenter configurations matching Spot & On-Demand instances.",
        "Real-time Kubecost finance allocation dashboards.",
        "Velero backups cron schedule templates.",
        "Failover DNS scripting configurations."
      ],
      docRequirements: [
        "Uptime analysis reports detailing automated Karpenter scale benchmarks.",
        "A disaster recovery handbook sketching failover steps during simulated earthquakes."
      ]
    }
  }
];
