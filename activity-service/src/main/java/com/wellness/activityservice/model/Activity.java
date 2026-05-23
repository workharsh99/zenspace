package com.wellness.activityservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.TextIndexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    @TextIndexed
    private String title;

    @TextIndexed
    private String description;

    private String category; // MEDITATION, BREATHING, YOGA, MUSIC, MOTIVATION

    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED

    private int durationMinutes;

    private String imageUrl;

    private String videoUrl;

    private String audioUrl;

    private List<String> tags;

    private List<String> benefits;

    private List<String> instructions;

    @Builder.Default
    private double rating = 0.0;

    @Builder.Default
    private int totalRatings = 0;

    @Builder.Default
    private int completionCount = 0;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    private String createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For breathing exercises
    private BreathingPattern breathingPattern;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BreathingPattern {
        private int inhaleSeconds;
        private int holdSeconds;
        private int exhaleSeconds;
        private int cycles;
    }
}
