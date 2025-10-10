package com.chibao.edu.runner.impl;

import com.chibao.edu.config.TwitterToKafkaServiceConfigData;
import com.chibao.edu.listener.TwitterKafkaStatusListener;
import com.chibao.edu.runner.StreamRunner;
import jakarta.annotation.PreDestroy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import twitter4j.FilterQuery;
import twitter4j.TwitterException;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;

import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StreamRunnerImpl implements StreamRunner {
    TwitterToKafkaServiceConfigData twitterToKafkaServiceConfigData;
    // this listener gets attached to twitter stream. its job is to react to events from the stream
    TwitterKafkaStatusListener twitterKafkaStatusListener;
    // the action twitter object that connects and receives data from Twitter streaming API
    @NonFinal
    TwitterStream twitterStream;


    @Override
    public void start() throws TwitterException {
        twitterStream = new TwitterStreamFactory().getInstance();
        twitterStream.addListener(twitterKafkaStatusListener);
        extracted();

    }

    private void extracted() {
        String[] keywords = twitterToKafkaServiceConfigData.getTwitterKeywords().toArray(new String[0]);
        FilterQuery filterQuery = new FilterQuery(keywords);
        twitterStream.filter(filterQuery);
        log.info("Started filtering twitter streaming data for keywords: {}", Arrays.toString(keywords));
    }

    @PreDestroy
    public void shutdown(){
        if (twitterStream != null){
            log.info("Closing twitter stream!");
            twitterStream.shutdown();
        }
    }
}
