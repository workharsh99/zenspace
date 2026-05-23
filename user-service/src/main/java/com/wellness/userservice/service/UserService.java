package com.wellness.userservice.service;

import com.wellness.userservice.dto.*;
import com.wellness.userservice.model.User;
import com.wellness.userservice.repository.UserRepository;
import com.wellness.userservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .wellnessGoal(request.getWellnessGoal())
                .stressLevel(request.getStressLevel())
                .role("USER")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getUsername());

        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId(), savedUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .message("Registration successful! Welcome to Wellness App.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        User user = userOpt.orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        log.info("User logged in: {}", user.getUsername());
        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .message("Login successful! Welcome back.")
                .build();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public User updateProfile(String id, UpdateProfileRequest request) {
        User user = getUserById(id);

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());
        if (request.getWellnessGoal() != null) user.setWellnessGoal(request.getWellnessGoal());
        if (request.getStressLevel() != null) user.setStressLevel(request.getStressLevel());
        if (request.getPreferredActivities() != null) user.setPreferredActivities(request.getPreferredActivities());

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
        log.info("User deleted: {}", id);
    }
}
