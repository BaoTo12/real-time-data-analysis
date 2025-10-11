package com.chibao.edu.kafka.admin.client;

import com.chibao.edu.config.KafkaConfigData;
import com.chibao.edu.config.RetryConfigData;
import com.chibao.edu.kafka.admin.exception.KafkaClientException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.CreateTopicsResult;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.admin.TopicListing;
import org.springframework.http.HttpStatus;
import org.springframework.retry.RetryContext;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KafkaAdminClient {
    KafkaConfigData kafkaConfigData;
    RetryConfigData retryConfigData;
    AdminClient adminClient;
    RetryTemplate retryTemplate;
    WebClient webClient;


    // TODO: method to create topics for streaming
    public void createTopic() {
        // ? The result of Admin.createTopics(Collection)
        CreateTopicsResult createTopicsResult;
        try {
            createTopicsResult = retryTemplate.execute(this::doCreateTopics);
        } catch (Throwable e) {
            throw new KafkaClientException("Reached max number of retry for creating kafka topic(s)", e);
        }
        checkCreatedTopics();
    }

    // TODO: check all topics are created
    public void checkCreatedTopics() {
        Collection<TopicListing> topics = getTopics();
        int retryCount = 1;
        Integer maxRetryCount = retryConfigData.getMaxAttempts();
        int multiplier = retryConfigData.getMultiplier().intValue();
        Long sleepTimeMs = retryConfigData.getSleepTimeMs();
        for (String topic : kafkaConfigData.getTopicNamesToCreate()) {
            while (!isTopicToCreated(topics, topic)) {
                checkMaxRetry(retryCount++, maxRetryCount);
                sleep(sleepTimeMs);
                sleepTimeMs *= multiplier;
                topics = getTopics();
            }
        }
    }

    // TODO: Check the state of Schema Registry
    public void checkSchemaRegistry() {
        int retryCount = 1;
        int maxRetryCount = retryConfigData.getMaxAttempts();
        int multiplier = retryConfigData.getMultiplier().intValue();
        Long sleepTimeMs = retryConfigData.getSleepTimeMs();
        while (!getSchemaRegistryStatus().is2xxSuccessful()) {
            checkMaxRetry(retryCount++, maxRetryCount);
            sleep(sleepTimeMs);
            sleepTimeMs *= multiplier;
        }
    }


    private HttpStatus getSchemaRegistryStatus() {
        try {
            return (HttpStatus) webClient
                    .get()
                    .uri(kafkaConfigData.getSchemaRegistryUrl())
                    .exchangeToMono(response -> Mono.just(response.statusCode()))
                    .block();
        } catch (Exception e) {
            return HttpStatus.SERVICE_UNAVAILABLE;
        }
    }

    private void sleep(Long sleepTimeMs) {
        try {
            Thread.sleep(sleepTimeMs);
        } catch (InterruptedException e) {
            throw new KafkaClientException("Error while sleeping for waiting new created topics");
        }
    }

    private void checkMaxRetry(int retry, int maxRetry) {
        if (retry > maxRetry) {
            throw new KafkaClientException("Reached max retry for reading kafka topic(s)");
        }
    }

    private boolean isTopicToCreated(Collection<TopicListing> topics, String topicName) {
        if (topics == null) {
            return false;
        }
        return topics.stream().anyMatch(topic -> topic.name().equals(topicName));
    }

    private CreateTopicsResult doCreateTopics(RetryContext retryContext) {
        List<String> topicNames = kafkaConfigData.getTopicNamesToCreate();
        log.info("Creating {} topic(s), attempts {}", topicNames.size(), retryContext.getRetryCount());
        List<NewTopic> kafkaTopics = topicNames.stream().map(topic -> new NewTopic(
                topic.trim(),
                kafkaConfigData.getNumOfPartitions(),
                kafkaConfigData.getReplicationFactor()
        )).toList();
        return adminClient.createTopics(kafkaTopics);
    }

    // ? TopicListString: A listing of a topic in the cluster.
    private Collection<TopicListing> getTopics() {
        Collection<TopicListing> topics;
        try {
            topics = retryTemplate.execute(this::doGetTopics);
        } catch (Throwable e) {
            throw new KafkaClientException("Reached max number of retry for reading kafka Topic(s)", e);
        }
        return topics;
    }

    private Collection<TopicListing> doGetTopics(RetryContext retryContext) throws ExecutionException, InterruptedException {
        log.info("Reading Kafka topic {}, attempt {}",
                kafkaConfigData.getTopicNamesToCreate().toArray(), retryContext.getRetryCount());
        Collection<TopicListing> topics = adminClient.listTopics().listings().get();
        if (topics != null) {
            topics.forEach(topic -> log.info("Topic with name {}", topic.name()));
        }
        return topics;
    }
}
