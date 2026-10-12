package com.cinehub.service;

import com.cinehub.dto.MoviePageResponse;
import com.cinehub.dto.MovieRequest;
import com.cinehub.dto.MovieResponse;

import java.util.List;

public interface MovieService {
    MoviePageResponse search(String search, String genre, int page, int size);

    List<MovieResponse> getTopRated();

    List<String> getGenres();

    MovieResponse getById(Long id);

    MovieResponse create(MovieRequest request);

    MovieResponse update(Long id, MovieRequest request);

    void delete(Long id);
}
