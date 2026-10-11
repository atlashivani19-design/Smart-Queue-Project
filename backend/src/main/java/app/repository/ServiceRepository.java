
package app.repository;

import app.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository
        extends JpaRepository<Service, Long> {

    // Find all services belonging to a specific location
    List<Service> findByLocationId(Long locationId);

}
