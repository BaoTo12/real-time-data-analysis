package com.chibao.edu.common.elastic.query.service.impl;

import com.chibao.edu.common.config.ElasticConfigData;
import com.chibao.edu.common.config.ElasticQueryConfigData;
import com.chibao.edu.common.elastic.model.impl.TwitterIndexModel;
import com.chibao.edu.common.elastic.query.exception.ElasticQueryClientException;
import com.chibao.edu.common.elastic.query.service.ElasticQueryClient;
import com.chibao.edu.common.elastic.query.util.ElasticQueryUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TwitterElasticQueryClient implements ElasticQueryClient<TwitterIndexModel> {

    ElasticConfigData elasticConfigData;
    ElasticQueryConfigData elasticQueryConfigData;
    ElasticsearchOperations elasticsearchOperations;
    ElasticQueryUtil<TwitterIndexModel> elasticQueryUtil;

    @Override
    public TwitterIndexModel getIndexModelById(String id) {
        Query query = elasticQueryUtil.getSearchQueryById(id);
        // ? SearchHit is an object that encapsulates the found data with additional information
        // ? searchOne method -> parameters: query object, the type of mapping, the name of index
        SearchHit<TwitterIndexModel> searchHit = elasticsearchOperations.searchOne(query, TwitterIndexModel.class,
                IndexCoordinates.of(elasticConfigData.getIndexName()));
        if (searchHit == null) {
            log.error("No document found at elasticsearch with id {}", id);
            throw new ElasticQueryClientException("No document found at elasticsearch with id " + id);
        }
        log.info("Document with id {} retrieved successfully", searchHit.getId());
        return searchHit.getContent();
    }

    @Override
    public List<TwitterIndexModel> getIndexModelByText(String text) {
        Query query = elasticQueryUtil.getSearchQueryByFieldText(elasticQueryConfigData.getTextField(), text);
        return search(query, "{} of documents with text {} retrieved successfully", text);
    }

    @Override
    public List<TwitterIndexModel> getAllIndexModels() {
        Query query = elasticQueryUtil.getSearchQueryForAll();
        return search(query, "{} number of documents retrieved successfully");
    }

    private List<TwitterIndexModel> search(Query query, String messages, Object... logParams){
        SearchHits<TwitterIndexModel> searchHits = elasticsearchOperations.search(query, TwitterIndexModel.class,
                IndexCoordinates.of(elasticConfigData.getIndexName()));
        log.info(messages, searchHits.getTotalHits(), logParams);
        return searchHits.get().map(SearchHit::getContent).toList();
    }
}
