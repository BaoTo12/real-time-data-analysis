package com.chibao.edu.common.elastic.index.service;

import com.chibao.edu.common.elastic.model.IndexModel;

import java.util.List;

public interface ElasticIndexClient<T extends IndexModel>{
    List<String> save(List<T> documents);
}
