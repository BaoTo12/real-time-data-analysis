import os
import shutil
import re

ROOT = r"c:\Users\Admin\Desktop\projects\real-time-data-analysis"

# Define target package hierarchy and file moves
# Each tuple: (source_dir_relative_to_root, new_subpackage)
# Source directory is relative to the workspace root.
moves = [
    ("app-config-data/src/main/java/com/chibao/edu/config", "config"),
    ("common-config/src/main/java/com/chibao/edu/config", "config"),
    ("common-util/src/main/java/com/chibao/edu", "util"),
    ("kafka/kafka-admin/src/main/java/com/chibao/edu/kafka/admin/client", "kafka.admin.client"),
    ("kafka/kafka-admin/src/main/java/com/chibao/edu/kafka/admin/config", "kafka.admin.config"),
    ("kafka/kafka-admin/src/main/java/com/chibao/edu/kafka/admin/exception", "kafka.admin.exception"),
    ("kafka/kafka-producer/src/main/java/com/chibao/edu/kafka/producer/config", "kafka.producer.config"),
    ("kafka/kafka-producer/src/main/java/com/chibao/edu/kafka/producer/config/service", "kafka.producer.service"),
    ("kafka/kafka-producer/src/main/java/com/chibao/edu/kafka/producer/config/service/impl", "kafka.producer.service.impl"),
    ("kafka/kafka-consumer/src/main/java/com/chibao/edu/kafka/consumer/config", "kafka.consumer.config"),
    ("elastic/elastic-config/src/main/java/com/chibao/edu/elastic/config", "elastic.config"),
    ("elastic/elastic-model/src/main/java/com/chibao/edu/elastic/model/index", "elastic.model"),
    ("elastic/elastic-model/src/main/java/com/chibao/edu/elastic/model/index/impl", "elastic.model.impl"),
    ("elastic/elastic-index-client/src/main/java/com/chibao/edu/elastic/index/client/repository", "elastic.index.repository"),
    ("elastic/elastic-index-client/src/main/java/com/chibao/edu/elastic/index/client/service", "elastic.index.service"),
    ("elastic/elastic-index-client/src/main/java/com/chibao/edu/elastic/index/client/service/impl", "elastic.index.service.impl"),
    ("elastic/elastic-index-client/src/main/java/com/chibao/edu/elastic/index/client/util", "elastic.index.util"),
    ("elastic/elastic-query-client/src/main/java/com/chibao/edu/exception", "elastic.query.exception"),
    ("elastic/elastic-query-client/src/main/java/com/chibao/edu/repository", "elastic.query.repository"),
    ("elastic/elastic-query-client/src/main/java/com/chibao/edu/service", "elastic.query.service"),
    ("elastic/elastic-query-client/src/main/java/com/chibao/edu/service/impl", "elastic.query.service.impl"),
    ("elastic/elastic-query-client/src/main/java/com/chibao/edu/util", "elastic.query.util"),
    ("elastic-query-service-common/src/main/java/com/example/elastic/query/service/common/api/error/handler", "query.error"),
    ("elastic-query-service-common/src/main/java/com/example/elastic/query/service/common/model", "query.model"),
]

# Exact class mappings for import renaming
class_mappings = {
    # config
    "com.chibao.edu.config.ElasticConfigData": "com.chibao.edu.common.config.ElasticConfigData",
    "com.chibao.edu.config.ElasticQueryConfigData": "com.chibao.edu.common.config.ElasticQueryConfigData",
    "com.chibao.edu.config.ElasticQueryServiceConfigData": "com.chibao.edu.common.config.ElasticQueryServiceConfigData",
    "com.chibao.edu.config.ElasticQueryWebClientConfigData": "com.chibao.edu.common.config.ElasticQueryWebClientConfigData",
    "com.chibao.edu.config.KafkaConfigData": "com.chibao.edu.common.config.KafkaConfigData",
    "com.chibao.edu.config.KafkaConsumerConfigData": "com.chibao.edu.common.config.KafkaConsumerConfigData",
    "com.chibao.edu.config.KafkaProducerConfigData": "com.chibao.edu.common.config.KafkaProducerConfigData",
    "com.chibao.edu.config.RetryConfigData": "com.chibao.edu.common.config.RetryConfigData",
    "com.chibao.edu.config.TwitterToKafkaServiceConfigData": "com.chibao.edu.common.config.TwitterToKafkaServiceConfigData",
    "com.chibao.edu.config.UserConfigData": "com.chibao.edu.common.config.UserConfigData",
    "com.chibao.edu.config.RetryConfig": "com.chibao.edu.common.config.RetryConfig",
    # util
    "com.chibao.edu.CollectionsUtil": "com.chibao.edu.common.util.CollectionsUtil",
    # kafka-admin
    "com.chibao.edu.kafka.admin.client.KafkaAdminClient": "com.chibao.edu.common.kafka.admin.client.KafkaAdminClient",
    "com.chibao.edu.kafka.admin.config.KafkaAdminConfig": "com.chibao.edu.common.kafka.admin.config.KafkaAdminConfig",
    "com.chibao.edu.kafka.admin.config.WebClientConfig": "com.chibao.edu.common.kafka.admin.config.WebClientConfig",
    "com.chibao.edu.kafka.admin.exception.KafkaClientException": "com.chibao.edu.common.kafka.admin.exception.KafkaClientException",
    # kafka-model
    "com.chibao.edu.TwitterAvroModel": "com.chibao.edu.common.kafka.model.TwitterAvroModel",
    # kafka-producer
    "com.chibao.edu.kafka.producer.config.KafkaProducerConfig": "com.chibao.edu.common.kafka.producer.config.KafkaProducerConfig",
    "com.chibao.edu.kafka.producer.config.service.KafkaProducer": "com.chibao.edu.common.kafka.producer.service.KafkaProducer",
    "com.chibao.edu.kafka.producer.config.service.impl.TwitterKafkaProducer": "com.chibao.edu.common.kafka.producer.service.impl.TwitterKafkaProducer",
    # kafka-consumer
    "com.chibao.edu.kafka.consumer.config.KafkaConsumerConfig": "com.chibao.edu.common.kafka.consumer.config.KafkaConsumerConfig",
    # elastic-config
    "com.chibao.edu.elastic.config.ElasticSearchConfig": "com.chibao.edu.common.elastic.config.ElasticSearchConfig",
    # elastic-model
    "com.chibao.edu.elastic.model.index.IndexModel": "com.chibao.edu.common.elastic.model.IndexModel",
    "com.chibao.edu.elastic.model.index.impl.TwitterIndexModel": "com.chibao.edu.common.elastic.model.impl.TwitterIndexModel",
    # elastic-index-client
    "com.chibao.edu.elastic.index.client.repository.TwitterElasticsearchIndexRepository": "com.chibao.edu.common.elastic.index.repository.TwitterElasticsearchIndexRepository",
    "com.chibao.edu.elastic.index.client.service.ElasticIndexClient": "com.chibao.edu.common.elastic.index.service.ElasticIndexClient",
    "com.chibao.edu.elastic.index.client.service.impl.TwitterElasticIndexClient": "com.chibao.edu.common.elastic.index.service.impl.TwitterElasticIndexClient",
    "com.chibao.edu.elastic.index.client.service.impl.TwitterElasticRepositoryIndexClient": "com.chibao.edu.common.elastic.index.service.impl.TwitterElasticRepositoryIndexClient",
    "com.chibao.edu.elastic.index.client.util.ElasticIndexUtil": "com.chibao.edu.common.elastic.index.util.ElasticIndexUtil",
    # elastic-query-client
    "com.chibao.edu.exception.ElasticQueryClientException": "com.chibao.edu.common.elastic.query.exception.ElasticQueryClientException",
    "com.chibao.edu.repository.TwitterElasticsearchQueryRepository": "com.chibao.edu.common.elastic.query.repository.TwitterElasticsearchQueryRepository",
    "com.chibao.edu.service.ElasticQueryClient": "com.chibao.edu.common.elastic.query.service.ElasticQueryClient",
    "com.chibao.edu.service.impl.TwitterElasticQueryClient": "com.chibao.edu.common.elastic.query.service.impl.TwitterElasticQueryClient",
    "com.chibao.edu.service.impl.TwitterElasticRepositoryQueryClient": "com.chibao.edu.common.elastic.query.service.impl.TwitterElasticRepositoryQueryClient",
    "com.chibao.edu.util.ElasticQueryUtil": "com.chibao.edu.common.elastic.query.util.ElasticQueryUtil",
    # elastic-query-service-common
    "com.example.elastic.query.service.common.api.error.handler.ElasticQueryServiceErrorHandler": "com.chibao.edu.common.query.error.ElasticQueryServiceErrorHandler",
    "com.example.elastic.query.service.common.model.ElasticQueryServiceRequestModel": "com.chibao.edu.common.query.model.ElasticQueryServiceRequestModel",
    "com.example.elastic.query.service.common.model.ElasticQueryServiceResponseModel": "com.chibao.edu.common.query.model.ElasticQueryServiceResponseModel",
}

# Perform the file moves and package updates
print("Starting file consolidation...")
for src_rel, subpkg in moves:
    src_dir = os.path.join(ROOT, src_rel)
    if not os.path.exists(src_dir):
        print(f"Skipping non-existent src path: {src_dir}")
        continue
    
    # Target package folder
    target_rel_dir = os.path.join("common/src/main/java/com/chibao/edu/common", subpkg.replace(".", "/"))
    target_dir = os.path.join(ROOT, target_rel_dir)
    os.makedirs(target_dir, exist_ok=True)
    
    # Process files
    for filename in os.listdir(src_dir):
        src_file = os.path.join(src_dir, filename)
        if os.path.isfile(src_file) and filename.endswith(".java"):
            # Read content
            with open(src_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Rewrite package declaration
            # Match package line, e.g. package com.chibao.edu.config;
            new_pkg = f"com.chibao.edu.common.{subpkg}"
            content = re.sub(r"package\s+[\w\.]+;", f"package {new_pkg};", content)
            
            # Write to target
            dst_file = os.path.join(target_dir, filename)
            with open(dst_file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Moved and package-renamed: {src_rel}/{filename} -> {target_rel_dir}/{filename}")

# Standardize import references in ALL java files across target directories
print("\nUpdating import references in all files...")
search_dirs = [
    "common",
    "config-server",
    "twitter-to-kafka-service",
    "kafka-to-elastic-service",
    "elastic-query-service"
]

for s_dir in search_dirs:
    full_search_dir = os.path.join(ROOT, s_dir)
    if not os.path.exists(full_search_dir):
        continue
    
    for root, dirs, files in os.walk(full_search_dir):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original_content = content
                
                # Replace imports/references based on class mapping
                for old_cls, new_cls in class_mappings.items():
                    # Replace exact imports
                    content = content.replace(f"import {old_cls};", f"import {new_cls};")
                    # Replace fully qualified names in code (optional, just in case)
                    # Use boundary markers to avoid partial replacements
                    content = re.sub(r'\b' + re.escape(old_cls) + r'\b', new_cls, content)
                
                # Special wildcard mapping replacements (if any)
                content = content.replace("import com.chibao.edu.config.*;", "import com.chibao.edu.common.config.*;")
                content = content.replace("import com.example.elastic.query.service.common.model.*;", "import com.chibao.edu.common.query.model.*;")
                
                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Updated imports in: {os.path.relpath(file_path, ROOT)}")

print("\nUpdate completed successfully!")
