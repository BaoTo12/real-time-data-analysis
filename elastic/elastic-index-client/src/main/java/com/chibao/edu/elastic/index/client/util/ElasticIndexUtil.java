package com.chibao.edu.elastic.index.client.util;

import com.chibao.edu.elastic.model.index.IndexModel;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.IndexQueryBuilder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ElasticIndexUtil<T extends IndexModel> {
    public List<IndexQuery> getIndexQueries(List<T> documents) {
        return documents.stream()
                .map(document -> new IndexQueryBuilder()
                        .withId(document.getId())
                        .withObject(document)
                        .build()
                ).toList();

    }
}

// ! Explain
/*
* IndexQuery là một đối tượng mô tả một yêu cầu index (ghi dữ liệu) vào Elasticsearch.
* Nó không tự thực thi, mà chỉ chứa thông tin như:
* id: ID của document
* object: chính object (dữ liệu) muốn lưu
* indexName: tên của index muốn lưu vào (nếu có chỉ định)
* routing, version, ... (các tùy chọn khác)
* **/
