package com.cinehub.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record MovieResponse(
        Long id,
        String title,
        String overview,
        String tagline,
        String imdbId,
        String posterUrl,
        String backdropUrl,
        LocalDate releaseDate,
        Integer runtimeMinutes,
        BigDecimal rating,
        Long voteCount,
        Set<String> genres
) {
}
