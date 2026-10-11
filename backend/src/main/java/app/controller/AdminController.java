package app.controller;

import app.entity.Service;
import app.entity.Token;
import app.repository.ServiceRepository;
import app.repository.TokenRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final TokenRepository tokenRepository;
    private final ServiceRepository serviceRepository;

    public AdminController(
            TokenRepository tokenRepository,
            ServiceRepository serviceRepository) {

        this.tokenRepository = tokenRepository;
        this.serviceRepository = serviceRepository;
    }

    // View waiting queue for a service
    @GetMapping("/queue/{serviceId}")
    public ResponseEntity<?> getQueue(
            @PathVariable Long serviceId) {

        Optional<Service> service =
                serviceRepository.findById(serviceId);

        if (service.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Service not found");
        }

        List<Token> queue =
                tokenRepository.findByServiceAndStatusOrderByCreatedAtAsc(
                        service.get(),
                        "WAITING"
                );

        return ResponseEntity.ok(queue);
    }

    // Call next token
    @PostMapping("/next/{serviceId}")
    public ResponseEntity<?> callNextToken(
            @PathVariable Long serviceId) {

        Optional<Service> service =
                serviceRepository.findById(serviceId);

        if (service.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Service not found");
        }

        List<Token> waitingTokens =
                tokenRepository.findByServiceAndStatusOrderByCreatedAtAsc(
                        service.get(),
                        "WAITING"
                );

        if (waitingTokens.isEmpty()) {
            return ResponseEntity.ok("No waiting tokens");
        }

        Token nextToken = waitingTokens.get(0);

        nextToken.setStatus("SERVING");

        Token savedToken =
                tokenRepository.save(nextToken);

        return ResponseEntity.ok(savedToken);
    }

    // Complete current token
    @PutMapping("/complete/{tokenId}")
    public ResponseEntity<?> completeToken(
            @PathVariable Long tokenId) {

        Optional<Token> optionalToken =
                tokenRepository.findById(tokenId);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Token token = optionalToken.get();

        token.setStatus("COMPLETED");

        return ResponseEntity.ok(
                tokenRepository.save(token)
        );
    }

    // Get all tokens
    @GetMapping("/tokens")
    public ResponseEntity<List<Token>> getAllTokens() {
        return ResponseEntity.ok(tokenRepository.findAll());
    }
}