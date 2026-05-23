package com.wellness.sessionservice.repository;

import com.wellness.sessionservice.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    List<Favorite> findByUserIdOrderBySavedAtDesc(String userId);

    Optional<Favorite> findByUserIdAndActivityId(String userId, String activityId);

    boolean existsByUserIdAndActivityId(String userId, String activityId);

    void deleteByUserIdAndActivityId(String userId, String activityId);

    long countByUserId(String userId);
}
