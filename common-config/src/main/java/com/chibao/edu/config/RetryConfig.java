package com.chibao.edu.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.backoff.ExponentialRandomBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
@RequiredArgsConstructor
public class RetryConfig {
    private final RetryConfigData retryConfigData;

    @Bean
    public RetryTemplate retryTemplate(){
        RetryTemplate retryTemplate = new RetryTemplate();

        // ? ExponentialBackOffPolicy: Increase wait time for each entry attempt
        ExponentialBackOffPolicy exponentialBackOffPolicy = new ExponentialBackOffPolicy();
        // ? Đây là cơ chế “chờ tăng dần theo cấp số nhân”
        /*
        * Lần 1: 1s
            Lần 2: 2s
            Lần 3: 4s
            Lần 4: 8s
            Lần 5: 10s (đạt max)
            -------
            * Lần 1: 1s
            Lần 2: 2s
            Lần 3: 4s
            Lần 4: 8s
            Lần 5: 10s (đạt max)
        * *
        * **/
        exponentialBackOffPolicy.setInitialInterval(retryConfigData.getInitialIntervalMs());
        exponentialBackOffPolicy.setMaxInterval(retryConfigData.getMaxIntervalMs());
        exponentialBackOffPolicy.setMultiplier(retryConfigData.getMultiplier());


        retryTemplate.setBackOffPolicy(exponentialBackOffPolicy);

        // ? Retry policy — số lần thử tối đa
        SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy();
        simpleRetryPolicy.setMaxAttempts(retryConfigData.getMaxAttempts());

        retryTemplate.setRetryPolicy(simpleRetryPolicy);

        return  retryTemplate;
    }
}
