package com.legipilot.service.shared.infra.in;

import org.springframework.http.HttpStatus;

import java.net.URI;

public record HttpErrorBody(String title, String message, HttpStatus status, URI uri) {

    public static HttpErrorBody create(String title, String message, HttpStatus status, URI uri) {
        return new HttpErrorBody(title, message, status, uri);
    }

}
