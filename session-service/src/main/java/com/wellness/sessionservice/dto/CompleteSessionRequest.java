package com.wellness.sessionservice.dto;

import lombok.Data;

@Data
public class CompleteSessionRequest {
    private String moodAfter;
    private int stressLevelAfter;
    private int actualDurationMinutes;
    private String notes;
    private double rating;
}
