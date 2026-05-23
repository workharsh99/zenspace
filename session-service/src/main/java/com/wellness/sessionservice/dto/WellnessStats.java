package com.wellness.sessionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WellnessStats {
    private long totalSessions;
    private long completedSessions;
    private long totalMinutes;
    private long favoritesCount;
    private double averageStressReduction;
    private double averageRating;
    private Map<String, Long> sessionsByCategory;
    private String mostPracticedCategory;
    private int currentStreak;
    private int longestStreak;
}
