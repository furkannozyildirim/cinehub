package com.cinehub.service;

import com.cinehub.dto.MoviePageResponse;
import com.cinehub.dto.MovieRequest;
import com.cinehub.dto.MovieResponse;
import com.cinehub.entity.Genre;
import com.cinehub.entity.Movie;
import com.cinehub.exception.BadRequestException;
import com.cinehub.exception.ResourceNotFoundException;
import com.cinehub.repository.GenreRepository;
import com.cinehub.repository.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieServiceImpl(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse search(String search, String genre, int page, int size) {
        if (page < 0) {
            throw new BadRequestException("page must be zero or greater");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("size must be between 1 and 100");
        }
        Page<Movie> result = movieRepository.search(
                normalizeFilter(search),
                normalizeFilter(genre),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "releaseDate").and(Sort.by("id")))
        );
        return new MoviePageResponse(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getTopRated() {
        return movieRepository.findTop10ByOrderByRatingDescVoteCountDesc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getGenres() {
        return genreRepository.findAllByOrderByNameAsc().stream().map(Genre::getName).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MovieResponse getById(Long id) {
        return toResponse(findMovie(id));
    }

    @Override
    public MovieResponse create(MovieRequest request) {
        Movie movie = new Movie(
                request.title().trim(),
                request.overview().trim(),
                blankToNull(request.tagline()),
                blankToNull(request.imdbId()),
                blankToNull(request.posterUrl()),
                blankToNull(request.backdropUrl()),
                request.releaseDate(),
                request.runtimeMinutes(),
                request.rating(),
                request.voteCount(),
                resolveGenres(request.genres())
        );
        return toResponse(movieRepository.save(movie));
    }

    @Override
    public MovieResponse update(Long id, MovieRequest request) {
        Movie movie = findMovie(id);
        movie.update(
                request.title().trim(),
                request.overview().trim(),
                blankToNull(request.tagline()),
                blankToNull(request.imdbId()),
                blankToNull(request.posterUrl()),
                blankToNull(request.backdropUrl()),
                request.releaseDate(),
                request.runtimeMinutes(),
                request.rating(),
                request.voteCount(),
                resolveGenres(request.genres())
        );
        return toResponse(movieRepository.save(movie));
    }

    @Override
    public void delete(Long id) {
        movieRepository.delete(findMovie(id));
    }

    private Movie findMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie " + id + " was not found"));
    }

    private Set<Genre> resolveGenres(Set<String> names) {
        return names.stream()
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .map(name -> genreRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> genreRepository.save(new Genre(name))))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private MovieResponse toResponse(Movie movie) {
        Set<String> genres = movie.getGenres().stream()
                .map(Genre::getName)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return new MovieResponse(
                movie.getId(), movie.getTitle(), movie.getOverview(), movie.getTagline(), movie.getImdbId(), movie.getPosterUrl(),
                movie.getBackdropUrl(), movie.getReleaseDate(), movie.getRuntimeMinutes(),
                movie.getRating(), movie.getVoteCount(), genres
        );
    }

    private String normalizeFilter(String filter) {
        return filter == null ? "" : filter.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
