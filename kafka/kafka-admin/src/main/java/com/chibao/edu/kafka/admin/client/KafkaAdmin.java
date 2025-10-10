package com.chibao.edu.kafka.admin.client;

import com.chibao.edu.config.KafkaConfigData;
import com.chibao.edu.config.RetryConfigData;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KafkaAdmin {
    KafkaConfigData kafkaConfigData;
    RetryConfigData retryConfigData;
    AdminClient adminClient;
    RetryTemplate retryTemplate;
}
