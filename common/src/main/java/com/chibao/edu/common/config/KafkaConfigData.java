package com.chibao.edu.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "kafka-config")
public class KafkaConfigData {
    private String bootstrapServers;
    private String schemaRegistryUrlKey;
    private String schemaRegistryUrl;
    private String topicName;
    private List<String> topicNamesToCreate;
    private Integer numOfPartitions;
    private Short replicationFactor;
}

// ? Definition of Kafka Schema Registry
// ? What problems it solves
// * without schema registry these problems can occur
// * 1. Producers can send messages that break consumers
// * 2. New message schema breaks older consumers
// ? How does it solve these
// * Schema Registry is a small separate service that stores and shapes the "format" of our messages
// * When you register your schema to this registry it will return a ID for that schema
// ? How does it work?
// * 1. You define a schema for a message type (Avro/Protobuf/JSON Schema).
// * 2. You register that schema in the registry (REST API). Registry returns an ID (small integer).
// * 3. Producer: when sending a message, the serializer asks the registry for the schema ID and writes the ID + binary payload to Kafka (not the full schema).
// * 4. Consumer: when reading, the deserializer reads the schema ID, fetches the schema from the registry (cached), and decodes the payload into a usable object.
// * 5. Evolution: when you change the schema, the registry can enforce compatibility rules (backward, forward, full). If the new schema breaks rules, the registry rejects it.

