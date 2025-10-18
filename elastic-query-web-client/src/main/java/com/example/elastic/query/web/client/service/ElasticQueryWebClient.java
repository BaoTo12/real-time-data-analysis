package com.example.elastic.query.web.client.service;


import com.example.elastic.query.web.client.common.model.ElasticQueryWebClientRequestModel;
import com.example.elastic.query.web.client.common.model.ElasticQueryWebClientResponseModel;

import java.util.List;

public interface ElasticQueryWebClient {

    List<ElasticQueryWebClientResponseModel> getDataByText(ElasticQueryWebClientRequestModel requestModel);
}
