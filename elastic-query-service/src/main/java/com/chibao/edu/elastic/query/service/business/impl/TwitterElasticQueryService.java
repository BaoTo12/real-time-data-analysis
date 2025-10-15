package com.chibao.edu.elastic.query.service.business.impl;

import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import com.chibao.edu.elastic.query.service.business.ElasticQueryService;
import com.chibao.edu.elastic.query.service.model.ElasticQueryServiceResponseModel;
import com.chibao.edu.elastic.query.service.transformer.ElasticToResponseModelTransformer;
import com.chibao.edu.service.ElasticQueryClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TwitterElasticQueryService implements ElasticQueryService {
    ElasticToResponseModelTransformer elasticToResponseModelTransformer;
    ElasticQueryClient<TwitterIndexModel> elasticQueryClient;

    @Override
    public ElasticQueryServiceResponseModel getDocumentById(String id) {
        log.info("Querying elasticsearch by id {}", id);
        return elasticToResponseModelTransformer.getResponseModel(elasticQueryClient.getIndexModelById(id));
    }

    @Override
    public List<ElasticQueryServiceResponseModel> getDocumentByText(String text) {
        log.info("Querying elasticsearch by text {}", text);
        return elasticToResponseModelTransformer.getResponseModels(elasticQueryClient.getIndexModelByText(text));
    }

    @Override
    public List<ElasticQueryServiceResponseModel> getAllDocuments() {
        log.info("Querying all documents in elasticsearch");
        return elasticToResponseModelTransformer.getResponseModels(elasticQueryClient.getAllIndexModels());
    }
}
