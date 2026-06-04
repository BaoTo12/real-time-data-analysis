package com.chibao.edu.common.elastic.index.repository;

import com.chibao.edu.common.elastic.model.impl.TwitterIndexModel;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwitterElasticsearchIndexRepository extends ElasticsearchRepository<TwitterIndexModel, String> {
    @Override
    <S extends TwitterIndexModel> List<S> saveAll(Iterable<S> entities);
}
