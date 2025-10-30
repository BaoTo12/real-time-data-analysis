package com.chibao.edu.kafka.to.elastic.service.consumer;

import org.apache.avro.specific.SpecificRecordBase;

import java.io.Serializable;

public interface KafkaConsumer<K extends Serializable, V extends SpecificRecordBase> {
    void receive(V messages, K keys, Integer partitions, Long offsets);
}
