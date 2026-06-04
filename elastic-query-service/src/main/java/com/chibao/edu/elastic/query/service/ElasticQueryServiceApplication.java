package com.chibao.edu.elastic.query.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication(scanBasePackages = "com.chibao.edu")
@EnableElasticsearchRepositories(basePackages = "com.chibao.edu.common.elastic.query.repository")
@Import(com.chibao.edu.common.elastic.config.ElasticSearchConfig.class)
public class ElasticQueryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElasticQueryServiceApplication.class, args);
    }
}
