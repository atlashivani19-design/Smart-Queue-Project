package app.repository;

import app.entity.Token;
import app.entity.User;
import app.entity.Service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {

    // Count tokens for a service with a particular status
    long countByServiceAndStatus(Service service, String status);

    // Find all tokens belonging to a user
    List<Token> findByUser(User user);

    // Find tokens for a service in queue order
    List<Token> findByServiceAndStatusOrderByCreatedAtAsc(
        Service service,
        String status
    );

    // Find waiting tokens that need an email reminder
    @Query("""
        SELECT t FROM Token t
        WHERE t.status = 'WAITING'
          AND t.reminderSent = false
          AND t.estimatedTurnTime <= :time
          AND t.estimatedTurnTime > CURRENT_TIMESTAMP
        """)
    List<Token> findTokensDueForReminder(
        @Param("time") LocalDateTime time
    );
}