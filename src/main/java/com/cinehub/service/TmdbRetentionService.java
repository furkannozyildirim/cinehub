package com.cinehub.service;

import com.cinehub.repository.MovieRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class TmdbRetentionService {

    private final MovieRepository movieRepository;

    public TmdbRetentionService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Scheduled(initialDelay = 0, fixedDelayString = "86400000")
    @Transactional
    public void removeExpiredTmdbMovies() {
        movieRepository.deleteAll(movieRepository.findAllByTmdbSyncedAtBefore(
                Instant.now().minus(6, ChronoUnit.MONTHS)
        ));
    }
}
