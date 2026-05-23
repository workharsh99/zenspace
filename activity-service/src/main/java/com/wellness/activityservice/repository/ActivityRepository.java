package com.wellness.activityservice.repository;

import com.wellness.activityservice.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> findByCategory(String category);

    List<Activity> findByActiveTrue();

    List<Activity> findByCategoryAndActiveTrue(String category);

    List<Activity> findByFeaturedTrueAndActiveTrue();

    List<Activity> findByDifficultyAndActiveTrue(String difficulty);

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'tags': { $regex: ?0, $options: 'i' } } ] }")
    List<Activity> searchActivities(String keyword);

    @Query("{ 'category': ?0, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'description': { $regex: ?1, $options: 'i' } } ] }")
    List<Activity> searchByKeywordAndCategory(String category, String keyword);

    List<Activity> findTop6ByActiveTrueOrderByRatingDesc();

    List<Activity> findTop10ByActiveTrueOrderByCompletionCountDesc();
}
