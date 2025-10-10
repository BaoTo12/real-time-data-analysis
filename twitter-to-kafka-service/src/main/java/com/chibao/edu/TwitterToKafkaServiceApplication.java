package com.chibao.edu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TwitterToKafkaServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TwitterToKafkaServiceApplication.class, args);
    }

    // TODO: there are three choices to init logic when application is created
    // ? Option1: use PostConstruct annotation that will run on every bean after the bean is created and all dependencies are injected
    // ? Option2: Application Listener and EventListener that runs on a certain event, such as context refresh, ready
    // * ContextRefreshedEvent — published when ApplicationContext.refresh() completes (all singleton beans initialized).
    // * ApplicationStartedEvent (after context refreshed)
    // ? Option3: CommandLineRunner / ApplicationRunner that will be run after ApplicationStartedEvent and ApplicationReadyEvent
}
