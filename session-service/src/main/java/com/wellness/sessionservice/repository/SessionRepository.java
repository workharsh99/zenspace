package com.wellness.sessionservice.repository;

import com.wellness.sessionservice.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {

    List<Session> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Session> findByUserIdAndStatus(String userId, String status);

    List<Session> findByUserIdAndActivityId(String userId, String activityId);

    long countByUserIdAndStatus(String userId, String status);

    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Session> findByUserIdAndDateRange(String userId, LocalDateTime start, LocalDateTime end);

    List<Session> findByUserIdAndFavoriteTrue(String userId);

    @Query("{ 'userId': ?0, 'status': 'COMPLETED' }")
    List<Session> findCompletedByUserId(String userId);

    long countByUserId(String userId);
}
