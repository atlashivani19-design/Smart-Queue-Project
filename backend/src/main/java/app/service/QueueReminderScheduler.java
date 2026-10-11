
package app.service;

import app.entity.Token;
import app.repository.TokenRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class QueueReminderScheduler {

    private final TokenRepository tokenRepository;
    private final EmailNotificationService emailService;

    @Value("${smartqueue.reminder.minutes-before:10}")
    private int minutesBefore;

    public QueueReminderScheduler(
            TokenRepository tokenRepository,
            EmailNotificationService emailService) {

        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    // Check for upcoming turns every 30 seconds
    @Scheduled(fixedDelay = 30000)
    public void checkUpcomingTurns() {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline = now.plusMinutes(minutesBefore);

        System.out.println("------------------------------------");
        System.out.println("Smart Queue Reminder Scheduler");
        System.out.println("Current time: " + now);
        System.out.println("Reminder window ends: " + deadline);

        try {
            List<Token> tokens =
                    tokenRepository.findTokensDueForReminder(deadline);

            System.out.println(
                    "Tokens due for reminder: " + tokens.size());

            if (tokens.isEmpty()) {
                System.out.println(
                        "No tokens are due for a reminder right now.");
            }

            for (Token token : tokens) {

                System.out.println(
                        "Processing token ID: " + token.getId()
                        + ", Token number: " + token.getTokenNumber());

                try {
                    // Send the email using Brevo
                    emailService.sendTurnReminder(token);

                    // Mark as sent only after the API call succeeds
                    token.setReminderSent(true);
                    tokenRepository.save(token);

                    System.out.println(
                            "Reminder API request succeeded for token "
                            + token.getTokenNumber());

                } catch (Exception e) {
                    System.err.println(
                            "Could not send reminder for token "
                            + token.getId());

                    System.err.println(
                            "Error: " + e.getMessage());

                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            System.err.println(
                    "Reminder scheduler encountered an error: "
                    + e.getMessage());

            e.printStackTrace();
        }

        System.out.println("------------------------------------");
    }
}
