package com.cinehub.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public record TmdbMovieDetails(
        Long id,
        String title,
        String overview,
        String tagline,
        @JsonProperty("imdb_id") String imdbId,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("backdrop_path") String backdropPath,
        @JsonProperty("release_date") String releaseDate,
        Integer runtime,
        @JsonProperty("vote_average") BigDecimal voteAverage,
        @JsonProperty("vote_count") Long voteCount,
        List<TmdbGenre> genres
) {
}
