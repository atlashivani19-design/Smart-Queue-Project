
package app.controller;

import app.entity.Service;
import app.entity.Location;
import app.repository.ServiceRepository;
import app.repository.LocationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final LocationRepository locationRepository;

    public ServiceController(
            ServiceRepository serviceRepository,
            LocationRepository locationRepository) {

        this.serviceRepository = serviceRepository;
        this.locationRepository = locationRepository;
    }

    // Get all services
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    // Get a service by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {

        Optional<Service> service = serviceRepository.findById(id);

        if (service.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(service.get());
    }

    // Get services for a selected location
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<Service>> getServicesByLocation(
            @PathVariable Long locationId) {

        Optional<Location> location =
                locationRepository.findById(locationId);

        if (location.isEmpty() || !location.get().isActive()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                serviceRepository.findByLocationId(locationId));
    }

    // Add a new service
    @PostMapping
    public ResponseEntity<?> createService(
            @RequestBody Map<String, Object> request) {

        String serviceName = request.get("serviceName") == null
                ? null : request.get("serviceName").toString();

        String description = request.get("description") == null
                ? null : request.get("description").toString();

        Object locationValue = request.get("locationId");

        if (serviceName == null || serviceName.isBlank()
                || description == null || description.isBlank()
                || locationValue == null) {

            return ResponseEntity.badRequest().body(
                    "serviceName, description and locationId are required");
        }

        Long locationId;

        try {
            locationId = Long.valueOf(locationValue.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                    "locationId must be a valid number");
        }

        Optional<Location> locationOptional =
                locationRepository.findById(locationId);

        if (locationOptional.isEmpty()
                || !locationOptional.get().isActive()) {

            return ResponseEntity.badRequest().body(
                    "Location not found or inactive");
        }

        Service service = new Service();
        service.setServiceName(serviceName);
        service.setDescription(description);
        service.setLocation(locationOptional.get());

        return ResponseEntity.ok(serviceRepository.save(service));
    }

    // Update a service
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        Optional<Service> optionalService =
                serviceRepository.findById(id);

        if (optionalService.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Service service = optionalService.get();

        if (request.containsKey("serviceName")) {
            String name = String.valueOf(request.get("serviceName"));

            if (name.isBlank()) {
                return ResponseEntity.badRequest().body(
                        "serviceName cannot be empty");
            }

            service.setServiceName(name);
        }

        if (request.containsKey("description")) {
            String description =
                    String.valueOf(request.get("description"));

            if (description.isBlank()) {
                return ResponseEntity.badRequest().body(
                        "description cannot be empty");
            }

            service.setDescription(description);
        }

        if (request.containsKey("locationId")) {
            Long locationId;

            try {
                locationId = Long.valueOf(
                        request.get("locationId").toString());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(
                        "locationId must be a valid number");
            }

            Optional<Location> location =
                    locationRepository.findById(locationId);

            if (location.isEmpty()
                    || !location.get().isActive()) {

                return ResponseEntity.badRequest().body(
                        "Location not found or inactive");
            }

            service.setLocation(location.get());
        }

        return ResponseEntity.ok(serviceRepository.save(service));
    }

    // Delete a service
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {

        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        serviceRepository.deleteById(id);

        return ResponseEntity.ok("Service deleted successfully");
    }
}

