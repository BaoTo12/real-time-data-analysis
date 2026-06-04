package com.chibao.edu.init.impl;

import com.chibao.edu.common.config.KafkaConfigData;
import com.chibao.edu.init.StreamInitializer;
import com.chibao.edu.common.kafka.admin.client.KafkaAdminClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KafkaStreamInitializer implements StreamInitializer {
    KafkaConfigData kafkaConfigData;
    KafkaAdminClient kafkaAdminClient;

    @Override
    public void init() {
        kafkaAdminClient.createTopic();
        kafkaAdminClient.checkSchemaRegistry();
        log.info("Topics with name {} is ready for operations!", kafkaConfigData.getTopicNamesToCreate().toArray());

    }
}
