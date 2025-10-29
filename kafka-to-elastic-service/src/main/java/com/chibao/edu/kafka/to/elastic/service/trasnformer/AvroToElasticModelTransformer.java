package com.chibao.edu.kafka.to.elastic.service.trasnformer;

import com.chibao.edu.TwitterAvroModel;
import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Component
public class AvroToElasticModelTransformer {

    public List<TwitterIndexModel> getElasticModels(List<TwitterAvroModel> twitterAvroModels) {
        return twitterAvroModels.stream()
                .map(twitterAvroModel -> TwitterIndexModel.builder()
                        .userId(twitterAvroModel.getUserId())
                        .id(String.valueOf(twitterAvroModel.getId()))
                        .text(twitterAvroModel.getText())
                        .createdAt(twitterAvroModel.getCreatedAt() != null
                                ? Instant.ofEpochMilli(twitterAvroModel.getCreatedAt())
                                : null)
                        .build()
                ).toList();
    }
}
