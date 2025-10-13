package com.chibao.edu.kafka.to.elastic.service.consumer.impl;

import com.chibao.edu.TwitterAvroModel;
import com.chibao.edu.config.KafkaConfigData;
import com.chibao.edu.kafka.admin.client.KafkaAdminClient;
import com.chibao.edu.kafka.to.elastic.service.consumer.KafkaConsumer;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TwitterKafkaConsumer implements KafkaConsumer<Long, TwitterAvroModel> {

    KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry;
    KafkaAdminClient kafkaAdminClient;
    KafkaConfigData kafkaConfigData;

    @EventListener
    public void onAppStarted(ApplicationEvent applicationEvent){
        kafkaAdminClient.checkCreatedTopics();
        log.info("Topics with name {} is ready for operations!", kafkaConfigData.getTopicNamesToCreate().toArray());
        Objects.requireNonNull(kafkaListenerEndpointRegistry.getListenerContainer("twitterTopicListener")).start();
    }

    @Override
    @KafkaListener(id = "twitterTopicListener", topics = "${kafka-config.topic-name}")
    public void receive(@Payload List<TwitterAvroModel> messages,
                        @Header List<Long> keys,
                        @Header List<Integer> partitions,
                        @Header List<Long> offsets) {
        log.info("${} number of message received with keys {}, partitions {} and offsets {}, " +
                "sending it to elastic: Thread id {} ",
                messages.size(),
                keys.toString(),
                partitions.toString(),
                offsets.toString(),
                Thread.currentThread().threadId());
    }
}


// ? KafkaListenerEndpointRegistry
/*
* * WHY?
* Bình thường khi bạn dùng @KafkaListener, Spring sẽ tự động tạo và khởi động listener container để lắng nghe dữ liệu từ Kafka.
    👉 Nhưng đôi khi, bạn không muốn listener tự động chạy ngay khi ứng dụng khởi động.
    Bạn muốn kiểm soát thủ công — ví dụ:
    Chờ đến khi Kafka broker hoặc topic đã sẵn sàng rồi mới bắt đầu nghe.
    Tạm dừng, khởi động lại hoặc dừng hẳn một consumer trong lúc hệ thống đang chạy.
    Chạy nhiều consumer group khác nhau tuỳ theo trạng thái hệ thống (ví dụ: maintenance mode, batch job mode…).
    ➡️ KafkaListenerEndpointRegistry chính là công cụ mà Spring cung cấp để quản lý và điều khiển các Kafka listener containers đang chạy trong ứng dụng.
    *
    * WHAT?
    Nếu bạn chỉ dùng @KafkaListener, bạn:
        Không thể dừng listener giữa chừng.
        Không thể đợi một điều kiện nào đó trước khi bắt đầu.
        Không thể dễ dàng truy cập các thông tin về listener container.
    KafkaListenerEndpointRegistry giúp bạn:
        Bắt đầu hoặc dừng một listener bất kỳ lúc nào.
        Kiểm tra trạng thái listener (đang chạy, đang dừng...).
        Truy cập container cụ thể bằng ID để điều khiển nó.
     * HOW IT WORKS?
     * Mỗi @KafkaListener trong Spring tạo ra một listener container (được Spring quản lý).
        Các container này được đăng ký tự động vào KafkaListenerEndpointRegistry.
        Bạn có thể lấy container ra từ registry bằng ID (được khai báo trong @KafkaListener).
* *
* **/