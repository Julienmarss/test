package com.legipilot.service.shared.infra.out.ai;

import com.legipilot.service.shared.domain.AgentClientPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class MistralAgentClient implements AgentClientPort {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.mistral.ai")
            .build();

    @Value("${spring.ai.mistralai.api-key}")
    private String apiKey;

    @Override
    public String complete(String agentId, List<Message> messages, Map<String, Object> responseFormat) {
        Map<String, Object> body = new HashMap<>();
        body.put("agent_id", agentId);
        body.put("response_format", responseFormat);
        body.put(
                "messages", messages.stream().map(m -> Map.of(
                "role", m.role(),
                "content", m.content()
        )).toList());

        return webClient.post()
                .uri("/v1/agents/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
