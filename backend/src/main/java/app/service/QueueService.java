package app.service;

import app.entity.Token;
import app.repository.TokenRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueueService {

    private final TokenRepository tokenRepository;

    public QueueService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Get all waiting tokens for a service
    public List<Token> getWaitingQueue(
            app.entity.Service service) {

        return tokenRepository
                .findByServiceAndStatusOrderByCreatedAtAsc(
                        service,
                        "WAITING"
                );
    }

    // Get number of waiting tokens
    public long getWaitingCount(
            app.entity.Service service) {

        return tokenRepository.countByServiceAndStatus(
                service,
                "WAITING"
        );
    }

    // Get the next token
    public Token getNextToken(
            app.entity.Service service) {

        List<Token> waitingTokens =
                getWaitingQueue(service);

        if (waitingTokens.isEmpty()) {
            return null;
        }

        return waitingTokens.get(0);
    }

    // Call the next token
    public Token callNextToken(
            app.entity.Service service) {

        Token nextToken = getNextToken(service);

        if (nextToken == null) {
            return null;
        }

        nextToken.setStatus("SERVING");

        return tokenRepository.save(nextToken);
    }

    // Complete token
    public Token completeToken(Token token) {

        token.setStatus("COMPLETED");

        return tokenRepository.save(token);
    }

    // Cancel token
    public Token cancelToken(Token token) {

        token.setStatus("CANCELLED");

        return tokenRepository.save(token);
    }
}