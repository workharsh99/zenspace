package com.wellness.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String firstName;
    private String lastName;
    private String profilePicture;
    private String bio;

    @Builder.Default
    private String role = "USER";

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> preferredActivities;
    private String stressLevel;
    private String wellnessGoal;
}
