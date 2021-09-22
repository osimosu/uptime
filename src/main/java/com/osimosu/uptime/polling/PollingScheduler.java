package com.osimosu.uptime.polling;

import com.osimosu.uptime.repository.ServiceRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PollingScheduler {

    @Value("${polling-interval-ms}")
    private String interval;

    private final Logger log = LoggerFactory.getLogger(PollingScheduler.class);

    private final ServiceRepository serviceRepository;

    private final PollingService pollingService;

    public PollingScheduler(ServiceRepository serviceRepository, PollingService pollingService) {
        this.serviceRepository = serviceRepository;
        this.pollingService = pollingService;
    }

    @Scheduled(fixedRateString = "${polling-interval-ms}")
    public void ScheduledMethod() {
        serviceRepository
            .findAllByUpdatedBefore(Instant.now().minus(Long.parseLong(interval), ChronoUnit.MILLIS))
            .forEach(service -> {
                log.info("polling {} at {} ", service.getName(), Instant.now());
                pollingService.poll(service);
            });
    }
}
