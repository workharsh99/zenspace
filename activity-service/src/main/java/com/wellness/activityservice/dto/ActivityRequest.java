package com.wellness.activityservice.dto;

import com.wellness.activityservice.model.Activity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ActivityRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String difficulty;

    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    private String imageUrl;
    private String videoUrl;
    private String audioUrl;
    private List<String> tags;
    private List<String> benefits;
    private List<String> instructions;
    private boolean featured;
    private Activity.BreathingPattern breathingPattern;
}
