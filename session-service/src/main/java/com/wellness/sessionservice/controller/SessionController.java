package com.wellness.sessionservice.controller;

import com.wellness.sessionservice.dto.*;
import com.wellness.sessionservice.model.Favorite;
import com.wellness.sessionservice.model.Session;
import com.wellness.sessionservice.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "session-service",
            "message", "Session Service is running"
        ));
    }

    // ---- Session Endpoints ----

    @PostMapping("/start")
    public ResponseEntity<Session> startSession(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody SessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.startSession(userId, request));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Session> completeSession(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CompleteSessionRequest request) {
        return ResponseEntity.ok(sessionService.completeSession(id, userId, request));
    }

    @PutMapping("/{id}/abandon")
    public ResponseEntity<Session> abandonSession(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(sessionService.abandonSession(id, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSession(@PathVariable String id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Session>> getUserSessions(@PathVariable String userId) {
        return ResponseEntity.ok(sessionService.getUserSessions(userId));
    }

    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<Session>> getCompletedSessions(@PathVariable String userId) {
        return ResponseEntity.ok(sessionService.getCompletedSessions(userId));
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Session>> getSessionsByStatus(
            @PathVariable String userId,
            @PathVariable String status) {
        return ResponseEntity.ok(sessionService.getSessionsByStatus(userId, status));
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<Session> toggleFavorite(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(sessionService.toggleFavoriteSession(id, userId));
    }

    // ---- Favorites Endpoints ----

    @PostMapping("/favorites")
    public ResponseEntity<Favorite> addFavorite(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody FavoriteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.addFavorite(userId, request));
    }

    @DeleteMapping("/favorites/{activityId}")
    public ResponseEntity<Map<String, String>> removeFavorite(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String activityId) {
        sessionService.removeFavorite(userId, activityId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }

    @GetMapping("/favorites/user/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable String userId) {
        return ResponseEntity.ok(sessionService.getUserFavorites(userId));
    }

    @GetMapping("/favorites/check/{activityId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String activityId) {
        boolean isFav = sessionService.isFavorite(userId, activityId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }

    // ---- Stats Endpoint ----

    @GetMapping("/stats/{userId}")
    public ResponseEntity<WellnessStats> getWellnessStats(@PathVariable String userId) {
        return ResponseEntity.ok(sessionService.getWellnessStats(userId));
    }
}
