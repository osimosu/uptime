package com.osimosu.uptime.polling;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class PollingConfig {

    @Value("${polling-timeout-ms}")
    private String timeout;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        return restTemplateBuilder
            .setConnectTimeout(Duration.ofMillis(Long.parseLong(timeout)))
            .setReadTimeout(Duration.ofMillis(Long.parseLong(timeout)))
            .build();
    }
}
