package com.cinehub.service;

import com.cinehub.entity.Genre;
import com.cinehub.entity.Movie;
import com.cinehub.repository.GenreRepository;
import com.cinehub.repository.MovieRepository;
import com.cinehub.tmdb.TmdbGenre;
import com.cinehub.tmdb.TmdbMovieDetails;
import com.cinehub.tmdb.TmdbMoviePage;
import com.cinehub.tmdb.TmdbMovieSummary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TmdbImportService {

    private static final String API_URL = "https://api.themoviedb.org/3";
    private static final String IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    private static final int POPULAR_PAGES_TO_IMPORT = 5;
    private final RestClient client = RestClient.builder().baseUrl(API_URL).build();
    private final String apiKey;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public TmdbImportService(@Value("${tmdb.api-key:}") String apiKey,
                             MovieRepository movieRepository, GenreRepository genreRepository) {
        this.apiKey = apiKey;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    @Transactional
    public int importPopularMovies() {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("TMDB_API_KEY ortam değişkeni ayarlanmamış.");
        }
        int saved = 0;
        for (int pageNumber = 1; pageNumber <= POPULAR_PAGES_TO_IMPORT; pageNumber++) {
            TmdbMoviePage page = client.get()
                    .uri("/movie/popular?api_key={key}&language=tr-TR&page={page}", apiKey, pageNumber)
                    .retrieve()
                    .body(TmdbMoviePage.class);
            if (page == null || page.results() == null) {
                throw new IllegalStateException("TMDB boş yanıt verdi.");
            }
            for (TmdbMovieSummary summary : page.results()) {
                TmdbMovieDetails details = client.get()
                        .uri("/movie/{id}?api_key={key}&language=tr-TR", summary.id(), apiKey)
                        .retrieve()
                        .body(TmdbMovieDetails.class);
                if (!isImportable(details)) {
                    continue;
                }
                save(details);
                saved++;
            }
        }
        return saved;
    }

    private void save(TmdbMovieDetails details) {
        Set<Genre> genres = details.genres() == null ? Set.of() : details.genres().stream()
                .map(TmdbGenre::name)
                .filter(name -> name != null && !name.isBlank())
                .map(String::trim)
                .map(name -> genreRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> genreRepository.save(new Genre(name))))
                .collect(Collectors.toCollection(LinkedHashSet::new));
        String overview = details.overview() == null || details.overview().isBlank()
                ? "Açıklama mevcut değil."
                : details.overview();
        String posterUrl = imageUrl(details.posterPath());
        String backdropUrl = imageUrl(details.backdropPath());
        BigDecimal rating = details.voteAverage() == null
                ? BigDecimal.ZERO
                : details.voteAverage().setScale(2, RoundingMode.HALF_UP);
        long votes = details.voteCount() == null ? 0 : details.voteCount();
        Movie movie = movieRepository.findByTmdbId(details.id()).orElse(null);
        if (movie == null) {
            movieRepository.save(new Movie(details.id(), details.title(), overview, blankToNull(details.tagline()),
                    blankToNull(details.imdbId()), posterUrl, backdropUrl, LocalDate.parse(details.releaseDate()),
                    details.runtime(), rating, votes, genres));
        } else {
            movie.updateFromTmdb(details.title(), overview, blankToNull(details.tagline()),
                    blankToNull(details.imdbId()), posterUrl, backdropUrl,
                    LocalDate.parse(details.releaseDate()), details.runtime(), rating, votes, genres);
        }
    }

    private boolean isImportable(TmdbMovieDetails movie) {
        if (movie == null || movie.id() == null || movie.title() == null || movie.title().isBlank()
                || movie.runtime() == null || movie.runtime() < 1 || movie.releaseDate() == null
                || movie.releaseDate().isBlank()) {
            return false;
        }
        try {
            LocalDate.parse(movie.releaseDate());
            return true;
        } catch (DateTimeParseException exception) {
            return false;
        }
    }

    private String imageUrl(String path) {
        return path == null || path.isBlank() ? null : IMAGE_URL + path;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
