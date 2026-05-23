package com.wellness.activityservice.service;

import com.wellness.activityservice.dto.ActivityRequest;
import com.wellness.activityservice.model.Activity;
import com.wellness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;

    public Activity createActivity(ActivityRequest request, String createdBy) {
        Activity activity = Activity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory().toUpperCase())
                .difficulty(request.getDifficulty() != null ? request.getDifficulty().toUpperCase() : "BEGINNER")
                .durationMinutes(request.getDurationMinutes())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .audioUrl(request.getAudioUrl())
                .tags(request.getTags())
                .benefits(request.getBenefits())
                .instructions(request.getInstructions())
                .featured(request.isFeatured())
                .breathingPattern(request.getBreathingPattern())
                .createdBy(createdBy)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return activityRepository.save(activity);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findByActiveTrue();
    }

    public Activity getActivityById(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found: " + id));
    }

    public List<Activity> getActivitiesByCategory(String category) {
        return activityRepository.findByCategoryAndActiveTrue(category.toUpperCase());
    }

    public List<Activity> searchActivities(String keyword) {
        return activityRepository.searchActivities(keyword);
    }

    public List<Activity> getFeaturedActivities() {
        return activityRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Activity> getTopRatedActivities() {
        return activityRepository.findTop6ByActiveTrueOrderByRatingDesc();
    }

    public List<Activity> getPopularActivities() {
        return activityRepository.findTop10ByActiveTrueOrderByCompletionCountDesc();
    }

    public Activity updateActivity(String id, ActivityRequest request) {
        Activity activity = getActivityById(id);

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setCategory(request.getCategory().toUpperCase());
        if (request.getDifficulty() != null) activity.setDifficulty(request.getDifficulty().toUpperCase());
        activity.setDurationMinutes(request.getDurationMinutes());
        if (request.getImageUrl() != null) activity.setImageUrl(request.getImageUrl());
        if (request.getVideoUrl() != null) activity.setVideoUrl(request.getVideoUrl());
        if (request.getAudioUrl() != null) activity.setAudioUrl(request.getAudioUrl());
        if (request.getTags() != null) activity.setTags(request.getTags());
        if (request.getBenefits() != null) activity.setBenefits(request.getBenefits());
        if (request.getInstructions() != null) activity.setInstructions(request.getInstructions());
        activity.setFeatured(request.isFeatured());
        if (request.getBreathingPattern() != null) activity.setBreathingPattern(request.getBreathingPattern());
        activity.setUpdatedAt(LocalDateTime.now());

        return activityRepository.save(activity);
    }

    public void deleteActivity(String id) {
        Activity activity = getActivityById(id);
        activity.setActive(false);
        activity.setUpdatedAt(LocalDateTime.now());
        activityRepository.save(activity);
        log.info("Activity soft-deleted: {}", id);
    }

    public Activity rateActivity(String id, double rating) {
        Activity activity = getActivityById(id);
        double newTotal = (activity.getRating() * activity.getTotalRatings()) + rating;
        activity.setTotalRatings(activity.getTotalRatings() + 1);
        activity.setRating(newTotal / activity.getTotalRatings());
        activity.setUpdatedAt(LocalDateTime.now());
        return activityRepository.save(activity);
    }

    public Activity incrementCompletion(String id) {
        Activity activity = getActivityById(id);
        activity.setCompletionCount(activity.getCompletionCount() + 1);
        activity.setUpdatedAt(LocalDateTime.now());
        return activityRepository.save(activity);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedSampleData() {
        if (activityRepository.count() == 0) {
            log.info("Seeding sample wellness activities...");
            List<Activity> sampleActivities = createSampleActivities();
            activityRepository.saveAll(sampleActivities);
            log.info("Seeded {} activities", sampleActivities.size());
        }
    }

    private List<Activity> createSampleActivities() {
        return Arrays.asList(
            Activity.builder()
                .title("Morning Mindfulness Meditation")
                .description("Start your day with a calming 10-minute mindfulness meditation to set a positive tone. Focus on your breath and let go of stress.")
                .category("MEDITATION")
                .difficulty("BEGINNER")
                .durationMinutes(10)
                .imageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                .tags(Arrays.asList("morning", "mindfulness", "beginner", "stress-relief"))
                .benefits(Arrays.asList("Reduces anxiety", "Improves focus", "Boosts mood", "Better sleep"))
                .instructions(Arrays.asList(
                    "Find a quiet, comfortable place to sit",
                    "Close your eyes and take 3 deep breaths",
                    "Focus on the sensation of breathing",
                    "When thoughts arise, gently return focus to breath",
                    "Continue for 10 minutes"
                ))
                .featured(true)
                .active(true)
                .rating(4.8)
                .totalRatings(245)
                .completionCount(1820)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("4-7-8 Breathing Technique")
                .description("The 4-7-8 breathing technique is a powerful stress reliever. Inhale for 4 seconds, hold for 7, exhale for 8.")
                .category("BREATHING")
                .difficulty("BEGINNER")
                .durationMinutes(5)
                .imageUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800")
                .tags(Arrays.asList("breathing", "anxiety", "sleep", "quick-relief"))
                .benefits(Arrays.asList("Instant calm", "Reduces anxiety", "Helps with sleep", "Lowers heart rate"))
                .instructions(Arrays.asList(
                    "Sit or lie in a comfortable position",
                    "Exhale completely through your mouth",
                    "Inhale through nose for 4 counts",
                    "Hold breath for 7 counts",
                    "Exhale through mouth for 8 counts",
                    "Repeat 4 cycles"
                ))
                .breathingPattern(Activity.BreathingPattern.builder()
                    .inhaleSeconds(4).holdSeconds(7).exhaleSeconds(8).cycles(4).build())
                .featured(true)
                .active(true)
                .rating(4.9)
                .totalRatings(389)
                .completionCount(3200)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Gentle Morning Yoga Flow")
                .description("A gentle 20-minute yoga flow to awaken your body and calm your mind. Perfect for beginners and those with stress.")
                .category("YOGA")
                .difficulty("BEGINNER")
                .durationMinutes(20)
                .imageUrl("https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800")
                .tags(Arrays.asList("yoga", "morning", "flexibility", "gentle"))
                .benefits(Arrays.asList("Increases flexibility", "Reduces tension", "Improves posture", "Calms mind"))
                .instructions(Arrays.asList(
                    "Start in Child's Pose for 2 minutes",
                    "Move to Cat-Cow stretches (10 reps)",
                    "Downward Dog for 1 minute",
                    "Warrior I and II on each side",
                    "End with Savasana for 3 minutes"
                ))
                .featured(true)
                .active(true)
                .rating(4.7)
                .totalRatings(178)
                .completionCount(1450)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Nature Sounds Relaxation")
                .description("Immerse yourself in calming nature sounds — rain, forest, ocean waves — to melt away stress and anxiety.")
                .category("MUSIC")
                .difficulty("BEGINNER")
                .durationMinutes(30)
                .imageUrl("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800")
                .audioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
                .tags(Arrays.asList("nature", "sounds", "relaxation", "sleep"))
                .benefits(Arrays.asList("Deep relaxation", "Better sleep", "Stress reduction", "Mental clarity"))
                .instructions(Arrays.asList(
                    "Put on headphones for best experience",
                    "Find a comfortable position",
                    "Close your eyes",
                    "Let the sounds wash over you",
                    "Focus on the natural sounds"
                ))
                .featured(false)
                .active(true)
                .rating(4.6)
                .totalRatings(312)
                .completionCount(2100)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Daily Affirmations & Motivation")
                .description("Powerful daily affirmations to rewire your mindset, boost confidence, and cultivate a positive outlook on life.")
                .category("MOTIVATION")
                .difficulty("BEGINNER")
                .durationMinutes(5)
                .imageUrl("https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800")
                .tags(Arrays.asList("affirmations", "motivation", "mindset", "positivity"))
                .benefits(Arrays.asList("Boosts confidence", "Positive mindset", "Reduces negative thoughts", "Increases motivation"))
                .instructions(Arrays.asList(
                    "Stand in front of a mirror",
                    "Take 3 deep breaths",
                    "Repeat each affirmation 3 times",
                    "Feel the meaning behind each word",
                    "End with gratitude"
                ))
                .featured(true)
                .active(true)
                .rating(4.5)
                .totalRatings(156)
                .completionCount(980)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Box Breathing for Focus")
                .description("Box breathing (4-4-4-4) is used by Navy SEALs to stay calm under pressure. Perfect for work stress and anxiety.")
                .category("BREATHING")
                .difficulty("BEGINNER")
                .durationMinutes(5)
                .imageUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800")
                .tags(Arrays.asList("box-breathing", "focus", "work-stress", "anxiety"))
                .benefits(Arrays.asList("Improves focus", "Reduces stress", "Calms nervous system", "Increases performance"))
                .instructions(Arrays.asList(
                    "Sit upright in a comfortable chair",
                    "Exhale all air from lungs",
                    "Inhale for 4 counts",
                    "Hold for 4 counts",
                    "Exhale for 4 counts",
                    "Hold for 4 counts",
                    "Repeat 5-10 times"
                ))
                .breathingPattern(Activity.BreathingPattern.builder()
                    .inhaleSeconds(4).holdSeconds(4).exhaleSeconds(4).cycles(8).build())
                .featured(false)
                .active(true)
                .rating(4.7)
                .totalRatings(203)
                .completionCount(1670)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Body Scan Meditation")
                .description("A deep relaxation technique where you systematically scan your body from head to toe, releasing tension in each area.")
                .category("MEDITATION")
                .difficulty("INTERMEDIATE")
                .durationMinutes(20)
                .imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800")
                .tags(Arrays.asList("body-scan", "deep-relaxation", "tension-release", "sleep"))
                .benefits(Arrays.asList("Releases physical tension", "Improves body awareness", "Promotes deep sleep", "Reduces chronic pain"))
                .instructions(Arrays.asList(
                    "Lie down in a comfortable position",
                    "Close your eyes and breathe naturally",
                    "Start at the top of your head",
                    "Slowly move attention down through each body part",
                    "Notice and release any tension you find",
                    "End at your toes"
                ))
                .featured(false)
                .active(true)
                .rating(4.8)
                .totalRatings(167)
                .completionCount(1230)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Stress Relief Yoga Nidra")
                .description("Yoga Nidra, or yogic sleep, is a powerful relaxation technique that brings you to the edge of sleep while remaining conscious.")
                .category("YOGA")
                .difficulty("BEGINNER")
                .durationMinutes(30)
                .imageUrl("https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800")
                .tags(Arrays.asList("yoga-nidra", "deep-relaxation", "sleep", "stress"))
                .benefits(Arrays.asList("Deep rest", "Stress relief", "Emotional healing", "Better sleep quality"))
                .instructions(Arrays.asList(
                    "Lie in Savasana (corpse pose)",
                    "Set a sankalpa (intention)",
                    "Rotate awareness through body parts",
                    "Visualize pairs of opposites",
                    "Rest in pure awareness"
                ))
                .featured(true)
                .active(true)
                .rating(4.9)
                .totalRatings(289)
                .completionCount(2340)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Binaural Beats for Deep Focus")
                .description("Theta wave binaural beats to enhance focus, creativity, and enter a meditative state effortlessly.")
                .category("MUSIC")
                .difficulty("BEGINNER")
                .durationMinutes(25)
                .imageUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800")
                .tags(Arrays.asList("binaural", "focus", "theta-waves", "meditation"))
                .benefits(Arrays.asList("Enhanced focus", "Deep meditation", "Creativity boost", "Stress reduction"))
                .instructions(Arrays.asList(
                    "Use stereo headphones (required)",
                    "Find a quiet environment",
                    "Close your eyes",
                    "Allow your mind to relax",
                    "Don't try to force anything"
                ))
                .featured(false)
                .active(true)
                .rating(4.6)
                .totalRatings(198)
                .completionCount(1560)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Activity.builder()
                .title("Gratitude Journaling Practice")
                .description("A guided gratitude journaling session to shift your focus from stress to appreciation, boosting mental wellness.")
                .category("MOTIVATION")
                .difficulty("BEGINNER")
                .durationMinutes(10)
                .imageUrl("https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800")
                .tags(Arrays.asList("gratitude", "journaling", "positivity", "mental-health"))
                .benefits(Arrays.asList("Increases happiness", "Reduces depression", "Better relationships", "Improved sleep"))
                .instructions(Arrays.asList(
                    "Get a journal and pen",
                    "Write 3 things you're grateful for",
                    "Describe why each matters to you",
                    "Write one positive thing about yourself",
                    "Set one intention for the day"
                ))
                .featured(false)
                .active(true)
                .rating(4.7)
                .totalRatings(234)
                .completionCount(1890)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        );
    }
}
