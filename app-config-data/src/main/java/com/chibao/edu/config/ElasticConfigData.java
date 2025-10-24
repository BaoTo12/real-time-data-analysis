package com.chibao.edu.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "spring.elasticsearch")
public class ElasticConfigData {
    private String indexName;
    private String uris;
    private Integer connectionTimeout;
    private Integer socketTimeout;
}
