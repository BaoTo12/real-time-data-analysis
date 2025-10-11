package com.chibao.edu.kafka.admin.config;

import com.chibao.edu.config.KafkaConfigData;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

import java.util.Map;

/*
 * Kích hoạt Spring Retry trong ứng dụng.
 * Nó giúp ta có thể dùng annotation @Retryable và @Recover trong bất kỳ bean nào.
 * **/
@Configuration
@EnableRetry
@RequiredArgsConstructor
public class KafkaAdminConfig {
    private final KafkaConfigData kafkaConfigData;

    // ? AdminClient: manage and inspects brokers, topics and configurations
    @Bean
    public AdminClient adminClient(){
        return AdminClient.create(
                Map.of(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, kafkaConfigData.getBootstrapServers())
        );
    }
}
