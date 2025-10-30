# Real-Time Data Analysis with Microservices

## Project Overview

This project demonstrates a real-time data analysis pipeline built with Spring Boot microservices, Apache Kafka, and Elasticsearch. It ingests data (simulated Twitter tweets), processes it through a Kafka messaging queue, and stores it in Elasticsearch for efficient querying and analysis. The architecture is designed for scalability, resilience, and maintainability, showcasing a robust approach to handling streaming data.

## Architecture

The project implements a robust, event-driven architecture designed for real-time data processing and analysis. Data flows through a series of microservices, each specializing in a particular stage of the pipeline, ensuring modularity, scalability, and fault tolerance. All services and their underlying infrastructure are containerized and orchestrated using Docker Compose.

**Data Flow:**

1.  **Twitter Stream (or Mock Data Generation):** The process begins with the ingestion of Twitter data. The `twitter-to-kafka-service` either connects to the live Twitter API (if configured) or generates mock tweets based on predefined keywords.
2.  **Twitter-to-Kafka Service:** This microservice acts as the entry point for data into the pipeline. It consumes tweets and publishes them as Avro-serialized messages to a designated Kafka topic (`twitter-topic`).
3.  **Kafka Cluster:** Serving as a high-throughput, fault-tolerant message broker, the Kafka cluster (comprising multiple brokers, Zookeeper for coordination, and Schema Registry for Avro schema management) reliably stores the incoming tweet data.
4.  **Kafka-to-Elastic Service:** This microservice subscribes to the `twitter-topic` in Kafka. It consumes the Avro-serialized tweet messages, deserializes them, performs any necessary transformations, and then indexes the processed data into an Elasticsearch cluster.
5.  **Elasticsearch Cluster:** The indexed tweet data is stored in Elasticsearch, enabling fast full-text search, complex queries, and real-time analytics.
6.  **Elastic Query Service:** This microservice provides a RESTful API layer that allows external applications or users to query the data stored in the Elasticsearch cluster. It acts as a gateway for data retrieval and analysis.

**Key Components:**

*   **Twitter-to-Kafka Service:** Ingests real-time (or mock) Twitter data based on predefined keywords and publishes it to a Kafka topic.
*   **Kafka Cluster:** A distributed streaming platform that acts as a central nervous system for data pipelines, ensuring reliable data transfer between services. Includes Kafka Brokers, Zookeeper, and Schema Registry.
*   **Kafka-to-Elastic Service:** Consumes data from Kafka topics, transforms it, and indexes it into Elasticsearch.
*   **Elasticsearch Cluster:** A distributed, RESTful search and analytics engine capable of storing and querying large volumes of data quickly.
*   **Elastic Query Service:** Provides a RESTful API to query the data stored in Elasticsearch.
*   **Spring Cloud Config Server:** Centralized configuration management for all microservices, allowing dynamic updates without service restarts.

## Technologies Used

*   **Spring Boot:** Chosen for its rapid application development capabilities, embedded servers, and convention-over-configuration approach, enabling quick setup and deployment of microservices.
*   **Spring Cloud:** Utilized for building robust distributed systems. Specifically, Spring Cloud Config provides externalized and centralized configuration management, crucial for microservice environments.
*   **Apache Kafka:** Employed as the central nervous system for the data pipeline due to its high-throughput, fault-tolerant, and scalable nature for handling real-time data streams.
*   **Apache Avro:** Selected for efficient, compact, and schema-evolvable data serialization within Kafka messages. This ensures data compatibility and integrity across different service versions.
*   **Elasticsearch:** Used as a powerful, distributed, and highly scalable search and analytics engine for storing, indexing, and querying the ingested Twitter data in real-time.
*   **Docker & Docker Compose:** Essential for containerizing all microservices and infrastructure components (Kafka, Elasticsearch, Zookeeper, Schema Registry). Docker Compose simplifies the orchestration and deployment of the multi-container application locally.
*   **Maven:** The primary build automation tool, managing project dependencies, compilation, and packaging of all modules.
*   **Lombok:** A library used to reduce boilerplate code (e.g., getters, setters, constructors) in Java classes, improving code readability and conciseness.

## Modules

The project is structured into several Maven modules, each with a specific responsibility:

*   `app-config-data`: Houses application-wide configuration properties and constants, providing a centralized place for common settings that can be consumed by other services.
*   `common-config`: Contains common Spring configurations, such as retry mechanisms, security settings, or client configurations, that are shared and reused across various microservices to maintain consistency.
*   `common-util`: A utility module for general-purpose helper classes and functions that are not specific to any particular domain or service but are useful across the project.
*   `config-server`: The dedicated Spring Cloud Config Server application, responsible for serving externalized configuration to all other microservices from a Git-backed repository (`config-server-repository`).
*   `elastic`: A parent module that groups all Elasticsearch-related sub-modules.
    *   `elastic-config`: Defines configuration properties and beans for setting up and connecting to the Elasticsearch client.
    *   `elastic-index-client`: Provides an API and implementation for indexing (writing) data into Elasticsearch.
    *   `elastic-model`: Contains the data transfer objects (DTOs) and domain models that represent the structure of documents stored in Elasticsearch.
    *   `elastic-query-client`: Offers an API and implementation for querying data from Elasticsearch.
*   `elastic-query-service`: A microservice that exposes a RESTful API, allowing external clients to perform queries against the Elasticsearch cluster and retrieve processed data.
*   `elastic-query-service-common`: Holds common interfaces, DTOs, and utility classes specifically used by the `elastic-query-service`.
*   `kafka`: A parent module that groups all Kafka-related sub-modules.
    *   `kafka-admin`: Contains components for administrative tasks related to Kafka, such as programmatically creating and managing Kafka topics.
    *   `kafka-consumer`: Provides a generic and reusable Kafka consumer implementation that can be extended by services needing to read from Kafka topics.
    *   `kafka-model`: Defines the Avro schema and generated classes (`TwitterAvroModel`) for messages exchanged over Kafka, ensuring type safety and schema evolution.
    *   `kafka-producer`: Offers a generic and reusable Kafka producer implementation for sending messages to Kafka topics.
*   `kafka-to-elastic-service`: A core microservice in the pipeline responsible for consuming messages from Kafka topics, transforming them, and persisting them into the Elasticsearch cluster.
*   `twitter-to-kafka-service`: The microservice responsible for ingesting data. It either connects to the Twitter streaming API or generates mock tweets, then publishes these tweets as messages to a Kafka topic.

## Setup and Installation

### Prerequisites

*   **Java 17+**
*   **Maven 3.6+**
*   **Docker Desktop** (or Docker Engine and Docker Compose)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/real-time-data-analysis.git
cd real-time-data-analysis
```

### 2. Build the Project

Build all Maven modules, compiling the code, running tests, and packaging them into JAR files. The `-DskipTests` flag is used here to bypass test execution during the build, which can speed up the initial setup. For a full build including tests, remove this flag.

```bash
mvn clean install -DskipTests
```

### 3. Prepare Docker Images (using Jib)

This project uses Jib, a Google-developed tool, to build optimized Docker and OCI images for Java applications without a Dockerfile. Jib integrates directly with Maven, simplifying the containerization process.

To build the Docker images for all microservices, ensure your Docker daemon is running, and then execute the following Maven command from the project root:

```bash
mvn compile jib:dockerBuild
```

This command will:
*   Compile all modules.
*   Build Docker images for each microservice (e.g., `twitter-to-kafka-service:latest`, `kafka-to-elastic-service:latest`, etc.) based on the configurations in their respective `pom.xml` files.
*   Push these images to your local Docker daemon.

Alternatively, if you want to build images for a specific service, navigate to its directory and run:

```bash
cd twitter-to-kafka-service
mvn compile jib:dockerBuild
cd ..
```

Repeat for `kafka-to-elastic-service`, `elastic-query-service`, and `config-server` if you prefer to build them individually.

Build the entire project: 
```java
mvn clean install -pl twitter-to-kafka-service,kafka-to-elastic-service,elastic-query-service,config-server jib:dockerBuild
```

### 4. Configure Environment Variables

Create a `.env` file in the `docker-compose` directory. This file will hold environment variables used by Docker Compose to configure service versions and sensitive information. The `ENCRYPT_KEY` is particularly important for the Config Server to decrypt sensitive properties; ensure it's a strong, unique key.

```
KAFKA_VERSION=7.5.0
ELASTIC_VERSION=8.11.1
SERVICE_VERSION=latest
GLOBAL_NETWORK=application
ENCRYPT_KEY=aVeryStrongAndSecretKeyForConfigServerEncryption123! # Replace with a strong, unique secret key
```

### 5. Start Infrastructure and Services

Navigate to the `docker-compose` directory and start all services. The command uses multiple `-f` flags to combine configurations from different Docker Compose files, allowing for modular definition of the infrastructure:

*   `common.yml`: Defines shared network configurations.
*   `elastic_cluster.yml`: Configures the Elasticsearch cluster.
*   `kafka_cluster.yml`: Sets up the Kafka ecosystem (Zookeeper, Kafka brokers, Schema Registry, kcat).
*   `services.yml`: Defines and links the custom microservices (`config-server`, `twitter-to-kafka-service`, `kafka-to-elastic-service`, `elastic-query-service`).

```bash
cd docker-compose
docker-compose -f common.yml -f elastic_cluster.yml -f kafka_cluster.yml -f services.yml up -d
```

This will start the following components:
*   Zookeeper
*   Kafka Brokers (3 instances)
*   Schema Registry
*   Elasticsearch Cluster (3 instances)
*   Spring Cloud Config Server
*   Twitter-to-Kafka Service
*   Kafka-to-Elastic Service
*   Elastic Query Service

It might take a few minutes for all services to start up and become healthy. You can check the status of all running containers with `docker-compose ps`.

## Usage

### 1. Verify Kafka Topics

To ensure the Kafka cluster is running and the `twitter-topic` has been created, you can use the `kcat` utility (which is included as a service in the `docker-compose` setup). This command executes `kcat` inside its container to list all available topics on the Kafka brokers.

```bash
docker exec -it docker-compose-kcat-1 kcat -b kafka-broker-1:9092 -L
```

**Expected Output:** You should see `twitter-topic` listed among the Kafka topics, indicating successful topic creation by the `kafka-admin` module.

### 2. Observe Data Flow

The `twitter-to-kafka-service` will start producing mock tweets (if `enable-mock-tweets` is true in its configuration) to the `twitter-topic`. The `kafka-to-elastic-service` will consume these messages and index them into Elasticsearch.

You can view the logs of individual services to observe their activity:

```bash
docker-compose logs -f twitter-to-kafka-service
docker-compose logs -f kafka-to-elastic-service
```

### 3. Query Data from Elasticsearch

The `elastic-query-service` exposes a REST API to query the indexed data. You can use `curl` or any API client (like Postman, Insomnia) to interact with it.

**Example: Fetch all documents**

```bash
curl -X GET "http://localhost:8183/elastic-query-service/documents"
```

**Expected (Partial) JSON Output:**

```json
[
  {
    "id": "1234567890",
    "userId": "123",
    "text": "This is a mock tweet about Java and Microservices.",
    "createdAt": "2023-10-26T10:00:00Z"
  },
  {
    "id": "0987654321",
    "userId": "456",
    "text": "Kafka streams are powerful for real-time data.",
    "createdAt": "2023-10-26T10:05:00Z"
  }
]
```

*(Note: The actual output will depend on the mock tweets generated and indexed.)*

**Example: Search documents by text (if implemented in the service)**

If the `elastic-query-service` supports searching by text, you might use an endpoint like:

```bash
curl -X GET "http://localhost:8183/elastic-query-service/documents?searchText=Java"
```

## Configuration

The project leverages **Spring Cloud Config Server** for centralized and version-controlled configuration management. This approach allows all microservices to fetch their configurations from a single, external source, promoting consistency and enabling dynamic updates without requiring service redeployments.

**How it works:**

1.  The `config-server` microservice starts up and loads configuration properties from a local Git repository, `config-server-repository` (which is mounted into its Docker container).
2.  Each client microservice (e.g., `twitter-to-kafka-service`, `kafka-to-elastic-service`) is configured to connect to the `config-server` on startup.
3.  When a client service starts, it requests its configuration from the `config-server`. The `config-server` then serves the appropriate `.yml` file based on the client's application name.

**Configuration File Naming Convention:**

Configuration files within the `config-server-repository` follow a specific naming convention:

*   `config-client.yml`: Contains global default configurations applicable to all services.
*   `config-client-<service-name>.yml`: Contains service-specific configurations that override or extend the global defaults. For example, `config-client-twitter_to_kafka.yml` holds configurations unique to the `twitter-to-kafka-service`.

This setup allows for easy management of different environments (e.g., development, staging, production) and dynamic changes to application properties.

## Future Enhancements

This project provides a solid foundation for real-time data analysis. Here are some potential enhancements to further extend its capabilities and robustness:

*   **Integrate with a real Twitter API for live data ingestion:** Currently, the `twitter-to-kafka-service` can use mock data. Integrating with the actual Twitter API would enable processing of live, real-world tweet streams, providing more dynamic and relevant data for analysis.
*   **Implement a frontend application to visualize the real-time data:** Developing a web-based frontend (e.g., using React, Angular, or Vue.js) would allow for interactive visualization of the data stored in Elasticsearch, such as dashboards, trend analysis, or geographical mapping of tweets.
*   **Add authentication and authorization to the services:** Secure the REST APIs of the `elastic-query-service` and potentially other services using Spring Security, OAuth2, or JWT to control access and protect sensitive data.
*   **Introduce a monitoring and alerting stack (e.g., Prometheus, Grafana):** Implement comprehensive monitoring for all microservices and infrastructure components to track performance metrics, identify bottlenecks, and set up alerts for anomalies or failures.
*   **Implement more sophisticated data transformations and analytics:** Enhance the `kafka-to-elastic-service` or introduce new processing services to perform advanced analytics, sentiment analysis, topic modeling, or entity extraction on the incoming tweet data before indexing.
*   **Improve error handling and resilience with circuit breakers and retry mechanisms:** Integrate patterns like Circuit Breaker (e.g., Resilience4j, Hystrix) and more advanced retry logic to make the microservices more resilient to transient failures and improve overall system stability.
*   **Container Orchestration with Kubernetes:** Migrate from Docker Compose to Kubernetes for production-grade container orchestration, enabling advanced features like auto-scaling, self-healing, and more sophisticated deployment strategies.
*   **Implement Distributed Tracing:** Integrate a distributed tracing system (e.g., Zipkin, Jaeger) to gain better visibility into requests as they flow through multiple microservices, aiding in debugging and performance optimization.
*   **Add Unit and Integration Tests:** Develop a comprehensive suite of unit and integration tests for all modules and services to ensure code quality, prevent regressions, and facilitate future development.

## Contributing

Feel free to fork the repository, open issues, and submit pull requests.

## License

This project is licensed under the MIT License.
