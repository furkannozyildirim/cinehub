package com.cinehub.tmdb;

import java.util.List;

public record TmdbMoviePage(List<TmdbMovieSummary> results) {
}
