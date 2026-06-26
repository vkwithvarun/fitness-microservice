package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        log.info("Gemini URL: {}", geminiApiUrl);
        log.info("Gemini KEY: {}", geminiApiKey);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
                }
        );

        return webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
//                .onStatus(
//                        status -> status.value() == 400,  // ✅ intercept 400
//                        response -> response.bodyToMono(String.class)
//                                .doOnNext(body ->
//                                        log.error("Gemini 400 Error Response: {}", body)) // ✅ log exact error
//                                .flatMap(body ->
//                                        Mono.error(new RuntimeException("Gemini error: " + body)))
//                )
                .bodyToMono(String.class)
//                .retryWhen(Retry.backoff(2, Duration.ofSeconds(60))
//                        .filter(throwable ->
//                                throwable instanceof WebClientResponseException.TooManyRequests))
                .block();
    }
}