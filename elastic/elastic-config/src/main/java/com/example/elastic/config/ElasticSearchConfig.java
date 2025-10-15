package com.example.elastic.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.ElasticsearchTransport;
import com.chibao.edu.config.ElasticConfigData;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@RequiredArgsConstructor
// ? Scan this package for repository interfaces that extend ElasticsearchRepository or related interfaces.
@EnableElasticsearchRepositories(basePackages = "com.chibao.edu.elastic")
public class ElasticSearchConfig extends ElasticsearchConfiguration {
    private final ElasticConfigData elasticConfigData;

    @Bean
    @Override
    @NonNull
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(elasticConfigData.getConnectionUrl())
                .withConnectTimeout(elasticConfigData.getConnectionTimeoutMs())
                .withSocketTimeout(elasticConfigData.getSocketTimeoutMs())
                .build();
    }

    // ? ElasticsearchClient is the main object you use in your code to talk to an Elasticsearch server.
    @Bean
    public ElasticsearchOperations elasticsearchClient() {
        return new ElasticsearchTemplate((ElasticsearchClient) clientConfiguration());
    }
}
/*
* ElasticsearchOperations
     ↓
* ElasticsearchTemplate (implementation)
     ↓
* ElasticsearchClient (tầng thấp hơn)
     ↓
* ElasticsearchTransport
     ↓
* HTTP REST to Elasticsearch server
* **/