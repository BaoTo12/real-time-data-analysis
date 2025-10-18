package com.chibao.edu.reactive.elastic.query.service.business.impl;


import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import com.chibao.edu.reactive.elastic.query.service.business.ElasticQueryService;
import com.chibao.edu.reactive.elastic.query.service.business.ReactiveElasticQueryClient;
import com.example.elastic.query.service.common.model.ElasticQueryServiceResponseModel;
import com.example.elastic.query.service.common.transformer.ElasticToResponseModelTransformer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class TwitterElasticQueryService implements ElasticQueryService {

    private static final Logger LOG = LoggerFactory.getLogger(TwitterElasticQueryService.class);

    private final ReactiveElasticQueryClient<TwitterIndexModel> reactiveElasticQueryClient;

    private final ElasticToResponseModelTransformer elasticToResponseModelTransformer;

    public TwitterElasticQueryService(ReactiveElasticQueryClient<TwitterIndexModel> elasticQueryClient,
                                      ElasticToResponseModelTransformer transformer) {
        this.reactiveElasticQueryClient = elasticQueryClient;
        this.elasticToResponseModelTransformer = transformer;
    }


    @Override
    public Flux<ElasticQueryServiceResponseModel> getDocumentByText(String text) {
        LOG.info("Querying reactive elasticsearch for text {}", text);
        return reactiveElasticQueryClient
                .getIndexModelByText(text)
                .map(elasticToResponseModelTransformer::getResponseModel);
    }
}
