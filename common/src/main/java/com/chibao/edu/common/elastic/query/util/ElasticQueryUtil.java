package com.chibao.edu.common.elastic.query.util;

import com.chibao.edu.common.elastic.model.IndexModel;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class ElasticQueryUtil<T extends IndexModel> {
    // TODO: Search by document ID
    public Query getSearchQueryById(String id) {
        return NativeQuery.builder()
                .withIds(Collections.singleton(id))
                .build();
    }

    // TODO: Search for documents where a field matches a text value
    // ? equivalent to: {"query":{"match": { "<field>": {"query":"<text>"}}}}
    public Query getSearchQueryByFieldText(String field, String text) {
        return NativeQuery.builder()
                .withQuery(q -> q.match(m -> m.field(field).query(text)))
                .build();
    }

    // TODO: Search for all documents in a index
    public Query getSearchQueryForAll() {
        return NativeQuery.builder()
                .withQuery(q -> q.matchAll(m -> m))
                .build();
    }
}
