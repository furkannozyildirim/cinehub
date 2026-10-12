package com.cinehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tmdb_id", unique = true)
    private Long tmdbId;

    @Column(name = "tmdb_synced_at")
    private Instant tmdbSyncedAt;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String overview;

    @Column(length = 255)
    private String tagline;

    @Column(name = "imdb_id", length = 20)
    private String imdbId;

    @Column(name = "poster_url", length = 2048)
    private String posterUrl;

    @Column(name = "backdrop_url", length = 2048)
    private String backdropUrl;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "runtime_minutes", nullable = false)
    private Integer runtimeMinutes;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal rating;

    @Column(name = "vote_count", nullable = false)
    private Long voteCount;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    protected Movie() {
    }

    public Movie(String title, String overview, String tagline, String imdbId, String posterUrl, String backdropUrl,
                 LocalDate releaseDate, Integer runtimeMinutes, BigDecimal rating,
                 Long voteCount, Set<Genre> genres) {
        this(null, title, overview, tagline, imdbId, posterUrl, backdropUrl, releaseDate,
                runtimeMinutes, rating, voteCount, genres);
    }

    public Movie(Long tmdbId, String title, String overview, String tagline, String imdbId, String posterUrl,
                 String backdropUrl, LocalDate releaseDate, Integer runtimeMinutes, BigDecimal rating,
                 Long voteCount, Set<Genre> genres) {
        this.tmdbId = tmdbId;
        this.tmdbSyncedAt = tmdbId == null ? null : Instant.now();
        this.title = title;
        this.overview = overview;
        this.tagline = tagline;
        this.imdbId = imdbId;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.releaseDate = releaseDate;
        this.runtimeMinutes = runtimeMinutes;
        this.rating = rating;
        this.voteCount = voteCount;
        this.genres = new HashSet<>(genres);
    }

    public void update(String title, String overview, String tagline, String imdbId, String posterUrl, String backdropUrl,
                       LocalDate releaseDate, Integer runtimeMinutes, BigDecimal rating,
                       Long voteCount, Set<Genre> genres) {
        this.title = title;
        this.overview = overview;
        this.tagline = tagline;
        this.imdbId = imdbId;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.releaseDate = releaseDate;
        this.runtimeMinutes = runtimeMinutes;
        this.rating = rating;
        this.voteCount = voteCount;
        this.genres.clear();
        this.genres.addAll(genres);
    }

    public Long getId() {
        return id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public Instant getTmdbSyncedAt() {
        return tmdbSyncedAt;
    }

    public void updateFromTmdb(String title, String overview, String tagline, String imdbId, String posterUrl,
                               String backdropUrl, LocalDate releaseDate, Integer runtimeMinutes,
                               BigDecimal rating, Long voteCount, Set<Genre> genres) {
        update(title, overview, tagline, imdbId, posterUrl, backdropUrl, releaseDate,
                runtimeMinutes, rating, voteCount, genres);
        this.tmdbSyncedAt = Instant.now();
    }

    public String getTitle() {
        return title;
    }

    public String getOverview() {
        return overview;
    }

    public String getTagline() {
        return tagline;
    }

    public String getImdbId() {
        return imdbId;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public Integer getRuntimeMinutes() {
        return runtimeMinutes;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public Long getVoteCount() {
        return voteCount;
    }

    public Set<Genre> getGenres() {
        return genres;
    }
}
