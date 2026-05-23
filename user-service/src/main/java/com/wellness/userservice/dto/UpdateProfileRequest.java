package com.wellness.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String bio;
    private String profilePicture;
    private String wellnessGoal;
    private String stressLevel;
    private List<String> preferredActivities;
}
