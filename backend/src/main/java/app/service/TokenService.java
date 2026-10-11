
package app.service;

import app.entity.Token;
import app.entity.User;
import app.repository.ServiceRepository;
import app.repository.TokenRepository;
import app.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    // Estimated service time per person, in minutes
    private static final int ESTIMATED_SERVICE_MINUTES = 10;

    public TokenService(
            TokenRepository tokenRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository) {

        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    // Generate a new token
    @Transactional
    public Token generateToken(Long userId, Long serviceId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        app.entity.Service service =
                serviceRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new RuntimeException("Service not found"));

        // Count people currently waiting for this service
        long waitingCount =
                tokenRepository.countByServiceAndStatus(
                        service, "WAITING");

        // Generate token number
        String tokenNumber =
                service.getId() + "-" + (waitingCount + 1);

        LocalDateTime now = LocalDateTime.now();

        Token token = new Token();
        token.setTokenNumber(tokenNumber);
        token.setUser(user);
        token.setService(service);
        token.setStatus("WAITING");
        token.setCreatedAt(now);

        // Estimate the user's turn time
        long estimatedMinutes =
                (waitingCount + 1) * ESTIMATED_SERVICE_MINUTES;

        token.setEstimatedTurnTime(
                now.plusMinutes(estimatedMinutes));

        // Allow the scheduler to consider this token for a reminder
        token.setReminderSent(false);

        // Save all token details to MySQL
        return tokenRepository.save(token);
    }

    // Get token by ID
    public Token getTokenById(Long tokenId) {
        return tokenRepository.findById(tokenId)
                .orElseThrow(() ->
                        new RuntimeException("Token not found"));
    }

    // Get all tokens belonging to a user
    public List<Token> getUserTokens(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return tokenRepository.findByUser(user);
    }

    // Get all tokens
    public List<Token> getAllTokens() {
        return tokenRepository.findAll();
    }

    // Cancel token
    @Transactional
    public Token cancelToken(Long tokenId) {

        Token token = getTokenById(tokenId);

        if ("COMPLETED".equals(token.getStatus())) {
            throw new RuntimeException(
                    "Completed token cannot be cancelled");
        }

        token.setStatus("CANCELLED");
        return tokenRepository.save(token);
    }
}
