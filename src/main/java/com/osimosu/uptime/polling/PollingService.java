package com.osimosu.uptime.polling;

import com.osimosu.uptime.domain.Service;
import com.osimosu.uptime.domain.enumeration.Status;
import com.osimosu.uptime.repository.ServiceRepository;
import java.time.Instant;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.client.RestTemplate;

@org.springframework.stereotype.Service
public class PollingService {

    private final RestTemplate restTemplate;

    private final ServiceRepository serviceRepository;

    public PollingService(RestTemplate restTemplate, ServiceRepository serviceRepository) {
        this.restTemplate = restTemplate;
        this.serviceRepository = serviceRepository;
    }

    @Async
    public void poll(Service service) {
        try {
            // make an HTTP GET request
            restTemplate.getForEntity(service.getUrl(), String.class);
            serviceRepository.save(service.status(Status.OK).updated(Instant.now()));
        } catch (Exception e) {
            serviceRepository.save(service.status(Status.FAIL).updated(Instant.now()));
        }
    }
}
