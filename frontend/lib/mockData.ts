import { Tweet } from './types';

// Rich mock data — realistic developer tweets about the system's keyword topics:
// Java, Microservices, Spring, Kafka, Elasticsearch
// Timestamps spread over the past 7 days for realistic chart data.
function daysAgo(days: number, hoursOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
}

export const MOCK_TWEETS: Tweet[] = [
  // ── Java ──────────────────────────────────────────────────────────────────
  {
    id: 'mock-001',
    userId: 100001,
    text: 'Java 21 virtual threads (Project Loom) are a game-changer for high-concurrency microservices — no more thread pool tuning nightmares. #Java #Microservices',
    createdAt: daysAgo(0, 1),
  },
  {
    id: 'mock-002',
    userId: 100002,
    text: 'Migrating from Java 11 to Java 17 brought a 15% throughput improvement in our Spring Boot services. Records and sealed classes made DTOs so much cleaner.',
    createdAt: daysAgo(0, 3),
  },
  {
    id: 'mock-003',
    userId: 100003,
    text: 'Java garbage collectors in 2024: ZGC or Shenandoah for low-latency microservices? We benchmarked both and ZGC wins on p99 tail latency at scale. #Java',
    createdAt: daysAgo(1, 2),
  },
  {
    id: 'mock-004',
    userId: 100004,
    text: 'Pattern matching in Java 21 is drastically reducing boilerplate in our domain model switch expressions. Finally feels like a modern language. #Java',
    createdAt: daysAgo(1, 5),
  },
  {
    id: 'mock-005',
    userId: 100005,
    text: 'Just shipped our first production service using Java 21 structured concurrency. The code reads like sequential logic but scales like async. Mind blown. #Java',
    createdAt: daysAgo(2, 0),
  },

  // ── Microservices ─────────────────────────────────────────────────────────
  {
    id: 'mock-006',
    userId: 100006,
    text: 'Microservices anti-pattern: sharing a database between services. We spent 6 months untangling tightly coupled schemas. Domain-driven boundaries matter. #Microservices',
    createdAt: daysAgo(0, 2),
  },
  {
    id: 'mock-007',
    userId: 100007,
    text: 'Service mesh vs. API gateway — not an either/or choice. Istio handles east-west traffic, Kong handles north-south. Both are essential in our microservices platform.',
    createdAt: daysAgo(1, 1),
  },
  {
    id: 'mock-008',
    userId: 100008,
    text: 'CQRS + event sourcing is overkill for most microservices. Use it only when you genuinely need audit trails or temporal queries. Complexity has a cost. #Microservices',
    createdAt: daysAgo(1, 4),
  },
  {
    id: 'mock-009',
    userId: 100009,
    text: 'Our microservices observability stack: OpenTelemetry for traces, Prometheus for metrics, Loki for logs. The trifecta that saved our on-call team. #Microservices',
    createdAt: daysAgo(2, 2),
  },
  {
    id: 'mock-010',
    userId: 100010,
    text: 'Circuit breakers in microservices: Resilience4j saved us from cascading failures during last week\'s Elasticsearch outage. Every service needs one. #Microservices',
    createdAt: daysAgo(2, 6),
  },
  {
    id: 'mock-011',
    userId: 100011,
    text: 'Deploying 40+ microservices with a single Helm chart umbrella — Kubernetes namespaces + ArgoCD GitOps gives us one-command rollbacks. #Microservices #DevOps',
    createdAt: daysAgo(3, 0),
  },

  // ── Spring ────────────────────────────────────────────────────────────────
  {
    id: 'mock-012',
    userId: 100012,
    text: 'Spring Boot 3.3 native image compilation with GraalVM cut our container startup time from 8s to 180ms. Cold start problem in serverless is finally solved. #Spring',
    createdAt: daysAgo(0, 4),
  },
  {
    id: 'mock-013',
    userId: 100013,
    text: 'Spring Cloud Config + Git backend = versioned, audited configuration for all microservices. Never go back to environment variable soup. #Spring #Microservices',
    createdAt: daysAgo(1, 0),
  },
  {
    id: 'mock-014',
    userId: 100014,
    text: 'Spring WebFlux with Project Reactor gave us 3x more RPS on the same hardware compared to blocking Spring MVC for our streaming analytics API. #Spring',
    createdAt: daysAgo(1, 6),
  },
  {
    id: 'mock-015',
    userId: 100015,
    text: 'Spring Security OAuth2 + Keycloak: setting up PKCE flows for our SPA was surprisingly painless with Spring Boot 3. The autoconfiguration is impressive. #Spring',
    createdAt: daysAgo(2, 1),
  },
  {
    id: 'mock-016',
    userId: 100016,
    text: 'Spring Data Elasticsearch 5.x with the new RestClient under the hood — the old HLRC was deprecated for good reason. Migration was smooth with Spring Boot 3. #Spring',
    createdAt: daysAgo(2, 4),
  },
  {
    id: 'mock-017',
    userId: 100017,
    text: 'Spring Batch processing 10M records nightly: chunk-oriented processing + skip policies + retry templates made it bulletproof. The framework does the heavy lifting. #Spring',
    createdAt: daysAgo(3, 2),
  },
  {
    id: 'mock-018',
    userId: 100018,
    text: 'Spring Actuator + Micrometer + Prometheus: health checks, JVM metrics, and custom business metrics all wired up in under 10 minutes. Love this ecosystem. #Spring',
    createdAt: daysAgo(3, 5),
  },

  // ── Kafka ─────────────────────────────────────────────────────────────────
  {
    id: 'mock-019',
    userId: 100019,
    text: 'Apache Kafka handling 1.2 million messages/sec in our real-time analytics pipeline. Avro serialization + Schema Registry keeps payload sizes 60% smaller than JSON. #Kafka',
    createdAt: daysAgo(0, 0),
  },
  {
    id: 'mock-020',
    userId: 100020,
    text: 'Kafka consumer group rebalancing was killing our latency. Switched to static membership (group.instance.id) and eliminated the 30-second rebalance storms. #Kafka',
    createdAt: daysAgo(0, 5),
  },
  {
    id: 'mock-021',
    userId: 100021,
    text: 'Kafka Streams vs. Flink for stateful stream processing: Kafka Streams wins on operational simplicity, Flink wins on complex event time windowing. Choose based on team skills. #Kafka',
    createdAt: daysAgo(1, 3),
  },
  {
    id: 'mock-022',
    userId: 100022,
    text: 'Outbox pattern with Kafka: write to DB and Kafka atomically by using Debezium CDC. No dual-write bugs, no lost messages. This is the correct way. #Kafka #Microservices',
    createdAt: daysAgo(2, 3),
  },
  {
    id: 'mock-023',
    userId: 100023,
    text: 'Kafka topic partitioning strategy: hash on userId keeps user event ordering while giving us horizontal scale. 96 partitions across 3 brokers, zero hotspots. #Kafka',
    createdAt: daysAgo(2, 7),
  },
  {
    id: 'mock-024',
    userId: 100024,
    text: 'Confluent Schema Registry with backward compatibility mode saved our team from breaking consumers when we evolved our Avro schemas. Always evolve schemas safely. #Kafka',
    createdAt: daysAgo(3, 1),
  },
  {
    id: 'mock-025',
    userId: 100025,
    text: 'Kafka Connect with Elasticsearch sink connector: streaming inserts at 50k events/sec into Elasticsearch with zero custom code. Connector ecosystem is underrated. #Kafka #Elasticsearch',
    createdAt: daysAgo(3, 4),
  },
  {
    id: 'mock-026',
    userId: 100026,
    text: 'Implementing exactly-once semantics in Kafka: idempotent producers + transactional consumers. The 0.11+ protocol handles duplicates at the broker level. #Kafka',
    createdAt: daysAgo(4, 0),
  },
  {
    id: 'mock-027',
    userId: 100027,
    text: 'Kafka\'s log compaction feature is a perfect fit for maintaining the latest state of every entity — a built-in snapshot store that any consumer can replay. #Kafka',
    createdAt: daysAgo(4, 3),
  },

  // ── Elasticsearch ─────────────────────────────────────────────────────────
  {
    id: 'mock-028',
    userId: 100028,
    text: 'Elasticsearch full-text search with BM25 scoring + custom field boosting gives us better relevance than plain keyword matching. Tuning the index mapping matters a lot. #Elasticsearch',
    createdAt: daysAgo(0, 6),
  },
  {
    id: 'mock-029',
    userId: 100029,
    text: 'Elasticsearch index lifecycle management (ILM): hot-warm-cold-delete tiers cut our storage costs by 70% for time-series data. An essential feature for production. #Elasticsearch',
    createdAt: daysAgo(1, 7),
  },
  {
    id: 'mock-030',
    userId: 100030,
    text: 'Elasticsearch aggregations for real-time analytics: date histograms + nested bucket aggs answer business questions in <50ms on 500M documents. #Elasticsearch',
    createdAt: daysAgo(2, 5),
  },
  {
    id: 'mock-031',
    userId: 100031,
    text: 'Elasticsearch vector search with HNSW index: combining BM25 text relevance and cosine similarity for hybrid semantic + keyword search. The future of search is hybrid. #Elasticsearch',
    createdAt: daysAgo(3, 3),
  },
  {
    id: 'mock-032',
    userId: 100032,
    text: 'Running a 3-node Elasticsearch cluster on Kubernetes: dedicated master, data, and coordinating nodes with persistent volumes. Zero downtime rolling upgrades. #Elasticsearch',
    createdAt: daysAgo(4, 1),
  },
  {
    id: 'mock-033',
    userId: 100033,
    text: 'Elasticsearch cross-cluster replication (CCR) for active-active multi-region: writes go to primary, reads served locally. 99.99% availability achieved. #Elasticsearch',
    createdAt: daysAgo(4, 4),
  },
  {
    id: 'mock-034',
    userId: 100034,
    text: 'Spring Data Elasticsearch repository pattern: just define an interface and get paginated, sorted queries for free. HATEOAS response models make the REST API self-describing. #Elasticsearch #Spring',
    createdAt: daysAgo(5, 0),
  },
  {
    id: 'mock-035',
    userId: 100035,
    text: 'Elasticsearch painless scripting for runtime fields: add computed fields to documents at query time without re-indexing. Perfect for A/B testing ranking algorithms. #Elasticsearch',
    createdAt: daysAgo(5, 3),
  },

  // ── Cross-topic ───────────────────────────────────────────────────────────
  {
    id: 'mock-036',
    userId: 100036,
    text: 'Real-time data pipeline: Twitter stream → Kafka (Avro) → Kafka-to-Elastic consumer → Elasticsearch. Spring Boot glues it all together beautifully. #Kafka #Elasticsearch #Spring',
    createdAt: daysAgo(0, 8),
  },
  {
    id: 'mock-037',
    userId: 100037,
    text: 'Event-driven architecture with Kafka decouples producers from consumers — the twitter-to-kafka service doesn\'t need to know Elasticsearch exists. Pure separation of concerns.',
    createdAt: daysAgo(1, 8),
  },
  {
    id: 'mock-038',
    userId: 100038,
    text: 'Avro binary encoding vs JSON: same tweet payload shrinks from 175 bytes to 70 bytes — a 60% reduction. At 10k msgs/sec that\'s 90GB saved per day. #Kafka',
    createdAt: daysAgo(2, 8),
  },
  {
    id: 'mock-039',
    userId: 100039,
    text: 'Spring Cloud Config Server backed by a Git repository: every microservice config change is a commit, every rollback is a git revert. #Spring #Microservices #DevOps',
    createdAt: daysAgo(3, 6),
  },
  {
    id: 'mock-040',
    userId: 100040,
    text: 'Docker Compose for local development: one command spins up Kafka, Zookeeper, Schema Registry, Elasticsearch cluster, and all Spring Boot microservices. #DevOps',
    createdAt: daysAgo(4, 5),
  },
  {
    id: 'mock-041',
    userId: 100041,
    text: 'Google Jib builds optimized Docker images for Java microservices from Maven without a Dockerfile. Layer caching makes rebuilds 10x faster. #Java #DevOps',
    createdAt: daysAgo(5, 1),
  },
  {
    id: 'mock-042',
    userId: 100042,
    text: 'The Saga pattern for distributed transactions across microservices: choreography via Kafka events keeps services decoupled without a central coordinator. #Microservices #Kafka',
    createdAt: daysAgo(5, 4),
  },
  {
    id: 'mock-043',
    userId: 100043,
    text: 'Spring Retry with exponential backoff: when Elasticsearch or Kafka is temporarily unavailable, our services gracefully wait and reconnect instead of crashing. #Spring',
    createdAt: daysAgo(6, 0),
  },
  {
    id: 'mock-044',
    userId: 100044,
    text: 'HATEOAS in REST APIs: self-descriptive responses with hypermedia links let clients discover available actions without reading docs. Spring HATEOAS makes this trivial. #Spring',
    createdAt: daysAgo(6, 3),
  },
  {
    id: 'mock-045',
    userId: 100045,
    text: 'Real-time analytics dashboard powered by Elasticsearch aggregations served through Spring Boot REST API — query latency under 80ms for 1 billion indexed documents. #Elasticsearch #Spring',
    createdAt: daysAgo(6, 6),
  },
  {
    id: 'mock-046',
    userId: 100046,
    text: 'Kafka lag monitoring with Prometheus + Grafana: when consumer lag spikes, our alert fires before users notice any slowdown. Proactive ops beats reactive ops. #Kafka',
    createdAt: daysAgo(7, 0),
  },
  {
    id: 'mock-047',
    userId: 100047,
    text: 'Elasticsearch index aliases: blue-green index deployments with zero search downtime. Reindex, validate, then flip the alias atomically. #Elasticsearch',
    createdAt: daysAgo(7, 2),
  },
  {
    id: 'mock-048',
    userId: 100048,
    text: 'Microservices health checks with Spring Actuator: liveness (is the process alive?) and readiness (can it serve traffic?) are different concerns. K8s needs both. #Spring #Microservices',
    createdAt: daysAgo(7, 4),
  },
  {
    id: 'mock-049',
    userId: 100049,
    text: 'Apache Kafka\'s segment-based storage and zero-copy transfer (sendfile syscall) is why it outperforms traditional message brokers by 100x at scale. #Kafka',
    createdAt: daysAgo(7, 6),
  },
  {
    id: 'mock-050',
    userId: 100050,
    text: 'Java records as immutable Avro-compatible DTOs: compact syntax, automatic equals/hashCode, perfect for event-driven message payloads between microservices. #Java #Kafka',
    createdAt: daysAgo(7, 8),
  },
];

// Simulate full-text search: tokenize, score by TF, rank by relevance
export function searchMockTweets(query: string): Tweet[] {
  if (!query.trim()) return [];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = MOCK_TWEETS.map((tweet) => {
    const body = tweet.text.toLowerCase();
    const score = tokens.reduce((acc, token) => {
      const re = new RegExp(token, 'gi');
      const matches = body.match(re);
      return acc + (matches ? matches.length : 0);
    }, 0);
    return { tweet, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map(({ tweet }) => tweet);
}
