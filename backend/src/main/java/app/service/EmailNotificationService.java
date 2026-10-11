package app.service;

import app.entity.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailNotificationService {

    private final RestClient restClient;

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    public EmailNotificationService() {
        this.restClient = RestClient.create();
    }

    public void sendTurnReminder(Token token) {

        if (token.getUser() == null
                || token.getUser().getEmail() == null
                || token.getUser().getEmail().isBlank()) {
            throw new IllegalStateException(
                    "Registered email address is missing");
        }

        String userName = token.getUser().getName();
        String recipientEmail = token.getUser().getEmail();

        String serviceName = token.getService() != null
                ? token.getService().getServiceName()
                : "Queue Service";

        String estimatedTime = token.getEstimatedTurnTime() != null
                ? token.getEstimatedTurnTime().toString()
                : "Not available";

        String emailText =
                "Hello " + userName + ",\n\n"
                + "Your queue turn is approaching.\n\n"
                + "Token: " + token.getTokenNumber() + "\n"
                + "Service: " + serviceName + "\n"
                + "Estimated turn time: " + estimatedTime + "\n\n"
                + "Please return to your counter soon.\n"
                + "This is an estimated time and may change.";

        Map<String, Object> emailRequest = Map.of(
                "sender", Map.of(
                        "name", "Smart Queue",
                        "email", senderEmail
                ),
                "to", List.of(
                        Map.of(
                                "email", recipientEmail,
                                "name", userName == null ? "" : userName
                        )
                ),
                "subject", "Smart Queue: Your turn is approaching!",
                "textContent", emailText
        );

        restClient.post()
                .uri("https://api.brevo.com/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(emailRequest)
                .retrieve()
                .toBodilessEntity();
    }
}