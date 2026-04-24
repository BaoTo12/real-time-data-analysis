# Real-Time Data Analysis — Event-Driven Microservices

An event-driven microservices pipeline that ingests, processes, and indexes real-time Twitter data using Apache Kafka, Avro serialization, Elasticsearch, and Spring Boot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot, Spring Cloud Config |
| Messaging | Apache Kafka + Confluent Schema Registry |
| Serialization | Apache Avro (binary) |
| Search & Analytics | Elasticsearch |
| Containerization | Docker Compose + Google Jib |
| Build | Maven |

---

## Architecture

```
Twitter / Mock Data
        │
        ▼
twitter-to-kafka-service   →  Kafka (Avro)  →  kafka-to-elastic-service  →  Elasticsearch
                                                                                   │
                                                                                   ▼
                                                                        elastic-query-service (REST API)
```

All services pull configuration from a central **Spring Cloud Config Server** backed by a Git repository.

---

## Avro Serialization — 60% Smaller Payloads Than JSON

Messages on Kafka use **Apache Avro binary encoding** instead of JSON.

### TwitterAvroModel Schema

```json
{
  "namespace": "com.chibao.edu",
  "type": "record",
  "name": "TwitterAvroModel",
  "fields": [
    { "name": "userId",    "type": "long" },
    { "name": "id",        "type": "long" },
    { "name": "text",      "type": ["null", "string"] },
    { "name": "createdAt", "type": ["null", "long"] }
  ]
}
```

### Why Avro is Smaller

| Source of Savings | JSON | Avro Binary |
|---|---|---|
| Field names | Sent on every message (`"userId":`, `"text":`, …) | **Omitted** — schema shared via Schema Registry |
| Integers | ASCII digits (e.g. `1745420561000` = 13 bytes) | ZigZag varint (≈ 7 bytes) |
| Structural overhead | `{`, `}`, `"`, `,` characters | **Zero** |

### Measured Results (same tweet, same data)

| Format | Payload Size |
|---|---|
| JSON | ~175 bytes |
| Avro binary | ~70 bytes |
| **Reduction** | **~60%** |

> Open `benchmark.html` in a browser to run the calculation live against your own data using the exact Avro encoding algorithm (ZigZag varint).

### Impact at Scale (10,000 messages/sec)

| Metric | Value |
|---|---|
| JSON bandwidth | ~1.75 MB/s |
| Avro bandwidth | ~0.70 MB/s |
| **Saved per second** | **~1.05 MB/s** |
| **Saved per day** | **~90 GB/day** |

---

## Modules

```
real-time-data-analysis/
├── config-server/              # Spring Cloud Config Server
├── app-config-data/            # Shared config properties
├── common-config/              # Shared Spring beans (retry, etc.)
├── common-util/                # Utility helpers
├── kafka/
│   ├── kafka-admin/            # Topic creation
│   ├── kafka-model/            # Avro schema + generated classes
│   ├── kafka-producer/         # Generic Kafka producer
│   └── kafka-consumer/         # Generic Kafka consumer
├── twitter-to-kafka-service/   # Ingest tweets → publish to Kafka
├── kafka-to-elastic-service/   # Consume Kafka → index to Elasticsearch
├── elastic/
│   ├── elastic-config/         # ES client config
│   ├── elastic-model/          # ES document models
│   ├── elastic-index-client/   # Write to ES
│   └── elastic-query-client/   # Query from ES
└── elastic-query-service/      # REST API over Elasticsearch
```

---

## Running the Project

### Prerequisites

- Java 17+
- Maven 3.6+
- Docker Desktop

### 1. Build

```bash
mvn clean install -DskipTests
```

### 2. Build Docker Images (Jib)

```bash
mvn compile jib:dockerBuild
```

### 3. Configure Environment

Create `docker-compose/.env`:

```env
KAFKA_VERSION=7.5.0
ELASTIC_VERSION=8.11.1
SERVICE_VERSION=latest
GLOBAL_NETWORK=application
ENCRYPT_KEY=your-strong-secret-key
```

### 4. Start All Services

```bash
cd docker-compose
docker-compose -f common.yml -f elastic_cluster.yml -f kafka_cluster.yml -f services.yml up -d
```

### 5. Verify

```bash
# Check Kafka topics
docker exec -it docker-compose-kcat-1 kcat -b kafka-broker-1:9092 -L

# Query Elasticsearch via REST
curl http://localhost:8183/elastic-query-service/documents
```

---

## Key Design Decisions

**CQRS** — Write path (twitter-to-kafka → Elasticsearch indexing) and read path (elastic-query-service REST API) are fully separated.

**Avro + Schema Registry** — Schema is registered once; producers and consumers share it by ID. No schema bytes travel in the message payload.

**Spring Cloud Config** — All service configs are externalized and version-controlled in `config-server-repository/`. Services fetch config on startup.

**Google Jib** — Builds optimized Docker images without a Dockerfile, directly from Maven.

---

## License

MIT
