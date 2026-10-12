package com.cinehub.dto;

import java.util.List;

public record MoviePageResponse(
        List<MovieResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
}
