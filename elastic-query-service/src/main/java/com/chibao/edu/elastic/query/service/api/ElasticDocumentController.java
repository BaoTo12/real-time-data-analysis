package com.chibao.edu.elastic.query.service.api;

import com.chibao.edu.elastic.query.service.model.ElasticQueryServiceRequestModel;
import com.chibao.edu.elastic.query.service.model.ElasticQueryServiceResponseModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "/documents")
public class ElasticDocumentController {

    @GetMapping("/")
    public @ResponseBody ResponseEntity<List<ElasticQueryServiceResponseModel>> getAllDocuments() {
        List<ElasticQueryServiceResponseModel> responseModels = new ArrayList<>();
        log.info("Elasticsearch returned {} of documents", responseModels);
        return ResponseEntity.ok(responseModels);
    }

    @GetMapping("/{id}")
    public @ResponseBody ResponseEntity<ElasticQueryServiceResponseModel> getDocumentById(@PathVariable String id){
        ElasticQueryServiceResponseModel responseModel = ElasticQueryServiceResponseModel.builder()
                .id(id)
                .build();
        log.debug("Elasticsearch returned document with id {}", id);
        return ResponseEntity.ok(responseModel);
    }

    @PostMapping("/get-document-by-text")
    public @ResponseBody
    ResponseEntity<List<ElasticQueryServiceResponseModel>>
    getDocumentByText(@RequestBody ElasticQueryServiceRequestModel elasticQueryServiceRequestModel) {
        List<ElasticQueryServiceResponseModel> response = new ArrayList<>();
        ElasticQueryServiceResponseModel elasticQueryServiceResponseModel =
                ElasticQueryServiceResponseModel.builder()
                        .text(elasticQueryServiceRequestModel.getText())
                        .build();
        response.add(elasticQueryServiceResponseModel);

        return ResponseEntity.ok(response);
    }

}
