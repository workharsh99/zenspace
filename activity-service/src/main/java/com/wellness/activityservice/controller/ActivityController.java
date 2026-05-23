package com.wellness.activityservice.controller;

import com.wellness.activityservice.dto.ActivityRequest;
import com.wellness.activityservice.model.Activity;
import com.wellness.activityservice.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "activity-service",
            "message", "Activity Service is running"
        ));
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@Valid @RequestBody ActivityRequest request,
                                                    @RequestHeader(value = "X-User-Id", defaultValue = "system") String userId) {
        Activity activity = activityService.createActivity(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(activity);
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Activity>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(activityService.getActivitiesByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Activity>> searchActivities(@RequestParam String keyword) {
        return ResponseEntity.ok(activityService.searchActivities(keyword));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Activity>> getFeatured() {
        return ResponseEntity.ok(activityService.getFeaturedActivities());
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Activity>> getTopRated() {
        return ResponseEntity.ok(activityService.getTopRatedActivities());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Activity>> getPopular() {
        return ResponseEntity.ok(activityService.getPopularActivities());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable String id,
                                                    @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.updateActivity(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteActivity(@PathVariable String id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(Map.of("message", "Activity deleted successfully"));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<Activity> rateActivity(@PathVariable String id,
                                                  @RequestParam double rating) {
        return ResponseEntity.ok(activityService.rateActivity(id, rating));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Activity> completeActivity(@PathVariable String id) {
        return ResponseEntity.ok(activityService.incrementCompletion(id));
    }
}
