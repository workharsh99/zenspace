package com.wellness.userservice.controller;

import com.wellness.userservice.dto.*;
import com.wellness.userservice.model.User;
import com.wellness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "user-service",
            "message", "User Service is running"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for username: {}", request.getUsername());
        AuthResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for: {}", request.getUsernameOrEmail());
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        user.setPassword(null); // Never expose password
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable String id,
                                               @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateProfile(id, request);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
