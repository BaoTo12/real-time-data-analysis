package com.chibao.edu.listener;

import com.chibao.edu.common.kafka.model.TwitterAvroModel;
import com.chibao.edu.common.config.KafkaConfigData;
import com.chibao.edu.common.kafka.producer.service.KafkaProducer;
import com.chibao.edu.transformer.TwitterStatusToAvroTransformer;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import twitter4j.Status;
import twitter4j.StatusAdapter;
@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TwitterKafkaStatusListener extends StatusAdapter {

    KafkaConfigData kafkaConfigData;
    KafkaProducer<Long, TwitterAvroModel> kafkaProducer;
    TwitterStatusToAvroTransformer twitterStatusToAvroTransformer;

    // TODO: Khi một tweet mới xuất hiện, Twitter4J sẽ gọi method:
    // ? Because we doc mock twitter service so we have to call this manually
    @Override
    public void onStatus(Status status) {
        log.info("Received status text {} sending to kafka topic {}",
                status.getText(), kafkaConfigData.getTopicName());
        TwitterAvroModel twitterAvroModel = twitterStatusToAvroTransformer.getTwitterAvroModelFromStatus(status);
        kafkaProducer.send(kafkaConfigData.getTopicName(), twitterAvroModel.getUserId(), twitterAvroModel);
    }
}
