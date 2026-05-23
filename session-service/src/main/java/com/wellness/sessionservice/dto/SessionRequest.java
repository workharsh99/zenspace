package com.wellness.sessionservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SessionRequest {

    @NotBlank(message = "Activity ID is required")
    private String activityId;

    private String activityTitle;
    private String activityCategory;
    private int durationMinutes;
    private String moodBefore;
    private int stressLevelBefore;
    private String notes;
}
