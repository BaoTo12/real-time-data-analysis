package com.chibao.edu.elastic.query.service.model.assembler;

import com.chibao.edu.elastic.model.index.impl.TwitterIndexModel;
import com.chibao.edu.elastic.query.service.api.ElasticDocumentController;
import com.chibao.edu.elastic.query.service.transformer.ElasticToResponseModelTransformer;
import com.example.elastic.query.service.common.model.ElasticQueryServiceResponseModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ElasticQueryServiceResponseModelAssembler extends
        RepresentationModelAssemblerSupport<TwitterIndexModel, ElasticQueryServiceResponseModel> {

    private final ElasticToResponseModelTransformer elasticToResponseModelTransformer;

    public ElasticQueryServiceResponseModelAssembler
            (Class<?> controllerClass,
             Class<ElasticQueryServiceResponseModel> resourceType,
             ElasticToResponseModelTransformer elasticToResponseModelTransformer) {
        super(controllerClass, resourceType);
        this.elasticToResponseModelTransformer = elasticToResponseModelTransformer;
    }

    @NonNull
    @Override
    public ElasticQueryServiceResponseModel toModel(@NonNull TwitterIndexModel entity) {
        ElasticQueryServiceResponseModel responseModel =
                elasticToResponseModelTransformer.getResponseModel(entity);

        responseModel.add(
                WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(ElasticDocumentController.class)
                                .getDocumentById(entity.getId())).withSelfRel());

        responseModel.add(
                WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(ElasticDocumentController.class)).withRel("documents"));

        return responseModel;
    }

    public List<ElasticQueryServiceResponseModel> toModels(List<TwitterIndexModel> twitterIndexModels){
        return twitterIndexModels.stream().map(this::toModel).toList();
    }
}
