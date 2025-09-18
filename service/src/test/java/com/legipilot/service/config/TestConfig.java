package com.legipilot.service.config;

import com.legipilot.service.shared.domain.EmailPort;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.util.function.Supplier;

import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestConfig {

    public static final LocalDateTime AUJOURDHUI = LocalDateTime.of(2025, 1, 1, 9, 0);

    @Bean
    @Primary
    public EmailPort emailPort() {
        return mock(EmailPort.class);
    }

    @Bean
    @Primary
    public Supplier<LocalDateTime> dateTimeSupplier() {
        return () -> AUJOURDHUI;
    }
}
