package com.cinehub.repository;

import com.cinehub.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.time.Instant;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query(
            value = """
                    select distinct m from Movie m
                    where (:search = ''
                        or lower(m.title) like lower(concat('%', :search, '%')))
                    and (:genre = '' or exists (
                        select g.id from Movie candidate join candidate.genres g
                        where candidate.id = m.id and lower(g.name) = lower(:genre)))
                    """,
            countQuery = """
                    select count(distinct m) from Movie m
                    where (:search = ''
                        or lower(m.title) like lower(concat('%', :search, '%')))
                    and (:genre = '' or exists (
                        select g.id from Movie candidate join candidate.genres g
                        where candidate.id = m.id and lower(g.name) = lower(:genre)))
                    """
    )
    Page<Movie> search(@Param("search") String search, @Param("genre") String genre, Pageable pageable);

    List<Movie> findTop10ByOrderByRatingDescVoteCountDesc();

    Optional<Movie> findByTmdbId(Long tmdbId);

    List<Movie> findAllByTmdbSyncedAtBefore(Instant cutoff);
}
