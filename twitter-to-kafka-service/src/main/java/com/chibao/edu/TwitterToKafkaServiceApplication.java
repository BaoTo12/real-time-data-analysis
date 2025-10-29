package com.chibao.edu;

import com.chibao.edu.init.StreamInitializer;
import com.chibao.edu.runner.StreamRunner;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication(scanBasePackages = "com.chibao.edu")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TwitterToKafkaServiceApplication implements CommandLineRunner {

    StreamRunner streamRunner;
    StreamInitializer streamInitializer;

    public static void main(String[] args) {
        log.info("Starting TwitterToKafkaServiceApplication...");
        SpringApplication.run(TwitterToKafkaServiceApplication.class, args);
    }

    // TODO: there are three choices to init logic when application is created
    // ? Option1: use PostConstruct annotation that will run on every bean after the bean is created and all dependencies are injected
    // ? Option2: Application Listener and EventListener that runs on a certain event, such as context refresh, ready
    // * ContextRefreshedEvent — published when ApplicationContext.refresh() completes (all singleton beans initialized).
    // * ApplicationStartedEvent (after context refreshed)
    // ? Option3: CommandLineRunner / ApplicationRunner that will be run after ApplicationStartedEvent and ApplicationReadyEvent

    @Override
    public void run(String... args) throws Exception {
        log.info("Application start ......");
        try {
            streamInitializer.init();
            streamRunner.start();
        } catch (Exception e) {
            log.error("Error starting TwitterToKafkaServiceApplication: {}", e.getMessage(), e);
            throw e;
        }
    }
}
