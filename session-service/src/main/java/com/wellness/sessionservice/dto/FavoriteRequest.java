package com.wellness.sessionservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FavoriteRequest {

    @NotBlank(message = "Activity ID is required")
    private String activityId;

    private String activityTitle;
    private String activityCategory;
    private String activityImageUrl;
}
