package com.chibao.edu.exception;

public class TwitterToKafkaServiceException extends RuntimeException{
    public TwitterToKafkaServiceException(String message) {
        super(message);
    }

    public TwitterToKafkaServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
