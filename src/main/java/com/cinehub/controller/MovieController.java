package com.cinehub.controller;

import com.cinehub.dto.MoviePageResponse;
import com.cinehub.dto.MovieRequest;
import com.cinehub.dto.MovieResponse;
import com.cinehub.service.MovieService;
import com.cinehub.service.TmdbImportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MovieController {

    private final MovieService movieService;
    private final TmdbImportService tmdbImportService;
    private final String tmdbApiKey;

    public MovieController(MovieService movieService, TmdbImportService tmdbImportService,
                           @Value("${tmdb.api-key:}") String tmdbApiKey) {
        this.movieService = movieService;
        this.tmdbImportService = tmdbImportService;
        this.tmdbApiKey = tmdbApiKey;
    }

    @GetMapping("/movies")
    public MoviePageResponse search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        return movieService.search(search, genre, page, size);
    }

    @GetMapping("/movies/top-rated")
    public List<MovieResponse> topRated() {
        return movieService.getTopRated();
    }

    @GetMapping("/genres")
    public List<String> genres() {
        return movieService.getGenres();
    }

    @GetMapping("/movies/{id}")
    public MovieResponse getById(@PathVariable Long id) {
        return movieService.getById(id);
    }

    @PostMapping("/movies")
    @ResponseStatus(HttpStatus.CREATED)
    public MovieResponse create(@Valid @RequestBody MovieRequest request) {
        return movieService.create(request);
    }

    @PutMapping("/movies/{id}")
    public MovieResponse update(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return movieService.update(id, request);
    }

    @DeleteMapping("/movies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        movieService.delete(id);
    }

    @PostMapping("/tmdb/import")
    public int importPopularMovies(@RequestHeader(name = "X-TMDB-API-Key", required = false) String requestKey) {
        if (tmdbApiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "TMDB_API_KEY ayarlanmamış.");
        }
        if (requestKey == null || !MessageDigest.isEqual(
                tmdbApiKey.getBytes(StandardCharsets.UTF_8), requestKey.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "TMDB API anahtarı geçersiz.");
        }
        return tmdbImportService.importPopularMovies();
    }
}
