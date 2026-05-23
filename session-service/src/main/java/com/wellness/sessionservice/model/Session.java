package com.wellness.sessionservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String activityId;
    private String activityTitle;
    private String activityCategory;

    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, ABANDONED

    private int durationMinutes;
    private int actualDurationMinutes;

    private String moodBefore; // STRESSED, ANXIOUS, NEUTRAL, CALM, HAPPY
    private String moodAfter;

    private int stressLevelBefore; // 1-10
    private int stressLevelAfter;

    private String notes;
    private double rating;

    @Builder.Default
    private boolean favorite = false;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
