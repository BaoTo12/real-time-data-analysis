import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs/backend_interview_questions");
const outputPath = path.join(outputDir, "backend_interview_questions_english.xlsx");

const rows = [
  {
    id: 1,
    category: "API & RESTful Design",
    topic: "REST vs GraphQL",
    question: "Differentiate REST APIs and GraphQL. What criteria would you use to choose the right solution?",
    answer:
      "GraphQL is strong when clients need flexible queries across multiple data sources. REST is strong for simpler systems with resource-oriented endpoints, straightforward caching, and easier maintenance. Choose based on UI complexity, payload optimization needs, cache requirements, and team maturity.",
    fundamentals:
      "REST models data as resources and uses HTTP methods and status codes. GraphQL exposes a typed schema and lets clients request exactly the fields they need. REST often benefits from HTTP caching and simpler observability, while GraphQL centralizes query flexibility but needs query governance.",
    why:
      "Interviewers want to see that you do not pick technology by hype. A strong answer balances client needs, backend complexity, caching, performance, versioning, and operational cost.",
    example:
      "For a mobile app with limited bandwidth and screens that combine user, order, and recommendation data, GraphQL can reduce over-fetching. For a CRUD admin system with stable resources, REST is usually simpler and easier to cache.",
  },
  {
    id: 2,
    category: "API & RESTful Design",
    topic: "Rate Limiting",
    question: "How would you handle rate limiting in an API?",
    answer:
      "Return HTTP 429 when limits are exceeded and include retry guidance. Store counters centrally, often in Redis, so multiple backend instances share the same limit state. Apply algorithms such as token bucket, sliding window, or fixed window depending on fairness and burst tolerance.",
    fundamentals:
      "Rate limiting protects shared resources by controlling request volume per user, IP, API key, route, or tenant. Distributed systems need a shared or coordinated state store. Good APIs expose headers such as remaining quota and retry timing.",
    why:
      "This question tests whether you understand abuse protection, scaling across instances, user experience during throttling, and operational trade-offs between precision and cost.",
    example:
      "Use token bucket for an API that allows short bursts but controls sustained traffic. Store bucket state in Redis and return 429 with Retry-After when a client exhausts its allowance.",
  },
  {
    id: 3,
    category: "API & RESTful Design",
    topic: "Error Responses",
    question: "How would you design API error responses so clients can handle them easily?",
    answer:
      "Use a consistent error response shape across endpoints. Return meaningful HTTP status codes, stable application error codes, readable messages, and field-level validation details when relevant. Log internal detail on the server but avoid exposing sensitive implementation data to clients.",
    fundamentals:
      "Clients need predictable contracts for both success and failure. HTTP 4xx usually means a client-side issue, while 5xx indicates server failure. Validation errors should identify fields and reasons, and internal errors should be traceable via request or correlation IDs.",
    why:
      "Interviewers are checking API maturity: contract consistency, debuggability, frontend ergonomics, security hygiene, and whether you avoid anti-patterns such as returning HTTP 200 for every failure.",
    example:
      'A validation failure can return 400 with code "VALIDATION_ERROR", message "Invalid request", and fields such as email: "Invalid email format". Server logs can include the stack trace and correlation ID.',
  },
  {
    id: 4,
    category: "Database",
    topic: "SQL vs NoSQL",
    question: "Differentiate SQL and NoSQL. What criteria would you use to choose one for a specific problem?",
    answer:
      "SQL fits relational data, joins, transactions, and strong consistency. NoSQL fits flexible schemas, high write volume, document-like data, or easier horizontal scaling. Choose based on data shape, consistency needs, query patterns, schema stability, and growth expectations.",
    fundamentals:
      "SQL databases use structured schemas and relational algebra. NoSQL is a family of models including document, key-value, wide-column, and graph stores. The key decision is not SQL versus NoSQL in the abstract, but matching storage model to access patterns.",
    why:
      "Interviewers want to see that you can choose persistence technology from requirements rather than preference, and that you understand trade-offs around transactions, schema evolution, and scaling.",
    example:
      "Use PostgreSQL for orders, payments, and inventory transactions. Use a document store for user profile preferences that change frequently and are usually retrieved as one document.",
  },
  {
    id: 5,
    category: "Database",
    topic: "Indexes",
    question: "How do database indexes work, and when should you avoid using them?",
    answer:
      "Indexes speed up reads by giving the database a faster lookup path than scanning the whole table. Too many indexes slow inserts, updates, and deletes because the database must maintain each index. Avoid indexing low-cardinality columns or columns that change constantly unless query evidence supports it.",
    fundamentals:
      "Common indexes use structures such as B-trees or hash indexes. They improve filtering, sorting, joins, and uniqueness checks when they match query predicates. Index usefulness depends on selectivity, column order, table size, and the query planner.",
    why:
      "This tests practical database performance knowledge. Good candidates understand the read/write trade-off and know that indexes should be justified by actual query patterns and execution plans.",
    example:
      "Index user_id on an orders table if most queries fetch orders by user. Avoid adding an index to a boolean is_active column if most rows have the same value and the planner will still prefer a scan.",
  },
  {
    id: 6,
    category: "Database",
    topic: "History & Audit Logs",
    question: "How would you design a schema for historical data and audit logs?",
    answer:
      "Use soft delete, versioning, audit tables, or event history depending on the business need. Store who changed what, when it changed, and the before/after values needed for traceability. Plan partitioning or archival when audit data grows over time.",
    fundamentals:
      "Historical design depends on whether you need recovery, legal traceability, analytics, or debugging. Audit records should be append-only when possible. Large history tables may need partitioning, retention policies, and careful indexing.",
    why:
      "Interviewers are testing whether you design for real production needs: compliance, debugging, rollback, storage growth, and the balance between easy history queries and write-path performance.",
    example:
      "For account settings, keep a current user_settings table plus an append-only user_settings_audit table with actor_id, changed_at, field_name, old_value, new_value, and request_id.",
  },
  {
    id: 7,
    category: "Security",
    topic: "JWT",
    question: "How does JWT work, and what security risks should you watch for?",
    answer:
      "A JWT contains a header, payload, and signature. The payload is not encrypted by default. Validate signatures, expiry, issuer, audience, and algorithm. Avoid localStorage for sensitive tokens when XSS risk is high, and design a revocation or rotation strategy.",
    fundamentals:
      "JWT is a signed token format used to carry claims. Stateless verification reduces database lookups, but logout, compromised tokens, and permission changes require extra handling. Never accept algorithm none or trust claims without verifying the signature.",
    why:
      "This question reveals whether you understand the difference between encoding, signing, and encryption, and whether you can reason about real authentication risks instead of treating JWT as magic security.",
    example:
      "Use short-lived access tokens, refresh token rotation, HttpOnly Secure cookies for browser apps, and a blacklist or token version field when immediate revocation is required.",
  },
  {
    id: 8,
    category: "Security",
    topic: "HTTPS",
    question: "How does HTTPS work, and why is it not enough for complete security?",
    answer:
      "HTTPS uses TLS to encrypt data in transit and reduce man-in-the-middle risk. It does not protect data after it reaches the server, prevent authorization bugs, validate inputs, or stop application logic flaws. It must be combined with secure application design.",
    fundamentals:
      "TLS provides confidentiality, integrity, and server authentication during transport. Application security also requires authentication, authorization, input validation, secure session handling, logging, and sometimes encryption at rest.",
    why:
      "Interviewers want to know whether you separate transport security from end-to-end application security, and whether you can identify layers of defense.",
    example:
      "A payment API can use HTTPS correctly and still be vulnerable if it lets one user access another user's invoice because authorization checks are missing.",
  },
  {
    id: 9,
    category: "Security",
    topic: "Sensitive Data",
    question: "How do you store and handle sensitive user information?",
    answer:
      "Hash passwords with a slow password hashing algorithm such as bcrypt, Argon2, or PBKDF2. Never store plaintext passwords or weak hashes such as MD5. Encrypt sensitive data at rest, restrict production access, avoid unnecessary retention, and minimize data collection.",
    fundamentals:
      "Password hashing is one-way and should include salts and work factors. Encryption protects recoverable sensitive data but requires key management. Data minimization reduces blast radius, while access control and audit trails limit misuse.",
    why:
      "This checks security fundamentals and production judgment: password safety, least privilege, compliance awareness, and reducing the impact of data exposure.",
    example:
      "Store password_hash only, encrypt national ID numbers with managed keys, mask sensitive fields in logs, and give production database access only through audited break-glass procedures.",
  },
  {
    id: 10,
    category: "Architecture & Service Design",
    topic: "Service Boundaries",
    question: "When should you split a service or module, and when should you keep it together?",
    answer:
      "Split when coupling, ownership, scaling, deployment, or reliability needs justify the operational cost. Keep it together when the system is small, boundaries are unclear, or coordination overhead would outweigh benefits. Avoid splitting too early.",
    fundamentals:
      "A good boundary aligns with business capability, data ownership, team ownership, and deployment independence. Splitting creates network calls, monitoring needs, versioning concerns, and distributed failure modes.",
    why:
      "Interviewers are looking for architectural maturity. They want evidence that you understand both modularity benefits and the real cost of distributed systems.",
    example:
      "Keep billing and order logic in one modular monolith early on. Split payment processing later if it needs independent security controls, scaling, deployment, and ownership.",
  },
  {
    id: 11,
    category: "Architecture & Service Design",
    topic: "Monolith vs Microservices",
    question: "Compare monolithic architecture with microservices. What is the best choice for a new project?",
    answer:
      "A monolith is easier to start, debug, test, and deploy for small teams or new products. Microservices help when independent scaling, team autonomy, or separate deployment lifecycles are required. For most new projects, start with a well-modularized monolith and split later when domain boundaries are proven.",
    fundamentals:
      "Monoliths centralize deployment and often simplify transactions. Microservices distribute ownership and runtime but add network latency, service discovery, observability, data consistency, deployment orchestration, and incident response complexity.",
    why:
      "This tests whether you can recommend an architecture based on project stage, team size, domain uncertainty, and operational readiness rather than repeating slogans.",
    example:
      "A startup MVP should usually begin as a modular monolith. A mature marketplace with separate search, payment, recommendation, and notification teams may benefit from microservices.",
  },
  {
    id: 12,
    category: "Distributed Systems",
    topic: "Data Consistency",
    question: "How do you ensure data consistency in a distributed system?",
    answer:
      "Choose consistency based on business risk. Use strong consistency where correctness is critical, such as payments or inventory reservation. Use eventual consistency for less critical flows, such as notifications or analytics. Design idempotency, retries, outbox patterns, and compensation workflows.",
    fundamentals:
      "Distributed systems must trade off latency, availability, and consistency. Strong consistency often needs coordination and higher latency. Eventual consistency improves availability but requires handling delays, duplicates, retries, and user-facing state transitions.",
    why:
      "Interviewers want to see that you can map consistency models to business requirements and design resilient workflows instead of assuming one global answer.",
    example:
      "Payment capture should be strongly consistent and idempotent. Email notifications can be eventually consistent through a message queue and retried safely if delivery fails.",
  },
  {
    id: 13,
    category: "Performance & Scalability",
    topic: "Bottlenecks",
    question: "How do you identify and handle bottlenecks in a system?",
    answer:
      "Use monitoring, tracing, logs, and profiling to locate the bottleneck before optimizing. Check database, CPU, memory, network, queues, locks, and external services. Fix the measured constraint with targeted changes, then verify impact.",
    fundamentals:
      "A bottleneck is the limiting resource in a workflow. Reliable diagnosis needs metrics such as latency percentiles, throughput, error rate, saturation, slow queries, and dependency timing. Premature optimization can waste time or make systems harder to maintain.",
    why:
      "This tests production debugging skills and whether you can move from symptoms to evidence to a safe fix.",
    example:
      "If monitoring shows high API latency and traces point to slow database reads, use EXPLAIN, add a targeted index, cache hot reads, or reduce N+1 queries, then compare before/after p95 latency.",
  },
  {
    id: 14,
    category: "Performance & Scalability",
    topic: "Cache Invalidation",
    question: "What cache invalidation strategy do you usually use, and why?",
    answer:
      "Use cache-aside with TTL for data that can tolerate some staleness. Use event-driven invalidation when updates must propagate quickly across services. Consider write-through for stronger consistency and write-behind when write performance matters more than immediate durability in the cache layer.",
    fundamentals:
      "Caching reduces load and latency but introduces staleness risk. TTL is simple but imprecise. Explicit invalidation is fresher but more complex. Thundering herd prevention may require locks, jittered TTLs, request coalescing, or background refresh.",
    why:
      "Interviewers are checking whether you understand caching as a consistency trade-off, not only a speed trick.",
    example:
      "Use cache-aside with a five-minute TTL for product catalog pages. Use event-driven invalidation after price updates so users do not see stale prices for too long.",
  },
  {
    id: 15,
    category: "Performance & Scalability",
    topic: "Slow SQL Queries",
    question: "How do you optimize a slow SQL query?",
    answer:
      "Start with EXPLAIN or EXPLAIN ANALYZE to understand the execution plan. Look for full table scans, poor join order, filesort, temporary tables, missing indexes, excessive rows, and unnecessary columns. Optimize indexes, query shape, joins, predicates, and result size.",
    fundamentals:
      "Query optimization is evidence-driven. The planner chooses execution strategies based on statistics, indexes, predicates, and joins. Better performance can come from indexes, rewritten predicates, pagination, denormalization, materialized views, or fixing N+1 access patterns.",
    why:
      "This tests hands-on backend performance skills and whether you can reason from the database engine's actual plan rather than guessing.",
    example:
      "If EXPLAIN shows a full scan on orders filtered by customer_id and created_at, add a composite index matching that access pattern and verify the new plan reads fewer rows.",
  },
  {
    id: 16,
    category: "Deployment & Reliability",
    topic: "Zero Downtime Deployment",
    question: "How is zero downtime deployment implemented?",
    answer:
      "Use blue-green deployment, canary release, or rolling updates. Keep database migrations backward compatible with both old and new service versions. Use health checks, readiness checks, traffic shifting, monitoring, and automatic rollback when error rates increase.",
    fundamentals:
      "Zero downtime requires old and new versions to coexist safely during rollout. Risky changes should be expanded, deployed, migrated, and contracted in separate steps. Health checks and observability decide whether traffic should continue moving to the new version.",
    why:
      "Interviewers are testing release engineering judgment: safe rollouts, migration strategy, rollback readiness, and production reliability.",
    example:
      "Add a nullable database column first, deploy code that writes both old and new fields, backfill data, then remove old reads in a later release after monitoring confirms stability.",
  },
];

const categories = [
  ["API & RESTful Design", "API contracts, traffic control, and client ergonomics"],
  ["Database", "Data modeling, performance, and operational growth"],
  ["Security", "Authentication, transport security, and sensitive data handling"],
  ["Architecture & Service Design", "Boundaries, coupling, scaling, and team fit"],
  ["Distributed Systems", "Consistency trade-offs and resilient workflows"],
  ["Performance & Scalability", "Evidence-driven optimization and caching"],
  ["Deployment & Reliability", "Safe releases and runtime protection"],
];

function applyHeader(range, fill = "#164E63") {
  range.format = {
    fill,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
}

function applyBody(range) {
  range.format = {
    fill: "#FFFFFF",
    font: { color: "#172033" },
    wrapText: true,
  };
}

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Overview");
const bank = workbook.worksheets.add("Interview Questions");

for (const sheet of [overview, bank]) {
  sheet.showGridLines = false;
}

overview.getRange("A1:L1").merge();
overview.getRange("A1").values = [["Backend Interview Prep: API, Database, Security, Architecture"]];
overview.getRange("A1").format = {
  fill: "#0F3D4C",
  font: { bold: true, color: "#FFFFFF", size: 16 },
};
overview.getRange("A2:L2").merge();
overview.getRange("A2").values = [[
  "English question bank translated and expanded with fundamentals, interview intent, and practical examples.",
]];
overview.getRange("A2").format = {
  fill: "#E7F1F3",
  font: { italic: true, color: "#334155" },
  wrapText: true,
};

overview.getRange("A4:C4").values = [["Category", "Questions", "Interview Focus"]];
applyHeader(overview.getRange("A4:C4"), "#164E63");
overview.getRange(`A5:C${4 + categories.length}`).values = categories.map(([category, focus]) => [
  category,
  null,
  focus,
]);
overview.getRange(`B5:B${4 + categories.length}`).formulas = categories.map(([category]) => [
  `=COUNTIF('Interview Questions'!$B$5:$B$20,"${category}")`,
]);
applyBody(overview.getRange(`A5:C${4 + categories.length}`));
overview.getRange(`A5:C${4 + categories.length}`).format.wrapText = true;
overview.getRange("A4:C11").format.rowHeightPx = 34;
overview.getRange("A:A").format.columnWidthPx = 220;
overview.getRange("B:B").format.columnWidthPx = 260;
overview.getRange("C:C").format.columnWidthPx = 500;
const categoryTable = overview.tables.add("A4:C11", true, "CategorySummary");
categoryTable.style = "TableStyleMedium2";

overview.getRange("A13:C13").values = [["How to Use This Workbook", "Recommended Interview Signal", "Common Follow-up Angle"]];
applyHeader(overview.getRange("A13:C13"), "#9A3412");
overview.getRange("A14:C17").values = [
  [
    "Prepare by category, then practice answering in 60-90 seconds.",
    "Clear trade-offs, production examples, and business-aware decisions.",
    "The interviewer may ask when your preferred approach would fail.",
  ],
  [
    "Use the fundamentals column to refresh theory before mock interviews.",
    "You can explain the mechanism, not only memorize a definition.",
    "Expect deeper questions around edge cases and operational cost.",
  ],
  [
    "Use the example column to build short stories from your own projects.",
    "You can connect design choices to latency, correctness, security, or maintainability.",
    "They may ask for a concrete incident, metric, or migration plan.",
  ],
  [
    "For senior roles, emphasize constraints and why another option was rejected.",
    "Judgment under ambiguity is often more important than the named tool.",
    "Expect questions about scale, rollout, monitoring, and failure modes.",
  ],
];
applyBody(overview.getRange("A14:C17"));
overview.getRange("A13:C17").format.wrapText = true;
overview.getRange("A13:C13").format.rowHeightPx = 44;
overview.getRange("A14:C17").format.rowHeightPx = 76;

const chart = overview.charts.add("bar", overview.getRange("A4:B11"));
chart.title = "Questions by Category";
chart.hasLegend = false;
chart.xAxis = { axisType: "textAxis" };
chart.yAxis = { numberFormatCode: "0.0" };
chart.setPosition("E4", "L18");

bank.getRange("A1:H1").merge();
bank.getRange("A1").values = [["Backend Interview Questions - English Study Bank"]];
bank.getRange("A1").format = {
  fill: "#0F3D4C",
  font: { bold: true, color: "#FFFFFF", size: 16 },
};
bank.getRange("A2:H2").merge();
bank.getRange("A2").values = [[
  "Each row gives the translated interview question, a concise answer, fundamentals to know, why interviewers ask it, and a practical example to defend your answer.",
]];
bank.getRange("A2").format = {
  fill: "#E7F1F3",
  font: { italic: true, color: "#334155" },
  wrapText: true,
};

const headers = [
  "ID",
  "Category",
  "Topic",
  "Interview Question",
  "Core Answer",
  "Fundamentals",
  "Why Interviewers Ask",
  "Strong Example / Signal",
];
bank.getRange("A4:H4").values = [headers];
applyHeader(bank.getRange("A4:H4"), "#164E63");

const matrix = rows.map((r) => [
  r.id,
  r.category,
  r.topic,
  r.question,
  r.answer,
  r.fundamentals,
  r.why,
  r.example,
]);
bank.getRange(`A5:H${4 + rows.length}`).values = matrix;
applyBody(bank.getRange(`A5:H${4 + rows.length}`));

bank.getRange("A:A").format.columnWidthPx = 50;
bank.getRange("B:B").format.columnWidthPx = 170;
bank.getRange("C:C").format.columnWidthPx = 170;
bank.getRange("D:D").format.columnWidthPx = 330;
bank.getRange("E:E").format.columnWidthPx = 390;
bank.getRange("F:F").format.columnWidthPx = 410;
bank.getRange("G:G").format.columnWidthPx = 360;
bank.getRange("H:H").format.columnWidthPx = 390;
bank.getRange("A4:H20").format.wrapText = true;
bank.getRange("A4:H4").format.rowHeightPx = 42;
bank.getRange("A5:H20").format.rowHeightPx = 132;

const questionTable = bank.tables.add("A4:H20", true, "InterviewQuestionBank");
questionTable.style = "TableStyleMedium4";
questionTable.showFilterButton = true;

bank.freezePanes.freezeRows(4);
bank.freezePanes.freezeColumns(3);
overview.freezePanes.freezeRows(4);

const overviewInspect = await workbook.inspect({
  kind: "table",
  range: "Overview!A1:C17",
  include: "values,formulas",
  tableMaxRows: 18,
  tableMaxCols: 3,
});
console.log(overviewInspect.ndjson);

const bankInspect = await workbook.inspect({
  kind: "table",
  range: "Interview Questions!A4:H20",
  include: "values",
  tableMaxRows: 18,
  tableMaxCols: 8,
});
console.log(bankInspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const overviewPreview = await workbook.render({
  sheetName: "Overview",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "overview_preview.png"), new Uint8Array(await overviewPreview.arrayBuffer()));

const bankPreview = await workbook.render({
  sheetName: "Interview Questions",
  range: "A1:H20",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "question_bank_preview.png"), new Uint8Array(await bankPreview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

console.log(`Saved ${outputPath}`);
