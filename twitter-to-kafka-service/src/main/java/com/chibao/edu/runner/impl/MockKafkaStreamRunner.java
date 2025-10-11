package com.chibao.edu.runner.impl;

import com.chibao.edu.config.TwitterToKafkaServiceConfigData;
import com.chibao.edu.exception.TwitterToKafkaServiceException;
import com.chibao.edu.listener.TwitterKafkaStatusListener;
import com.chibao.edu.runner.StreamRunner;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import twitter4j.Status;
import twitter4j.TwitterException;
import twitter4j.TwitterObjectFactory;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Primary
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "twitter-to-kafka-service.enable-mock-tweets", havingValue = "true")
public class MockKafkaStreamRunner implements StreamRunner {
    private final TwitterToKafkaServiceConfigData config;
    private final TwitterKafkaStatusListener listener;

    // ? sample words to create tweets
    private static final String[] WORDS = new String[]{
            "Lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
            "adipiscing", "elit", "Maecenas", "porttitor", "congue",
            "massa", "Fusce", "posuere", "magna", "sed", "pulvinar",
            "ultricies", "purus", "lectus", "malesuada", "libero"
    };
    private static final String TWITTER_STATUS_DATE_FORMAT = "EEE MMM dd HH:mm:ss zzz yyyy";
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern(TWITTER_STATUS_DATE_FORMAT, Locale.ENGLISH);

    // ?
    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "mock-twitter-stream-thread");
        t.setDaemon(true);
        return t;
    });

    @Override
    public void start() throws TwitterException {
        final String[] keywords = config.getTwitterKeywords().toArray(new String[0]);
        final int minTweetLength = config.getMockMinTweetLength();
        final int maxTweetLength = config.getMockMaxTweetLength();
        final long sleepTimeMs = config.getMockSleepMs();

        if (keywords.length == 0) {
            log.warn("No twitter keywords configured - mock stream will not start.");
            return;
        }
        if (minTweetLength < 1 || maxTweetLength < minTweetLength) {
            throw new TwitterToKafkaServiceException("Invalid mock tweet length configuration.");
        }

        log.info("Starting mock filtering twitter streams for keywords {}", String.join(", ", keywords));

        // schedule at fixed delay so we respect sleepTimeMs between tasks
        executor.scheduleWithFixedDelay(() -> {
            try {
                String formattedTweetAsRawJson = getFormattedTweet(keywords, minTweetLength, maxTweetLength);
                // TODO: parse JSON thành Status
                Status status = TwitterObjectFactory.createStatus(formattedTweetAsRawJson);
                listener.onStatus(status);
            } catch (TwitterException te) {
                log.error("Error creating twitter status from mock JSON", te);
            } catch (Exception e) {
                log.error("Unexpected error in mock twitter stream", e);
            }
        }, 0, Math.max(1, sleepTimeMs), TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down mock twitter stream executor...");
        executor.shutdownNow();
    }

    // TODO: build JSON (string)
    private String getFormattedTweet(String[] keywords, int minTweetLength, int maxTweetLength) {
        String createdAt = ZonedDateTime.now().format(DATE_FORMATTER);
        long id = ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE);
        String text = getRandomTweetContent(keywords, minTweetLength, maxTweetLength);
        long userId = ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE);

        // Build JSON with proper escaping for text fields

        return "{" +
                "\"created_at\":\"" + jsonEscape(createdAt) + "\"," +
                "\"id\":" + id + "," +
                "\"text\":\"" + jsonEscape(text) + "\"," +
                "\"user\":{\"id\":" + userId + "}" +
                "}";
    }

    private String getRandomTweetContent(String[] keywords, int minTweetLength, int maxTweetLength) {
        int tweetLength = ThreadLocalRandom.current().nextInt(minTweetLength, maxTweetLength + 1);
        StringBuilder tweet = new StringBuilder(tweetLength * 6);
        for (int i = 0; i < tweetLength; i++) {
            tweet.append(WORDS[ThreadLocalRandom.current().nextInt(WORDS.length)]);
            if (i == tweetLength / 2 && keywords.length > 0) {
                tweet.append(' ')
                        .append(keywords[ThreadLocalRandom.current().nextInt(keywords.length)]);
            }
            if (i < tweetLength - 1) tweet.append(' ');
        }
        return tweet.toString();
    }

    private String jsonEscape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (char c : s.toCharArray()) {
            switch (c) {
                case '\\':
                    sb.append("\\\\");
                    break;
                case '"':
                    sb.append("\\\"");
                    break;
                case '\n':
                    sb.append("\\n");
                    break;
                case '\r':
                    sb.append("\\r");
                    break;
                case '\t':
                    sb.append("\\t");
                    break;
                default:
                    sb.append(c);
            }
        }
        return sb.toString();
    }
}
