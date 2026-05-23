package com.wellness.sessionservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "favorites")
@CompoundIndex(name = "user_activity_idx", def = "{'userId': 1, 'activityId': 1}", unique = true)
public class Favorite {

    @Id
    private String id;

    private String userId;
    private String activityId;
    private String activityTitle;
    private String activityCategory;
    private String activityImageUrl;

    private LocalDateTime savedAt;
}
