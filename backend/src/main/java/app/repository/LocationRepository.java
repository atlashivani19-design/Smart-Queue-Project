
package app.repository;

import app.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository
        extends JpaRepository<Location, Long> {

    List<Location> findByActiveTrue();

    List<Location> findByNameContainingIgnoreCase(String name);
}
