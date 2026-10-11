
package app.controller;

import app.entity.Token;
import app.repository.TokenRepository;
import app.repository.UserRepository;
import app.service.TokenService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public TokenController(
            TokenRepository tokenRepository,
            UserRepository userRepository,
            TokenService tokenService) {

        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    // Generate a token using TokenService
    @PostMapping
    public ResponseEntity<?> generateToken(
            @RequestParam Long userId,
            @RequestParam Long serviceId) {

        try {
            Token savedToken =
                    tokenService.generateToken(userId, serviceId);

            return ResponseEntity.ok(savedToken);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Get token by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getToken(@PathVariable Long id) {

        return tokenRepository.findById(id)
                .<ResponseEntity<?>>map(
                        token -> ResponseEntity.ok(token))
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    // Get all tokens
    @GetMapping
    public ResponseEntity<List<Token>> getAllTokens() {
        return ResponseEntity.ok(tokenRepository.findAll());
    }

    // Get tokens for a particular user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserTokens(
            @PathVariable Long userId) {

        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        return ResponseEntity.ok(
                tokenService.getUserTokens(userId));
    }

    // Cancel token
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelToken(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    tokenService.cancelToken(id));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}
