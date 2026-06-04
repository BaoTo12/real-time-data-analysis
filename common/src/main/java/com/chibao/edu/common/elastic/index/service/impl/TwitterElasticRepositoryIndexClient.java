package com.chibao.edu.common.elastic.index.service.impl;

import com.chibao.edu.common.elastic.index.repository.TwitterElasticsearchIndexRepository;
import com.chibao.edu.common.elastic.index.service.ElasticIndexClient;
import com.chibao.edu.common.elastic.model.impl.TwitterIndexModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "elastic-config.is-repository", havingValue = "true", matchIfMissing = true)
public class TwitterElasticRepositoryIndexClient implements ElasticIndexClient<TwitterIndexModel> {

    private final TwitterElasticsearchIndexRepository twitterElasticsearchIndexRepository;

    @Override
    public List<String> save(List<TwitterIndexModel> documents) {
        List<TwitterIndexModel> repositoryResponse =
                twitterElasticsearchIndexRepository.saveAll(documents);
        log.info("Successfully indexing TwitterIndexModel: {}", repositoryResponse);
        List<String> ids = repositoryResponse.stream().map(TwitterIndexModel::getId).toList();
        log.info("Documents indexed successfully with type: {} and ids: {}", TwitterIndexModel.class.getName(), ids);
        return ids;
    }
}
