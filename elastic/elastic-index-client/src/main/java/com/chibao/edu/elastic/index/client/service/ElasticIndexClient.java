package com.chibao.edu.elastic.index.client.service;

import com.chibao.edu.elastic.model.index.IndexModel;

import java.util.List;

public interface ElasticIndexClient<T extends IndexModel>{
    List<String> save(List<T> documents);
}
