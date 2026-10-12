package com.cinehub.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record MovieRequest(
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 10000) String overview,
        @Size(max = 255) String tagline,
        @Size(max = 20) String imdbId,
        @Size(max = 2048) String posterUrl,
        @Size(max = 2048) String backdropUrl,
        @NotNull LocalDate releaseDate,
        @NotNull @Positive Integer runtimeMinutes,
        @NotNull @DecimalMin("0.00") @DecimalMax("10.00") @Digits(integer = 2, fraction = 2)
        BigDecimal rating,
        @NotNull @Min(0) Long voteCount,
        @NotEmpty Set<@NotBlank @Size(max = 50) String> genres
) {
}
