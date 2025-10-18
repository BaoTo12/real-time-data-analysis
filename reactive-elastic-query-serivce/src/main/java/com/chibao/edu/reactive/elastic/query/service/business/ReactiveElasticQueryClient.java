package com.chibao.edu.reactive.elastic.query.service.business;

import com.chibao.edu.elastic.model.index.IndexModel;
import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import reactor.core.publisher.Flux;

public interface ReactiveElasticQueryClient<T extends IndexModel> {

    Flux<TwitterIndexModel> getIndexModelByText(String text);
}
