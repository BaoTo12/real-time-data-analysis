package com.chibao.edu.elastic.query.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.chibao.edu")
public class ElasticQueryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElasticQueryServiceApplication.class, args);
    }
}
