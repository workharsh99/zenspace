package com.wellness.sessionservice.service;

import com.wellness.sessionservice.dto.*;
import com.wellness.sessionservice.model.Favorite;
import com.wellness.sessionservice.model.Session;
import com.wellness.sessionservice.repository.FavoriteRepository;
import com.wellness.sessionservice.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;
    private final FavoriteRepository favoriteRepository;

    // ---- Session Management ----

    public Session startSession(String userId, SessionRequest request) {
        Session session = Session.builder()
                .userId(userId)
                .activityId(request.getActivityId())
                .activityTitle(request.getActivityTitle())
                .activityCategory(request.getActivityCategory())
                .durationMinutes(request.getDurationMinutes())
                .moodBefore(request.getMoodBefore())
                .stressLevelBefore(request.getStressLevelBefore())
                .notes(request.getNotes())
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return sessionRepository.save(session);
    }

    public Session completeSession(String sessionId, String userId, CompleteSessionRequest request) {
        Session session = getSessionById(sessionId);

        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: session does not belong to user");
        }

        session.setStatus("COMPLETED");
        session.setMoodAfter(request.getMoodAfter());
        session.setStressLevelAfter(request.getStressLevelAfter());
        session.setActualDurationMinutes(request.getActualDurationMinutes());
        if (request.getNotes() != null) session.setNotes(request.getNotes());
        session.setRating(request.getRating());
        session.setCompletedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        return sessionRepository.save(session);
    }

    public Session abandonSession(String sessionId, String userId) {
        Session session = getSessionById(sessionId);
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        session.setStatus("ABANDONED");
        session.setUpdatedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    public Session getSessionById(String id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
    }

    public List<Session> getUserSessions(String userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Session> getCompletedSessions(String userId) {
        return sessionRepository.findCompletedByUserId(userId);
    }

    public List<Session> getSessionsByStatus(String userId, String status) {
        return sessionRepository.findByUserIdAndStatus(userId, status);
    }

    public Session toggleFavoriteSession(String sessionId, String userId) {
        Session session = getSessionById(sessionId);
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        session.setFavorite(!session.isFavorite());
        session.setUpdatedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    // ---- Favorites Management ----

    public Favorite addFavorite(String userId, FavoriteRequest request) {
        if (favoriteRepository.existsByUserIdAndActivityId(userId, request.getActivityId())) {
            throw new RuntimeException("Activity already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .userId(userId)
                .activityId(request.getActivityId())
                .activityTitle(request.getActivityTitle())
                .activityCategory(request.getActivityCategory())
                .activityImageUrl(request.getActivityImageUrl())
                .savedAt(LocalDateTime.now())
                .build();

        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userId, String activityId) {
        if (!favoriteRepository.existsByUserIdAndActivityId(userId, activityId)) {
            throw new RuntimeException("Activity not in favorites");
        }
        favoriteRepository.deleteByUserIdAndActivityId(userId, activityId);
    }

    public List<Favorite> getUserFavorites(String userId) {
        return favoriteRepository.findByUserIdOrderBySavedAtDesc(userId);
    }

    public boolean isFavorite(String userId, String activityId) {
        return favoriteRepository.existsByUserIdAndActivityId(userId, activityId);
    }

    // ---- Wellness Stats ----

    public WellnessStats getWellnessStats(String userId) {
        List<Session> allSessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Session> completed = allSessions.stream()
                .filter(s -> "COMPLETED".equals(s.getStatus()))
                .collect(Collectors.toList());

        long totalMinutes = completed.stream()
                .mapToLong(s -> s.getActualDurationMinutes() > 0 ? s.getActualDurationMinutes() : s.getDurationMinutes())
                .sum();

        double avgStressReduction = completed.stream()
                .filter(s -> s.getStressLevelBefore() > 0 && s.getStressLevelAfter() > 0)
                .mapToDouble(s -> s.getStressLevelBefore() - s.getStressLevelAfter())
                .average()
                .orElse(0.0);

        double avgRating = completed.stream()
                .filter(s -> s.getRating() > 0)
                .mapToDouble(Session::getRating)
                .average()
                .orElse(0.0);

        Map<String, Long> byCategory = completed.stream()
                .filter(s -> s.getActivityCategory() != null)
                .collect(Collectors.groupingBy(Session::getActivityCategory, Collectors.counting()));

        String mostPracticed = byCategory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        long favCount = favoriteRepository.countByUserId(userId);

        return WellnessStats.builder()
                .totalSessions(allSessions.size())
                .completedSessions(completed.size())
                .totalMinutes(totalMinutes)
                .favoritesCount(favCount)
                .averageStressReduction(Math.round(avgStressReduction * 10.0) / 10.0)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .sessionsByCategory(byCategory)
                .mostPracticedCategory(mostPracticed)
                .currentStreak(calculateCurrentStreak(completed))
                .longestStreak(calculateLongestStreak(completed))
                .build();
    }

    private int calculateCurrentStreak(List<Session> completed) {
        if (completed.isEmpty()) return 0;
        // Simple streak: count consecutive days from today
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        int streak = 0;
        LocalDateTime checkDate = today;

        for (int i = 0; i < 30; i++) {
            final LocalDateTime date = checkDate;
            boolean hasSession = completed.stream()
                    .anyMatch(s -> s.getCompletedAt() != null &&
                            s.getCompletedAt().toLocalDate().equals(date.toLocalDate()));
            if (hasSession) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }

    private int calculateLongestStreak(List<Session> completed) {
        if (completed.isEmpty()) return 0;
        return Math.min(completed.size(), 7); // Simplified calculation
    }
}
