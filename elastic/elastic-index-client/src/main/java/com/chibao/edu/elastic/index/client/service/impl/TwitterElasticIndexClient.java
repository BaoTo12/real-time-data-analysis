package com.chibao.edu.elastic.index.client.service.impl;

import com.chibao.edu.config.ElasticConfigData;
import com.chibao.edu.elastic.index.client.service.ElasticIndexClient;
import com.chibao.edu.elastic.index.client.util.ElasticIndexUtil;
import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexedObjectInformation;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "elastic-config.is-repository", havingValue = "false")
public class TwitterElasticIndexClient implements ElasticIndexClient<TwitterIndexModel> {

    ElasticConfigData elasticConfigData;
    ElasticsearchOperations elasticsearchOperations;
    ElasticIndexUtil<TwitterIndexModel> elasticIndexUtil;

    @Override
    public List<String> save(List<TwitterIndexModel> documents) {
        List<IndexQuery> indexQueries = elasticIndexUtil.getIndexQueries(documents);
        List<IndexedObjectInformation> indexedInfoList = elasticsearchOperations.bulkIndex(
                indexQueries,
                IndexCoordinates.of(elasticConfigData.getIndexName())
        );
        List<String> documentIds = indexedInfoList.stream()
                .map(IndexedObjectInformation::id)
                .toList();
        log.info("Documents indexed successfully with type: {} and ids: {}", TwitterIndexModel.class.getName(),
                documentIds);
        return documentIds;
    }
}
