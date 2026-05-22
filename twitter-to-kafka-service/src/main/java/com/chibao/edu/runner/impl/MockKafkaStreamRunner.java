package com.chibao.edu.runner.impl;

import com.chibao.edu.config.TwitterToKafkaServiceConfigData;
import com.chibao.edu.exception.TwitterToKafkaServiceException;
import com.chibao.edu.listener.TwitterKafkaStatusListener;
import com.chibao.edu.runner.StreamRunner;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import twitter4j.Status;
import twitter4j.TwitterException;
import twitter4j.TwitterObjectFactory;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Primary
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "twitter-to-kafka-service.enable-mock-tweets", havingValue = "true")
public class MockKafkaStreamRunner implements StreamRunner {
    private final TwitterToKafkaServiceConfigData config;
    private final TwitterKafkaStatusListener listener;

    private static final String TWITTER_STATUS_DATE_FORMAT = "EEE MMM dd HH:mm:ss zzz yyyy";
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern(TWITTER_STATUS_DATE_FORMAT, Locale.ENGLISH);

    /**
     * Realistic developer tweet templates, keyed by tracked keyword topic.
     * Each entry is a complete, meaningful tweet — the keyword appears naturally in the text.
     */
    private static final List<String> TWEET_TEMPLATES = List.of(
            // Java
            "Java 21 virtual threads (Project Loom) are a game-changer for high-concurrency microservices — no more thread pool tuning nightmares. #Java #Microservices",
            "Migrating from Java 11 to Java 17 brought a 15%% throughput improvement in our Spring Boot services. Records and sealed classes made DTOs so much cleaner. #Java",
            "Java garbage collectors in 2024: ZGC or Shenandoah for low-latency microservices? We benchmarked both and ZGC wins on p99 tail latency at scale. #Java",
            "Pattern matching in Java 21 is drastically reducing boilerplate in our domain model switch expressions. Finally feels like a modern language. #Java",
            "Just shipped our first production service using Java 21 structured concurrency. The code reads like sequential logic but scales like async. Mind blown. #Java",
            "Java records as immutable Avro-compatible DTOs: compact syntax, automatic equals/hashCode, perfect for event-driven message payloads. #Java #Kafka",
            "Java 21 sequenced collections finally give us a consistent API across List, Set, and Deque. Small change, huge improvement in readability. #Java",
            "GraalVM native image for Java microservices: 50ms startup time vs 8s on JVM. The tradeoffs are real but worth it for serverless workloads. #Java",

            // Spring
            "Spring Boot 3.3 native image compilation with GraalVM cut our container startup time from 8s to 180ms. Cold start problem in serverless is finally solved. #Spring",
            "Spring Cloud Config + Git backend = versioned, audited configuration for all microservices. Never go back to environment variable soup. #Spring #Microservices",
            "Spring WebFlux with Project Reactor gave us 3x more RPS on the same hardware compared to blocking Spring MVC for our streaming analytics API. #Spring",
            "Spring Security OAuth2 + Keycloak: setting up PKCE flows for our SPA was surprisingly painless with Spring Boot 3. The autoconfiguration is impressive. #Spring",
            "Spring Data Elasticsearch 5.x with the new RestClient — the old HLRC was deprecated for good reason. Migration was smooth with Spring Boot 3. #Spring #Elasticsearch",
            "Spring Batch processing 10M records nightly: chunk-oriented processing + skip policies + retry templates made it bulletproof. #Spring",
            "Spring Actuator + Micrometer + Prometheus: health checks, JVM metrics, and custom business metrics wired up in under 10 minutes. Love this ecosystem. #Spring",
            "Spring Retry with exponential backoff: when Elasticsearch or Kafka is temporarily unavailable, services gracefully wait and reconnect instead of crashing. #Spring",
            "HATEOAS in REST APIs: self-descriptive responses with hypermedia links let clients discover actions without reading docs. Spring HATEOAS makes this trivial. #Spring",
            "Spring Cloud Gateway as an API gateway for microservices: rate limiting, circuit breaking, and auth — all declarative in YAML. #Spring #Microservices",

            // Kafka
            "Apache Kafka handling 1.2 million messages/sec in our real-time analytics pipeline. Avro serialization + Schema Registry keeps payload sizes 60%% smaller than JSON. #Kafka",
            "Kafka consumer group rebalancing was killing our latency. Switched to static membership and eliminated the 30-second rebalance storms. #Kafka",
            "Kafka Streams vs. Flink for stateful stream processing: Kafka Streams wins on operational simplicity, Flink wins on complex event-time windowing. #Kafka",
            "Outbox pattern with Kafka: write to DB and Kafka atomically using Debezium CDC. No dual-write bugs, no lost messages. This is the correct way. #Kafka #Microservices",
            "Kafka topic partitioning strategy: hash on userId keeps user event ordering while giving us horizontal scale. 96 partitions across 3 brokers, zero hotspots. #Kafka",
            "Confluent Schema Registry with backward compatibility mode saved our team from breaking consumers when we evolved our Avro schemas. #Kafka",
            "Kafka Connect with Elasticsearch sink connector: streaming inserts at 50k events/sec with zero custom code. Connector ecosystem is underrated. #Kafka #Elasticsearch",
            "Implementing exactly-once semantics in Kafka: idempotent producers + transactional consumers. The 0.11+ protocol handles duplicates at the broker level. #Kafka",
            "Kafka lag monitoring with Prometheus + Grafana: when consumer lag spikes our alert fires before users notice any slowdown. Proactive ops beats reactive. #Kafka",
            "Apache Kafka's log compaction feature is perfect for maintaining the latest state of every entity — a built-in snapshot store any consumer can replay. #Kafka",
            "Kafka's zero-copy transfer (sendfile syscall) is why it outperforms traditional message brokers by 100x at scale. The storage model is genius. #Kafka",

            // Elasticsearch
            "Elasticsearch full-text search with BM25 scoring + custom field boosting gives better relevance than plain keyword matching. Tuning the index mapping matters a lot. #Elasticsearch",
            "Elasticsearch index lifecycle management (ILM): hot-warm-cold-delete tiers cut our storage costs by 70%% for time-series data. Essential for production. #Elasticsearch",
            "Elasticsearch aggregations for real-time analytics: date histograms + nested bucket aggs answer business questions in <50ms on 500M documents. #Elasticsearch",
            "Elasticsearch vector search with HNSW index: combining BM25 text relevance and cosine similarity for hybrid semantic + keyword search. The future of search. #Elasticsearch",
            "Running a 3-node Elasticsearch cluster on Kubernetes: dedicated master, data, and coordinating nodes with persistent volumes. Zero downtime rolling upgrades. #Elasticsearch",
            "Elasticsearch cross-cluster replication (CCR) for active-active multi-region: writes go to primary, reads served locally. 99.99%% availability achieved. #Elasticsearch",
            "Spring Data Elasticsearch repository pattern: define an interface and get paginated, sorted queries for free. HATEOAS makes the REST API self-describing. #Elasticsearch #Spring",
            "Elasticsearch painless scripting for runtime fields: add computed fields at query time without re-indexing. Perfect for A/B testing ranking algorithms. #Elasticsearch",
            "Elasticsearch alias + blue-green index deployments: reindex, validate, then flip the alias atomically for zero search downtime. #Elasticsearch",

            // Microservices
            "Microservices anti-pattern: sharing a database between services. We spent 6 months untangling tightly coupled schemas. Domain-driven boundaries matter. #Microservices",
            "Service mesh vs. API gateway — not either/or. Istio handles east-west traffic, Kong handles north-south. Both are essential in our microservices platform. #Microservices",
            "CQRS + event sourcing is overkill for most microservices. Use it only when you genuinely need audit trails or temporal queries. Complexity has a cost. #Microservices",
            "Our microservices observability stack: OpenTelemetry for traces, Prometheus for metrics, Loki for logs. The trifecta that saved our on-call team. #Microservices",
            "Circuit breakers with Resilience4j saved us from cascading failures during last week's Elasticsearch outage. Every microservice needs one. #Microservices",
            "Deploying 40+ microservices with a single Helm chart umbrella — Kubernetes namespaces + ArgoCD GitOps gives us one-command rollbacks. #Microservices #DevOps",
            "The Saga pattern for distributed transactions across microservices: choreography via Kafka events keeps services decoupled without a central coordinator. #Microservices #Kafka",
            "Microservices health checks with Spring Actuator: liveness (is the process alive?) and readiness (can it serve traffic?) are different concerns. K8s needs both. #Microservices",

            // Cross-topic
            "Real-time data pipeline: Twitter stream → Kafka (Avro) → kafka-to-elastic consumer → Elasticsearch. Spring Boot glues it all together beautifully. #Kafka #Elasticsearch",
            "Event-driven architecture with Kafka decouples producers from consumers — the twitter-to-kafka service doesn't need to know Elasticsearch exists. Pure CQRS. #Microservices",
            "Avro binary encoding vs JSON: same tweet payload shrinks from 175 bytes to 70 bytes — 60%% reduction. At 10k msgs/sec that's 90GB saved per day. #Kafka",
            "Spring Cloud Config Server backed by a Git repository: every config change is a commit, every rollback is a git revert. GitOps for microservices config. #Spring",
            "Docker Compose for local development: one command spins up Kafka, Zookeeper, Schema Registry, Elasticsearch cluster, and all Spring Boot microservices. #DevOps",
            "Real-time analytics dashboard powered by Elasticsearch aggregations served through Spring Boot REST API — query latency under 80ms for 1 billion indexed documents. #Elasticsearch #Spring"
    );

    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "mock-twitter-stream-thread");
        t.setDaemon(true);
        return t;
    });

    @Override
    public void start() throws TwitterException {
        final String[] keywords = config.getTwitterKeywords().toArray(new String[0]);
        final long sleepTimeMs = config.getMockSleepMs();

        if (keywords.length == 0) {
            log.warn("No twitter keywords configured — mock stream will not start.");
            return;
        }

        log.info("Starting mock twitter stream for keywords: {}", String.join(", ", keywords));

        executor.scheduleWithFixedDelay(() -> {
            try {
                String json = buildTweetJson();
                Status status = TwitterObjectFactory.createStatus(json);
                listener.onStatus(status);
            } catch (TwitterException te) {
                log.error("Error creating twitter status from mock JSON", te);
            } catch (Exception e) {
                log.error("Unexpected error in mock twitter stream", e);
            }
        }, 0, Math.max(1, sleepTimeMs), TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down mock twitter stream executor...");
        executor.shutdownNow();
    }

    private String buildTweetJson() {
        String createdAt = ZonedDateTime.now().format(DATE_FORMATTER);
        long id     = ThreadLocalRandom.current().nextLong(1_000_000L, Long.MAX_VALUE);
        long userId = ThreadLocalRandom.current().nextLong(100_001L, 200_000L);
        String text = TWEET_TEMPLATES.get(
                ThreadLocalRandom.current().nextInt(TWEET_TEMPLATES.size())
        );
        return "{" +
                "\"created_at\":\"" + jsonEscape(createdAt) + "\"," +
                "\"id\":"            + id                   + "," +
                "\"text\":\""        + jsonEscape(text)      + "\"," +
                "\"user\":{\"id\":"  + userId               + "}" +
                "}";
    }

    private String jsonEscape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (char c : s.toCharArray()) {
            switch (c) {
                case '\\': sb.append("\\\\"); break;
                case '"':  sb.append("\\\""); break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:   sb.append(c);
            }
        }
        return sb.toString();
    }
}
