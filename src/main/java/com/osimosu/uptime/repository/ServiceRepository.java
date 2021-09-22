package com.osimosu.uptime.repository;

import com.osimosu.uptime.domain.Service;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Service entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    @Query("select service from Service service where service.user.login = ?#{principal.username}")
    List<Service> findByUserIsCurrentUser();

    @Query("select service from Service service where service.user.login = ?#{principal.username}")
    Page<Service> findByUserIsCurrentUser(Pageable pageable);

    List<Service> findAllByUpdatedBefore(Instant datetime);
}
