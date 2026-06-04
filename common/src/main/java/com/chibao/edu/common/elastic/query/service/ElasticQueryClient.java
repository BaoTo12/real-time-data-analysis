package com.chibao.edu.common.elastic.query.service;

import com.chibao.edu.common.elastic.model.IndexModel;

import java.util.List;

public interface ElasticQueryClient<T extends IndexModel> {
    T getIndexModelById(String id);

    List<T> getIndexModelByText(String text);

    List<T> getAllIndexModels();
}
