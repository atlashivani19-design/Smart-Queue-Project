
package app.controller;

import app.entity.Location;
import app.repository.LocationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "http://localhost:5173")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(
            LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    // Get all active locations
    @GetMapping
    public List<Location> getLocations() {
        return locationRepository.findByActiveTrue();
    }

    // Get a location by ID
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocation(
            @PathVariable Long id) {

        return locationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    // Add a new location
    @PostMapping
    public ResponseEntity<Location> addLocation(
            @RequestBody Location location) {

        if (location.getName() == null
                || location.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        location.setId(null);
        location.setActive(true);

        return ResponseEntity.ok(
                locationRepository.save(location));
    }

    // Update a location
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long id,
            @RequestBody Location details) {

        return locationRepository.findById(id)
                .map(location -> {
                    location.setName(details.getName());
                    location.setBuilding(details.getBuilding());
                    location.setFloor(details.getFloor());
                    location.setAddress(details.getAddress());

                    return ResponseEntity.ok(
                            locationRepository.save(location));
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    // Deactivate a location without deleting its history
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateLocation(
            @PathVariable Long id) {

        return locationRepository.findById(id)
                .map(location -> {
                    location.setActive(false);
                    locationRepository.save(location);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }
}
